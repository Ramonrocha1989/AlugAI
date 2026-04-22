'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMyMachines } from '@/hooks/use-machines';
import { useUser } from '@/hooks/use-user';
import { DashboardAnalytics } from '@/components/dashboard-analytics';
import { PlanCard } from '@/components/plan-card';
import { MachineListItem } from '@/components/machine-list-item';
import { DashboardSkeleton } from '@/components/dashboard-skeleton';
import { ErrorBoundary } from '@/components/error-boundary';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PlanId } from '@/types';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { data: machines, isLoading, error } = useMyMachines();
  const { data: user, isLoading: userLoading, error: userError } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading || userLoading) {
    return <DashboardSkeleton />;
  }

  if (error || userError) {
    const message = (error as Error)?.message || (userError as Error)?.message;
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Erro ao carregar dashboard</h1>
          <p className="text-muted-foreground mb-4">Erro: {message}</p>
          <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Minhas Máquinas</h1>
          <p className="text-muted-foreground">Gerencie seus anúncios de máquinas</p>
        </div>
        <Link href="/dashboard/new-machine">
          <Button size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Anunciar Máquina
          </Button>
        </Link>
      </div>

      {user && (
        <ErrorBoundary>
          <PlanCard user={user} />
        </ErrorBoundary>
      )}

      {machines && machines.length > 0 ? (
        <>
          <ErrorBoundary>
            <DashboardAnalytics machines={machines} userPlan={(user?.plan || 'free') as PlanId} />
          </ErrorBoundary>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-32">
            {machines.map((machine) => (
              <ErrorBoundary key={machine.id}>
                <MachineListItem machine={machine} user={user} />
              </ErrorBoundary>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-muted rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Você ainda não tem máquinas cadastradas</h3>
          <p className="text-muted-foreground mb-6">Comece anunciando sua primeira máquina</p>
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
