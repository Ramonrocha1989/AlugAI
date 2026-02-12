'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMyMachines } from '@/hooks/use-machines';
import { MachineCard } from '@/components/machine-card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { authService } from '@/services/machine-api';

export default function DashboardPage() {
  const router = useRouter();
  const { data: machines, isLoading } = useMyMachines();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login');
    }
  }, [router]);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map((machine) => (
            <MachineCard key={machine.id} machine={machine} />
          ))}
        </div>
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
