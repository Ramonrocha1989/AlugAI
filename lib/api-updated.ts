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

  if (!response.ok) {
    const error: any = new Error(`HTTP ${response.status}`);
    error.response = response;
    throw error;
  }

  return response.json();
}
