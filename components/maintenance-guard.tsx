'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { usePathname } from 'next/navigation';
import { Wrench } from 'lucide-react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
});

async function fetchPublicSettings() {
  const { data } = await api.get('/settings/public');
  return data;
}

function isAdmin(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const stored = localStorage.getItem('currentUser');
    if (!stored) return false;
    const user = JSON.parse(stored);
    const parsed = user.user || user;
    return parsed.role === 'ADMIN';
  } catch {
    return false;
  }
}

export function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const { data } = useQuery({
    queryKey: ['public-settings'],
    queryFn: fetchPublicSettings,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  // Permitir acesso ao login e admin mesmo em manutenção
  const allowedPaths = ['/login', '/admin'];
  const isAllowedPath = allowedPaths.some(p => pathname?.startsWith(p));

  if (data?.maintenanceMode && !isAdmin() && !isAllowedPath) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Wrench className="h-10 w-10 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Em manutenção</h1>
          <p className="text-muted-foreground text-lg mb-6">
            {data.maintenanceMessage || 'Estamos em manutenção, voltamos em breve!'}
          </p>
          <div className="text-sm text-muted-foreground">
            {data.emailSupport && <p>📧 {data.emailSupport}</p>}
            {data.phoneSupport && <p>📞 {data.phoneSupport}</p>}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
