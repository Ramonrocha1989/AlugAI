import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// accessToken em memória — não exposto ao JS malicioso via localStorage
let accessToken: string | null = null;
let bootstrapPromise: Promise<boolean> | null = null;

function dispatchAuthTokenChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth-token-changed'));
  }
}

function isPublicAuthEndpoint(url?: string) {
  if (!url) return false;

  return [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-email',
  ].some((endpoint) => url.includes(endpoint));
}

function removeLegacyTokenKeysFromStorage() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  } catch {
    /* ignore */
  }
}

export function setAccessToken(token: string) {
  accessToken = token;
  removeLegacyTokenKeysFromStorage();
  dispatchAuthTokenChanged();
}

export function clearAccessToken() {
  accessToken = null;
  removeLegacyTokenKeysFromStorage();
  dispatchAuthTokenChanged();
}

export function getAccessToken() {
  return accessToken;
}

export async function bootstrapAccessToken(): Promise<boolean> {
  if (accessToken) return true;
  if (bootstrapPromise) return bootstrapPromise;

  bootstrapPromise = (async () => {
    try {
      const refreshRes = await httpClient.post(
        validateEndpoint('/auth/refresh'),
        {},
        {
          // Flags internas de controle (não viram headers HTTP)
          skipAuthRefresh: true,
          skipAuthRedirect: true,
        } as any
      );
      const newAccessToken = refreshRes.data?.accessToken;
      if (newAccessToken) {
        setAccessToken(newAccessToken);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      bootstrapPromise = null;
    }
  })();

  return bootstrapPromise;
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
  const requestUrl = typeof config.url === 'string' ? config.url : '';
  if (accessToken && !isPublicAuthEndpoint(requestUrl)) {
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
    const requestUrl = typeof originalRequest?.url === 'string' ? originalRequest.url : '';
    const skipAuthRefresh = Boolean((originalRequest as any)?.skipAuthRefresh);
    const skipAuthRedirect = Boolean((originalRequest as any)?.skipAuthRedirect);
    const isRefreshEndpoint = requestUrl.includes('/auth/refresh');

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      skipAuthRefresh ||
      isRefreshEndpoint ||
      isPublicAuthEndpoint(requestUrl)
    ) {
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
      if (typeof window !== 'undefined' && !skipAuthRedirect) {
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
      }
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);
