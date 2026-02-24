'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { authService } from '@/services/api';

export default function ConfirmDeletePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  const confirmDelete = useMutation({
    mutationFn: (token: string) => authService.confirmDeleteAccount(token),
    onSuccess: () => {
      setStatus('success');
      setTimeout(() => {
        router.push('/');
      }, 3000);
    },
    onError: () => {
      setStatus('error');
    },
  });

  useEffect(() => {
    if (token) {
      confirmDelete.mutate(token);
    } else {
      setStatus('error');
    }
  }, [token]);

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {status === 'loading' && 'Processando...'}
            {status === 'success' && 'Conta Excluída'}
            {status === 'error' && 'Erro'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'loading' && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-center text-muted-foreground">
                Confirmando exclusão da sua conta...
              </p>
            </div>
          )}

          {status === 'success' && (
            <>
              <div className="flex flex-col items-center gap-4">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
                <p className="text-center font-medium">
                  Sua conta foi marcada para exclusão
                </p>
              </div>
              <Alert>
                <div className="text-sm space-y-2">
                  <p>Sua conta será excluída permanentemente em 30 dias.</p>
                  <p className="font-medium">
                    Para recuperar sua conta, entre em contato com o suporte antes deste prazo.
                  </p>
                </div>
              </Alert>
              <p className="text-center text-sm text-muted-foreground">
                Redirecionando em 3 segundos...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="flex flex-col items-center gap-4">
                <XCircle className="h-12 w-12 text-destructive" />
                <p className="text-center font-medium text-destructive">
                  Não foi possível confirmar a exclusão
                </p>
              </div>
              <Alert className="bg-destructive/10 border-destructive/20">
                <p className="text-sm">
                  O link pode estar expirado ou inválido. Tente solicitar a exclusão novamente.
                </p>
              </Alert>
              <Button onClick={() => router.push('/profile')} className="w-full">
                Voltar ao Perfil
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
