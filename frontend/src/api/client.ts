/**
 * Axios instance — reads token from Zustand auth store (via localStorage)
 * and attaches it to every request. Handles 401 by clearing auth state.
 */
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';

export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT ──────────────────────────────────────────
apiClient.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('fatakpay-auth');
    if (raw) {
      const { state } = JSON.parse(raw) as { state: { tokens?: { access?: string } } };
      const token = state?.tokens?.access;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    // localStorage unavailable or corrupt — proceed without token
  }
  return config;
});

// ── Response interceptor: handle 401 ─────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Clear persisted auth so the app redirects to login
      localStorage.removeItem('fatakpay-auth');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  },
);

export default apiClient;
