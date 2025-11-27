/**
 * @file Payment route handlers.
 *
 * Exposes REST API endpoints for managing Stripe-based payments tied
 * to delivery transactions. These routes delegate business logic to
 * the PaymentService layer, keeping controllers lightweight.
 *
 * Base URL: /api/payments
 */

const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentServices');

/**
 * @route POST /api/payments/create-intent
 * @desc Create and authorize a Stripe PaymentIntent for a delivery
 * @body {number} deliveryId - Target delivery for payment authorization
 * @returns {object} clientSecret + local payment record ID
 *
 * Used when a driver accepts a delivery request.
 */
router.post('/create-intent', async (req, res) => {
  try {
    const { deliveryId } = req.body;
    const { paymentIntent, payment } = await paymentService.createPaymentIntent(
      deliveryId
    );

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.payment_id,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      error: err.message || 'Server error creating payment intent',
    });
  }
});

/**
 * @route POST /api/payments/capture
 * @desc Capture (finalize) a previously authorized PaymentIntent
 * @body {number} paymentId - Local payment record to capture
 * @returns {object} success + Stripe result
 *
 * Used when delivery is confirmed completed.
 */
router.post('/capture', async (req, res) => {
  try {
    const { paymentId } = req.body;
    const result = await paymentService.capturePayment(paymentId);
    res.json({ success: true, result });
  } catch (err) {
    res.status(err.status || 500).json({
      error: err.message || 'Server error capturing payment',
    });
  }
});

/**
 * @route POST /api/payments/cancel
 * @desc Cancel or void a PaymentIntent if the delivery fails
 * @body {number} paymentId - Local payment record to cancel
 * @returns {object} success + Stripe result
 *
 * Used when a delivery is cancelled before completion.
 */
router.post('/cancel', async (req, res) => {
  try {
    const { paymentId } = req.body;
    const result = await paymentService.cancelPayment(paymentId);
    res.json({ success: true, result });
  } catch (err) {
    res.status(err.status || 500).json({
      error: err.message || 'Server error cancelling payment',
    });
  }
});
console.log('Payment routes loaded!');
module.exports = router;
