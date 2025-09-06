import api from './api';

export const listUsers = () => api.get('/admin/users').then(r=>r.data);
export const getUser = (id) => api.get(`/admin/users/${id}`).then(r=>r.data);
export const updateUser = (id, payload) => api.put(`/admin/users/${id}`, payload).then(r=>r.data);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`).then(r=>r.data);
