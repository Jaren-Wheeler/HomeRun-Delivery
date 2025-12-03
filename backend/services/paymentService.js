/**
 * @file paymentService.js
 * Business logic for Stripe-powered delivery payments.
 *
 * Payment Lifecycle (Capture on Completion Model):
 *
 *  Purchaser creates request → Stripe **authorizes** funds (hold only)
 *    ↳ deliverer accepts → delivery in progress
 *    ↳ deliverer completes → Stripe **captures** the funds
 *
 * Benefits:
 * - No charge issued until service is fulfilled
 * - Automated refund support if job is canceled before completion
 *
 * Service responsibilities:
 * - Manage Stripe PaymentIntents
 * - Sync payment state with Delivery lifecycle transitions
 */

const stripe = require('../config/stripe');
const { Delivery, Payment } = require('../models');

const PaymentService = {
  /**
   * Creates a Stripe PaymentIntent with manual capture.
   * Called when a delivery is **posted** by the purchaser.
   *
   * Status result:
   *   pending authorization ↔ delivery.status: 'open'
   */
  async authorizePayment(deliveryId) {
    const delivery = await Delivery.findByPk(deliveryId);
    if (!delivery) return null;

    const amountInCents = Math.round(Number(delivery.proposed_payment) * 100);

    const intent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'cad',
      capture_method: 'manual',
      metadata: { deliveryId },
    });

    const payment = await Payment.create({
      deliveryId,
      amount: delivery.proposed_payment,
      stripePaymentIntentId: intent.id,
      status: intent.status,
    });

    // ensure association populated
    await payment.reload({ include: { model: Delivery, as: 'delivery' } });

    // update delivery lifecycle
    await payment.delivery.update({ status: 'closed' });

    return { intent, payment };
  },

  /**
   * Finalizes (captures) the charge:
   *  - Called when the delivery has been successfully completed
   *  - Moves payment to `succeeded`
   *  - Delivery status → `completed`
   */
  async capturePayment(paymentId) {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) return null;

    const result = await stripe.paymentIntents.capture(
      payment.stripePaymentIntentId
    );

    await payment.update({
      status: result.status,
      capturedAt: new Date(),
    });

    await Delivery.update(
      { status: 'completed' },
      { where: { delivery_id: payment.deliveryId } }
    );

    return result;
  },

  /**
   * Cancels + voids the PaymentIntent:
   *  - Used when the job is canceled before completion
   *  - Restores funds to the purchaser automatically
   */
  async cancelPayment(paymentId) {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) return null;

    const result = await stripe.paymentIntents.cancel(
      payment.stripePaymentIntentId
    );

    await payment.update({ status: result.status });

    await Delivery.update(
      { status: 'canceled' },
      { where: { delivery_id: payment.deliveryId } }
    );

    return result;
  },
};

module.exports = PaymentService;
