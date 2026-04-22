'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import {
  useReceivedProposals,
  useSentProposals,
  useAcceptProposal,
  useRejectProposal,
  useCancelProposal,
} from '@/hooks/use-proposals';
import { proposalsService } from '@/services/proposals-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { CounterProposalModal } from '@/components/counter-proposal-modal';
import { Proposal } from '@/types/proposal';
import { Loader2, Package, CheckCircle, XCircle, Clock, ArrowLeftRight, MessageCircle } from 'lucide-react';

const STATUS_CONFIG = {
  PENDING: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  ACCEPTED: { label: 'Aceita', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  REJECTED: { label: 'Recusada', color: 'bg-red-100 text-red-800', icon: XCircle },
  COUNTERED: { label: 'Contra-proposta', color: 'bg-blue-100 text-blue-800', icon: ArrowLeftRight },
};

export default function ProposalsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const tab = searchParams.get('tab') || 'received';
  
  const [counterProposal, setCounterProposal] = useState<Proposal | null>(null);
  const [mounted, setMounted] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'accept' | 'reject' | 'cancel';
    id: string;
  } | null>(null);

  const { data: received, isLoading: loadingReceived } = useReceivedProposals();
  const { data: sent, isLoading: loadingSent } = useSentProposals();
  const acceptProposal = useAcceptProposal();
  const rejectProposal = useRejectProposal();
  const cancelProposal = useCancelProposal();

  useEffect(() => {
    setMounted(true);
  }, []);

  const proposals = tab === 'received' ? received : sent;
  const isLoading = tab === 'received' ? loadingReceived : loadingSent;

  // Calcular notificações não vistas para cada aba
  const receivedNotifications = received?.filter(p => 
    p.status === 'PENDING' && p.viewedByReceiver === false
  ).length || 0;

  const sentNotifications = sent?.filter(p => 
    ['ACCEPTED', 'REJECTED', 'COUNTERED'].includes(p.status) && p.viewedBySender === false
  ).length || 0;

  // Marcar propostas como vistas quando a página carrega
  useEffect(() => {
    if (proposals && proposals.length > 0) {
      const markPromises = proposals
        .filter(proposal => {
          const needsView = tab === 'received' 
            ? proposal.viewedByReceiver === false
            : proposal.viewedBySender === false;
          return needsView;
        })
        .map(proposal => proposalsService.markAsViewed(proposal.id));
      
      if (markPromises.length > 0) {
        Promise.all(markPromises).then(() => {
          // Refetch após marcar como vistas
          if (tab === 'received') {
            queryClient.invalidateQueries({ queryKey: ['proposals', 'received'] });
          } else {
            queryClient.invalidateQueries({ queryKey: ['proposals', 'sent'] });
          }
        }).catch(() => {});
      }
    }
  }, [proposals, tab]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleAccept = async (id: string) => {
    setConfirmAction({ type: 'accept', id });
  };

  const handleReject = async (id: string) => {
    setConfirmAction({ type: 'reject', id });
  };

  const handleCancel = async (id: string) => {
    setConfirmAction({ type: 'cancel', id });
  };

  const executeConfirmAction = async () => {
    if (!confirmAction) return;
    try {
      if (confirmAction.type === 'accept') {
        await acceptProposal.mutateAsync(confirmAction.id);
      } else if (confirmAction.type === 'reject') {
        await rejectProposal.mutateAsync(confirmAction.id);
      } else {
        await cancelProposal.mutateAsync(confirmAction.id);
      }
    } finally {
      setConfirmAction(null);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Minhas Propostas</h1>

      <div className="flex gap-2 mb-4 md:mb-6 overflow-x-auto pb-2 pt-3">
        <Button
          variant={tab === 'received' ? 'default' : 'outline'}
          onClick={() => router.push('/proposals?tab=received')}
          className="relative whitespace-nowrap overflow-visible"
          size="sm"
        >
          Recebidas
          {receivedNotifications > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2.5 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs z-10"
            >
              {receivedNotifications}
            </Badge>
          )}
        </Button>
        <Button
          variant={tab === 'sent' ? 'default' : 'outline'}
          onClick={() => router.push('/proposals?tab=sent')}
          className="relative whitespace-nowrap overflow-visible"
          size="sm"
        >
          Enviadas
          {sentNotifications > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2.5 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs z-10"
            >
              {sentNotifications}
            </Badge>
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !proposals || proposals.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Nenhuma proposta {tab === 'received' ? 'recebida' : 'enviada'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => {
            const status = STATUS_CONFIG[proposal.status];
            const StatusIcon = status.icon;
            const isReceived = tab === 'received';
            const otherUser = isReceived ? proposal.sender : proposal.receiver;

            return (
              <Card key={proposal.id}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative h-32 sm:h-24 w-full sm:w-24 flex-shrink-0 bg-muted rounded overflow-hidden">
                      <Image
                        src={proposal.machine.images[0] || '/placeholder.jpg'}
                        alt={proposal.machine.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-base md:text-lg truncate">{proposal.machine.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {isReceived ? 'De' : 'Para'}: {otherUser.name}
                          </p>
                        </div>
                        <Badge className={`${status.color} whitespace-nowrap flex-shrink-0`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Preço Anunciado</p>
                          <p className="font-semibold text-sm md:text-base">{formatPrice(proposal.machine.price)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Proposta</p>
                          <p className="font-semibold text-primary text-sm md:text-base">{formatPrice(proposal.proposedPrice)}</p>
                        </div>
                      </div>

                      {proposal.counterPrice && (
                        <div className="bg-blue-50 p-3 rounded mb-3">
                          <p className="text-xs text-muted-foreground mb-1">Contra-proposta</p>
                          <p className="font-semibold text-blue-600">{formatPrice(proposal.counterPrice)}</p>
                          {proposal.counterMessage && (
                            <p className="text-sm mt-2">{proposal.counterMessage}</p>
                          )}
                        </div>
                      )}

                      <p className="text-sm mb-3 line-clamp-2">{proposal.message}</p>

                      <div className="flex flex-wrap gap-2">
                        {isReceived && proposal.status === 'PENDING' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleAccept(proposal.id)}
                              disabled={acceptProposal.isPending}
                              className="min-h-[44px] sm:min-h-0"
                            >
                              Aceitar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setCounterProposal(proposal)}
                              className="min-h-[44px] sm:min-h-0"
                            >
                              Contra-propor
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(proposal.id)}
                              disabled={rejectProposal.isPending}
                              className="min-h-[44px] sm:min-h-0"
                            >
                              Recusar
                            </Button>
                          </>
                        )}

                        {!isReceived && proposal.status === 'PENDING' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCancel(proposal.id)}
                            disabled={cancelProposal.isPending}
                            className="min-h-[44px] sm:min-h-0"
                          >
                            Cancelar
                          </Button>
                        )}

                        {proposal.status === 'COUNTERED' && (
                          <Button
                            size="sm"
                            variant="default"
                            className="w-full sm:w-auto"
                            onClick={() => {
                              const phone = isReceived ? proposal.sender.phone : proposal.receiver.phone;
                              const otherName = isReceived ? proposal.sender.name : proposal.receiver.name;
                              const message = encodeURIComponent(
                                `Olá ${otherName}! Sobre a proposta da *${proposal.machine.name}*:\n\n` +
                                `Proposta inicial: ${formatPrice(proposal.proposedPrice)}\n` +
                                `Contra-proposta: ${formatPrice(proposal.counterPrice!)}\n\n` +
                                `Vamos negociar?`
                              );
                              if (phone) {
                                window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
                              } else {
                                window.open(`https://wa.me/?text=${message}`, '_blank');
                              }
                            }}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Negociar no WhatsApp
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push(`/machine/${proposal.machineId}`)}
                        >
                          Ver Anúncio
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {counterProposal && (
        <CounterProposalModal
          isOpen={true}
          onClose={() => setCounterProposal(null)}
          proposal={counterProposal}
        />
      )}

      <ConfirmDialog
        open={!!confirmAction}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={
          confirmAction?.type === 'accept' ? 'Aceitar proposta' :
          confirmAction?.type === 'reject' ? 'Recusar proposta' :
          'Cancelar proposta'
        }
        description={
          confirmAction?.type === 'accept' ? 'Tem certeza que deseja aceitar esta proposta?' :
          confirmAction?.type === 'reject' ? 'Tem certeza que deseja recusar esta proposta?' :
          'Tem certeza que deseja cancelar esta proposta?'
        }
        confirmLabel={
          confirmAction?.type === 'accept' ? 'Aceitar' :
          confirmAction?.type === 'reject' ? 'Recusar' :
          'Cancelar proposta'
        }
        variant={confirmAction?.type === 'accept' ? 'default' : 'destructive'}
        loading={acceptProposal.isPending || rejectProposal.isPending || cancelProposal.isPending}
        onConfirm={executeConfirmAction}
      />
    </div>
  );
}
