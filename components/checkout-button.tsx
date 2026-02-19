'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Check, CreditCard } from 'lucide-react';

interface CheckoutButtonProps {
  planName: string;
  planPrice: number;
  planDescription: string;
  planType: 'lojista';
}

export function CheckoutButton({ planName, planPrice, planDescription, planType }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    console.log('🔍 Dados enviados:', { planName, planPrice, planDescription, planType });
    setLoading(true);

    try {
      // Pegar token do usuário logado
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        alert('Você precisa estar logado para assinar um plano');
        window.location.href = '/login';
        return;
      }

      const { token } = JSON.parse(currentUser);
      if (!token) {
        alert('Token de autenticação não encontrado. Faça login novamente.');
        window.location.href = '/login';
        return;
      }

      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          planName,
          planPrice,
          planDescription,
          planType,
        }),
      });

      const data = await response.json();
      console.log('📦 Resposta da API:', data);

      if (data.init_point) {
        console.log('✅ Redirecionando para:', data.init_point);
        window.location.href = data.init_point;
      } else {
        console.error('❌ Erro: init_point não encontrado', data);
        alert('Erro ao criar pagamento');
      }
    } catch (error) {
      console.error('❌ Erro ao processar:', error);
      alert('Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleCheckout} disabled={loading} size="lg" className="w-full">
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processando...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Assinar Agora
        </>
      )}
    </Button>
  );
}
