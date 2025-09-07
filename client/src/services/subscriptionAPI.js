import api from './api';

const subscriptionAPI = {
  // Subscription plans
  getPlans: () => api.get('/payments/plans'),
  
  // Subscription management
  getSubscriptions: () => api.get('/payments/subscriptions'),
  
  createSubscription: (subscriptionData) => api.post('/payments/subscribe', subscriptionData),
  
  updateSubscription: (subscriptionId, updateData) => api.put(`/payments/subscription/${subscriptionId}`, updateData),
  
  cancelSubscription: (subscriptionId) => api.delete(`/payments/subscription/${subscriptionId}`),
  
  // Payment history
  getPaymentHistory: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/payments/history?${queryString}`);
  },
  
  // One-time payments
  createPaymentIntent: (paymentData) => api.post('/payments/payment-intent', paymentData),
};

export default subscriptionAPI;