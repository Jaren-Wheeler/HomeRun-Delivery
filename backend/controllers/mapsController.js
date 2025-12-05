// backend/controllers/MapsController.js
const { MapsService } = require("../services");

const MapsController = {
  getMapsKey(req, res) {
    return res.json({
      apiKey: process.env.GOOGLE_MAPS_API_KEY,
    });
  },

  async getMarkers(req, res) {
    try {
      const markers = await MapsService.getOpenMarkers();
      res.json(markers);
    } catch (err) {
      console.error("❌ Failed loading markers:", err);
      res.status(500).json({ error: "Failed to load markers" });
    }
  },
};

module.exports = MapsController;
