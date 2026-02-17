'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function PaymentFailurePage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Pagamento Recusado</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Não foi possível processar seu pagamento. Verifique os dados do cartão e tente novamente.
          </p>
          <div className="space-y-2">
            <Button onClick={() => router.push('/pricing')} className="w-full">
              Tentar Novamente
            </Button>
            <Button onClick={() => router.push('/dashboard')} variant="outline" className="w-full">
              Voltar ao Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
