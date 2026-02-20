const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Enviar cookies automaticamente
  });

  // Se 401 (não autenticado), redirecionar para login
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    const error: any = new Error('Não autenticado');
    error.response = response;
    throw error;
  }

  if (!response.ok) {
    const error: any = new Error(`HTTP ${response.status}`);
    error.response = response;
    throw error;
  }

  return response.json();
}
