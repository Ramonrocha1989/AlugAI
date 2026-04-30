import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const isProd = process.env.NODE_ENV === 'production';

export function validateEndpoint(endpoint: string): string {
  if (!/^\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]*$/.test(endpoint)) {
    throw new Error('Invalid endpoint');
  }
  return endpoint;
}

export const httpClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: isProd, // cookies só em produção
});

// Em dev, injetar token do localStorage no header Authorization
if (typeof window !== 'undefined' && !isProd) {
  httpClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

// Refresh automático com mutex
let isRefreshing = false;
let failedQueue: Array<{ resolve: () => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve();
  });
  failedQueue = [];
};

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => resolve(httpClient(originalRequest)),
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = !isProd ? localStorage.getItem('refreshToken') : undefined;
      const refreshRes = await httpClient.post(
        validateEndpoint('/auth/refresh'),
        !isProd && refreshToken ? { refreshToken } : undefined,
      );

      if (!isProd && refreshRes.data.accessToken) {
        localStorage.setItem('accessToken', refreshRes.data.accessToken);
        localStorage.setItem('refreshToken', refreshRes.data.refreshToken);
      }

      processQueue(null);
      return httpClient(originalRequest);
    } catch (err) {
      processQueue(err);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
      }
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);
