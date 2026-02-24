'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

export default function PaymentPending() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[80vh]">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Clock className="h-16 w-16 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl">Pagamento Pendente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Seu pagamento está sendo processado. Você receberá uma notificação quando for aprovado.
          </p>
          <Button onClick={() => router.push('/dashboard')} className="w-full">
            Ir para Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
