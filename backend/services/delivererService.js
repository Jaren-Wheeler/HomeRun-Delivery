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

const Delivery = require('../models/Delivery');
const User = require('../models/User');

const DelivererService = {
  /**
   * Finds all jobs currently `open` and without a deliverer assigned.
   * Driver can claim any of these jobs.
   */
  async getDelivererPendingJobs(delivererId) {
    return Delivery.findAll({
      where: { delivererId: delivererId, status: 'closed' },
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
      where: { delivererId: delivererId, status: 'completed' },
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
      delivererId: delivererId,
      status: 'closed',
    });

    return delivery;
  },
};

module.exports = DelivererService;
