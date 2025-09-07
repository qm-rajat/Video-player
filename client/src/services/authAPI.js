import api from './api';

const authAPI = {
  // Authentication
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  
  // Profile management
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  updatePassword: (passwordData) => api.put('/auth/password', passwordData),
  
  // Password reset
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
  
  // Email verification
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  resendVerification: () => api.post('/auth/resend-verification'),
  
  // Age verification
  verifyAge: (ageData) => api.post('/auth/verify-age', ageData),
  
  // Account management
  deleteAccount: () => api.delete('/auth/account'),
};

export default authAPI;