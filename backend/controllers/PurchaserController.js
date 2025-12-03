/**
 * @file PurchaserController.js
 * Handles all customer-side delivery interactions:
 *  - Create new delivery job requests
 *  - Track their pending (unclaimed) delivery jobs
 *
 * Delegates business logic to PurchaserService:
 *   Controller → (HTTP handling) → Service → (DB + business rules)
 */

const PurchaserService = require('../services/purchaserService');

const PurchaserController = {
  /**
   * GET /api/purchaser/:id/pending
   * Shows active delivery jobs posted by the purchaser where:
   *    - No driver has accepted yet
   *    - Status remains `open`
   * Useful for UI tracking and cancellation flows.
   */
  async getPurchaserPendingJobs(req, res) {
    try {
      const jobs = await PurchaserService.getPurchaserPendingJobs(
        req.params.id
      );
      res.json(jobs);
    } catch (err) {
      console.error('❌ Purchaser Jobs Error:', err);
      res.status(500).json({ error: 'Failed to load jobs' });
    }
  },

  /**
   * POST /api/purchaser
   * Creates a new delivery job request. Starts lifecycle at:
   *      purchaser → "open" → (deliverer accepts) → "closed" → "completed"
   * Requires payload validation on frontend/API-level before submission.
   */
  async createDelivery(req, res) {
    try {
      const newDelivery = await PurchaserService.createDelivery(req.body);
      res.status(201).json(newDelivery);
    } catch (err) {
      console.error('❌ Create Delivery Error:', err);
      res.status(500).json({ error: 'Failed to create delivery' });
    }
  },
};

module.exports = PurchaserController;
