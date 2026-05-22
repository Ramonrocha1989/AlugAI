'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, Trash2, User, Shield, Pencil, X, Check, ChevronRight, Mail, Phone, Building2, BadgeCheck, AlertTriangle } from 'lucide-react';
import { authService, getPlanConfig } from '@/services/machine-api';
import { PlanId } from '@/types';
import { apiRequest } from '@/lib/api';
import dynamic from 'next/dynamic';
import { useToast } from '@/components/toast-provider';
import { getApiErrorMessage } from '@/lib/error-handler';
const DeleteAccountModal = dynamic(() => import('@/components/delete-account-modal').then(m => ({ default: m.DeleteAccountModal })), { ssr: false });
import Link from 'next/link';

const profileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
  phone: z.string().regex(/^\d{10,11}$/, 'Telefone inválido. Use formato: 51999887766').optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileClient() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDangerZone, setShowDangerZone] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => authService.getMe(),
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('currentUser'),
  });

  const updateProfile = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      return apiRequest('/auth/profile', { method: 'PUT', body: JSON.stringify(data) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      setIsEditing(false);
      showToast('Perfil atualizado com sucesso!', 'success');
    },
    onError: (error: unknown) => {
      showToast(getApiErrorMessage(error, 'Erro ao atualizar perfil. Tente novamente.'), 'error');
    },
  });

  const { register, handleSubmit, formState: { errors, isDirty, dirtyFields }, reset } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return <div className="container mx-auto px-4 py-8">Erro ao carregar perfil</div>;
  }

  const onSubmit = (data: ProfileFormData) => updateProfile.mutate(data);

  const startEditing = () => {
    reset({
      name: profile.name || '',
      phone: (profile as any).phone?.replace(/^55/, '') || '',
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (isDirty) {
      setShowDiscardConfirm(true);
    } else {
      setIsEditing(false);
      reset();
    }
  };

  const confirmDiscard = () => {
    setShowDiscardConfirm(false);
    setIsEditing(false);
    reset();
  };

  const initials = (profile.name || profile.email)
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const planConfig = profile.plan !== 'free' ? getPlanConfig(profile.plan as PlanId) : null;

  const formatPhone = (phone: string) => {
    const clean = phone.replace(/^55/, '');
    if (clean.length === 11) return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    if (clean.length === 10) return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    return clean;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header do perfil */}
      <div className="flex items-center gap-5 mb-8">
        <div className="h-18 w-18 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-2xl font-bold text-primary shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold truncate">{profile.name}</h1>
          <p className="text-muted-foreground text-sm">{profile.email}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {profile.emailVerified && (
              <Badge variant="verified" className="text-xs">
                <BadgeCheck className="h-3 w-3 mr-1" /> Verificado
              </Badge>
            )}
            {planConfig && (
              <Badge variant={
                profile.plan === 'premium' ? 'planPremium' :
                profile.plan === 'profissional' ? 'profissional' : 'basico'
              }>
                {planConfig.name}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {planConfig && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Meu Plano</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Anúncios</span>
                  <span className="font-semibold">{profile.usage?.activeAds || 0}/{profile.maxAds}</span>
                </div>
                {planConfig.maxPremiumAds > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Premium</span>
                    <span className="font-semibold text-yellow-600">{profile.usage?.premiumAds || 0}/{profile.maxPremiumAds}</span>
                  </div>
                )}
                {planConfig.maxFeaturedAds > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Destaques</span>
                    <span className="font-semibold text-blue-600">{profile.usage?.featuredAds || 0}/{profile.maxFeaturedAds}</span>
                  </div>
                )}
                <Separator />
                <Link href="/pricing" className="flex items-center justify-between text-sm text-primary hover:underline">
                  Gerenciar plano <ChevronRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          )}

          {!(profile as any).phone && (
            <Card className="border-yellow-200 bg-yellow-50/50">
              <CardContent className="pt-5 pb-5">
                <p className="text-yellow-800 font-medium text-sm">⚠️ Telefone não cadastrado</p>
                <p className="text-xs text-yellow-700 mt-1">Necessário para contato via WhatsApp.</p>
                <Button size="sm" variant="outline" className="mt-3 w-full" onClick={startEditing}>
                  <Phone className="h-3.5 w-3.5 mr-2" /> Adicionar telefone
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="pt-5 pb-5">
              <nav className="space-y-1">
                <Link href="/profile/store" className="flex items-center justify-between py-2 px-3 rounded-md text-sm hover:bg-muted transition-colors">
                  Perfil da loja <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
                <Link href="/dashboard" className="flex items-center justify-between py-2 px-3 rounded-md text-sm hover:bg-muted transition-colors">
                  Meus anúncios <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
                <Link href="/dashboard/favorites" className="flex items-center justify-between py-2 px-3 rounded-md text-sm hover:bg-muted transition-colors">
                  Favoritos <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-lg">Dados pessoais</CardTitle>
                <CardDescription>
                  {isEditing ? 'Altere os campos desejados e salve' : 'Gerencie suas informações'}
                </CardDescription>
              </div>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={startEditing}>
                  <Pencil className="h-4 w-4 mr-2" /> Editar
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 mr-2" /> Cancelar
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <>
                  {showDiscardConfirm && (
                    <div className="flex items-start gap-3 p-3 mb-4 rounded-lg bg-yellow-50 border border-yellow-200">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-800">Descartar alterações?</p>
                        <p className="text-xs text-yellow-700 mt-0.5">As mudanças não salvas serão perdidas.</p>
                        <div className="flex gap-2 mt-2">
                          <Button type="button" size="sm" variant="destructive" className="h-7 text-xs" onClick={confirmDiscard}>
                            Descartar
                          </Button>
                          <Button type="button" size="sm" variant="outline" className="h-7 text-xs" onClick={() => setShowDiscardConfirm(false)}>
                            Continuar editando
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">
                          Nome
                          {dirtyFields.name && <span className="ml-1.5 text-xs text-primary">• alterado</span>}
                        </Label>
                        <Input
                          id="name"
                          className={dirtyFields.name ? 'border-primary/50 bg-primary/5' : ''}
                          {...register('name')}
                        />
                        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="phone">
                          Telefone (WhatsApp)
                          {dirtyFields.phone && <span className="ml-1.5 text-xs text-primary">• alterado</span>}
                        </Label>
                        <Input
                          id="phone"
                          placeholder="51999887766"
                          className={dirtyFields.phone ? 'border-primary/50 bg-primary/5' : ''}
                          {...register('phone')}
                        />
                        {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
                        <p className="text-xs text-muted-foreground mt-1">DDD + número</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {isDirty ? '⬤ Alterações não salvas' : 'Nenhuma alteração'}
                      </p>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={handleCancelEdit}>
                          Cancelar
                        </Button>
                        <Button type="submit" size="sm" disabled={!isDirty || updateProfile.isPending}>
                          {updateProfile.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="mr-2 h-4 w-4" />
                          )}
                          Salvar
                        </Button>
                      </div>
                    </div>
                  </form>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Nome</p>
                        <p className="text-sm font-medium">{profile.name || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm font-medium break-all">{profile.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Telefone</p>
                        <p className="text-sm font-medium">
                          {(profile as any).phone ? formatPhone((profile as any).phone) : '—'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Empresa</p>
                        <p className="text-sm font-medium">{profile.company?.name || '—'}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Status da conta</p>
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${profile.emailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {profile.emailVerified ? '✓ Email verificado' : '⏳ Verificação pendente'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Zona de perigo */}
          <div className="pt-4">
            <button
              onClick={() => setShowDangerZone(!showDangerZone)}
              className="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {showDangerZone ? 'Ocultar opções de exclusão' : 'Excluir minha conta'}
            </button>

            {showDangerZone && (
              <Card className="border-destructive/30 mt-3">
                <CardContent className="pt-5 pb-5">
                  <p className="text-sm text-muted-foreground mb-4">
                    Ao excluir sua conta, todos os seus dados serão permanentemente removidos após 30 dias. Esta ação não pode ser desfeita.
                  </p>
                  <Button variant="destructive" size="sm" onClick={() => setShowDeleteModal(true)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Excluir Minha Conta
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <DeleteAccountModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} />
    </div>
  );
}
