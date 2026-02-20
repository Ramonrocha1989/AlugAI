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
    setLoading(true);

    try {
      // Tentar pegar token do localStorage (prioridade)
      let token = localStorage.getItem('token');
      
      // Fallback: tentar pegar do currentUser
      if (!token) {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
          alert('Você precisa estar logado para assinar um plano');
          // window.location.href = "/login";
          return;
        }
        const parsed = JSON.parse(currentUser);
        token = parsed.token;
      }

      if (!token) {
        alert('Token de autenticação não encontrado. Faça login novamente.');
        // window.location.href = "/login";
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

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert('Erro ao criar pagamento');
      }
    } catch (error) {
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
