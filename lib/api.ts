const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Sistema de toast customizado
function showToast(message: string, type: 'error' | 'success' | 'warning' = 'error') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    color: white;
    font-weight: 500;
    max-width: 400px;
    animation: slideIn 0.3s ease-out;
    background-color: ${
      type === 'error' ? '#dc2626' : type === 'success' ? '#16a34a' : '#ca8a04'
    };
  `;
  toast.textContent = message;
  
  // Adicionar animação CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
      toast.remove();
      style.remove();
    }, 300);
  }, 3000);
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  console.log('[API_REQUEST] Fazendo requisição para:', endpoint);
  console.log('[API_REQUEST] Token disponível:', !!token);
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  console.log('[API_REQUEST] Resposta recebida:', response.status, response.statusText);

  if (response.status === 401 && typeof window !== 'undefined') {
    const data = await response.json().catch(() => ({}));
    console.log('[API_REQUEST] Erro 401:', data);
    
    // Não redirecionar nem mostrar toast se estiver na página de login
    const isLoginPage = window.location.pathname === '/login';
    
    if (!isLoginPage) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('token');
      
      if (data.message) {
        const message = data.message === 'Invalid credentials' 
          ? 'Credenciais inválidas' 
          : data.message;
        showToast(message, 'error');
      }
      
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    }
    
    throw new Error(data.message || 'Unauthorized');
  }

  if (response.status === 403 && typeof window !== 'undefined') {
    const data = await response.json().catch(() => ({}));
    console.log('[API_REQUEST] Erro 403:', data);
    
    if (data.accountDeleted) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('token');
      
      showToast(data.message || 'Sua conta foi marcada para exclusão e não pode mais ser acessada.', 'warning');
      
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      
      throw new Error(data.message || 'Account deleted');
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.log('[API_REQUEST] Erro HTTP:', response.status, errorData);
    const error: any = new Error(`HTTP ${response.status}`);
    error.response = response;
    error.data = errorData;
    throw error;
  }

  const responseData = await response.json();
  console.log('[API_REQUEST] Dados da resposta:', responseData);
  return responseData;
}
