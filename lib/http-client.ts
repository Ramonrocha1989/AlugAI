import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Valida que o endpoint é apenas um path relativo seguro e pertence ao domínio permitido
export function validateEndpoint(endpoint: string): string {
  if (!/^\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]*$/.test(endpoint)) {
    throw new Error('Invalid endpoint');
  }
  // Constrói URL completa usando o base como prefixo (não como origem)
  const base = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
  const fullUrl = new URL(base + endpoint);
  const allowed = new URL(API_BASE);
  if (fullUrl.origin !== allowed.origin) {
    throw new Error('Endpoint fora do domínio permitido');
  }
  // Retorna apenas o path relativo ao baseURL para o axios não duplicar
  const basePath = new URL(API_BASE).pathname.replace(/\/$/, '');
  const relativePath = fullUrl.pathname.replace(basePath, '') + fullUrl.search;
  return relativePath || '/';
}

export const httpClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Adiciona token em todas as requisições
httpClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Refresh automático com mutex
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token!);
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
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(httpClient(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
      if (!refreshToken) throw new Error('No refresh token');

      const { data } = await httpClient.post(validateEndpoint('/auth/refresh'), { refreshToken });

      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      processQueue(null, data.accessToken);
      return httpClient(originalRequest);
    } catch (err) {
      processQueue(err, null);
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
