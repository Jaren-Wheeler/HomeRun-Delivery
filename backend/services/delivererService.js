/**
 * @file delivererService.js
 * Core business logic supporting the **deliverer role**.
 *
 * Responsibilities:
 *  - Query delivery jobs for driver dashboards
 *  - Validate delivery state transitions
 *  - Assign jobs to drivers
 *  - Mark jobs as completed
 *
 * Data access layer responsibilities:
 *   Service → (Business rules + DB logic) → Sequelize Models
 */

const { Delivery, User } = require('../models');

const DelivererService = {
  /**
   * Finds all jobs currently `open` and without a deliverer assigned.
   * Driver can claim any of these jobs.
   */
  async getDelivererPendingJobs() {
    return Delivery.findAll({
      where: { status: 'open', deliverer_id: null },
      include: [
        {
          model: User,
          as: 'Purchaser',
          attributes: ['first_name', 'last_name'],
        },
      ],
    });
  },

  /**
   * Finds completed jobs previously handled by the deliverer.
   * Useful for profile history & payout reporting.
   */
  async getDelivererCompletedJobs(delivererId) {
    return Delivery.findAll({
      where: { deliverer_id: delivererId, status: 'completed' },
      include: [
        {
          model: User,
          as: 'Purchaser',
          attributes: ['first_name', 'last_name'],
        },
      ],
    });
  },

  /**
   * Transition job status: CLOSED → COMPLETED
   * Driver may only complete jobs they have already accepted.
   */
  async completeDelivery(deliveryId) {
    const delivery = await Delivery.findByPk(deliveryId);
    if (!delivery) return null;

    if (delivery.status !== 'closed') {
      throw new Error('Delivery must be accepted before completion');
    }

    delivery.status = 'completed';
    await delivery.save();
    return delivery;
  },

  /**
   * Assigns the deliverer to the job and transitions:
   *   OPEN → CLOSED
   * Only valid if delivery has not yet been claimed.
   */
  async acceptJob(deliveryId, delivererId) {
    const delivery = await Delivery.findByPk(deliveryId);
    if (!delivery) return null;

    if (delivery.status !== 'open') {
      throw new Error('Job is not open anymore');
    }

    await delivery.update({
      deliverer_id: delivererId,
      status: 'closed',
    });

    return delivery;
  },
};

module.exports = DelivererService;
