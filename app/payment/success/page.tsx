'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { analytics } from '@/lib/analytics';

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const paymentId = searchParams.get('payment_id') || '';
    const status = searchParams.get('status');
    const externalRef = searchParams.get('external_reference') || '';

    if (status === 'approved' && paymentId) {
      const [, planName, priceStr] = externalRef.split('|');
      analytics.trackPurchase(paymentId, planName || 'plano', parseFloat(priceStr) || 0);
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[80vh]">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Pagamento Aprovado!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Seu plano foi ativado com sucesso. Agora você tem acesso a todos os benefícios!
          </p>
          <Button onClick={() => router.push('/dashboard')} className="w-full">
            Ir para Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
