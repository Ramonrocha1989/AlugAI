import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface SimpleMachineData {
  id: string;
  name: string;
  price: string;
  images: string[];
  location: string;
}

interface SimpleMachineCardProps {
  machine: SimpleMachineData;
}

export function SimpleMachineCard({ machine }: SimpleMachineCardProps) {
  const formatPrice = (price: string) => {
    const numPrice = parseInt(price);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(numPrice);
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
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Title */}
          <div>
            <h3 className="font-bold text-lg mb-1 line-clamp-2 group-hover:text-primary transition-colors">
              {machine.name}
            </h3>
          </div>

          {/* Location */}
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            {machine.location}
          </div>

          {/* Price */}
          <div className="pt-2 border-t">
            <p className="text-2xl font-bold text-primary">
              {formatPrice(machine.price)}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}