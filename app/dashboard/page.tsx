'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMyMachines, useDeleteMachine } from '@/hooks/use-machines';
import { machineService } from '@/services/machine-api';
import { useToast } from '@/components/toast-provider';
import { DashboardAnalytics } from '@/components/dashboard-analytics';
import { MachineCard } from '@/components/machine-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2, Edit, Trash2, Eye, MessageCircle, CheckCircle } from 'lucide-react';
import { authService } from '@/services/machine-api';
import { Machine } from '@/types/machine';

export default function DashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { data: machines, isLoading } = useMyMachines();
  const deleteMachine = useDeleteMachine();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login');
    }
  }, [router]);

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

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : machines && machines.length > 0 ? (
        <>
          {/* Analytics Dashboard */}
          <DashboardAnalytics machines={machines} />

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
