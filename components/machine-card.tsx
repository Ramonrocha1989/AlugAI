'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Machine } from '@/types/machine';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BUSINESS_TYPES, CATEGORIES, QUICK_TAGS } from '@/lib/constants';
import { MapPin, Calendar, Gauge, Clock, CheckCircle2 } from 'lucide-react';

interface MachineCardProps {
  machine: Machine;
}

export function MachineCard({ machine }: MachineCardProps) {
  const formatPrice = (price: number, businessType: string) => {
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(price);

    return businessType === 'rental' ? `${formatted}/dia` : formatted;
  };

  return (
    <Link href={`/machine/${machine.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        {/* Imagem */}
        <div className="relative h-48 w-full bg-muted">
          <Image
            src={machine.images[0] || '/placeholder.jpg'}
            alt={machine.name}
            fill
            className="object-cover"
          />
          {machine.isVerifiedSeller && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Verificado
            </div>
          )}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-white/90">
              {BUSINESS_TYPES[machine.businessType]}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Título e Categoria */}
          <div className="mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{machine.name}</h3>
            <p className="text-sm text-muted-foreground">
              {CATEGORIES[machine.category]}
            </p>
          </div>

          {/* Informações Técnicas */}
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{machine.yearModel}</span>
              {machine.engineHours && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{machine.engineHours.toLocaleString('pt-BR')}h</span>
                </>
              )}
            </div>

            {machine.power && (
              <div className="flex items-center gap-2 text-sm">
                <Gauge className="h-4 w-4 text-muted-foreground" />
                <span>{machine.power} cv</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="line-clamp-1">
                {machine.city}, {machine.state}
              </span>
            </div>
          </div>

          {/* Tags Rápidas */}
          {machine.quickTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {machine.quickTags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {QUICK_TAGS[tag]}
                </Badge>
              ))}
              {machine.quickTags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{machine.quickTags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Opções de Negociação */}
          <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
            {machine.acceptsTradeDown && <span>• Aceita troca</span>}
            {machine.acceptsGrains && <span>• Aceita grãos</span>}
            {machine.acceptsFinancing && <span>• Aceita financiamento</span>}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="w-full">
            <p className="text-2xl font-bold text-primary">
              {formatPrice(machine.price, machine.businessType)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {machine.ownerName}
            </p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
