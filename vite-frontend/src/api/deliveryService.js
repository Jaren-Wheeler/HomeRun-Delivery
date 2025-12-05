import api from './axiosConfig';

const deliveryService = {
  /**
   * Purchaser: Create Delivery ONLY
   * Returns Delivery object with deliveryId
   */
  createDelivery: async (data) => {
    const response = await api.post('/purchaser/create-with-intent', data);
    return response.data; // this now returns { delivery, clientSecret }
  },

  /**
   * Purchaser: Create Stripe PaymentIntent for an existing delivery
   * Returns: { clientSecret }
   */
  createPaymentIntent: async (deliveryId) => {
    const response = await api.post(`/payments/create-intent/${deliveryId}`);
    return response.data;
  },

  getPurchaserDeliveries: async (purchaserId) => {
    const response = await api.get(`/purchaser/${purchaserId}/pending`);
    return response.data;
  },

  getPurchaserInProgressJobs: async (purchaserId) => {
    const response = await api.get(`/purchaser/${purchaserId}/in-progress`);
    return response.data;
  },

  getPendingDelivererJobs: async (delivererId) => {
    const response = await api.get(`/deliverer/${delivererId}/pending`);
    return response.data;
  },

  acceptJob: async (delivererId, deliveryId) => {
    const response = await api.put(`/deliverer/${delivererId}/accept`, {
      deliveryId,
    });
    return response.data;
  },

  completeJob: async (delivererId, deliveryId) => {
    const response = await api.put(`/deliverer/${delivererId}/complete`, {
      deliveryId,
    });
    return response.data;
  },

  getCompletedDelivererJobs: async (delivererId) => {
    const response = await api.get(`/deliverer/${delivererId}/completed`);
    return response.data;
  },

  getPaymentClientSecret: async (deliveryId) => {
  const res = await api.get(`/payments/intent/${deliveryId}`);
  return res.data.clientSecret;
},

};

export default deliveryService;
