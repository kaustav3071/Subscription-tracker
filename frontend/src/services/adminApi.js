import api from './api';

export const listUsers = () => api.get('/admin/users').then(r=>r.data);
export const getUser = (id) => api.get(`/admin/users/${id}`).then(r=>r.data);
export const updateUser = (id, payload) => api.put(`/admin/users/${id}`, payload).then(r=>r.data);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`).then(r=>r.data);

export async function listSupport(params = {}) {
  const search = new URLSearchParams();
  if (params.status) search.set('status', params.status);
  const { data } = await api.get(`/admin/support${search.toString() ? `?${search}` : ''}`);
  return data;
}

export async function resolveSupport(id) {
  const { data } = await api.patch(`/admin/support/${id}`, { status: 'resolved' });
  return data;
}

export async function replySupport(id, reply) {
  const { data } = await api.post(`/admin/support/${id}/reply`, { reply });
  return data;
}

export async function getSupportHistory(id) {
  const { data } = await api.get(`/admin/support/${id}/history`);
  return data;
}
