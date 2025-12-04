/**
 * @file PaymentController.js
 * Handles incoming requests and delegates full lifecycle management to PaymentService.
 * NO delivery status changes should occur here — ONLY in PaymentService.
 */

const { PaymentService } = require('../services');

const PaymentController = {
  /**
   * STEP 1 — Authorize funds using Stripe PaymentIntent
   * Returns clientSecret to frontend for Stripe UI
   */
  async createIntent(req, res) {
    try {
      const { deliveryId } = req.params;
      const { intent, payment } = await PaymentService.authorizePayment(
        deliveryId
      );

      return res.status(201).json({
        message: 'Payment authorization created',
        clientSecret: intent.client_secret,
        payment,
        paymentStatus: intent.status,
      });
    } catch (err) {
      console.error('❌ Payment Intent Error:', err);
      res
        .status(500)
        .json({ error: err.message || 'Failed to create payment intent' });
    }
  },

  /**
   * STEP 2 — Capture previously authorized funds
   */
  async capture(req, res) {
    try {
      const { paymentId } = req.params;
      const result = await PaymentService.capturePayment(paymentId);

      return res.json({
        message: 'Payment captured successfully',
        status: result.status,
      });
    } catch (err) {
      console.error('❌ Payment Capture Error:', err);
      res
        .status(500)
        .json({ error: err.message || 'Failed to capture payment' });
    }
  },

  /**
   * STEP 3 — Cancel PaymentIntent + restore job to 'open'
   */
  async cancel(req, res) {
    try {
      const { paymentId } = req.params;
      const result = await PaymentService.cancelPayment(paymentId);

      return res.json({
        message: 'Payment canceled and job reopened',
        status: result.status,
      });
    } catch (err) {
      console.error('❌ Payment Cancel Error:', err);
      res
        .status(500)
        .json({ error: err.message || 'Failed to cancel payment' });
    }
  },
};

module.exports = PaymentController;
