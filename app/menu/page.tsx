import { Metadata } from 'next';
import Link from 'next/link';
import { LogoutButton } from '@/components/logout-button';
import { 
  User, 
  Settings, 
  FileText, 
  DollarSign, 
  HelpCircle, 
  Shield,
  Bell,
  Star,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Menu - BaitaBriq',
  description: 'Acesse todas as funcionalidades do BaitaBriq',
};

const menuItems = [
  {
    title: 'Conta',
    items: [
      { name: 'Meu Perfil', href: '/profile', icon: User, description: 'Visualizar e editar perfil' },
      { name: 'Notificações', href: '/dashboard/notifications', icon: Bell, description: 'Gerenciar notificações' },
    ]
  },
  {
    title: 'Negócios',
    items: [
      { name: 'Propostas', href: '/proposals', icon: MessageSquare, description: 'Propostas recebidas e enviadas' },
      { name: 'Avaliações', href: '/dashboard/reviews', icon: Star, description: 'Suas avaliações' },
      { name: 'Planos', href: '/pricing', icon: DollarSign, description: 'Planos e assinaturas' },
    ]
  },
  {
    title: 'Informações',
    items: [
      { name: 'Blog', href: '/blog', icon: FileText, description: 'Artigos e novidades' },
      { name: 'Como Funciona', href: '/como-funciona', icon: HelpCircle, description: 'Guia de uso da plataforma' },
      { name: 'Política de Privacidade', href: '/politica-privacidade', icon: Shield, description: 'Termos e privacidade' },
    ]
  }
];

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Mobile */}
      <div className="bg-white shadow-sm p-4 md:hidden">
        <div className="flex items-center">
          <Link href="/" className="mr-4">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Menu</h1>
        </div>
      </div>

      {/* Header Desktop */}
      <div className="hidden md:block bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Menu</h1>
          <p className="text-gray-600 mt-2">Acesse todas as funcionalidades</p>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-8">
          {menuItems.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {section.items.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center p-4 hover:bg-gray-50 transition-colors ${
                        index !== section.items.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      <div className="bg-blue-100 p-2 rounded-lg mr-4">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <div className="text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Logout Button */}
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}