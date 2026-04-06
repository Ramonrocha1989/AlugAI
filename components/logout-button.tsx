'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Limpar dados do localStorage
    localStorage.removeItem('currentUser');
    
    // Disparar evento para atualizar outros componentes
    window.dispatchEvent(new Event('storage'));
    
    // Redirecionar para login
    router.push('/login');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <button 
        onClick={handleLogout}
        className="flex items-center w-full p-4 hover:bg-red-50 transition-colors text-red-600"
      >
        <div className="bg-red-100 p-2 rounded-lg mr-4">
          <LogOut className="w-5 h-5 text-red-600" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-medium">Sair da Conta</h3>
          <p className="text-sm text-red-500">Fazer logout do BaitaBriq</p>
        </div>
      </button>
    </div>
  );
}