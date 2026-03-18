import Link from 'next/link';
import Image from 'next/image';
import { Machine } from '@/types/machine';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group">
        <div className="relative h-48 w-full">
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

          {/* Verification Badges */}
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
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Title and Category */}
          <div>
            <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {machine.manufacturer || ''} {machine.model || ''} {machine.yearModel || ''}
            </h3>
            <p className="text-sm text-muted-foreground">
              {CATEGORIES[machine.category] || machine.category}
            </p>
          </div>

          {/* Specs */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
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

          {/* Location */}
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            {machine.city || ''}, {machine.state || ''}
          </div>

          {/* Quick Tags */}
          {machine.quickTags && machine.quickTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {machine.quickTags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {QUICK_TAGS[tag]}
                </Badge>
              ))}
              {machine.quickTags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{machine.quickTags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Negotiation Options */}
          {(machine.acceptsTradeDown || machine.acceptsGrains || machine.acceptsFinancing) && (
            <div className="flex flex-wrap gap-2 text-xs">
              {machine.acceptsTradeDown && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Aceita troca</span>
                </div>
              )}
              {machine.acceptsGrains && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Aceita grãos</span>
                </div>
              )}
              {machine.acceptsFinancing && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Aceita financiamento</span>
                </div>
              )}
            </div>
          )}

          {/* Price */}
          <div className="pt-2 border-t">
            <p className="text-2xl font-bold text-primary">
              {formatPrice(machine.price, machine.businessType)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {machine.ownerName || 'Vendedor'}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}