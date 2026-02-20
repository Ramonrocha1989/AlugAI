const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
let csrfToken: string | null = null;
let csrfPromise: Promise<string> | null = null;

async function getCsrfToken(): Promise<string> {
  // Reusar promise se já estiver buscando
  if (csrfPromise) return csrfPromise;
  
  // Retornar token em cache se existir
  if (csrfToken) return csrfToken;
  
  csrfPromise = fetch(`${API_URL}/auth/csrf-token`, { 
    credentials: 'include' 
  })
    .then(res => {
      if (!res.ok) throw new Error('Falha ao obter CSRF token');
      return res.json();
    })
    .then(data => {
      csrfToken = data.csrfToken;
      csrfPromise = null;
      return csrfToken!;
    })
    .catch(err => {
      csrfPromise = null;
      throw err;
    });
  
  return csrfPromise;
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const method = options.method?.toUpperCase() || 'GET';
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Adicionar CSRF token para métodos que modificam dados
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    try {
      const token = await getCsrfToken();
      (headers as Record<string, string>)['X-CSRF-Token'] = token;
    } catch (error) {
      console.error('Erro ao obter CSRF token:', error);
      // Tentar sem token (vai falhar mas com erro mais claro)
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Enviar cookies automaticamente
  });

  // Se 401 (não autenticado), redirecionar para login
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      clearCsrfToken();
      window.location.href = '/login';
    }
    const error: any = new Error('Não autenticado');
    error.response = response;
    throw error;
  }

  // Se erro 403 (CSRF inválido), renovar token e tentar novamente
  if (response.status === 403 && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    csrfToken = null; // Limpar token inválido
    const newToken = await getCsrfToken();
    (headers as Record<string, string>)['X-CSRF-Token'] = newToken;
    
    // Retry com novo token
    const retryResponse = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });
    
    if (!retryResponse.ok) {
      const error: any = new Error(`HTTP ${retryResponse.status}`);
      error.response = retryResponse;
      throw error;
    }
    
    return retryResponse.json();
  }

  if (!response.ok) {
    const error: any = new Error(`HTTP ${response.status}`);
    error.response = response;
    throw error;
  }

  return response.json();
}

export function clearCsrfToken() {
  csrfToken = null;
  csrfPromise = null;
}
