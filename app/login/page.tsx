'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin, useRegister } from '@/hooks/use-api';
import { useToast } from '@/components/toast-provider';
import { loginSchema, registerSchema, LoginFormData, RegisterFormData } from '@/lib/validations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, User, Building } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'INDIVIDUAL' | 'COMPANY' | null>(null);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const login = useLogin();
  const register = useRegister();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur', 
    reValidateMode: 'onChange',
  });

  const onLogin = async (data: LoginFormData) => {
    try {
      await login.mutateAsync(data);
      showToast('✅ Login realizado com sucesso!', 'success');
      
      // Aguardar para garantir que localStorage foi salvo
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Usar window.location para garantir redirecionamento
      window.location.href = '/dashboard';
    } catch (error: any) {
      // Não mostrar erro se for 403 (conta deletada - já tratado pelo apiRequest)
      if (error.response?.status === 403 || error.message?.includes('marcada para exclusão')) {
        return; // Toast amarelo já foi mostrado pelo lib/api.ts
      }
      
      if (error.response?.status === 429) {
        showToast('⚠️ Muitas tentativas de login! Por segurança, bloqueamos temporariamente. Tente novamente em 15 minutos.', 'warning');
      } else if (error.response?.status === 401) {
        showToast('❌ Email ou senha incorretos.', 'error');
      } else {
        showToast('Erro ao fazer login. Tente novamente.', 'error');
      }
    }
  };

  const onRegister = async (data: RegisterFormData) => {
    try {
      await register.mutateAsync(data);
      setShowVerificationMessage(true);
    } catch (error: any) {
      if (error.response?.status === 429) {
        showToast('⚠️ Muitas tentativas de cadastro! Por segurança, bloqueamos temporariamente. Tente novamente em 1 hora.', 'warning');
      } else if (error.response?.status === 409) {
        showToast('❌ Este email já está cadastrado. Faça login ou use outro email.', 'error');
      } else {
        showToast('Erro ao fazer cadastro. Tente novamente.', 'error');
      }
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
              <Button onClick={() => {
                setShowVerificationMessage(false);
                setIsLogin(true);
              }} className="w-full">
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
                  className={loginForm.formState.errors.email ? 'border-destructive' : ''}
                />
                {loginForm.formState.errors.email && (
                  <div className="flex items-center gap-1 mt-1">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <p className="text-sm text-destructive">
                      {loginForm.formState.errors.email.message}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <PasswordInput
                  id="password"
                  {...loginForm.register('password')}
                  className={loginForm.formState.errors.password ? 'border-destructive' : ''}
                />
                {loginForm.formState.errors.password && (
                  <div className="flex items-center gap-1 mt-1">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <p className="text-sm text-destructive">
                      {loginForm.formState.errors.password.message}
                    </p>
                  </div>
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
          ) : !userType ? (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium mb-2">Como você quer se cadastrar?</h3>
                <p className="text-sm text-muted-foreground">Escolha o tipo de conta</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2 hover:bg-primary/5"
                  onClick={() => {
                    setUserType('INDIVIDUAL');
                    registerForm.setValue('userType', 'INDIVIDUAL');
                  }}
                >
                  <User className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Pessoa Física</div>
                    <div className="text-xs text-muted-foreground">Para uso pessoal</div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2 hover:bg-primary/5"
                  onClick={() => {
                    setUserType('COMPANY');
                    registerForm.setValue('userType', 'COMPANY');
                  }}
                >
                  <Building className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Empresa</div>
                    <div className="text-xs text-muted-foreground">Para negócios</div>
                  </div>
                </Button>
              </div>
              
              <Button
                type="button"
                variant="link"
                className="w-full"
                onClick={() => setIsLogin(true)}
              >
                Já tem conta? Faça login
              </Button>
            </div>
          ) : (
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {userType === 'INDIVIDUAL' ? <User className="h-5 w-5" /> : <Building className="h-5 w-5" />}
                  <span className="font-medium">
                    {userType === 'INDIVIDUAL' ? 'Pessoa Física' : 'Empresa'}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setUserType(null);
                    registerForm.reset();
                  }}
                >
                  Alterar
                </Button>
              </div>

              {userType === 'INDIVIDUAL' ? (
                <>
                  <div>
                    <Label htmlFor="fullName">Nome Completo</Label>
                    <Input
                      id="fullName"
                      {...registerForm.register('fullName')}
                      className={(registerForm.formState.errors as any).fullName ? 'border-destructive' : ''}
                    />
                    {(registerForm.formState.errors as any).fullName && (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <p className="text-sm text-destructive">
                          {(registerForm.formState.errors as any).fullName.message}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cpf">CPF (opcional)</Label>
                    <Input
                      id="cpf"
                      placeholder="12345678901"
                      maxLength={11}
                      {...registerForm.register('cpf', {
                        onChange: (e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          registerForm.setValue('cpf', value);
                          registerForm.trigger('cpf');
                        }
                      })}
                      className={(registerForm.formState.errors as any).cpf ? 'border-destructive' : ''}
                    />
                    {(registerForm.formState.errors as any).cpf && (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <p className="text-sm text-destructive">
                          {(registerForm.formState.errors as any).cpf.message}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Apenas números (ex: 12345678901)
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="companyName">Nome da Empresa</Label>
                    <Input
                      id="companyName"
                      {...registerForm.register('companyName')}
                      className={(registerForm.formState.errors as any).companyName ? 'border-destructive' : ''}
                    />
                    {(registerForm.formState.errors as any).companyName && (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <p className="text-sm text-destructive">
                          {(registerForm.formState.errors as any).companyName.message}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cnpj">CNPJ (opcional)</Label>
                    <Input
                      id="cnpj"
                      placeholder="12345678000199"
                      maxLength={14}
                      {...registerForm.register('cnpj', {
                        onChange: (e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          registerForm.setValue('cnpj', value);
                          registerForm.trigger('cnpj');
                        }
                      })}
                      className={(registerForm.formState.errors as any).cnpj ? 'border-destructive' : ''}
                    />
                    {(registerForm.formState.errors as any).cnpj && (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <p className="text-sm text-destructive">
                          {(registerForm.formState.errors as any).cnpj.message}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Apenas números (ex: 12345678000199)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="responsibleName">Nome do Responsável</Label>
                    <Input
                      id="responsibleName"
                      {...registerForm.register('responsibleName')}
                      className={(registerForm.formState.errors as any).responsibleName ? 'border-destructive' : ''}
                    />
                    {(registerForm.formState.errors as any).responsibleName && (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <p className="text-sm text-destructive">
                          {(registerForm.formState.errors as any).responsibleName.message}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="phone">Telefone (WhatsApp)</Label>
                <Input
                  id="phone"
                  placeholder="51999887766"
                  maxLength={11}
                  {...registerForm.register('phone', {
                    onChange: (e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      registerForm.setValue('phone', value);
                      registerForm.trigger('phone');
                    }
                  })}
                  className={registerForm.formState.errors.phone ? 'border-destructive' : ''}
                />
                {registerForm.formState.errors.phone && (
                  <div className="flex items-center gap-1 mt-1">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <p className="text-sm text-destructive">
                      {registerForm.formState.errors.phone.message}
                    </p>
                  </div>
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
                  className={registerForm.formState.errors.email ? 'border-destructive' : ''}
                />
                {registerForm.formState.errors.email && (
                  <div className="flex items-center gap-1 mt-1">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <p className="text-sm text-destructive">
                      {registerForm.formState.errors.email.message}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <PasswordInput
                  id="password"
                  {...registerForm.register('password')}
                  className={registerForm.formState.errors.password ? 'border-destructive' : ''}
                />
                {registerForm.formState.errors.password && (
                  <div className="flex items-center gap-1 mt-1">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <p className="text-sm text-destructive">
                      {registerForm.formState.errors.password.message}
                    </p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Mínimo 8 caracteres, com maiúscula, minúscula e número
                </p>
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
                onClick={() => {
                  setIsLogin(true);
                  setUserType(null);
                }}
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
