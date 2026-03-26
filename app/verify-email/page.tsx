'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { authService } from '@/services/machine-api';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token de verificação não encontrado.');
      return;
    }

    verifyEmail(token);
  }, [token]);

  const verifyEmail = async (token: string) => {
    try {
      await authService.verifyEmail(token);
      setStatus('success');
      setMessage('Email verificado com sucesso! Redirecionando para o login...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      setStatus('error');
      setMessage('Token inválido ou expirado. Solicite um novo email de verificação.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verificação de Email</CardTitle>
          <CardDescription>
            {status === 'loading' && 'Verificando seu email...'}
            {status === 'success' && 'Email verificado!'}
            {status === 'error' && 'Erro na verificação'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {status === 'loading' && (
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <p className="text-center text-muted-foreground">{message}</p>
              <Button onClick={() => router.push('/login')} className="w-full">
                Ir para Login
              </Button>
            </>
          )}
          
          {status === 'error' && (
            <>
              <XCircle className="h-16 w-16 text-destructive" />
              <p className="text-center text-muted-foreground">{message}</p>
              <Button onClick={() => router.push('/login')} variant="outline" className="w-full">
                Voltar para Login
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex justify-center items-center py-16">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
