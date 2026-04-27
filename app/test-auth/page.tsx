'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/services/machine-api';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TestAuthPage() {
  const [user, setUser] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addLog('Página carregada');
    checkAuth();
  }, []);

  const checkAuth = () => {
    addLog('Verificando autenticação...');
    const currentUser = authService.getCurrentUser();
    addLog(`Usuário: ${JSON.stringify(currentUser)}`);
    setUser(currentUser);
  };

  const doLogin = async () => {
    try {
      addLog('Iniciando login...');
      const result = await authService.login({
        email: 'test@test.com',
        password: '123456'
      });
      addLog(`Login OK: ${JSON.stringify(result)}`);
      checkAuth();
    } catch (error: any) {
      addLog(`Erro: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">🔍 Teste Auth</h1>
      
      <div className="space-y-4 mb-6">
        <p><strong>Autenticado:</strong> {user ? '✅ Sim' : '❌ Não'}</p>
        {user && <p><strong>Email:</strong> {user.email}</p>}
      </div>

      <div className="space-y-3 mb-6">
        <Button onClick={doLogin} className="w-full">Fazer Login</Button>
        <Button onClick={checkAuth} variant="secondary" className="w-full">Verificar</Button>
        <Link href="/dashboard"><Button className="w-full">Dashboard</Button></Link>
      </div>

      <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-64 overflow-y-auto">
        {logs.map((log, i) => <div key={i}>{log}</div>)}
      </div>
    </div>
  );
}
