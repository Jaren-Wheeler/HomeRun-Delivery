/**
 * @file purchaserService.js
 * Handles business logic for purchasers:
 * - Create a delivery job + initialize Stripe PaymentIntent (manual capture)
 * - Get dashboard list of open deliveries
 * - Update or delete own open deliveries
 */

const { Delivery, User, Payment } = require('../models');
const stripe = require('../config/stripe');

const PurchaserService = {
  /**
   * Purchaser dashboard list:
   * Only return jobs still waiting for a driver (open)
   */
  async getPurchaserPendingJobs(purchaserId) {
    return Delivery.findAll({
      where: {
        purchaserId,
        status: 'open',
      },
    });
  },

  /**
   * Purchaser dashboard list:
   * Only return jobs that have been accepted by a deliverer but not completed
   */
  async getPurchaserInProgressJobs(purchaserId) {
    return Delivery.findAll({
      where: {
        purchaserId,
        status: "closed"   // accepted but not completed
      },
      include: [
        {
          model: User,
          as: "Deliverer",
          attributes: ["first_name", "last_name"]
        }
      ]
    });
  },

  /**
   * Create Delivery + Stripe PaymentIntent
   *
   * Lifecycle:
   *  - Creates DB delivery row (status: open)
   *  - Creates PaymentIntent with manual capture (auth only)
   *  - Saves the Payment + Intent ID in DB
   *  - Returns:
   *      delivery: Delivery model instance
   *      clientSecret: string needed by Stripe Elements
   */
  async createDelivery(payload) {
    // ------------------------
    // Validate required fields
    // ------------------------
    if (!payload.purchaser_id) {
      throw new Error('Purchaser ID missing in request');
    }
    if (!payload.proposed_payment) {
      throw new Error('Payment amount missing');
    }

    // 1 Create delivery in DB
    const delivery = await Delivery.create({
      pickupAddress: payload.pickup_address,
      dropoffAddress: payload.dropoff_address,
      latitude: payload.latitude ?? null,
      longitude: payload.longitude ?? null,
      itemDescription: payload.item_description,
      proposedPayment: payload.proposed_payment,
      purchaserId: payload.purchaser_id,
      status: 'open',
    });

    // 2 Ensure Stripe customer exists for purchaser
    const purchaser = await User.findByPk(payload.purchaser_id);
    if (!purchaser) {
      throw new Error('Purchaser not found');
    }
    if (!purchaser.stripeCustomerId) {
      throw new Error('User does not have a Stripe customer ID setup');
    }

    // Stripe requires cents
    const amountInCents = Math.round(Number(delivery.proposedPayment) * 100);

    // 3 Create PaymentIntent at Stripe
    const intent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'cad',
      capture_method: 'manual', // Authorization only
      customer: purchaser.stripeCustomerId,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        deliveryId: delivery.deliveryId,
        purchaserId: purchaser.user_id, // correct column name
      },
    });

    // 4 Payment tracking row in DB
    await Payment.create({
      deliveryId: delivery.deliveryId,
      amount: delivery.proposedPayment,
      stripePaymentIntentId: intent.id,
      status: intent.status,
    });

    // Save PaymentIntent ID reference in the delivery table
    await delivery.update({
      paymentIntentId: intent.id,
    });

    // 5 Return format FE requires
    return {
      delivery,
      clientSecret: intent.client_secret,
    };
  },

  async updateDelivery(id, updateData) {
    const result = await Delivery.update(updateData, {
      where: { deliveryId: id },
    });
    return result[0] > 0;
  },

  async deleteDelivery(id) {
    const deleted = await Delivery.destroy({ where: { deliveryId: id } });
    return deleted > 0;
  },
};

module.exports = PurchaserService;
