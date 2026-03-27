'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip } from '@/components/tooltip';
import { NotificationsDropdown } from '@/components/notifications-dropdown';
import { authService } from '@/services/machine-api';
import { useLogout } from '@/hooks/use-api';
import { useFavorites } from '@/hooks/use-favorites';
import { useReceivedProposals, useSentProposals } from '@/hooks/use-proposals';
import { LogOut, LayoutDashboard, Shield, Heart, FileText, CreditCard, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const logout = useLogout();
  const { data: favorites = [], isError: favoritesError } = useFavorites();
  const { data: receivedProposals = [], isError: receivedError } = useReceivedProposals();
  const { data: sentProposals = [], isError: sentError } = useSentProposals();
  
  // Propostas recebidas não vistas e pendentes
  const pendingReceived = !receivedError && receivedProposals ? receivedProposals.filter(p => 
    p.status === 'PENDING' && p.viewedByReceiver === false
  ).length : 0;
  
  // Propostas enviadas com resposta não vista
  const updatedSent = !sentError && sentProposals ? sentProposals.filter(p => 
    ['ACCEPTED', 'REJECTED', 'COUNTERED'].includes(p.status) && p.viewedBySender === false
  ).length : 0;
  
  const totalNotifications = pendingReceived + updatedSent;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name?: string; company?: { name: string }; role?: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser();
      setIsAuthenticated(!!currentUser);
      
      if (currentUser) {
        // Extrair user se vier aninhado
        const userData = (currentUser as any)?.user || currentUser;
        setUser(userData);
      }
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    logout.mutateAsync();
    // window.location.href = "/login";
  };

  return (
    <header className="border-b sticky top-0 bg-white z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center flex-shrink-0 py-1">
          <img src="/logo.jpeg" alt="BaitaBriq" className="h-12 md:h-16 bg-transparent mix-blend-multiply transform scale-125" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2 xl:gap-4 flex-row ml-auto">
          <Link href="/">
            <Button variant="ghost" size="sm">Máquinas</Button>
          </Link>
          
          {isAuthenticated ? (
            <>
              <NotificationsDropdown />
              
              <div className="2xl:hidden">
                <Tooltip content="Favoritos">
                  <Link href="/dashboard/favorites">
                    <Button variant="ghost" size="sm" className="relative">
                      <Heart className="h-4 w-4 2xl:mr-2" />
                      <span className="hidden 2xl:inline">Favoritos</span>
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
                </Tooltip>
              </div>
              <div className="hidden 2xl:block">
                <Link href="/dashboard/favorites">
                  <Button variant="ghost" size="sm" className="relative">
                    <Heart className="h-4 w-4 2xl:mr-2" />
                    <span className="hidden 2xl:inline">Favoritos</span>
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
              </div>
              <div className="2xl:hidden">
                <Tooltip content="Propostas">
                  <Link href="/proposals">
                    <Button variant="ghost" size="sm" className="relative">
                      <FileText className="h-4 w-4 2xl:mr-2" />
                      <span className="hidden 2xl:inline">Propostas</span>
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
                </Tooltip>
              </div>
              <div className="hidden 2xl:block">
                <Link href="/proposals">
                  <Button variant="ghost" size="sm" className="relative">
                    <FileText className="h-4 w-4 2xl:mr-2" />
                    <span className="hidden 2xl:inline">Propostas</span>
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
              </div>
              <div className="2xl:hidden">
                <Tooltip content="Ser Verificado">
                  <Link href="/verification">
                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                      <Shield className="h-4 w-4 2xl:mr-2" />
                      <span className="hidden 2xl:inline">Verificado</span>
                    </Button>
                  </Link>
                </Tooltip>
              </div>
              <div className="hidden 2xl:block">
                <Link href="/verification">
                  <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                    <Shield className="h-4 w-4 2xl:mr-2" />
                    <span className="hidden 2xl:inline">Verificado</span>
                  </Button>
                </Link>
              </div>
              <div className="2xl:hidden">
                <Tooltip content="Planos">
                  <Link href="/pricing">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      <CreditCard className="h-4 w-4 2xl:mr-2" />
                      <span className="hidden 2xl:inline">Planos</span>
                    </Button>
                  </Link>
                </Tooltip>
              </div>
              <div className="hidden 2xl:block">
                <Link href="/pricing">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    <CreditCard className="h-4 w-4 2xl:mr-2" />
                    <span className="hidden 2xl:inline">Planos</span>
                  </Button>
                </Link>
              </div>
              <div className="2xl:hidden">
                <Tooltip content="Dashboard">
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm">
                      <LayoutDashboard className="h-4 w-4 2xl:mr-2" />
                      <span className="hidden 2xl:inline">Dashboard</span>
                    </Button>
                  </Link>
                </Tooltip>
              </div>
              <div className="hidden 2xl:block">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="h-4 w-4 2xl:mr-2" />
                    <span className="hidden 2xl:inline">Dashboard</span>
                  </Button>
                </Link>
              </div>
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  Perfil
                </Button>
              </Link>
              {user?.role === 'ADMIN' && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
                    Admin
                  </Button>
                </Link>
              )}
              <div className="2xl:hidden">
                <Tooltip content="Sair">
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 2xl:mr-2" />
                    <span className="hidden 2xl:inline">Sair</span>
                  </Button>
                </Tooltip>
              </div>
              <div className="hidden 2xl:block">
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 2xl:mr-2" />
                  <span className="hidden 2xl:inline">Sair</span>
                </Button>
              </div>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">Entrar</Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-1 ml-auto">
          {isAuthenticated && <NotificationsDropdown />}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="min-h-[44px] min-w-[44px]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-background animate-in slide-in-from-top-2 duration-200 block">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start min-h-[48px]">Máquinas</Button>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link href="/dashboard/favorites" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start min-h-[48px]">
                    <Heart className="h-4 w-4 mr-2" />
                    Favoritos
                    {favorites.length > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {favorites.length}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Link href="/proposals" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start min-h-[48px]">
                    <FileText className="h-4 w-4 mr-2" />
                    Propostas
                    {totalNotifications > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {totalNotifications}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Link href="/verification" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-green-600 min-h-[48px]">
                    <Shield className="h-4 w-4 mr-2" />
                    Ser Verificado
                  </Button>
                </Link>
                <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-blue-600 min-h-[48px]">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Planos
                  </Button>
                </Link>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start min-h-[48px]">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start min-h-[48px]">
                    Perfil
                  </Button>
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-purple-600 min-h-[48px]">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button variant="outline" className="w-full justify-start min-h-[48px]" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full min-h-[48px]">Entrar</Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}