/**
 * @file mapsService.js
 * Business logic for map-based delivery browsing and marker data retrieval.
 *
 * Responsibilities:
 *  - Provide lightweight marker data to Google Maps UI
 *  - Only expose non-sensitive delivery information to clients
 *
 * NOTE:
 *   This service intentionally excludes detailed job fields
 *   to maintain privacy and reduce payload size for map queries.
 */

const Delivery = require('../models/Delivery');
const User = require('../models/User');

const MapsService = {
  /**
   * Finds all delivery jobs where status is `open`.
   * Provides minimal fields needed to render map markers and info popups.
   *
   * Used in:
   *  - Google Maps on main screen
   *  - "Available Jobs" browsing UI
   */
  async getOpenMarkers() {
    return Delivery.findAll({
      where: { status: 'open' },
      attributes: [
        'delivery_id',
        'pickup_address',
        'item_description',
        'proposed_payment',
        'status',
        'purchaser_id',
        'deliverer_id',
        'latitude',
        'longitude',
      ],
      include: [
        {
          model: User,
          as: 'Purchaser',
          attributes: ['first_name', 'last_name'], // identification for UI only
        },
      ],
    });
  },
};

module.exports = MapsService;
