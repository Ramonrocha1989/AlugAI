import Link from 'next/link';
import Image from 'next/image';
import { Machine } from '@/types/machine';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FavoriteButton } from '@/components/favorite-button';
import { MapPin, Star, Award, CheckCircle2 } from 'lucide-react';
import { BUSINESS_TYPES, CATEGORIES, QUICK_TAGS } from '@/lib/constants';

interface MachineCardProps {
  machine: Machine;
}

export function MachineCard({ machine }: MachineCardProps) {
  const formatPrice = (price: number | string, businessType: string) => {
    const numPrice = typeof price === 'string' ? parseInt(price) : price;
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(numPrice);

    return businessType === 'RENTAL' ? `${formatted}/dia` : formatted;
  };

  const getBusinessTypeColor = (type: string) => {
    switch (type) {
      case 'SALE': return 'bg-blue-500';
      case 'RENTAL': return 'bg-green-500';
      case 'EXCHANGE': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Link href={`/machine/${machine.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group h-[580px] flex flex-col">
        {/* Imagem - Altura fixa */}
        <div className="relative h-48 w-full flex-shrink-0">
          <Image
            src={machine.images[0] || '/placeholder.jpg'}
            alt={machine.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          
          {/* Business Type Badge */}
          <div className="absolute top-2 left-2">
            <Badge className={`${getBusinessTypeColor(machine.businessType)} text-white`}>
              {BUSINESS_TYPES[machine.businessType]}
            </Badge>
          </div>

          {/* Verification & Plan Badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {machine.isVerifiedSeller && (
              <Badge className="bg-green-500 text-white flex items-center gap-1">
                <Award className="h-3 w-3" />
                VERIFICADO
              </Badge>
            )}
            {machine.isPremium && (
              <Badge className="bg-yellow-500 text-white flex items-center gap-1">
                <Star className="h-3 w-3" />
                PREMIUM
              </Badge>
            )}
            {machine.ownerPlan === 'premium' && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs">
                👑 Loja Premium
              </Badge>
            )}
            {machine.ownerPlan === 'profissional' && !machine.isPremium && (
              <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs">
                ⭐ Profissional
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          <div className="absolute bottom-2 right-2">
            <FavoriteButton 
              machineId={machine.id} 
              machineName={`${machine.manufacturer} ${machine.model}`}
              size="md"
            />
          </div>
        </div>

        {/* Conteúdo - 332px restantes (580 - 248 da imagem) */}
        <CardContent className="p-5 flex flex-col flex-grow h-[332px]">
          {/* Title and Category - 80px */}
          <div className="mb-4 h-[80px] flex flex-col justify-start">
            <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
              {machine.manufacturer || ''} {machine.model || ''} {machine.yearModel || ''}
            </h3>
            <p className="text-sm text-muted-foreground">
              {CATEGORIES[machine.category] || machine.category}
            </p>
          </div>

          {/* Specs - 24px */}
          <div className="mb-4 h-[24px] flex items-center">
            {(machine.yearModel || machine.engineHours || machine.power) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                {machine.yearModel && <span>{machine.yearModel}</span>}
                {machine.engineHours && (
                  <>
                    <span>•</span>
                    <span>{machine.engineHours.toLocaleString('pt-BR')}h</span>
                  </>
                )}
                {machine.power && (
                  <>
                    <span>•</span>
                    <span>{machine.power} cv</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Location - 24px */}
          <div className="mb-4 h-[24px] flex items-center">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm text-muted-foreground truncate">
              {machine.city || ''}, {machine.state || ''}
            </span>
          </div>

          {/* Quick Tags - 32px */}
          <div className="mb-4 h-[32px] flex items-start">
            {machine.quickTags && machine.quickTags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {machine.quickTags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs h-6">
                    {QUICK_TAGS[tag]}
                  </Badge>
                ))}
                {machine.quickTags.length > 2 && (
                  <Badge variant="secondary" className="text-xs h-6">
                    +{machine.quickTags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Negotiation Options - 48px */}
          <div className="mb-4 h-[48px] flex items-start">
            {(machine.acceptsTradeDown || machine.acceptsGrains || machine.acceptsFinancing) && (
              <div className="flex flex-wrap gap-2 text-xs">
                {machine.acceptsTradeDown && (
                  <div className="flex items-center gap-1 text-green-600 whitespace-nowrap">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Aceita troca</span>
                  </div>
                )}
                {machine.acceptsGrains && (
                  <div className="flex items-center gap-1 text-green-600 whitespace-nowrap">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Aceita grãos</span>
                  </div>
                )}
                {machine.acceptsFinancing && (
                  <div className="flex items-center gap-1 text-green-600 whitespace-nowrap">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Financiamento</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Spacer flexível - Ocupa espaço restante */}
          <div className="flex-grow"></div>

          {/* Price - Sempre no final - 80px */}
          <div className="pt-4 border-t mt-auto h-[80px] flex flex-col justify-center">
            <p className="text-2xl font-bold text-primary leading-tight mb-2">
              {formatPrice(machine.price, machine.businessType)}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {machine.ownerName || 'Vendedor'}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}