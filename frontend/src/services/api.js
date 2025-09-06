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

export default api;
