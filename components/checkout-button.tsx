'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { analytics } from '@/lib/analytics';
import { httpClient, validateEndpoint } from '@/lib/http-client';
import { PlanId } from '@/types';

interface CheckoutButtonProps {
  planName: string;
  planPrice: number;
  planDescription: string;
  planType: PlanId;
}

export function CheckoutButton({ planName, planPrice, planDescription, planType }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    analytics.trackAddToCart(planName, planPrice, planType);

    try {
      const { data } = await httpClient.post(validateEndpoint('/api/create-preference'), {
        planName,
        planPrice,
        planDescription,
        planType,
      });

      if (data.init_point) {
        const url = new URL(data.init_point);
        if (url.protocol !== 'https:') throw new Error('URL de pagamento inválida');
        analytics.trackBeginCheckout(planName, planPrice, planType);
        window.location.href = url.toString();
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
