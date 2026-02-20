'use client';

import { useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export function CsrfInitializer() {
  useEffect(() => {
    // Pré-carregar CSRF token ao iniciar a aplicação
    fetch(`${API_URL}/auth/csrf-token`, { 
      credentials: 'include' 
    }).catch(() => {
      // Ignorar erro silenciosamente - será obtido quando necessário
    });
  }, []);

  return null;
}
