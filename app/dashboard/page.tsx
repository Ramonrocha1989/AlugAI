'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMyMachines, useDeleteMachine, useUpdateMachine } from '@/hooks/use-machines';
import { machineService } from '@/services/machine-api';
import { useToast } from '@/components/toast-provider';
import { useUser } from '@/hooks/use-user';
import { DashboardAnalytics } from '@/components/dashboard-analytics';
import { MachineCard } from '@/components/machine-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Loader2, Edit, Trash2, Eye, MessageCircle, CheckCircle } from 'lucide-react';
import { authService } from '@/services/machine-api';
import { getPlanConfig } from '@/services/machine-api';
import { Machine } from '@/types/machine';
import { PlanId } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { data: machines, isLoading, error } = useMyMachines();
  const { data: user, isLoading: userLoading, error: userError } = useUser();
  const deleteMachine = useDeleteMachine();
  const updateMachine = useUpdateMachine();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [cancellingPlan, setCancellingPlan] = useState(false);

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Não redirecionar automaticamente - deixar componente tratar
    const timer = setTimeout(() => {
      setIsCheckingAuth(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  if (isCheckingAuth || isLoading || userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Se houver erro, mostrar mensagem
  if (error || userError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Erro ao carregar dashboard</h1>
          <p className="text-muted-foreground mb-4">Erro: {(error as any)?.message || (userError as any)?.message}</p>
          <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  const handleDelete = async (machine: Machine) => {
    if (!confirm(`Tem certeza que deseja deletar "${machine.name}"?`)) {
      return;
    }

    setDeletingId(machine.id);
    try {
      await deleteMachine.mutateAsync(machine.id);
      showToast('Máquina deletada com sucesso!', 'success');
    } catch (error: any) {
      if (error.response?.status === 403) {
        showToast('Você não tem permissão para deletar esta máquina', 'error');
      } else {
        showToast('Erro ao deletar máquina', 'error');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleMarkLead = async (machineId: string) => {
    try {
      await machineService.markLead(machineId);
      showToast('Lead marcado como qualificado!', 'success');
      window.location.reload();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Não foi possível marcar o lead', 'error');
    }
  };

  const togglePremium = async (machineId: string, currentValue: boolean) => {
    try {
      await updateMachine.mutateAsync({
        id: machineId,
        data: { isPremium: !currentValue },
      });
      showToast(currentValue ? 'Premium desativado!' : '🏆 Premium ativado!', 'success');
      window.location.reload();
    } catch (error: any) {
      if (error.response?.status === 403) {
        showToast(error.response?.data?.message || 'Limite de anúncios Premium atingido (3 máximo)', 'error');
      } else {
        showToast('Erro ao atualizar Premium', 'error');
      }
    }
  };

  const toggleFeatured = async (machineId: string, currentValue: boolean) => {
    try {
      await updateMachine.mutateAsync({
        id: machineId,
        data: { isFeatured: !currentValue },
      });
      showToast(currentValue ? 'Destaque desativado!' : '⭐ Destaque ativado!', 'success');
      window.location.reload();
    } catch (error: any) {
      if (error.response?.status === 403) {
        showToast(error.response?.data?.message || 'Limite de anúncios em Destaque atingido (5 máximo)', 'error');
      } else {
        showToast('Erro ao atualizar Destaque', 'error');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Minhas Máquinas</h1>
          <p className="text-muted-foreground">
            Gerencie seus anúncios de máquinas
          </p>
        </div>
        <Link href="/dashboard/new-machine">
          <Button size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Anunciar Máquina
          </Button>
        </Link>
      </div>

      {/* Seção do Plano */}
      {user && user.plan !== 'free' && (() => {
        const planConfig = getPlanConfig(user.plan as PlanId);
        const planColors: Record<string, string> = {
          basico: 'from-blue-50 to-sky-50 border-blue-200',
          profissional: 'from-indigo-50 to-blue-50 border-indigo-200',
          premium: 'from-amber-50 to-orange-50 border-amber-200',
        };
        const planBadge: Record<string, any> = {
          basico: 'basico',
          profissional: 'profissional',
          premium: 'planPremium',
        };
        return (
          <Card className={`mb-6 bg-gradient-to-r ${planColors[user.plan] || 'from-gray-50 to-gray-50 border-gray-200'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {user.plan === 'premium' ? '👑' : user.plan === 'profissional' ? '⭐' : '⚡'} Plano {planConfig.name} Ativo
                <Badge variant={planBadge[user.plan] || 'secondary'}>{planConfig.name}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{user.usage?.activeAds || 0}/{user.maxAds}</div>
                  <div className="text-sm text-muted-foreground">Anúncios Ativos</div>
                </div>
                {planConfig.maxPremiumAds > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{user.usage?.premiumAds || 0}/{user.maxPremiumAds}</div>
                    <div className="text-sm text-muted-foreground">Premium Ativos</div>
                  </div>
                )}
                {planConfig.maxFeaturedAds > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{user.usage?.featuredAds || 0}/{user.maxFeaturedAds}</div>
                    <div className="text-sm text-muted-foreground">Destaques Ativos</div>
                  </div>
                )}
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                {planConfig.features.slice(0, 4).map((f, i) => (
                  <span key={i}>✅ {f}{i < 3 ? ' • ' : ''}</span>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {user.planExpiresAt
                    ? `Renova em ${new Date(user.planExpiresAt).toLocaleDateString('pt-BR')}`
                    : 'Assinatura ativa'}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  disabled={cancellingPlan}
                  onClick={async () => {
                    if (!confirm('Tem certeza que deseja cancelar sua assinatura? Seus anúncios ficarão ativos até o fim do período pago.')) return;
                    setCancellingPlan(true);
                    try {
                      const token = localStorage.getItem('accessToken');
                      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/cancel`, {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      if (!res.ok) throw new Error();
                      showToast('Assinatura cancelada. Seu plano fica ativo até o fim do período.', 'success');
                      window.location.reload();
                    } catch {
                      showToast('Erro ao cancelar assinatura', 'error');
                    } finally {
                      setCancellingPlan(false);
                    }
                  }}
                >
                  {cancellingPlan ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Cancelar assinatura'}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })()}

      {isLoading || userLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : machines && machines.length > 0 ? (
        <>
          {/* Analytics Dashboard */}
          <DashboardAnalytics machines={machines} userPlan={(user?.plan || 'free') as PlanId} />

          {/* Lista de Máquinas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-32">
          {machines.map((machine) => (
            <div key={machine.id} className="relative">
              <MachineCard machine={machine} />
              <div className="absolute top-2 left-2 flex gap-2 z-10">
                <Link href={`/dashboard/edit-machine/${machine.id}`}>
                  <Button size="sm" variant="secondary">
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(machine)}
                  disabled={deletingId === machine.id}
                >
                  {deletingId === machine.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Deletar
                    </>
                  )}
                </Button>
              </div>
              
              {/* Estatísticas */}
              <div className="mt-3 p-3 bg-muted rounded-lg space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    Visualizações
                  </span>
                  <Badge variant="secondary">{machine.views || 0}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    Cliques WhatsApp
                  </span>
                  <Badge variant="secondary">{machine.whatsappClicks || 0}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <CheckCircle className="h-4 w-4" />
                    Leads Qualificados
                  </span>
                  <Badge variant="secondary">{machine.qualifiedLeads || 0}</Badge>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => handleMarkLead(machine.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Marcar Lead Qualificado
                </Button>

                {/* Botões Premium e Destaque (planos que suportam) */}
                {user && getPlanConfig(user.plan as PlanId).maxPremiumAds > 0 && (
                  <div className="space-y-2 mt-3 pt-3 border-t">
                    <Button
                      size="sm"
                      variant={machine.isPremium ? 'default' : 'outline'}
                      className="w-full"
                      onClick={() => togglePremium(machine.id, machine.isPremium || false)}
                      disabled={!machine.isPremium && (user.usage?.premiumAds || 0) >= (user.maxPremiumAds || 3)}
                    >
                      {machine.isPremium ? '🏆 Premium Ativo' : 'Ativar Premium'}
                      {!machine.isPremium && ` (${user.usage?.premiumAds || 0}/${user.maxPremiumAds || 3})`}
                    </Button>
                    <Button
                      size="sm"
                      variant={machine.isFeatured ? 'default' : 'outline'}
                      className="w-full"
                      onClick={() => toggleFeatured(machine.id, machine.isFeatured || false)}
                      disabled={!machine.isFeatured && (user.usage?.featuredAds || 0) >= (user.maxFeaturedAds || 5)}
                    >
                      {machine.isFeatured ? '⭐ Destaque Ativo' : 'Ativar Destaque'}
                      {!machine.isFeatured && ` (${user.usage?.featuredAds || 0}/${user.maxFeaturedAds || 5})`}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        </>
      ) : (
        <div className="text-center py-12 bg-muted rounded-lg">
          <h3 className="text-xl font-semibold mb-2">
            Você ainda não tem máquinas cadastradas
          </h3>
          <p className="text-muted-foreground mb-6">
            Comece anunciando sua primeira máquina
          </p>
          <Link href="/dashboard/new-machine">
            <Button>
              <Plus className="h-5 w-5 mr-2" />
              Anunciar Máquina
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
