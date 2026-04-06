import { api } from './api';

// Interceptor com mutex para evitar refresh concorrente
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token!);
  });
  failedQueue = [];
};

const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user).refreshToken : null;
};

const saveTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window === 'undefined') return;
  const user = localStorage.getItem('currentUser');
  if (user) {
    const userData = JSON.parse(user);
    userData.token = accessToken;
    userData.refreshToken = refreshToken;
    localStorage.setItem('currentUser', JSON.stringify(userData));
  }
};

const logout = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('currentUser');
  window.location.href = '/login';
};

// Configurar interceptor de resposta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Se já está fazendo refresh, enfileira a requisição
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const { data } = await api.post('/auth/refresh', { refreshToken });
      saveTokens(data.accessToken, data.refreshToken);
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      processQueue(null, data.accessToken);
      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);
      logout();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);