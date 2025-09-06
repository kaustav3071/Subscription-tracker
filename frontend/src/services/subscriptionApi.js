import api from './api';

// User scoped subscription endpoints
export const subscriptionApi = {
  list: (params = {}) => api.get('/subscriptions', { params }).then(r => r.data),
  get: (id) => api.get(`/subscriptions/${id}`).then(r => r.data),
  create: (data) => api.post('/subscriptions', data).then(r => r.data),
  update: (id, data) => api.put(`/subscriptions/${id}`, data).then(r => r.data),
  remove: (id) => api.delete(`/subscriptions/${id}`).then(r => r.data),
  // Admin: list a specific user's subscriptions
  adminListUser: (userId, params = {}) => api.get(`/admin/users/${userId}/subscriptions`, { params }).then(r => r.data),
  // Admin: list all subscriptions across users
  adminListAll: (params = {}) => api.get('/admin/subscriptions', { params }).then(r => r.data),
};

export default subscriptionApi;
