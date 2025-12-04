/**
 * @file DelivererController.js
 * Updated to integrate Stripe lifecycle:
 *  - Accept job → Authorize payment via Stripe PaymentIntent
 *  - Complete job → Capture authorized payment
 */

const { DelivererService, PaymentService } = require('../services');
const { Payment } = require('../models');

const DelivererController = {
  /**
   * GET /api/deliverer/:id/pending
   */
  async getPendingDelivererJobs(req, res) {
    try {
      const jobs = await DelivererService.getDelivererPendingJobs(
        req.params.id
      );
      res.json(jobs);
    } catch (err) {
      console.error('❌ Pending Deliverer Jobs Error:', err);
      res.status(500).json({ error: 'Failed to load pending jobs' });
    }
  },

  /**
   * GET /api/deliverer/:id/completed
   */
  async getCompletedDelivererJobs(req, res) {
    try {
      const jobs = await DelivererService.getDelivererCompletedJobs(
        req.params.id
      );
      res.json(jobs);
    } catch (err) {
      console.error('❌ Completed Deliverer Jobs Error:', err);
      res.status(500).json({ error: 'Failed to load completed jobs' });
    }
  },

  /**
   * PUT /api/deliverer/:id/accept
   * Driver claims an open job AND payment is authorized.
   */
async acceptJob(req, res) {
  try {
    const deliveryId = req.params.id;
    const delivererId = req.body.delivererId;

    // 1️⃣ Authorize payment FIRST (job is still open)
    const { intent } = await PaymentService.authorizePayment(deliveryId);

    // 2️⃣ NOW accept the job (sets status → pending)
    const delivery = await DelivererService.acceptJob(
      deliveryId,
      delivererId
    );

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    // 3️⃣ Send response
    res.json({
      message: 'Job accepted and payment authorized',
      delivery,
      clientSecret: intent.client_secret,
    });

  } catch (err) {
    console.error("❌ Accept Job Error:", err);
    res.status(400).json({ error: err.message || "Failed to accept job" });
  }
},

  /**
   * PUT /api/deliverer/:id/complete
   * Driver completes the delivery AND payment is captured.
   */
  async completeJob(req, res) {
    try {
      const { deliveryId } = req.body;
      const delivery = await DelivererService.completeDelivery(deliveryId);

      if (!delivery) {
        return res.status(404).json({ error: 'Delivery not found' });
      }

      // Find associated Payment record
      const payment = await Payment.findOne({
        where: { deliveryId: delivery.deliveryId },
      });

      if (!payment) {
        return res.status(404).json({
          error: 'Payment not found for this delivery',
        });
      }
      
      const result = await PaymentService.capturePayment(payment.id);

      res.json({
        message: 'Delivery completed and payment captured',
        status: result.status,
      });
    } catch (err) {
      console.error('❌ Complete Job Error:', err);
      res.status(400).json({ error: err.message || 'Failed to complete job' });
    }
  },
};

module.exports = DelivererController;
