import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Usa cookies quando a URL aponta para o domínio de produção
const useCookies = API_BASE.includes('api.baitabriq.com.br');

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
  withCredentials: useCookies,
});

// Em dev, injetar token do localStorage no header Authorization
if (typeof window !== 'undefined' && !useCookies) {
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
      // Em produção: cookie enviado automaticamente via withCredentials
      // Em dev: refreshToken no body
      const refreshToken = !useCookies ? localStorage.getItem('refreshToken') : undefined;
      const refreshRes = await httpClient.post(
        validateEndpoint('/auth/refresh'),
        !useCookies && refreshToken ? { refreshToken } : undefined,
      );

      if (!useCookies && refreshRes.data.accessToken) {
        localStorage.setItem('accessToken', refreshRes.data.accessToken);
        localStorage.setItem('refreshToken', refreshRes.data.refreshToken);
      }

      processQueue(null);
      // Remover Authorization header antigo para forçar uso do cookie novo
      delete originalRequest.headers['Authorization'];
      delete originalRequest.headers['authorization'];
      // Pequeno delay para garantir que o browser processou o Set-Cookie
      await new Promise(resolve => setTimeout(resolve, 100));
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
