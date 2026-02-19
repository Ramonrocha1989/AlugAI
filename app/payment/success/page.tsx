'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/components/toast-provider';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!hasShownToast.current) {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      showToast('Pagamento aprovado! Plano Lojista ativado 🎉', 'success');
      hasShownToast.current = true;
    }
  }, [queryClient, showToast]);

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Pagamento Aprovado!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Seu plano foi ativado com sucesso! Agora você tem acesso a todos os recursos premium.
          </p>
          {paymentId && (
            <p className="text-sm text-muted-foreground">
              ID do pagamento: {paymentId}
            </p>
          )}
          <Button onClick={() => router.push('/dashboard')} className="w-full">
            Ir para Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
