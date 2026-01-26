'use client';

import { useState } from 'react';
import { useEquipments } from '@/hooks/use-api';
import { EquipmentCard } from '@/components/equipment-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Loader2 } from 'lucide-react';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [filters, setFilters] = useState<{ search?: string; location?: string }>({});

  const { data: equipments, isLoading } = useEquipments(filters);

  const handleSearch = () => {
    setFilters({
      search: search || undefined,
      location: location || undefined,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Aluguel de Equipamentos</h1>
        <p className="text-muted-foreground">
          Encontre o equipamento ideal para sua obra
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-card border rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar equipamento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Localização..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-9"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>Buscar</Button>
        </div>
      </div>

      {/* Lista de equipamentos */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            {equipments?.length || 0} equipamentos encontrados
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipments?.map((equipment) => (
              <EquipmentCard key={equipment.id} equipment={equipment} />
            ))}
          </div>
        </>
      )}

      {!isLoading && equipments?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhum equipamento encontrado com os filtros aplicados.
          </p>
        </div>
      )}
    </div>
  );
}
