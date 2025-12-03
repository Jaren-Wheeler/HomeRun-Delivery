/**
 * @file PaymentController.js
 * Controls the request flow for Stripe PaymentIntent lifecycle:
 *  - createIntent → authorize funds on job acceptance
 *  - capture → finalize charge on completion
 *  - cancel → release authorization if job fails/declines
 *
 * Delegates business logic to PaymentService for cleaner separation of concerns.
 */
const { PaymentService } = require('../services');

const PaymentController = {
  /**
   * STEP 1 — Create PaymentIntent (manual capture)
   * Called when the deliverer accepts the job.
   * Funds are *held* but not charged yet.
   */
  async createIntent(req, res) {
    try {
      const { deliveryId } = req.params;
      const result = await PaymentService.authorizePayment(deliveryId);

      if (!result) {
        return res.status(404).json({ error: 'Delivery not found' });
      }

      // Update delivery status since a driver accepted the job
      await result.payment.delivery.update({ status: 'closed' });

      return res.status(201).json({
        clientSecret: result.intent.client_secret,
        payment: result.payment,
      });
    } catch (err) {
      console.error('❌ Payment Intent Error:', err);
      res.status(500).json({ error: 'Failed to create payment intent' });
    }
  },

  /**
   * STEP 2 — Capture Payment after successful delivery completion.
   * Stripe moves the authorized hold → completed transaction.
   */
  async capture(req, res) {
    try {
      const { paymentId } = req.params;
      const result = await PaymentService.capturePayment(paymentId);

      if (!result) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      return res.json({ message: 'Payment captured successfully' });
    } catch (err) {
      console.error('❌ Payment Capture Error:', err);
      res.status(500).json({ error: 'Failed to capture payment' });
    }
  },

  /**
   * STEP 3 — Cancel hold if job cannot be completed.
   * Stripe releases funds immediately.
   */
  async cancel(req, res) {
    try {
      const { paymentId } = req.params;
      const result = await PaymentService.cancelPayment(paymentId);

      if (!result) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      return res.json({ message: 'Payment canceled successfully' });
    } catch (err) {
      console.error('❌ Payment Cancel Error:', err);
      res.status(500).json({ error: 'Failed to cancel payment' });
    }
  },
};

module.exports = PaymentController;
