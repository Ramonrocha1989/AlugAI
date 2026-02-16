'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin, useRegister } from '@/hooks/use-api';
import { loginSchema, registerSchema, LoginFormData, RegisterFormData } from '@/lib/validations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const router = useRouter();
  const login = useLogin();
  const register = useRegister();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onLogin = async (data: LoginFormData) => {
    try {
      await login.mutateAsync(data);
      router.push('/dashboard');
    } catch (error) {
      alert('Erro ao fazer login');
    }
  };

  const onRegister = async (data: RegisterFormData) => {
    try {
      await register.mutateAsync(data);
      setShowVerificationMessage(true);
    } catch (error) {
      alert('Erro ao fazer cadastro');
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? 'Login' : 'Cadastro'}</CardTitle>
          <CardDescription>
            {isLogin
              ? 'Entre com suas credenciais'
              : 'Crie sua conta para começar'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showVerificationMessage ? (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800 font-medium">Cadastro realizado com sucesso!</p>
                <p className="text-sm text-green-600 mt-2">
                  Enviamos um email de verificação para você. Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.
                </p>
              </div>
              <Button onClick={() => router.push('/login')} className="w-full">
                Ir para Login
              </Button>
            </div>
          ) : isLogin ? (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...loginForm.register('email')}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  {...loginForm.register('password')}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-destructive mt-1">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Link href="/forgot-password">
                  <Button type="button" variant="link" className="px-0 text-sm">
                    Esqueci minha senha
                  </Button>
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={login.isPending}
              >
                {login.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Entrar
              </Button>

              <Button
                type="button"
                variant="link"
                className="w-full"
                onClick={() => setIsLogin(false)}
              >
                Não tem conta? Cadastre-se
              </Button>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
              <div>
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <Input
                  id="companyName"
                  {...registerForm.register('companyName')}
                />
                {registerForm.formState.errors.companyName && (
                  <p className="text-sm text-destructive mt-1">
                    {registerForm.formState.errors.companyName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Telefone (WhatsApp)</Label>
                <Input
                  id="phone"
                  placeholder="51999887766"
                  {...registerForm.register('phone')}
                />
                {registerForm.formState.errors.phone && (
                  <p className="text-sm text-destructive mt-1">
                    {registerForm.formState.errors.phone.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Formato: DDD + número (ex: 51999887766)
                </p>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...registerForm.register('email')}
                />
                {registerForm.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  {...registerForm.register('password')}
                />
                {registerForm.formState.errors.password && (
                  <p className="text-sm text-destructive mt-1">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={register.isPending}
              >
                {register.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cadastrar
              </Button>

              <Button
                type="button"
                variant="link"
                className="w-full"
                onClick={() => setIsLogin(true)}
              >
                Já tem conta? Faça login
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
