'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Machine } from '@/types/machine';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FavoriteButton } from '@/components/favorite-button';
import { RatingBadge } from '@/components/rating-badge';
import { BUSINESS_TYPES, CATEGORIES, QUICK_TAGS } from '@/lib/constants';
import { analytics } from '@/lib/analytics';
import { MapPin, Calendar, Gauge, Clock, CheckCircle2, Star, Award } from 'lucide-react';

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
    <Link 
      href={`/machine/${machine.id}`}
      onClick={() => analytics.trackMachineView(machine.id, machine.name, machine.category)}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        <div className="relative h-40 sm:h-48 w-full bg-muted">
          <Image
            src={machine.images[0] || '/placeholder.jpg'}
            alt={machine.name}
            fill
            className="object-cover"
          />
          {/* Badges de Monetização */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {machine.isPremium && (
              <Badge variant="premium" className="flex items-center gap-1 text-xs">
                <Star className="h-3 w-3" />
                <span className="hidden sm:inline">PREMIUM</span>
              </Badge>
            )}
            <Badge variant="secondary" className="bg-white/90 text-xs">
              {BUSINESS_TYPES[machine.businessType]}
            </Badge>
          </div>
          {/* Badges lado direito */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
            {machine.isVerifiedSeller && (
              <Badge className="bg-green-500 text-white flex items-center gap-1 text-xs">
                <CheckCircle2 className="h-3 w-3" />
                <span className="hidden sm:inline">VERIFICADO</span>
              </Badge>
            )}
            {machine.isFeatured && (
              <div className="bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
                ⭐ <span className="hidden sm:inline">Destaque</span>
              </div>
            )}
          </div>
          <div className="absolute bottom-2 right-2">
            <FavoriteButton machineId={machine.id} machineName={machine.name} size="sm" />
          </div>
        </div>

        <CardContent className="p-3 sm:p-4 flex-1">
          <div className="mb-2">
            <h3 className="font-semibold text-base sm:text-lg line-clamp-1">{machine.name}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {CATEGORIES[machine.category]}
            </p>
          </div>

          <div className="space-y-1.5 mb-2 sm:mb-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              <span>{machine.yearModel}</span>
              {machine.engineHours && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <span>{machine.engineHours.toLocaleString('pt-BR')}h</span>
                </>
              )}
            </div>

            {machine.power && (
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Gauge className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                <span>{machine.power} cv</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              <span className="line-clamp-1">
                {machine.city}, {machine.state}
              </span>
            </div>
          </div>

          {machine.quickTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
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

          <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
            {machine.acceptsTradeDown && <span>• Aceita troca</span>}
            {machine.acceptsGrains && <span>• Aceita grãos</span>}
            {machine.acceptsFinancing && <span>• Aceita financiamento</span>}
          </div>
        </CardContent>

        <CardFooter className="p-3 sm:p-4 pt-0">
          <div className="w-full flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xl sm:text-2xl font-bold text-primary truncate">
                {formatPrice(machine.price, machine.businessType)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-muted-foreground truncate">
                  {machine.ownerName}
                </p>
                <RatingBadge userId={machine.ownerId} showCount={false} />
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
