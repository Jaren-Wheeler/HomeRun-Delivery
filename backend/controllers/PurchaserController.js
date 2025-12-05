/**
 * @file PurchaserController.js
 * Handles customer-side delivery interactions:
 *  - Create new delivery job requests (now includes card setup + Stripe lock)
 *  - Track all delivery posts in "open" state
 */

const PurchaserService = require('../services/purchaserService');

const PurchaserController = {
  /**
   * GET /api/purchaser/:id/pending
   * Returns all OPEN delivery jobs for the purchaser.
   */
  async getPurchaserPendingJobs(req, res) {
    try {
      const jobs = await PurchaserService.getPurchaserPendingJobs(
        req.params.id
      );
      res.json(jobs);
    } catch (err) {
      console.error('❌ Pending Jobs Error:', err);
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * POST /api/purchaser
   *
   * 🎯 BIG UPDATE:
   * When a delivery is created, we now:
   *  1) Create Delivery row in DB
   *  2) Create Stripe PaymentIntent with manual capture
   *  3) Return BOTH:
   *        - delivery
   *        - clientSecret (FE must confirm card entry)
   */
  async createDelivery(req, res) {
    try {
      console.log('📦 Incoming Delivery Create:', req.body);

      // Updated service returns: { delivery, clientSecret }
      const result = await PurchaserService.createDelivery(req.body);

      // Ensure deliveryId is exposed exactly as frontend expects
      return res.status(201).json({
        deliveryId: result.delivery.delivery_id || result.delivery.deliveryId,
        delivery: result.delivery,
        clientSecret: result.clientSecret,
      });
    } catch (err) {
      console.error('❌ Create Delivery Error:', err);
      return res.status(500).json({ error: err.message });
    }
  },

  /**
   * Modify an existing delivery request
   * (currently only for open requests)
   */
  async updateExistingJobs(req, res) {
    try {
      const { id } = req.params;
      const success = await PurchaserService.updateDelivery(id, req.body);
      if (!success)
        return res.status(404).json({ error: 'Delivery not found' });
      res.json({ message: 'Delivery updated successfully' });
    } catch (err) {
      console.error('Error updating delivery:', err);
      res.status(500).json({ error: 'Failed to update delivery' });
    }
  },

  /**
   * Delete an open delivery job
   */
  async deleteOpenJob(req, res) {
    try {
      const { id } = req.params;
      const deleted = await PurchaserService.deleteDelivery(id);
      if (!deleted)
        return res.status(404).json({ error: 'Delivery not found' });
      res.json({ message: 'Delivery deleted successfully' });
    } catch (err) {
      console.error('Error deleting delivery:', err);
      res.status(500).json({ error: 'Failed to delete delivery' });
    }
  },
};

module.exports = PurchaserController;
