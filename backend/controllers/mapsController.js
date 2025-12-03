/**
 * @file MapsController.js
 * Handles requests related to Google Maps usage:
 *  - Expose API key securely to client
 *  - Load markers for available deliveries
 *
 * Business logic delegated to MapsService for clean architecture.
 */

const { MapsService } = require('../services');

const MapsController = {
  /**
   * Provides the Google Maps JS SDK key dynamically.
   * Prevents hardcoding API credentials in frontend build.
   */
  getMapsKey(req, res) {
    return res.json({
      key: process.env.GOOGLE_MAPS_API_KEY,
    });
  },

  /**
   * Returns map markers for all *open* delivery jobs.
   * Purchaser name included for UI context.
   */
  async getMarkers(req, res) {
    try {
      const markers = await MapsService.getOpenMarkers();
      res.json(markers);
    } catch (err) {
      console.error('❌ Error loading map markers:', err);
      res.status(500).json({ error: 'Failed to load markers' });
    }
  },
};

module.exports = MapsController;
