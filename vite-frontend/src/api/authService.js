import api from './axiosConfig';

const authService = {
  login: async (email, password) => {
    const response = await api.post('/account/login', { email, password });
    return response.data; // { user, token }
  },

  register: async (formData) => {
    const response = await api.post('/account/register', formData);
    return response.data; // { message, user, token }
  },
};

export default authService;
