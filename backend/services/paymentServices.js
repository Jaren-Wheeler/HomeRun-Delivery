/**
 * @file Payment service logic.
 *
 * Handles Stripe PaymentIntent lifecycle:
 *  - Authorization when driver accepts a delivery
 *  - Capture when delivery is completed
 *  - Cancellation if delivery is not fulfilled
 *
 * This maintains financial integrity while ensuring Stripe
 * remains the source of truth for transaction state.
 */

const stripe = require('../config/stripe');
const { Delivery, Payment } = require('../models');

/**
 * Create and authorize a PaymentIntent for a delivery.
 *
 * @param {number} deliveryId - ID of the delivery being charged
 * @returns {Promise<{paymentIntent: object, payment: object}>}
 */
async function createPaymentIntent(deliveryId) {
  const delivery = await Delivery.findByPk(deliveryId);
  if (!delivery) {
    throw { status: 404, message: 'Delivery not found' };
  }

  const amountInCents = Math.round(Number(delivery.price) * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'usd',
    capture_method: 'manual', // Only charge when completed
    metadata: { deliveryId: String(delivery.delivery_id) },
  });

  const payment = await Payment.create({
    deliveryId: delivery.delivery_id,
    stripePaymentIntentId: paymentIntent.id,
    status: paymentIntent.status, // synced with Stripe
    amount: delivery.price,
  });

  return { paymentIntent, payment };
}

/**
 * Capture a previously authorized payment.
 *
 * @param {number} paymentId - Local payment record ID
 * @returns {Promise<object>} Stripe capture result
 */
async function capturePayment(paymentId) {
  const payment = await Payment.findByPk(paymentId, {
    include: Delivery,
  });
  if (!payment) throw { status: 404, message: 'Payment not found' };

  if (payment.status !== 'requires_capture') {
    throw {
      status: 400,
      message: 'Payment must be in `requires_capture` state to finalize',
    };
  }

  const paymentIntent = await stripe.paymentIntents.capture(
    payment.stripePaymentIntentId
  );

  payment.status = paymentIntent.status;
  payment.capturedAt = new Date();
  await payment.save();

  if (payment.Delivery) {
    payment.Delivery.status = 'completed';
    await payment.Delivery.save();
  }

  return paymentIntent;
}

/**
 * Cancel or void a payment before completion.
 *
 * @param {number} paymentId - Local payment record ID
 * @returns {Promise<object>} Stripe cancel result
 */
async function cancelPayment(paymentId) {
  const payment = await Payment.findByPk(paymentId, {
    include: Delivery,
  });
  if (!payment) throw { status: 404, message: 'Payment not found' };

  if (payment.status !== 'requires_capture') {
    throw {
      status: 400,
      message: 'Payment must be authorized before canceling',
    };
  }

  const paymentIntent = await stripe.paymentIntents.cancel(
    payment.stripePaymentIntentId
  );

  payment.status = paymentIntent.status;
  await payment.save();

  if (payment.Delivery) {
    payment.Delivery.status = 'canceled';
    await payment.Delivery.save();
  }

  return paymentIntent;
}

module.exports = {
  createPaymentIntent,
  capturePayment,
  cancelPayment,
};
