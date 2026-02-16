import Link from 'next/link';
import Image from 'next/image';
import { Equipment } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Award } from 'lucide-react';

interface EquipmentCardProps {
  equipment: Equipment;
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={equipment.images[0]}
          alt={equipment.name}
          fill
          className="object-cover"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {equipment.isPremium && (
            <Badge variant="premium" className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              PREMIUM
            </Badge>
          )}
          {equipment.ownerPlan === 'lojista' && (
            <Badge variant="verified" className="flex items-center gap-1">
              <Award className="h-3 w-3" />
              VERIFICADO
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">
          {equipment.name}
        </h3>
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          {equipment.location}
        </div>
        <div className="text-2xl font-bold text-primary">
          R$ {equipment.dailyPrice}
          <span className="text-sm font-normal text-muted-foreground">/dia</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/equipment/${equipment.id}`} className="w-full">
          <Button className="w-full">Ver detalhes</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
