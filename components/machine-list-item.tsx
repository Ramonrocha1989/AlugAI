'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MachineCard } from '@/components/machine-card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/toast-provider';
import { useDeleteMachine, useUpdateMachine } from '@/hooks/use-machines';
import { useMarkLead } from '@/hooks/use-subscription';
import { getPlanConfig } from '@/services/machine-api';
import { Machine } from '@/types/machine';
import { User, PlanId } from '@/types';
import { Edit, Trash2, Eye, MessageCircle, CheckCircle, Loader2 } from 'lucide-react';

interface MachineListItemProps {
  machine: Machine;
  user: User | undefined;
}

export function MachineListItem({ machine, user }: MachineListItemProps) {
  const { showToast } = useToast();
  const deleteMachine = useDeleteMachine();
  const updateMachine = useUpdateMachine();
  const markLead = useMarkLead();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteMachine.mutateAsync(machine.id);
      showToast('Máquina deletada com sucesso!', 'success');
      setShowDeleteDialog(false);
    } catch (error: any) {
      showToast(
        error.response?.status === 403
          ? 'Você não tem permissão para deletar esta máquina'
          : 'Erro ao deletar máquina',
        'error'
      );
    }
  };

  const handleMarkLead = async () => {
    try {
      await markLead.mutateAsync(machine.id);
      showToast('Lead marcado como qualificado!', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Não foi possível marcar o lead', 'error');
    }
  };

  const togglePremium = async () => {
    try {
      await updateMachine.mutateAsync({
        id: machine.id,
        data: { isPremium: !machine.isPremium },
      });
      showToast(machine.isPremium ? 'Premium desativado!' : '🏆 Premium ativado!', 'success');
    } catch (error: any) {
      showToast(
        error.response?.status === 403
          ? error.response?.data?.message || 'Limite de anúncios Premium atingido'
          : 'Erro ao atualizar Premium',
        'error'
      );
    }
  };

  const toggleFeatured = async () => {
    try {
      await updateMachine.mutateAsync({
        id: machine.id,
        data: { isFeatured: !machine.isFeatured },
      });
      showToast(machine.isFeatured ? 'Destaque desativado!' : '⭐ Destaque ativado!', 'success');
    } catch (error: any) {
      showToast(
        error.response?.status === 403
          ? error.response?.data?.message || 'Limite de anúncios em Destaque atingido'
          : 'Erro ao atualizar Destaque',
        'error'
      );
    }
  };

  const planConfig = user ? getPlanConfig(user.plan as PlanId) : null;

  return (
    <>
      <div className="relative">
        <MachineCard machine={machine} />
        <div className="absolute top-2 left-2 flex gap-2 z-10">
          <Link href={`/dashboard/edit-machine/${machine.id}`}>
            <Button size="sm" variant="secondary" aria-label={`Editar ${machine.name}`}>
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
          </Link>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            aria-label={`Deletar ${machine.name}`}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Deletar
          </Button>
        </div>

        <div className="mt-3 p-3 bg-muted rounded-lg space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Eye className="h-4 w-4" /> Visualizações
            </span>
            <Badge variant="secondary">{machine.views || 0}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <MessageCircle className="h-4 w-4" /> Cliques WhatsApp
            </span>
            <Badge variant="secondary">{machine.whatsappClicks || 0}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <CheckCircle className="h-4 w-4" /> Leads Qualificados
            </span>
            <Badge variant="secondary">{machine.qualifiedLeads || 0}</Badge>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-full mt-2"
            onClick={handleMarkLead}
            disabled={markLead.isPending}
          >
            {markLead.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-1" />
            )}
            Marcar Lead Qualificado
          </Button>

          {planConfig && planConfig.maxPremiumAds > 0 && user && (
            <div className="space-y-2 mt-3 pt-3 border-t">
              <Button
                size="sm"
                variant={machine.isPremium ? 'default' : 'outline'}
                className="w-full"
                onClick={togglePremium}
                disabled={updateMachine.isPending || (!machine.isPremium && (user.usage?.premiumAds || 0) >= (user.maxPremiumAds || 3))}
              >
                {machine.isPremium ? '🏆 Premium Ativo' : 'Ativar Premium'}
                {!machine.isPremium && ` (${user.usage?.premiumAds || 0}/${user.maxPremiumAds || 3})`}
              </Button>
              <Button
                size="sm"
                variant={machine.isFeatured ? 'default' : 'outline'}
                className="w-full"
                onClick={toggleFeatured}
                disabled={updateMachine.isPending || (!machine.isFeatured && (user.usage?.featuredAds || 0) >= (user.maxFeaturedAds || 5))}
              >
                {machine.isFeatured ? '⭐ Destaque Ativo' : 'Ativar Destaque'}
                {!machine.isFeatured && ` (${user.usage?.featuredAds || 0}/${user.maxFeaturedAds || 5})`}
              </Button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Deletar máquina"
        description={`Tem certeza que deseja deletar "${machine.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Deletar"
        variant="destructive"
        loading={deleteMachine.isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}
