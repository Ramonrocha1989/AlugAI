import Link from 'next/link';
import Image from 'next/image';
import { Machine } from '@/types/machine';
import { optimizeCloudinaryUrl } from '@/lib/cloudinary';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FavoriteButton } from '@/components/favorite-button';
import { MapPin, Star, Award, CheckCircle2 } from 'lucide-react';
import { BUSINESS_TYPES, QUICK_TAGS } from '@/lib/constants';

interface MachineCardProps {
  machine: Machine;
  priority?: boolean;
}

export function MachineCard({ machine, priority = false }: MachineCardProps) {
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

  const hasBadges = machine.isVerifiedSeller || machine.isPremium || machine.ownerPlan === 'premium' || machine.ownerPlan === 'profissional';

  return (
    <Link href={`/machine/${machine.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group h-[580px] flex flex-col">
        {/* Imagem */}
        <div className="relative h-48 w-full flex-shrink-0">
          <Image
            src={optimizeCloudinaryUrl(machine.images[0] || '/placeholder.jpg', { width: 400 })}
            alt={machine.name}
            fill
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          
          {/* Tipo de negócio - canto superior esquerdo */}
          <div className="absolute top-2 left-2">
            <Badge className={`${getBusinessTypeColor(machine.businessType)} text-white`}>
              {BUSINESS_TYPES[machine.businessType]}
            </Badge>
          </div>

          {/* Favorito - canto inferior direito */}
          <div className="absolute bottom-2 right-2">
            <FavoriteButton 
              machineId={machine.id} 
              machineName={`${machine.manufacturer} ${machine.model}`}
              size="md"
            />
          </div>
        </div>

        <CardContent className="p-5 flex flex-col flex-grow">
          {/* Badges de verificação/plano - abaixo da foto */}
          {hasBadges && (
            <div className="flex flex-wrap gap-1 mb-3">
              {machine.isVerifiedSeller && (
                <Badge className="bg-green-500 text-white flex items-center gap-1 text-xs">
                  <Award className="h-3 w-3" /> Verificado
                </Badge>
              )}
              {machine.isPremium && (
                <Badge className="bg-yellow-500 text-white flex items-center gap-1 text-xs">
                  <Star className="h-3 w-3" /> Premium
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
          )}

          {/* Título e Categoria */}
          <div className="mb-3">
            <h3 className="font-bold text-lg mb-1 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
              {machine.manufacturer || ''} {machine.model || ''} {machine.yearModel || ''}
            </h3>
            <p className="text-sm text-muted-foreground">
              {machine.category?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Sem categoria'}
            </p>
          </div>

          {/* Specs */}
          {(machine.yearModel || machine.engineHours || machine.power) && (
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
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

          {/* Localização */}
          <div className="mb-3 flex items-center">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm text-muted-foreground truncate">
              {machine.city || ''}, {machine.state || ''}
            </span>
          </div>

          {/* Quick Tags */}
          {machine.quickTags && machine.quickTags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1">
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

          {/* Opções de negociação */}
          {(machine.acceptsTradeDown || machine.acceptsGrains || machine.acceptsFinancing) && (
            <div className="mb-3 flex flex-wrap gap-2 text-xs">
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

          {/* Spacer */}
          <div className="flex-grow"></div>

          {/* Preço - sempre no final */}
          <div className="pt-4 border-t mt-auto">
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
