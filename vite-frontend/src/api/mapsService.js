import api from './axiosConfig';

const mapsService = {
  // Get API key for Google Maps initialization
  getMapsKey: async () => {
    const response = await api.get('/maps/maps-key');
    return response.data; // { apiKey: "xxxxx" }
  },

  // Get open deliveries formatted for map markers
  getMarkers: async () => {
    const response = await api.get('/maps/markers');
    return response.data; // [{ id, pickupAddress, latitude, longitude, ... }]
  },
};

export default mapsService;
