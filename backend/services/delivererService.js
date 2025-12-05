/**
 * @file delivererService.js
 * Simplified responsibilities:
 *  - Validate lifecycle
 *  - Assign deliverer
 *  - Return delivery for payment lifecycle to proceed
 */

const { Delivery, User } = require('../models');
const PaymentService = require('./paymentService');

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

 async acceptJob(delivererId, deliveryId) {
  const delivery = await Delivery.findByPk(deliveryId);

  if (!delivery) throw new Error("Delivery not found");

  // Debug: what is the status before we touch it?
  console.log("STATUS BEFORE ASSIGN:", delivery.status);

  // Assign deliverer but DO NOT change status yet
  delivery.delivererId = delivererId;
  await delivery.save();

  // Debug again
  console.log("STATUS AFTER ASSIGN:", delivery.status);

  // Now authorize Stripe
  const { intent, payment } = await PaymentService.authorizePayment(deliveryId);

  // Debug after stripe
  console.log("STATUS AFTER STRIPE:", delivery.status);

  return {
    message: "Job accepted",
    clientSecret: intent.client_secret,
    payment
  };
}


};

module.exports = DelivererService;
