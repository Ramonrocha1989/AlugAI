'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMyEquipments } from '@/hooks/use-api';
import { authService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Loader2, Package } from 'lucide-react';
import Image from 'next/image';

export default function DashboardPage() {
  const router = useRouter();
  const { data: equipments, isLoading } = useMyEquipments();

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
          <h1 className="text-3xl font-bold mb-2">Meus Equipamentos</h1>
          <p className="text-muted-foreground">
            Gerencie seus equipamentos cadastrados
          </p>
        </div>
        <Link href="/dashboard/new-equipment">
          <Button size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar Equipamento
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : equipments && equipments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipments.map((equipment) => (
            <Card key={equipment.id}>
              <div className="relative h-48 w-full">
                <Image
                  src={equipment.images[0]}
                  alt={equipment.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{equipment.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {equipment.description}
                  </p>
                  <div className="text-xl font-bold text-primary">
                    R$ {equipment.dailyPrice}/dia
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {equipment.location}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Nenhum equipamento cadastrado
            </h3>
            <p className="text-muted-foreground mb-6">
              Comece cadastrando seu primeiro equipamento para aluguel
            </p>
            <Link href="/dashboard/new-equipment">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Equipamento
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
