import axios from 'axios';

// Backend mounts routes at root (e.g., /users, /subscriptions) without the /api prefix.
// Default base adjusted accordingly. Set VITE_API_BASE in env to override if needed.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000',
  withCredentials: false
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      // Optionally redirect later
    }
    return Promise.reject(error);
  }
);

export async function listUserSupport(params = {}) {
  const search = new URLSearchParams();
  if (params.status) search.set('status', params.status);
  const { data } = await api.get(`/users/support${search.toString() ? `?${search}` : ''}`);
  return data;
}

export async function resolveUserSupport(id) {
  const { data } = await api.patch(`/users/support/${id}/resolve`);
  return data;
}

export async function getUserSupportHistory(id) {
  const { data } = await api.get(`/users/support/${id}/history`);
  return data;
}

// Notification preferences API
export async function getNotificationPreferences() {
  const { data } = await api.get('/users/notifications');
  return data;
}

export async function updateNotificationPreferences(preferences) {
  const { data } = await api.patch('/users/notifications', preferences);
  return data;
}

export default api;
