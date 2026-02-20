'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/services/machine-api';
import { Button } from '@/components/ui/button';

export default function DashboardSimplePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      window.location.href = '/login';
    } else {
      setUser(currentUser);
    }
  }, []);

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Dashboard Simplificado ✅</h1>
      <div className="bg-muted p-6 rounded-lg">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Empresa:</strong> {user.company?.name || user.name}</p>
        <Button onClick={() => window.location.href = '/dashboard'} className="mt-4">
          Ir para Dashboard Completo
        </Button>
      </div>
    </div>
  );
}
