/**
 * @file paymentService.js
 * Handles Stripe PaymentIntent lifecycle for deliveries.
 *
 * Lifecycle:
 *  1) open → accept → CLOSED (Stripe auth)
 *  2) closed → complete → COMPLETED (capture)
 *  3) cancel → back to OPEN (authorization voided)
 */

const stripe = require('../config/stripe');
const { Delivery, Payment, User } = require('../models');

const PaymentService = {
  /**
   * Authorize payment once deliverer accepts job.
   * Creates Stripe PaymentIntent with manual capture.
   */
  async authorizePayment(deliveryId) {
    const delivery = await Delivery.findByPk(deliveryId, {
      include: [{ model: User, as: 'Purchaser' }],
    });
    if (!delivery) throw new Error('Delivery not found');

    if (delivery.status !== 'open') {
      throw new Error('Delivery is not open for payment authorization');
    }

    const purchaser = delivery.Purchaser;
    if (!purchaser) throw new Error('Purchaser not linked to delivery');

    const amountInCents = Math.round(Number(delivery.proposedPayment) * 100);

    // Create PaymentIntent linked to purchaser's Stripe customer
    const intent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'cad',
      capture_method: 'manual',
      customer: purchaser.stripeCustomerId || undefined, // ⭐ NEW
      metadata: {
        deliveryId,
        purchaserId: delivery.purchaserId,
        delivererId: delivery.delivererId,
      },
    });

    // Log payment row in DB
    await Payment.create({
      deliveryId,
      amount: delivery.proposedPayment,
      stripePaymentIntentId: intent.id,
      status: intent.status,
    });

    // Delivery now closed (driver responsible)
    await delivery.update({
      status: 'closed',
      paymentIntentId: intent.id,
      delivererId: delivery.delivererId,
    });

    return { intent };
  },

  /**
   * Final charge when delivery completed.
   */
  async capturePayment(paymentId) {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) throw new Error('Payment not found');

    const result = await stripe.paymentIntents.capture(
      payment.stripePaymentIntentId
    );

    await payment.update({
      status: result.status,
      capturedAt: new Date(),
    });

    await Delivery.update(
      { status: 'completed' },
      { where: { deliveryId: payment.deliveryId } }
    );

    return result;
  },

  /**
   * Cancel an authorized payment — job reopens.
   */
  async cancelPayment(paymentId) {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) throw new Error('Payment not found');

    const result = await stripe.paymentIntents.cancel(
      payment.stripePaymentIntentId
    );

    await payment.update({ status: result.status });

    await Delivery.update(
      { status: 'open', delivererId: null, paymentIntentId: null },
      { where: { deliveryId: payment.deliveryId } }
    );

    return result;
  },
};

module.exports = PaymentService;
