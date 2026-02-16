'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NotificationsDropdown } from '@/components/notifications-dropdown';
import { authService } from '@/services/api';
import { useLogout } from '@/hooks/use-api';
import { useFavorites } from '@/hooks/use-favorites';
import { useReceivedProposals, useSentProposals } from '@/hooks/use-proposals';
import { LogOut, LayoutDashboard, Shield, Heart, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const logout = useLogout();
  const { data: favorites = [] } = useFavorites();
  const { data: receivedProposals = [] } = useReceivedProposals();
  const { data: sentProposals = [] } = useSentProposals();
  
  // Propostas recebidas não vistas e pendentes
  const pendingReceived = receivedProposals.filter(p => 
    p.status === 'PENDING' && p.viewedByReceiver === false
  ).length;
  
  // Propostas enviadas com resposta não vista
  const updatedSent = sentProposals.filter(p => 
    ['ACCEPTED', 'REJECTED', 'COUNTERED'].includes(p.status) && p.viewedBySender === false
  ).length;
  
  const totalNotifications = pendingReceived + updatedSent;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ companyName: string } | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser();
      setIsAuthenticated(!!currentUser);
      setUser(currentUser);
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    logout.mutateAsync();
    window.location.href = '/login';
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <img src="/logo.svg" alt="Mercado Máquina" className="h-12" />
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost">Máquinas</Button>
          </Link>
          
          {isAuthenticated ? (
            <>
              <NotificationsDropdown />
              
              <Link href="/dashboard/favorites">
                <Button variant="ghost" className="relative">
                  <Heart className="h-4 w-4 mr-2" />
                  Favoritos
                  {favorites.length > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {favorites.length}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Link href="/proposals">
                <Button variant="ghost" className="relative">
                  <FileText className="h-4 w-4 mr-2" />
                  Propostas
                  {totalNotifications > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {totalNotifications}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Link href="/verification">
                <Button variant="ghost" className="text-green-600 hover:text-green-700">
                  <Shield className="h-4 w-4 mr-2" />
                  Ser Verificado
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost">
                  Perfil
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button>Entrar</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
