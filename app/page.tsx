'use client';

import { useState } from 'react';
import { useMachines } from '@/hooks/use-machines';
import { MachineCard } from '@/components/machine-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MachineFilters } from '@/types/machine';
import { Search, Loader2, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { CATEGORIES, BUSINESS_TYPES, STATES_SUL } from '@/lib/constants';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [state, setState] = useState('');
  const [category, setCategory] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Filtros avançados
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [minEngineHours, setMinEngineHours] = useState('');
  const [maxEngineHours, setMaxEngineHours] = useState('');
  const [minPower, setMinPower] = useState('');
  const [maxPower, setMaxPower] = useState('');
  const [acceptsTradeDown, setAcceptsTradeDown] = useState(false);
  const [acceptsGrains, setAcceptsGrains] = useState(false);
  const [isVerifiedSeller, setIsVerifiedSeller] = useState(false);
  
  const [filters, setFilters] = useState<MachineFilters>({});

  const { data: machines, isLoading } = useMachines(filters);

  const handleSearch = () => {
    setFilters({
      search: search || undefined,
      state: state || undefined,
      category: category as any || undefined,
      businessType: businessType as any || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minYear: minYear ? Number(minYear) : undefined,
      maxYear: maxYear ? Number(maxYear) : undefined,
      minEngineHours: minEngineHours ? Number(minEngineHours) : undefined,
      maxEngineHours: maxEngineHours ? Number(maxEngineHours) : undefined,
      minPower: minPower ? Number(minPower) : undefined,
      maxPower: maxPower ? Number(maxPower) : undefined,
      acceptsTradeDown: acceptsTradeDown || undefined,
      acceptsGrains: acceptsGrains || undefined,
      isVerifiedSeller: isVerifiedSeller || undefined,
    });
  };

  const handleClearFilters = () => {
    setSearch('');
    setState('');
    setCategory('');
    setBusinessType('');
    setMinPrice('');
    setMaxPrice('');
    setMinYear('');
    setMaxYear('');
    setMinEngineHours('');
    setMaxEngineHours('');
    setMinPower('');
    setMaxPower('');
    setAcceptsTradeDown(false);
    setAcceptsGrains(false);
    setIsVerifiedSeller(false);
    setFilters({});
  };

  const hasActiveFilters = search || state || category || businessType || minPrice || maxPrice || 
    minYear || maxYear || minEngineHours || maxEngineHours || minPower || maxPower || 
    acceptsTradeDown || acceptsGrains || isVerifiedSeller;

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
        {/* Filtros Básicos */}
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

        {/* Toggle Filtros Avançados */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="mb-4"
        >
          {showAdvanced ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Ocultar filtros avançados
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              Mostrar filtros avançados
            </>
          )}
        </Button>

        {/* Filtros Avançados */}
        {showAdvanced && (
          <div className="border-t pt-4 space-y-4">
            {/* Faixa de Preço */}
            <div>
              <label className="text-sm font-medium mb-2 block">Faixa de Preço (R$)</label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Mínimo"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Máximo"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Faixa de Ano */}
            <div>
              <label className="text-sm font-medium mb-2 block">Ano do Modelo</label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="De (ex: 2015)"
                  value={minYear}
                  onChange={(e) => setMinYear(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Até (ex: 2024)"
                  value={maxYear}
                  onChange={(e) => setMaxYear(e.target.value)}
                />
              </div>
            </div>

            {/* Faixa de Horas de Motor - CAMPO DE OURO */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                ⭐ Horas de Motor
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Mínimo (ex: 0)"
                  value={minEngineHours}
                  onChange={(e) => setMinEngineHours(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Máximo (ex: 5000)"
                  value={maxEngineHours}
                  onChange={(e) => setMaxEngineHours(e.target.value)}
                />
              </div>
            </div>

            {/* Faixa de Potência */}
            <div>
              <label className="text-sm font-medium mb-2 block">Potência (cv)</label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Mínimo (ex: 75)"
                  value={minPower}
                  onChange={(e) => setMinPower(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Máximo (ex: 200)"
                  value={maxPower}
                  onChange={(e) => setMaxPower(e.target.value)}
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div>
              <label className="text-sm font-medium mb-2 block">Opções de Negociação</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptsTradeDown}
                    onChange={(e) => setAcceptsTradeDown(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Aceita troca</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptsGrains}
                    onChange={(e) => setAcceptsGrains(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Aceita grãos como pagamento</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVerifiedSeller}
                    onChange={(e) => setIsVerifiedSeller(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Apenas vendedores verificados</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={handleClearFilters} className="mt-4">
            Limpar todos os filtros
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
