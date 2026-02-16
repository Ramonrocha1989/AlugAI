'use client';

import { useState } from 'react';
import { useAdminMachines, useUpdateMachineStatus, useFeatureMachine, useDeleteMachine } from '@/hooks/use-admin';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Star, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminMachinesPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');
  const { data, isLoading } = useAdminMachines({ page, limit: 20, status });
  const updateStatus = useUpdateMachineStatus();
  const featureMachine = useFeatureMachine();
  const deleteMachine = useDeleteMachine();

  const handleStatusChange = (id: string, newStatus: string) => {
    if (confirm(`Alterar status para ${newStatus}?`)) {
      updateStatus.mutate({ id, status: newStatus });
    }
  };

  const handleFeature = (id: string, isFeatured: boolean) => {
    featureMachine.mutate({ id, isFeatured });
  };

  const handleDelete = (id: string) => {
    if (confirm('Deletar esta máquina permanentemente?')) {
      deleteMachine.mutate(id);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Máquinas</h1>
        <Link href="/admin">
          <Button variant="outline">Voltar ao Dashboard</Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Button
              variant={status === 'all' ? 'default' : 'outline'}
              onClick={() => setStatus('all')}
            >
              Todas
            </Button>
            <Button
              variant={status === 'ACTIVE' ? 'default' : 'outline'}
              onClick={() => setStatus('ACTIVE')}
            >
              Ativas
            </Button>
            <Button
              variant={status === 'PENDING' ? 'default' : 'outline'}
              onClick={() => setStatus('PENDING')}
            >
              Pendentes
            </Button>
            <Button
              variant={status === 'REJECTED' ? 'default' : 'outline'}
              onClick={() => setStatus('REJECTED')}
            >
              Rejeitadas
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {data?.machines?.map((machine: any) => (
              <Card key={machine.id}>
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
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{machine.name}</h3>
                            {machine.isFeatured && (
                              <Badge className="bg-yellow-500">
                                <Star className="h-3 w-3 mr-1" />
                                Destaque
                              </Badge>
                            )}
                            <Badge
                              className={
                                machine.status === 'ACTIVE'
                                  ? 'bg-green-500'
                                  : machine.status === 'PENDING'
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }
                            >
                              {machine.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {formatPrice(machine.price)} • {machine.category}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Vendedor: {machine.owner?.name} ({machine.owner?.email})
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        {machine.status !== 'ACTIVE' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(machine.id, 'ACTIVE')}
                            disabled={updateStatus.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Aprovar
                          </Button>
                        )}
                        {machine.status !== 'REJECTED' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusChange(machine.id, 'REJECTED')}
                            disabled={updateStatus.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reprovar
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant={machine.isFeatured ? 'outline' : 'default'}
                          onClick={() => handleFeature(machine.id, !machine.isFeatured)}
                          disabled={featureMachine.isPending}
                        >
                          <Star className="h-4 w-4 mr-2" />
                          {machine.isFeatured ? 'Remover Destaque' : 'Destacar'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(machine.id)}
                          disabled={deleteMachine.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Deletar
                        </Button>
                        <Link href={`/machine/${machine.id}`}>
                          <Button size="sm" variant="ghost">
                            Ver Anúncio
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {data?.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span className="flex items-center px-4">
                Página {page} de {data.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => p + 1)}
                disabled={page >= data.totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
