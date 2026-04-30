import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// accessToken em memória — não exposto ao JS malicioso via localStorage
let accessToken: string | null = null;

export function setAccessToken(token: string) {
  accessToken = token;
}

export function clearAccessToken() {
  accessToken = null;
}

export function getAccessToken() {
  return accessToken;
}

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
  withCredentials: true, // necessário para enviar refreshToken cookie
});

// Injetar accessToken no header Authorization em toda requisição
httpClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Refresh robusto sem race condition
let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

const processPending = () => {
  pendingRequests.forEach(cb => cb());
  pendingRequests = [];
};

const clearPending = () => {
  pendingRequests = [];
};

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Marcar para não tentar refresh infinito
    originalRequest._retry = true;

    if (isRefreshing) {
      // Enfileirar e aguardar o refresh em andamento terminar
      return new Promise((resolve, reject) => {
        pendingRequests.push(() => {
          if (accessToken) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          resolve(httpClient(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      // refreshToken é enviado automaticamente via cookie httpOnly
      const refreshRes = await httpClient.post(validateEndpoint('/auth/refresh'));

      const newAccessToken = refreshRes.data.accessToken;
      if (newAccessToken) {
        setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }

      processPending();
      return httpClient(originalRequest);
    } catch (err) {
      clearPending();
      clearAccessToken();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
      }
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);
