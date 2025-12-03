/**
 * @file purchaserService.js
 * Core business logic supporting the **purchaser role**.
 *
 * Responsibilities:
 *  - Create new delivery job requests
 *  - Retrieve currently active (unclaimed) delivery jobs
 *
 * Delivery lifecycle overview:
 *    Purchaser creates job → status: `open` → (deliverer accepts) → `closed`
 *    → (job completed) → `completed`
 *
 * NOTE:
 *   Purchasers do not directly complete deliveries — that’s owned by deliverers.
 */

const Delivery = require('../models/Delivery');

const PurchaserService = {
  /**
   * Returns open delivery jobs that were created by this purchaser.
   * Used in UI to show outstanding requests that have not been picked up.
   */
  async getPurchaserPendingJobs(purchaserId) {
    return Delivery.findAll({
      where: {
        purchaser_id: purchaserId,
        status: 'open',
      },
    });
  },

  /**
   * Creates a new delivery request.
   * Initializes delivery lifecycle at `open` state and assigns
   * the purchaser as the job owner.
   *
   * Required payload fields (validated upstream):
   *  - pickup_address, dropoff_address
   *  - item_description
   *  - proposed_payment (CAD)
   *  - purchaser_id (FK)
   */
  async createDelivery(payload) {
    return Delivery.create({
      pickup_address: payload.pickup_address,
      dropoff_address: payload.dropoff_address,
      latitude: payload.latitude || null,
      longitude: payload.longitude || null,
      item_description: payload.item_description,
      proposed_payment: payload.proposed_payment,
      purchaser_id: payload.purchaser_id,
      deliverer_id: null, // no driver yet, still open
      status: 'open',
    });
  },
};

module.exports = PurchaserService;
