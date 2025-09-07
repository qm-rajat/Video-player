import api from './api';

const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard'),
  
  // Content moderation
  getReportedContent: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/reports?${queryString}`);
  },
  
  moderateContent: (type, id, moderationData) => api.put(`/admin/moderate/${type}/${id}`, moderationData),
  
  // User management
  getUsers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/users?${queryString}`);
  },
  
  suspendUser: (userId, suspensionData) => api.put(`/admin/users/${userId}/suspend`, suspensionData),
  
  unsuspendUser: (userId) => api.put(`/admin/users/${userId}/unsuspend`),
  
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  
  // Analytics
  getPaymentStats: () => api.get('/admin/payments'),
  
  // System
  getSystemLogs: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/logs?${queryString}`);
  },
};

export default adminAPI;