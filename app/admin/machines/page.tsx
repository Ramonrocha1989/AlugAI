'use client';

import { useState, useEffect } from 'react';
import { useAdminMachines, useUpdateMachineStatus, useFeatureMachine, useDeleteMachine } from '@/hooks/use-admin';
import { useCategories } from '@/hooks/use-categories';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/toast-provider';
import {
  Loader2, Star, Trash2, CheckCircle, XCircle, Search,
  Eye, MousePointerClick, MapPin, Calendar, Package,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todas' },
  { value: 'ACTIVE', label: 'Ativas' },
  { value: 'PENDING', label: 'Pendentes' },
  { value: 'REJECTED', label: 'Rejeitadas' },
];

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-500',
  PENDING: 'bg-yellow-500',
  REJECTED: 'bg-red-500',
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Ativa',
  PENDING: 'Pendente',
  REJECTED: 'Rejeitada',
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
}

function formatDate(date: string | null | undefined): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('pt-BR');
}

export default function AdminMachinesPage() {
  const { showToast } = useToast();
  const { categoriesMap } = useCategories();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [confirmAction, setConfirmAction] = useState<{
    type: 'approve' | 'reject' | 'feature' | 'unfeature' | 'delete';
    machineId: string;
    machineName: string;
  } | null>(null);

  const { data, isLoading } = useAdminMachines({
    page, limit: 20,
    status: status !== 'all' ? status : undefined,
    search: debouncedSearch || undefined,
  });
  const { data: pendingCheck } = useAdminMachines({ status: 'PENDING', limit: 1, page: 1 });
  const pendingCount = pendingCheck?.total ?? 0;
  const updateStatus = useUpdateMachineStatus();
  const featureMachine = useFeatureMachine();
  const deleteMachine = useDeleteMachine();

  const machines = data?.machines || data?.data || (Array.isArray(data) ? data : []);
  const total = data?.total || machines.length;
  const totalPages = data?.totalPages || 1;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const executeAction = () => {
    if (!confirmAction) return;
    const { type, machineId } = confirmAction;

    const onSuccess = () => {
      setConfirmAction(null);
      showToast('Ação realizada com sucesso!', 'success');
    };
    const onError = () => showToast('Erro ao executar ação', 'error');

    switch (type) {
      case 'approve':
        updateStatus.mutate({ id: machineId, status: 'ACTIVE' }, { onSuccess, onError });
        break;
      case 'reject':
        updateStatus.mutate({ id: machineId, status: 'REJECTED' }, { onSuccess, onError });
        break;
      case 'feature':
        featureMachine.mutate({ id: machineId, isFeatured: true }, { onSuccess, onError });
        break;
      case 'unfeature':
        featureMachine.mutate({ id: machineId, isFeatured: false }, { onSuccess, onError });
        break;
      case 'delete':
        deleteMachine.mutate(machineId, { onSuccess, onError });
        break;
    }
  };

  const getConfirmProps = () => {
    if (!confirmAction) return { title: '', description: '', variant: 'default' as const };
    const { type, machineName } = confirmAction;
    switch (type) {
      case 'approve': return { title: 'Aprovar máquina', description: `Aprovar "${machineName}"?`, variant: 'default' as const };
      case 'reject': return { title: 'Reprovar máquina', description: `Reprovar "${machineName}"? Ela sairá dos resultados.`, variant: 'destructive' as const };
      case 'feature': return { title: 'Destacar máquina', description: `Destacar "${machineName}"? Ela aparecerá no topo dos resultados.`, variant: 'default' as const };
      case 'unfeature': return { title: 'Remover destaque', description: `Remover destaque de "${machineName}"?`, variant: 'default' as const };
      case 'delete': return { title: 'Deletar máquina', description: `Deletar "${machineName}" permanentemente? Essa ação não pode ser desfeita.`, variant: 'destructive' as const };
    }
  };

  const isActionPending = updateStatus.isPending || featureMachine.isPending || deleteMachine.isPending;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Máquinas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            <Package className="h-4 w-4 inline mr-1" />
            {total} máquina{total !== 1 ? 's' : ''} encontrada{total !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin">
          <Button variant="outline">Voltar ao Dashboard</Button>
        </Link>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, fabricante ou modelo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                variant={status === opt.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setStatus(opt.value); setPage(1); }}
                className="relative"
              >
                {opt.label}
                {opt.value === 'PENDING' && pendingCount > 0 && status !== 'PENDING' && (
                  <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white h-5 min-w-5 flex items-center justify-center p-0 text-xs rounded-full">
                    {pendingCount}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : machines.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Nenhuma máquina encontrada.
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {machines.map((machine: any) => (
              <Card key={machine.id} className={machine.status === 'REJECTED' ? 'border-red-200 bg-red-50/30' : ''}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="relative h-24 w-24 flex-shrink-0 bg-muted rounded overflow-hidden">
                      <Image
                        src={machine.images?.[0] || '/placeholder.jpg'}
                        alt={machine.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* Nome + Badges */}
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-lg">{machine.name}</h3>
                        <Badge className={STATUS_COLORS[machine.status] || 'bg-gray-500'}>
                          {STATUS_LABELS[machine.status] || machine.status}
                        </Badge>
                        {machine.isFeatured && (
                          <Badge className="bg-yellow-500">
                            <Star className="h-3 w-3 mr-1" /> Destaque
                          </Badge>
                        )}
                        {machine.isPremium && (
                          <Badge variant="premium">Premium</Badge>
                        )}
                      </div>

                      {/* Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground mb-2">
                        <span>{formatPrice(machine.price)} • {categoriesMap[machine.category] || machine.category}</span>
                        <span>Vendedor: {machine.owner?.name || '—'}</span>
                        {(machine.city || machine.state) && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {machine.city}{machine.state ? `, ${machine.state}` : ''}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Criado: {formatDate(machine.createdAt)}
                        </span>
                      </div>

                      {/* Métricas */}
                      <div className="flex gap-3 text-sm mb-3">
                        <span className="bg-muted px-2 py-0.5 rounded flex items-center gap-1">
                          <Eye className="h-3 w-3" /> {machine.views || 0} views
                        </span>
                        <span className="bg-muted px-2 py-0.5 rounded flex items-center gap-1">
                          <MousePointerClick className="h-3 w-3" /> {machine.whatsappClicks || 0} cliques
                        </span>
                        {machine.images && (
                          <span className="bg-muted px-2 py-0.5 rounded">{machine.images.length} fotos</span>
                        )}
                      </div>

                      {/* Ações */}
                      <div className="flex flex-wrap gap-2">
                        {machine.status !== 'ACTIVE' && (
                          <Button
                            size="sm"
                            onClick={() => setConfirmAction({ type: 'approve', machineId: machine.id, machineName: machine.name })}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" /> Aprovar
                          </Button>
                        )}
                        {machine.status !== 'REJECTED' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setConfirmAction({ type: 'reject', machineId: machine.id, machineName: machine.name })}
                          >
                            <XCircle className="h-4 w-4 mr-1" /> Reprovar
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant={machine.isFeatured ? 'outline' : 'default'}
                          onClick={() => setConfirmAction({
                            type: machine.isFeatured ? 'unfeature' : 'feature',
                            machineId: machine.id,
                            machineName: machine.name,
                          })}
                        >
                          <Star className="h-4 w-4 mr-1" />
                          {machine.isFeatured ? 'Remover Destaque' : 'Destacar'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setConfirmAction({ type: 'delete', machineId: machine.id, machineName: machine.name })}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Deletar
                        </Button>
                        <Link href={`/machine/${machine.id}`}>
                          <Button size="sm" variant="ghost">Ver Anúncio</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span className="flex items-center px-4">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}

      {confirmAction && (
        <ConfirmDialog
          open={true}
          onOpenChange={(open) => { if (!open) setConfirmAction(null); }}
          title={getConfirmProps().title}
          description={getConfirmProps().description}
          confirmLabel="Confirmar"
          variant={getConfirmProps().variant}
          loading={isActionPending}
          onConfirm={executeAction}
        />
      )}
    </div>
  );
}
