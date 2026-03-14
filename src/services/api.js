import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/users/register', data),
  login: (data) => api.post('/auth/users/login', data),
  getProfile: () => api.get('/auth/users/profile'),
  updateProfile: (data) => api.put('/auth/users/profile', data),
  deleteAccount: () => api.delete('/auth/users/profile'),
};

// Automation APIs
export const automationAPI = {
  getAll: () => api.get('/automations'),
  getOne: (id) => api.get(`/automations/${id}`),
  create: (data) => api.post('/automations/create-automation', data),
  update: (id, data) => api.put(`/automations/${id}`, data),
  delete: (id) => api.delete(`/automations/${id}`),
  toggle: (id) => api.patch(`/automations/${id}/toggle`),
};

// Logs APIs
export const logsAPI = {
  getAll: (limit = 50) => api.get(`/logs?limit=${limit}`),
  getByAutomation: (id, limit = 50) => api.get(`/logs/${id}?limit=${limit}`),
  getStats: () => api.get('/logs/stats'),
};

// Metrics APIs
export const metricsAPI = {
  get: () => api.get('/metrics'),
};

export default api;
