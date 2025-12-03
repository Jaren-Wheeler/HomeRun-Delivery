/**
 * @file DelivererController.js
 * Handles all driver-side delivery interactions:
 *  - View available delivery jobs
 *  - View delivery job history
 *  - Accept open delivery jobs
 *  - Complete closed delivery jobs
 *
 * Enforces business rules through DelivererService:
 *    Controller → (Validation/HTTP) → Service → (Business logic / DB)
 */

const { DelivererService } = require('../services');

const DelivererController = {
  /**
   * GET /api/deliverer/:id/pending
   * Lists all deliveries with `status: open` and `deliverer_id: null`.
   * The driver can claim any of these pending jobs.
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
   * Shows the driver’s completed delivery history for reputation + payout tracking.
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
   * PUT /api/deliverer/:id/complete
   * Moves a delivery from `closed` → `completed`.
   * Driver can only complete a job they have accepted.
   */
  async completeJob(req, res) {
    try {
      const delivery = await DelivererService.completeDelivery(req.params.id);

      if (!delivery) {
        return res.status(404).json({ error: 'Delivery not found' });
      }

      res.json({
        message: 'Delivery marked as completed!',
        delivery,
      });
    } catch (err) {
      console.error('❌ Complete Job Error:', err);
      res.status(400).json({ error: err.message || 'Failed to complete job' });
    }
  },

  /**
   * PUT /api/deliverer/:id/accept
   * Moves a delivery from `open` → `closed` and assigns the deliverer to it.
   */
  async acceptJob(req, res) {
    try {
      const delivery = await DelivererService.acceptJob(
        req.params.id,
        req.body.deliverer_id
      );

      if (!delivery) {
        return res.status(404).json({ error: 'Delivery not found' });
      }

      res.json({ message: 'Job accepted', delivery });
    } catch (err) {
      console.error('❌ Accept Job Error:', err);
      res.status(400).json({ error: err.message || 'Failed to accept job' });
    }
  },
};

module.exports = DelivererController;
