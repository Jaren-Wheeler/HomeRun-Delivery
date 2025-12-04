/**
 * @file paymentService.js
 * Manages the complete **payment lifecycle** for deliveries via Stripe.
 *
 * Lifecycle mapping:
 *  Purchaser creates job → status: "open"
 *  Deliverer accepts job → Stripe auth → status: "closed"
 *  Deliverer completes job → Stripe capture → "completed"
 *  If canceled/opened back up → status resets to "open"
 *
 * All delivery state updates go through this service for consistency.
 */

const stripe = require('../config/stripe');
const { Delivery, Payment } = require('../models');

const PaymentService = {
  /**
   * Called when a deliverer ACCEPTS a job
   *  - Stripe PaymentIntent is created with manual capture enabled.
   *  - A Payment record is stored in DB.
   *  - Delivery status updates to "closed"
   *
   * @param {number} deliveryId
   * @returns {object} - intent + payment record
   */
  async authorizePayment(deliveryId) {
    const delivery = await Delivery.findByPk(deliveryId);
    if (!delivery) throw new Error('Delivery not found');

    if (delivery.status !== 'open') {
      throw new Error('Delivery is not open for payment authorization');
    }

    const amountInCents = Math.round(Number(delivery.proposedPayment) * 100);

    // 1 Create a Stripe PaymentIntent (manual capture)
    const intent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'cad',
      capture_method: 'manual',
      metadata: { deliveryId },
    });

    // 2 Create DB Payment record
    await Payment.create({
      deliveryId,
      amount: delivery.proposedPayment,
      stripePaymentIntentId: intent.id,
      status: intent.status,
    });

    // 3 Move delivery to "closed" (Deliverer is now responsible)
    await delivery.update({
      status: 'closed',
      paymentIntentId: intent.id,
      deliverer_id: delivery.delivererId,
    });

    return { intent };
  },

  /**
   * Called when a deliverer COMPLETES a job
   *  - Stripe capture finalizes the payment
   *  - DB updates:
   *      payment.status → Stripe result
   *      delivery.status → "completed"
   *
   * @param {number} paymentId
   * @returns {object} - Stripe capture result
   */
  async capturePayment(paymentId) {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) throw new Error('Payment not found');

    // 1 Capture funds in Stripe
    const result = await stripe.paymentIntents.capture(
      payment.stripePaymentIntentId
    );

    // 2 Update Payment record
    await payment.update({
      status: result.status,
      capturedAt: new Date(),
    });

    // 3 Delivery lifecycle complete 🎉
    await Delivery.update(
      { status: 'completed' },
      { where: { deliveryId: payment.deliveryId } }
    );

    return result;
  },

  /**
   * Called if a job is canceled before completion
   *  - Cancels the Stripe authorization
   *  - Payment status updated accordingly
   *  - Delivery becomes available again
   *
   * @param {number} paymentId
   * @returns {object} - Stripe cancellation result
   */
  async cancelPayment(paymentId) {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) throw new Error('Payment not found');

    // 1 Cancel Stripe payment intent
    const result = await stripe.paymentIntents.cancel(
      payment.stripePaymentIntentId
    );

    // 2 Update Payment record
    await payment.update({ status: result.status });

    // 3 Make job available again
    await Delivery.update(
      { status: 'open', delivererId: null, paymentIntentId: null },
      { where: { deliveryId: payment.deliveryId } }
    );

    return result;
  },
};

module.exports = PaymentService;
