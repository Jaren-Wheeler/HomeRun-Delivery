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
const { Delivery } = require('../models');

const PurchaserService = {
  /**
   * Returns open delivery jobs that were created by this purchaser.
   * Used in UI to show outstanding requests that have not been picked up.
   */
  async getPurchaserPendingJobs(purchaserId) {
    return Delivery.findAll({
      where: {
        purchaser_id: purchaserId,
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
      pickupAddress: payload.pickup_address,
      dropoffAddress: payload.dropoff_address,
      latitude: payload.latitude || null,
      longitude: payload.longitude || null,
      itemDescription: payload.item_description,
      proposedPayment: payload.proposed_payment,
      purchaserId: payload.purchaser_id,
      delivererId: null, // no driver yet
      status: 'open',
    });
  },


  async updateDelivery(id, updateData) {
    const result = await Delivery.update(updateData, {
        where: { deliveryId: id }
    });

    return result[0] > 0; // returns true if something was updated
    
  },

  async deleteDelivery(id) {
      const deleted = await Delivery.destroy({
          where: { deliveryId: id }
      });

      return deleted > 0; // true if a row was deleted
  }


};


module.exports = PurchaserService;
