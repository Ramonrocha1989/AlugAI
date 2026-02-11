'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForgotPassword } from '@/hooks/use-api';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/lib/validations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const forgotPassword = useForgotPassword();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword.mutateAsync(data.email);
      setSuccess(true);
    } catch (error) {
      alert('Erro ao solicitar recuperação de senha');
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Email Enviado!</CardTitle>
            <CardDescription>
              Verifique sua caixa de entrada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enviamos um link de recuperação para seu email. Clique no link para redefinir sua senha.
            </p>
            <Button onClick={() => router.push('/login')} className="w-full">
              Voltar para Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Esqueci minha senha</CardTitle>
          <CardDescription>
            Digite seu email para receber o link de recuperação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={forgotPassword.isPending}
            >
              {forgotPassword.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar Link de Recuperação
            </Button>

            <Link href="/login">
              <Button type="button" variant="ghost" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Login
              </Button>
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
