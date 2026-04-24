'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip } from '@/components/tooltip';
import { NotificationsDropdown } from '@/components/notifications-dropdown';
import { authService } from '@/services/machine-api';
import { getPlanConfig } from '@/services/machine-api';
import { useLogout } from '@/hooks/use-api';
import { useUser } from '@/hooks/use-user';
import { PlanId } from '@/types';
import { useFavorites } from '@/hooks/use-favorites';
import { useReceivedProposals, useSentProposals } from '@/hooks/use-proposals';
import { LogOut, LayoutDashboard, Shield, Heart, FileText, CreditCard, Menu, X, ChevronDown, Tractor, Wheat, MapPin, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMounted } from '@/hooks/use-mounted';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const logout = useLogout();
  const { data: user, isLoading: userLoading } = useUser();
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
  const mounted = useMounted();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser();
      setIsAuthenticated(!!currentUser);
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

  const categories = [
    {
      title: 'Tratores Usados',
      description: 'John Deere, Case IH, New Holland',
      icon: Tractor,
      href: '/categoria/tratores',
      iconColor: 'text-green-600'
    },
    {
      title: 'Colheitadeiras',
      description: 'Para soja, milho, arroz e trigo',
      icon: Wheat,
      href: '/categoria/colheitadeiras',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'Máquinas no RS',
      description: 'Pelotas, Porto Alegre, Santa Maria',
      icon: MapPin,
      href: '/maquinas/rs',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Blog & Dicas',
      description: 'Guias para comprar máquinas',
      icon: BookOpen,
      href: '/blog',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <header className="border-b fixed top-0 left-0 right-0 bg-white z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center flex-shrink-0 py-1">
          <img src="/logo-sem-fundo.png" alt="BaitaBriq" className="h-12 md:h-16 bg-transparent mix-blend-multiply transform scale-125" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2 xl:gap-4 flex-row ml-auto">
          <Link href="/">
            <Button variant="ghost" size="sm">Início</Button>
          </Link>
          
          {/* Dropdown de Categorias */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
              className="flex items-center gap-1"
            >
              Categorias
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            {categoriesDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-80 bg-white border rounded-lg shadow-lg z-50">
                <div className="p-2">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <Link 
                        key={category.href} 
                        href={category.href}
                        onClick={() => setCategoriesDropdownOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-gray-50">
                          <IconComponent className={`h-5 w-5 ${category.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{category.title}</div>
                          <div className="text-xs text-muted-foreground">{category.description}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          
          {user && !userLoading ? (
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
              <div className="flex items-center gap-2">
                {user && (() => {
                  const planConfig = getPlanConfig(user.plan as PlanId);
                  const badgeVariant: Record<string, any> = {
                    free: 'secondary',
                    basico: 'basico',
                    profissional: 'profissional',
                    premium: 'planPremium',
                  };
                  const planIcon: Record<string, string> = {
                    free: '📦',
                    basico: '⚡',
                    profissional: '⭐',
                    premium: '👑',
                  };
                  return (
                    <Badge variant={badgeVariant[user.plan] || 'secondary'} className="flex items-center gap-1">
                      {planIcon[user.plan]} {planConfig.name}
                    </Badge>
                  );
                })()}
                <Link href="/profile">
                  <Button variant="ghost" size="sm">
                    Perfil
                  </Button>
                </Link>
              </div>
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
          {user && <NotificationsDropdown />}
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
              <Button variant="ghost" className="w-full justify-start min-h-[48px]">Início</Button>
            </Link>
            
            {/* Categorias no Mobile */}
            <div className="border-t pt-2 mt-2">
              <div className="text-sm font-medium text-muted-foreground mb-2 px-3">Categorias</div>
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Link 
                    key={category.href} 
                    href={category.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" className="w-full justify-start min-h-[48px]">
                      <IconComponent className={`h-4 w-4 mr-2 ${category.iconColor}`} />
                      {category.title}
                    </Button>
                  </Link>
                );
              })}
            </div>
            
            {user ? (
              <>
                <div className="border-t pt-2 mt-2">
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
                      {user && (() => {
                        const planConfig = getPlanConfig(user.plan as PlanId);
                        const badgeVariant: Record<string, any> = {
                          free: 'secondary',
                          basico: 'basico',
                          profissional: 'profissional',
                          premium: 'planPremium',
                        };
                        const planIcon: Record<string, string> = {
                          free: '📦',
                          basico: '⚡',
                          profissional: '⭐',
                          premium: '👑',
                        };
                        return (
                          <Badge variant={badgeVariant[user.plan] || 'secondary'} className="ml-2">
                            {planIcon[user.plan]} {planConfig.name}
                          </Badge>
                        );
                      })()}
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
                </div>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full min-h-[48px]">Entrar</Button>
              </Link>
            )}
          </nav>
        </div>
      )}

      {/* Overlay para fechar dropdown */}
      {categoriesDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setCategoriesDropdownOpen(false)}
        />
      )}
    </header>
  );
}