'use client';

import { useState, useEffect, useRef } from 'react';
import { useInfiniteMachines } from '@/hooks/use-infinite-machines';
import { MachineCard } from '@/components/machine-card';
import { MachineSkeletonGrid } from '@/components/machine-skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MachineFilters } from '@/types/machine';
import { analytics } from '@/lib/analytics';
import { Search, Loader2, Filter, ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import { CATEGORIES, BUSINESS_TYPES, STATES_SUL, CULTURES } from '@/lib/constants';
import { WebsiteSchema } from '@/components/structured-data';
import { FAQSchema } from '@/components/faq-schema';

type SortOption = 'recent' | 'price-asc' | 'price-desc' | 'hours-asc' | 'year-desc';

const getSortByParam = (sort: SortOption): string => {
  const mapping: Record<SortOption, string> = {
    'recent': 'created_desc',
    'price-asc': 'price_asc',
    'price-desc': 'price_desc',
    'hours-asc': 'engine_hours_asc',
    'year-desc': 'year_desc'
  };
  return mapping[sort];
};

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [state, setState] = useState('');
  const [category, setCategory] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [selectedCulture, setSelectedCulture] = useState('');
  
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
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteMachines({ ...filters, sortBy: getSortByParam(sortBy) });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allMachines = data?.pages.flatMap(page => page.data) || [];
  const totalMachines = data?.pages[0]?.meta.total || 0;

  useEffect(() => {
    setFilters(prev => ({ ...prev, sortBy: getSortByParam(sortBy) }));
  }, [sortBy]);

  const handleSearch = () => {
    const newFilters: MachineFilters = {
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
    };
    
    setFilters(newFilters);
    
    if (search) analytics.trackSearch(search);
    if (category) analytics.trackFilterUsed('category', category);
    if (state) analytics.trackFilterUsed('state', state);
    if (businessType) analytics.trackFilterUsed('businessType', businessType);
    if (minPrice || maxPrice) analytics.trackFilterUsed('price', `${minPrice || 0}-${maxPrice || 'max'}`);
  };

  const handleCultureFilter = (culture: string) => {
    setSelectedCulture(culture);
    
    let categoryFilter = '';
    let searchTerm = '';
    
    switch (culture) {
      case 'Arroz':
        categoryFilter = 'TRACTORS';
        searchTerm = 'arroz';
        break;
      case 'Soja':
        categoryFilter = 'TRACTORS';
        searchTerm = 'soja';
        break;
      case 'Milho':
        categoryFilter = 'HARVESTERS';
        searchTerm = 'milho';
        break;
      case 'Pecuária Leiteira':
      case 'Pecuária de Corte':
        categoryFilter = 'HAYMAKING';
        break;
      default:
        break;
    }
    
    setCategory(categoryFilter);
    setSearch(searchTerm);
    setFilters({
      category: categoryFilter as any || undefined,
      search: searchTerm || undefined,
    });
    
    analytics.trackFilterUsed('culture', culture);
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
    setSelectedCulture('');
    setFilters({});
    setSortBy('recent');
  };

  const hasActiveFilters = search || state || category || businessType || minPrice || maxPrice || 
    minYear || maxYear || minEngineHours || maxEngineHours || minPower || maxPower || 
    acceptsTradeDown || acceptsGrains || isVerifiedSeller || selectedCulture;

  return (
    <>
      <WebsiteSchema />
      <FAQSchema />
      <div className="container mx-auto px-4 py-2 md:py-4 max-w-[1920px]">
        <div className="mb-4 md:mb-6">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">
            <span style={{ color: '#B81212' }}>baita</span>
            <span style={{ color: '#11813F' }}>briq</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Compre, venda ou troca máquinas agrícolas e de construção
          </p>
        </div>

        <div className="mb-4 md:mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs md:text-sm font-medium">🌾 Filtro por Cultura:</span>
            <Badge variant="secondary" className="text-xs">Diferencial do Sul</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {CULTURES.map((culture) => (
              <Button
                key={culture}
                variant={selectedCulture === culture ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCultureFilter(culture)}
                className="text-xs md:text-sm"
              >
                {culture}
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4 md:p-6 mb-6 md:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 mb-4">
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

            <Button onClick={handleSearch} className="w-full md:col-span-2 lg:col-span-1">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </div>

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

          {showAdvanced && (
            <div className="border-t pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Faixa de Preço (R$)</label>
                  <div className="grid grid-cols-2 gap-2">
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

                <div>
                  <label className="text-sm font-medium mb-2 block">Ano do Modelo</label>
                  <div className="grid grid-cols-2 gap-2">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    ⭐ Horas de Motor
                  </label>
                  <div className="grid grid-cols-2 gap-2">
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

                <div>
                  <label className="text-sm font-medium mb-2 block">Potência (cv)</label>
                  <div className="grid grid-cols-2 gap-2">
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
              </div>

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

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="text-sm text-muted-foreground">
            {isLoading ? (
              'Carregando...'
            ) : (
              <>
                <span className="font-semibold text-foreground">{totalMachines}</span> máquinas encontradas
                {selectedCulture && <span className="ml-2">para <strong>{selectedCulture}</strong></span>}
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full sm:w-auto"
            >
              <option value="recent">Mais recentes</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="hours-asc">Menos horas de uso</option>
              <option value="year-desc">Mais novos (ano)</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <MachineSkeletonGrid count={6} />
        ) : allMachines.length > 0 ? (
          <>
            {/* Grid com altura fixa otimizada */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
              {allMachines.map((machine) => (
                <MachineCard key={machine.id} machine={machine} />
              ))}
            </div>

            <div ref={loadMoreRef} className="pt-4 pb-2 flex justify-center">
              {isFetchingNextPage && (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Carregando mais máquinas...</p>
                </div>
              )}
              {!hasNextPage && allMachines.length > 0 && (
                <p className="text-sm text-muted-foreground">Você viu todas as máquinas disponíveis</p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-muted rounded-lg">
            <p className="text-lg font-semibold mb-2">Nenhuma máquina encontrada</p>
            <p className="text-muted-foreground mb-4">
              Tente ajustar os filtros ou limpar a busca
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={handleClearFilters}>
                Limpar filtros
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
}