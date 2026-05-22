'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MachineCard } from '@/components/machine-card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/toast-provider';
import { getApiErrorMessage, getApiErrorStatus } from '@/lib/error-handler';
import { useDeleteMachine, useUpdateMachine } from '@/hooks/use-machines';
import { getPlanConfig } from '@/services/machine-api';
import { Machine } from '@/types/machine';
import { User, PlanId } from '@/types';
import {
  Edit, Trash2, Eye, MessageCircle, Loader2,
  Heart, FileText, Clock, AlertTriangle, Hourglass, XCircle,
} from 'lucide-react';

interface MachineListItemProps {
  machine: Machine;
  user: User | undefined;
}

function getDaysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

function getMachineAlerts(machine: Machine): string[] {
  const alerts: string[] = [];
  const days = getDaysSince(machine.createdAt);

  if (machine.views > 20 && (machine.whatsappClicks || 0) === 0) {
    alerts.push('Muitas views sem contato — melhore as fotos ou descrição');
  }
  if ((machine.whatsappClicks || 0) > 5 && (machine.proposalsCount?.pending || 0) === 0 && (machine.favoritesCount || 0) === 0) {
    alerts.push('Contatos sem interesse visível — revise o preço ou condições');
  }
  if (days > 30 && machine.views < 10) {
    alerts.push('Anúncio com poucas views — considere ativar Premium');
  }
  if (days > 60 && (machine.whatsappClicks || 0) === 0) {
    alerts.push('60+ dias sem contato — considere baixar o preço');
  }

  return alerts;
}

export function MachineListItem({ machine, user }: MachineListItemProps) {
  const { showToast } = useToast();
  const deleteMachine = useDeleteMachine();
  const updateMachine = useUpdateMachine();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const userPlan = (user?.plan || 'free') as PlanId;
  const planConfig = user ? getPlanConfig(userPlan) : null;
  const showAlerts = userPlan === 'profissional' || userPlan === 'premium';
  const showExtras = userPlan === 'premium';
  const daysSince = getDaysSince(machine.createdAt);
  const alerts = showAlerts ? getMachineAlerts(machine) : [];
  const totalProposals = machine.proposalsCount
    ? machine.proposalsCount.pending + machine.proposalsCount.accepted + machine.proposalsCount.rejected + machine.proposalsCount.countered
    : 0;

  const handleDelete = async () => {
    try {
      await deleteMachine.mutateAsync(machine.id);
      showToast('Máquina deletada com sucesso!', 'success');
      setShowDeleteDialog(false);
    } catch (error: unknown) {
      showToast(
        getApiErrorStatus(error) === 403
          ? getApiErrorMessage(error, 'Você não tem permissão para deletar esta máquina')
          : getApiErrorMessage(error, 'Erro ao deletar máquina'),
        'error'
      );
    }
  };


  const togglePremium = async () => {
    try {
      await updateMachine.mutateAsync({
        id: machine.id,
        data: { isPremium: !machine.isPremium },
      });
      showToast(machine.isPremium ? 'Premium desativado!' : '🏆 Premium ativado!', 'success');
    } catch (error: unknown) {
      showToast(
        getApiErrorStatus(error) === 403
          ? getApiErrorMessage(error, 'Limite de anúncios Premium atingido')
          : getApiErrorMessage(error, 'Erro ao atualizar Premium'),
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
    } catch (error: unknown) {
      showToast(
        getApiErrorStatus(error) === 403
          ? getApiErrorMessage(error, 'Limite de anúncios em Destaque atingido')
          : getApiErrorMessage(error, 'Erro ao atualizar Destaque'),
        'error'
      );
    }
  };

  return (
    <>
      <div className="relative">
        <MachineCard machine={machine} />
        <div className="absolute top-2 left-2 flex gap-2 z-10">
          {machine.status === 'PENDING' && (
            <Badge className="bg-yellow-500 text-white">
              <Hourglass className="h-3 w-3 mr-1" /> Em análise
            </Badge>
          )}
          {machine.status === 'REJECTED' && (
            <Badge variant="destructive">
              <XCircle className="h-3 w-3 mr-1" /> Reprovado
            </Badge>
          )}
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
          {/* Dias desde publicação — Básico+ */}
          {userPlan !== 'free' && (
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" /> Publicado há
              </span>
              <Badge variant={daysSince > 60 ? 'destructive' : daysSince > 30 ? 'outline' : 'secondary'}>
                {daysSince} {daysSince === 1 ? 'dia' : 'dias'}
              </Badge>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Eye className="h-4 w-4" /> Visualizações
            </span>
            <Badge variant="secondary">{machine.views || 0}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <MessageCircle className="h-4 w-4" /> Contatos
            </span>
            <Badge variant="secondary">{machine.whatsappClicks || 0}</Badge>
          </div>

          {/* Favoritos e Propostas — Premium */}
          {showExtras && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Heart className="h-4 w-4" /> Favoritaram
                </span>
                <Badge variant="secondary">{machine.favoritesCount || 0}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <FileText className="h-4 w-4" /> Propostas
                </span>
                <div className="flex items-center gap-1">
                  {machine.proposalsCount?.pending ? (
                    <Badge className="bg-yellow-100 text-yellow-800">{machine.proposalsCount.pending} pendente{machine.proposalsCount.pending > 1 ? 's' : ''}</Badge>
                  ) : null}
                  <Badge variant="secondary">{totalProposals} total</Badge>
                </div>
              </div>
            </>
          )}

          {/* Alertas por máquina — Profissional+ */}
          {alerts.length > 0 && (
            <div className="mt-2 space-y-1">
              {alerts.map((alert, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 p-2 rounded">
                  <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                  <span>{alert}</span>
                </div>
              ))}
            </div>
          )}

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
