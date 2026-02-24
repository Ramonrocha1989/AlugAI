'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Trash2 } from 'lucide-react';
import { authService } from '@/services/machine-api';
import { apiRequest } from '@/lib/api';
import { DeleteAccountModal } from '@/components/delete-account-modal';

const profileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
  phone: z.string().regex(/^\d{10,11}$/, 'Telefone inválido. Use formato: 51999887766').optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileClient() {
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      // Buscar do localStorage (dados básicos)
      const user = authService.getCurrentUser();
      if (!user) throw new Error('Não autenticado');
      return user;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const updated = await apiRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      alert('Perfil atualizado com sucesso!');
    },
    onError: () => {
      alert('Erro ao atualizar perfil');
    },
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormData>({
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

  const onSubmit = (data: ProfileFormData) => {
    updateProfile.mutate(data);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>

      {!(profile as any).phone && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 font-medium">⚠️ Adicione seu telefone</p>
          <p className="text-sm text-yellow-700 mt-1">
            Seu telefone é necessário para que outros usuários possam entrar em contato via WhatsApp nas negociações.
          </p>
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input value={profile.email} disabled />
          </div>
          <div>
            <Label>Empresa</Label>
            <Input value={profile.company.name} disabled />
          </div>
          <div>
            <Label>Status</Label>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-sm ${profile.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {profile.emailVerified ? '✓ Email Verificado' : '⏳ Email Pendente'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Editar Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                defaultValue={profile.name || ''}
                placeholder="Seu nome"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Telefone (WhatsApp)</Label>
              <Input
                id="phone"
                defaultValue={(profile as any).phone ? (profile as any).phone.replace(/^55/, '') : ''}
                placeholder="51999887766"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Formato: DDD + número (ex: 51999887766)
              </p>
            </div>

            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-destructive/50 mt-6">
        <CardHeader>
          <CardTitle className="text-destructive">Exclusão de Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Ao excluir sua conta, todos os seus dados serão permanentemente removidos após 30 dias. Esta ação não pode ser desfeita.
            </p>
            <Button 
              variant="destructive" 
              onClick={() => setShowDeleteModal(true)}
              className="w-full sm:w-auto"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir Minha Conta
            </Button>
          </div>
        </CardContent>
      </Card>

      <DeleteAccountModal 
        open={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
      />
    </div>
  );
}
