'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

export default function PaymentPendingPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <Clock className="h-10 w-10 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl">Pagamento Pendente</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Seu pagamento está sendo processado. Você receberá uma confirmação em breve.
          </p>
          <Button onClick={() => router.push('/dashboard')} className="w-full">
            Voltar ao Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
