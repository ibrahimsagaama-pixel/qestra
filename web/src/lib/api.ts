import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Injecte le token JWT automatiquement
api.interceptors.request.use((config) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('qestra_token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirige vers /auth/login si 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('qestra_token');
      localStorage.removeItem('qestra_user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(err);
  },
);
