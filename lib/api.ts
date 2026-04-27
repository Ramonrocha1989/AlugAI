import { httpClient, validateEndpoint } from './http-client';

function showToast(message: string, type: 'error' | 'success' | 'warning' = 'error') {
  if (typeof document === 'undefined') return;
  const colors = { error: '#dc2626', success: '#16a34a', warning: '#ca8a04' };
  const toast = document.createElement('div');
  toast.style.cssText = `position:fixed;top:20px;right:20px;z-index:9999;padding:16px 24px;border-radius:8px;box-shadow:0 4px 6px rgba(0,0,0,.1);color:#fff;font-weight:500;max-width:400px;background:${colors[type]}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const safeUrl = validateEndpoint(endpoint);
  const method = (options.method || 'GET').toLowerCase() as 'get' | 'post' | 'put' | 'patch' | 'delete';
  const body = options.body ? JSON.parse(options.body as string) : undefined;

  try {
    const response = await httpClient.request({
      url: safeUrl,
      method,
      data: body,
      headers: options.headers as Record<string, string>,
    });
    return response.data;
  } catch (error: any) {
    const status = error.response?.status;
    const data = error.response?.data || {};

    if (status === 401 && typeof window !== 'undefined') {
      const isLoginPage = window.location.pathname === '/login';
      if (!isLoginPage) {
        ['currentUser', 'accessToken', 'refreshToken', 'token'].forEach(k => localStorage.removeItem(k));
        if (data.message) {
          showToast(data.message === 'Invalid credentials' ? 'Credenciais inválidas' : data.message, 'error');
        }
        setTimeout(() => { window.location.href = '/login'; }, 1500);
      }
      throw new Error(data.message || 'Unauthorized');
    }

    if (status === 403 && data.accountDeleted && typeof window !== 'undefined') {
      ['currentUser', 'accessToken', 'refreshToken', 'token'].forEach(k => localStorage.removeItem(k));
      showToast(data.message || 'Sua conta foi marcada para exclusão.', 'warning');
      setTimeout(() => { window.location.href = '/login'; }, 2000);
      throw new Error(data.message || 'Account deleted');
    }

    throw error;
  }
}
