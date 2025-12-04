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
      console.error('❌ Create Delivery Error:', err); // FULL ERROR LOG
      res.status(500).json({
        error: err.message,
        name: err.name,
        details: err.errors || null,
      });
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
      console.log('📦 Incoming Body:', req.body); // LOG PAYLOAD FIRST

      const newDelivery = await PurchaserService.createDelivery(req.body);

      return res.status(201).json(newDelivery);
    } catch (err) {
      console.error('❌ Create Delivery Error:', {
        message: err.message,
        name: err.name,
        details: err.errors?.map((e) => e.message) || null,
      });

      return res.status(500).json({
        error: err.message,
        details: err.errors?.map((e) => e.message) || null,
      });
    }
  },

  async updateExistingJobs(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const success = await PurchaserService.updateDelivery(id, updateData);

      if (!success) {
        return res.status(404).json({ error: 'Delivery not found' });
      }

      return res.json({ message: 'Delivery updated successfully' });
    } catch (error) {
      console.error('Error updating delivery:', error);
      res.status(500).json({ error: 'Failed to update delivery' });
    }
  },

  async deleteOpenJob(req, res) {
    try {
      const { id } = req.params;

      const deleted = await PurchaserService.deleteDelivery(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Delivery not found' });
      }

      return res.json({ message: 'Delivery deleted successfully' });
    } catch (error) {
      console.error('Error deleting delivery:', error);
      return res.status(500).json({ error: 'Failed to delete delivery' });
    }
  },
};

module.exports = PurchaserController;
