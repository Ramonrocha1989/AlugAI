'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusCircle, Heart, Menu } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Início', icon: null, match: (p: string) => p === '/' },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, match: (p: string) => p === '/dashboard' || (p.startsWith('/dashboard') && !p.includes('favorites') && !p.includes('new-machine')) },
  { href: '/dashboard/new-machine', label: 'Anunciar', icon: PlusCircle, match: (p: string) => p.includes('new-machine') },
  { href: '/dashboard/favorites', label: 'Favoritos', icon: Heart, match: (p: string) => p.includes('favorites') },
  { href: '/menu', label: 'Menu', icon: Menu, match: (p: string) => p === '/menu' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <nav className="flex justify-around items-center py-1 px-2">
        {navItems.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center py-2 px-3 min-w-[56px] transition-colors ${
                active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {Icon ? (
                <Icon className={`h-5 w-5 mb-0.5 ${active ? 'stroke-[2.5]' : ''}`} />
              ) : (
                <Image src="/logo-sem-fundo.png" alt="BaitaBriq" width={20} height={20} className={`h-5 w-5 mb-0.5 object-contain ${active ? 'opacity-100' : 'opacity-60'}`} />
              )}
              <span className={`text-[10px] ${active ? 'font-semibold' : ''}`}>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}