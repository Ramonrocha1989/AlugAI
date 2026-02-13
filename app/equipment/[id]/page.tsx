'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEquipment } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Building2, Calendar, Loader2, ArrowLeft } from 'lucide-react';
import { authService } from '@/services/machine-api';

export default function EquipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: equipment, isLoading } = useEquipment(params.id as string);

  const handleRentalRequest = () => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    alert('Solicitação de aluguel enviada! (Funcionalidade mock)');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Equipamento não encontrado</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative h-96 w-full rounded-lg overflow-hidden">
            <Image
              src={equipment.images[0]}
              alt={equipment.name}
              fill
              className="object-cover"
            />
          </div>
          {equipment.images.length > 1 && (
            <div className="grid grid-cols-3 gap-4">
              {equipment.images.slice(1).map((image, index) => (
                <div key={index} className="relative h-24 rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`${equipment.name} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{equipment.name}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {equipment.city}, {equipment.state}
              </div>
              <div className="flex items-center">
                <Building2 className="h-4 w-4 mr-1" />
                {equipment.ownerName}
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">
                R$ {equipment.price.toLocaleString('pt-BR')}
                <span className="text-lg font-normal text-muted-foreground">/dia</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Categoria: {equipment.category}
              </p>
              <Button onClick={handleRentalRequest} className="w-full" size="lg">
                Solicitar Aluguel
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Disponibilidade
              </h2>
              <p className="text-sm text-muted-foreground">
                {equipment.available ? 'Disponível para aluguel imediato' : 'Indisponível no momento'}
              </p>
            </CardContent>
          </Card>

          <div>
            <h2 className="font-semibold text-lg mb-3">Descrição</h2>
            <p className="text-muted-foreground leading-relaxed">
              {equipment.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
