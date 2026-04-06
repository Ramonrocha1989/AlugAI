'use client';

export function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex justify-around items-center py-2 px-4">
        <a href="/" className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-blue-600">
          <div className="mb-1">
            <img 
              src="/logo-sem-fundo.png" 
              alt="BaitaBriq" 
              className="h-6 w-6 bg-transparent mix-blend-multiply" 
            />
          </div>
          <span className="text-xs">Início</span>
        </a>
        
        <a href="/dashboard" className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-blue-600">
          <div className="text-xl mb-1">👤</div>
          <span className="text-xs">Conta</span>
        </a>
        
        <a href="/dashboard/new-machine" className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-blue-600">
          <div className="text-xl mb-1">➕</div>
          <span className="text-xs">Vender</span>
        </a>
        
        <a href="/dashboard/favorites" className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-blue-600">
          <div className="text-xl mb-1">❤️</div>
          <span className="text-xs">Favoritos</span>
        </a>
        
        <a href="/menu" className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-blue-600">
          <div className="text-xl mb-1">☰</div>
          <span className="text-xs">Menu</span>
        </a>
      </div>
    </div>
  );
}