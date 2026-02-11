'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResetPassword } from '@/hooks/use-api';
import { resetPasswordSchema, ResetPasswordFormData } from '@/lib/validations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const [token, setToken] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetPassword = useResetPassword();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      form.setValue('token', tokenParam);
    }
  }, [searchParams, form]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPassword.mutateAsync({ token: data.token, password: data.password });
      alert('Senha alterada com sucesso!');
      router.push('/login');
    } catch (error) {
      alert('Erro ao redefinir senha. Token pode estar expirado.');
    }
  };

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Link Inválido</CardTitle>
            <CardDescription>Token de recuperação não encontrado</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/forgot-password')} className="w-full">
              Solicitar Novo Link
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
          <CardTitle>Redefinir Senha</CardTitle>
          <CardDescription>Digite sua nova senha</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...form.register('token')} />
            
            <div>
              <Label htmlFor="password">Nova Senha</Label>
              <Input
                id="password"
                type="password"
                {...form.register('password')}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...form.register('confirmPassword')}
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={resetPassword.isPending}
            >
              {resetPassword.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Redefinir Senha
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
