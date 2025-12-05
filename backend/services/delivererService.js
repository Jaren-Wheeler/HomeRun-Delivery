/**
 * @file delivererService.js
 * Simplified responsibilities:
 *  - Validate lifecycle
 *  - Assign deliverer
 *  - Return delivery for payment lifecycle to proceed
 */

const { Delivery, User } = require('../models');

const DelivererService = {
  async getDelivererPendingJobs(delivererId) {
    return Delivery.findAll({
      where: {
        status: 'closed',
        delivererId: delivererId,
      },
      include: [
        {
          model: User,
          as: 'Purchaser',
          attributes: ['first_name', 'last_name'],
        },
      ],
    });
  },

  async getDelivererCompletedJobs(delivererId) {
    return Delivery.findAll({
      where: { delivererId, status: 'completed' },
      include: [
        {
          model: User,
          as: 'Purchaser',
          attributes: ['first_name', 'last_name'],
        },
      ],
    });
  },

  async completeDelivery(deliveryId) {
    const delivery = await Delivery.findByPk(deliveryId);
    if (!delivery) return null;

    if (delivery.status !== 'closed') {
      throw new Error('Delivery must be accepted before completion');
    }

    return delivery; // status update handled in PaymentService
  },

  async acceptJob(deliveryId, delivererId) {
    const delivery = await Delivery.findByPk(deliveryId);
    if (!delivery) {
      throw new Error('Delivery not found');
    }

    if (delivery.status !== 'open') {
      throw new Error('Delivery is not open');
    }

    const updatedDelivery = await delivery.update({
      delivererId,
      // status stays "open" here
    });

    return updatedDelivery;
  },
};

module.exports = DelivererService;
