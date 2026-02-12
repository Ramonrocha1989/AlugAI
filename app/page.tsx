'use client';

import { useState } from 'react';
import { useMachines } from '@/hooks/use-machines';
import { MachineCard } from '@/components/machine-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MachineFilters } from '@/types/machine';
import { Search, MapPin, Loader2, Filter } from 'lucide-react';
import { CATEGORIES, BUSINESS_TYPES, STATES_SUL } from '@/lib/constants';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [state, setState] = useState('');
  const [category, setCategory] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [filters, setFilters] = useState<MachineFilters>({});

  const { data: machines, isLoading } = useMachines(filters);

  const handleSearch = () => {
    setFilters({
      search: search || undefined,
      state: state || undefined,
      category: category as any || undefined,
      businessType: businessType as any || undefined,
    });
  };

  const handleClearFilters = () => {
    setSearch('');
    setState('');
    setCategory('');
    setBusinessType('');
    setFilters({});
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Mercado Máquina</h1>
        <p className="text-muted-foreground">
          Compre, venda, alugue ou troque máquinas agrícolas e de construção
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-card border rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar máquina..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Todas as categorias</option>
            {Object.entries(CATEGORIES).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Todos os tipos</option>
            {Object.entries(BUSINESS_TYPES).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Todos os estados</option>
            {STATES_SUL.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          <Button onClick={handleSearch} className="w-full">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
        </div>

        {(search || state || category || businessType) && (
          <Button variant="outline" size="sm" onClick={handleClearFilters}>
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Lista de máquinas */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            {machines?.length || 0} máquinas encontradas
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {machines?.map((machine) => (
              <MachineCard key={machine.id} machine={machine} />
            ))}
          </div>
        </>
      )}

      {!isLoading && machines?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhuma máquina encontrada com os filtros aplicados.
          </p>
        </div>
      )}
    </div>
  );
}
