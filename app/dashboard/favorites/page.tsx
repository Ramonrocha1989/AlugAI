'use client';

import Link from 'next/link';
import { useFavoritedMachines } from '@/hooks/use-favorites';
import { MachineCard } from '@/components/machine-card';
import { Button } from '@/components/ui/button';
import { Loader2, Heart } from 'lucide-react';

export default function FavoritesPage() {
  const result = useFavoritedMachines();
  const machines = result.data?.data || [];
  const count = result.data?.count || 0;
  const isLoading = result.isLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Heart className="h-8 w-8 text-red-500 fill-red-500" />
          Meus Favoritos
        </h1>
        <p className="text-muted-foreground">
          {count === 0 
            ? 'Você ainda não tem máquinas favoritas'
            : `${count} ${count === 1 ? 'máquina favorita' : 'máquinas favoritas'}`
          }
        </p>
      </div>

      {machines.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nenhuma máquina favorita</h2>
          <p className="text-muted-foreground mb-4">
            Clique no ícone de coração nas máquinas para adicioná-las aos favoritos
          </p>
          <Link href="/">
            <Button>Explorar Máquinas</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map((machine) => (
            <MachineCard key={machine.id} machine={machine} />
          ))}
        </div>
      )}
    </div>
  );
}
