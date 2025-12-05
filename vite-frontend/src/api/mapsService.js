import api from "./axiosConfig";

const mapsService = {
  // Get backend Google Maps API key
  async getMapsKey() {
    const res = await api.get("/maps/maps-key");
    return res.data;
  },

  // Get all open delivery markers
  async getMarkers() {
    const res = await api.get("/maps/markers");
    return res.data;
  },
};

export default mapsService;
