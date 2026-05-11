'use client';

import { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { useInfiniteMachines } from '@/hooks/use-infinite-machines';
import { MachineCard } from '@/components/machine-card';
import { MachineSkeletonGrid } from '@/components/machine-skeleton';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MachineFilters } from '@/types/machine';
import { analytics } from '@/lib/analytics';
import axios from 'axios';
import { Search, Loader2, Filter, ChevronDown, ChevronUp, ArrowUpDown, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BUSINESS_TYPES, STATES_SUL, CULTURES } from '@/lib/constants';
import { useCategories } from '@/hooks/use-categories';
import { WebsiteSchema } from '@/components/structured-data';
import { FAQSchema } from '@/components/faq-schema';
import { BannerCarousel } from '@/components/banner-carousel';
import { parseMachineSearchBox } from '@/lib/machine-search-query';
import { shouldMirrorFreeSearchToCity } from '@/lib/mirror-free-search-to-city';

type SortOption = 'recent' | 'price-asc' | 'price-desc' | 'hours-asc' | 'year-desc';

/** Inputs no hero herdam text-white do bloco; forçar texto escuro no fundo branco. */
const heroFieldClass =
  'bg-white border-white/80 text-neutral-900 placeholder:text-neutral-500 shadow-sm focus-visible:ring-offset-0';

function getMachinesListErrorMessage(err: unknown): string {
  if (!axios.isAxiosError(err)) {
    return 'Não foi possível carregar as máquinas.';
  }
  const data = err.response?.data;
  if (data && typeof data === 'object') {
    const raw = (data as Record<string, unknown>).message;
    if (Array.isArray(raw)) return raw.map(String).join(' ');
    if (typeof raw === 'string' && raw.trim()) return raw;
  }
  if (err.response?.status === 400) {
    return 'Algum filtro está inválido (por exemplo, categoria inativa ou slug incorreto). Ajuste os filtros e tente de novo.';
  }
  return 'Não foi possível carregar as máquinas.';
}

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
  const { categoriesMap } = useCategories();
  const [search, setSearch] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [selectedCulture, setSelectedCulture] = useState('');
  
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [minEngineHours, setMinEngineHours] = useState('');
  const [maxEngineHours, setMaxEngineHours] = useState('');
  const [minPower, setMinPower] = useState('');
  const [maxPower, setMaxPower] = useState('');
  const [acceptsTradeDown, setAcceptsTradeDown] = useState(false);
  const [acceptsGrains, setAcceptsGrains] = useState(false);
  const [acceptsFinancing, setAcceptsFinancing] = useState(false);
  const [isVerifiedSeller, setIsVerifiedSeller] = useState(false);

  /** Valor de busca enviado à API (com debounce; Enter aplica na hora). */
  const [appliedSearch, setAppliedSearch] = useState('');
  const loadMoreRef = useRef<HTMLDivElement>(null);

  /** Tamanho base da fonte (px) na faixa de chips; encolhe para caber na largura sem cortar. */
  const chipToolbarOuterRef = useRef<HTMLDivElement>(null);
  const chipToolbarInnerRef = useRef<HTMLDivElement>(null);
  const [chipToolbarFontPx, setChipToolbarFontPx] = useState(13);
  const categoryChips = useMemo(() => Object.entries(categoriesMap).slice(0, 6), [categoriesMap]);
  const categoryKeysSig = useMemo(() => categoryChips.map(([k]) => k).join(','), [categoryChips]);

  const hasActiveFilters = useMemo(
    () =>
      !!(
        search ||
        state ||
        city ||
        category ||
        businessType ||
        minPrice ||
        maxPrice ||
        minYear ||
        maxYear ||
        minEngineHours ||
        maxEngineHours ||
        minPower ||
        maxPower ||
        acceptsTradeDown ||
        acceptsGrains ||
        acceptsFinancing ||
        isVerifiedSeller ||
        selectedCulture
      ),
    [
      search,
      state,
      city,
      category,
      businessType,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      minEngineHours,
      maxEngineHours,
      minPower,
      maxPower,
      acceptsTradeDown,
      acceptsGrains,
      acceptsFinancing,
      isVerifiedSeller,
      selectedCulture,
    ]
  );

  useLayoutEffect(() => {
    const outer = chipToolbarOuterRef.current;
    const inner = chipToolbarInnerRef.current;
    if (!outer || !inner) return;

    const BASE = 13;
    const MIN = 9;

    const fit = () => {
      const avail = outer.clientWidth;
      if (avail <= 0) return;
      const needed = inner.scrollWidth;
      if (!needed) return;
      if (needed <= avail) {
        setChipToolbarFontPx(BASE);
        return;
      }
      const next = Math.max(MIN, Math.min(BASE, Math.floor((BASE * avail) / needed)));
      setChipToolbarFontPx(next);
      requestAnimationFrame(() => {
        if (inner.scrollWidth > avail && inner.scrollWidth > 0) {
          const refined = Math.max(MIN, Math.floor((next * avail) / inner.scrollWidth));
          if (refined < next) setChipToolbarFontPx(refined);
        }
      });
    };

    fit();
    const ro = new ResizeObserver(() => requestAnimationFrame(fit));
    ro.observe(outer);
    return () => ro.disconnect();
  }, [categoryKeysSig, showAdvanced, hasActiveFilters, category]);

  useEffect(() => {
    const id = window.setTimeout(() => setAppliedSearch(search.trim()), 300);
    return () => window.clearTimeout(id);
  }, [search]);

  const parsedSearchBox = useMemo(
    () => parseMachineSearchBox(appliedSearch),
    [appliedSearch]
  );

  const machineQueryFilters = useMemo<MachineFilters>(
    () => {
      const freeSearch = parsedSearchBox.search;
      const cityFromAdvanced = city.trim() || undefined;
      const mirrorCityOnly =
        !cityFromAdvanced &&
        !!freeSearch &&
        shouldMirrorFreeSearchToCity(freeSearch);

      return {
      search: mirrorCityOnly ? undefined : freeSearch,
      state: parsedSearchBox.stateFromSearch || state || undefined,
      city: cityFromAdvanced || (mirrorCityOnly ? freeSearch : undefined),
      category: (category || undefined) as MachineFilters['category'],
      businessType: (businessType || undefined) as MachineFilters['businessType'],
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      minYear: minYear ? Number(minYear) : undefined,
      maxYear: maxYear ? Number(maxYear) : undefined,
      minEngineHours: minEngineHours ? Number(minEngineHours) : undefined,
      maxEngineHours: maxEngineHours ? Number(maxEngineHours) : undefined,
      minPower: minPower ? Number(minPower) : undefined,
      maxPower: maxPower ? Number(maxPower) : undefined,
      acceptsTradeDown: acceptsTradeDown || undefined,
      acceptsGrains: acceptsGrains || undefined,
      acceptsFinancing: acceptsFinancing || undefined,
      isVerifiedSeller: isVerifiedSeller || undefined,
      sortBy: getSortByParam(sortBy),
    };
    },
    [
      parsedSearchBox,
      state,
      city,
      category,
      businessType,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      minEngineHours,
      maxEngineHours,
      minPower,
      maxPower,
      acceptsTradeDown,
      acceptsGrains,
      acceptsFinancing,
      isVerifiedSeller,
      sortBy,
    ]
  );

  const { 
    data, 
    isLoading, 
    isError,
    error,
    refetch,
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteMachines(machineQueryFilters);

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

  const lastTrackedSearch = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (appliedSearch && appliedSearch !== lastTrackedSearch.current) {
      analytics.trackSearch(appliedSearch);
    }
    lastTrackedSearch.current = appliedSearch || undefined;
  }, [appliedSearch]);

  const handleCultureFilter = (culture: string) => {
    setSelectedCulture(culture);
    
    let categoryFilter = '';
    let searchTerm = '';
    
    switch (culture) {
      case 'Arroz':
        categoryFilter = 'tratores';
        searchTerm = 'arroz';
        break;
      case 'Soja':
        categoryFilter = 'tratores';
        searchTerm = 'soja';
        break;
      case 'Milho':
        categoryFilter = 'colheitadeiras';
        searchTerm = 'milho';
        break;
      case 'Pecuária Leiteira':
      case 'Pecuária de Corte':
        categoryFilter = 'fenacao-e-silagem';
        break;
      default:
        break;
    }
    
    setCategory(categoryFilter);
    setSearch(searchTerm);
    setAppliedSearch(searchTerm.trim());

    analytics.trackFilterUsed('culture', culture);
  };

  const handleClearFilters = () => {
    setSearch('');
    setState('');
    setCity('');
    setCategory('');
    setBusinessType('');
    setMinPrice(0);
    setMaxPrice(0);
    setMinYear('');
    setMaxYear('');
    setMinEngineHours('');
    setMaxEngineHours('');
    setMinPower('');
    setMaxPower('');
    setAcceptsTradeDown(false);
    setAcceptsGrains(false);
    setAcceptsFinancing(false);
    setIsVerifiedSeller(false);
    setSelectedCulture('');
    setAppliedSearch('');
    setSortBy('recent');
  };

  return (
    <>
      <WebsiteSchema />
      <FAQSchema />
      <div className="container mx-auto px-4 pt-0 md:pt-0 pb-2 md:pb-4 max-w-[1920px] md:-mt-24">
        <BannerCarousel />

        {/* Botão para expandir filtros no mobile */}
        <div className="md:hidden mb-4">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {/* Filtros - sempre visíveis no desktop, colapsáveis no mobile */}
        <div
          className={`${showFilters ? 'block' : 'hidden'} md:block relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen border rounded-none p-6 md:p-10 mb-8 md:mb-10 md:min-h-[420px] md:flex md:items-start`}
          style={{
            backgroundImage:
              "linear-gradient(rgba(6,22,33,0.72), rgba(6,22,33,0.58)), url('/hero-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="max-w-6xl mx-auto w-full pt-20 md:pt-20">
            <div className="text-center mb-5 md:mb-6">
              <h1 className="text-white font-bold text-2xl md:text-4xl leading-tight max-w-4xl mx-auto">
                As melhores oportunidades em máquinas agrícolas e pesadas, em um só lugar
              </h1>
            </div>

            <div className="space-y-4 mb-4">
              <div className="relative max-w-3xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Cidade, UF, modelo, marca ou descrição (cidade também na busca livre)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`pl-12 h-12 text-base rounded-lg shadow-md ${heroFieldClass}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      setAppliedSearch(search.trim());
                    }
                  }}
                />
              </div>

              <div
                ref={chipToolbarOuterRef}
                className="w-full max-w-5xl mx-auto min-w-0 overflow-visible px-0.5"
              >
                <div
                  ref={chipToolbarInnerRef}
                  role="toolbar"
                  aria-label="Filtros rápidos"
                  style={{ fontSize: `${chipToolbarFontPx}px` }}
                  className="mx-auto flex w-max max-w-full flex-nowrap items-center justify-center gap-x-[0.45em] py-0.5"
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    aria-expanded={showAdvanced}
                    className={
                      showAdvanced
                        ? 'inline-flex h-[2.12em] min-h-[26px] shrink-0 items-center justify-center gap-x-[0.35em] whitespace-nowrap rounded-md border px-[0.55em] py-0 text-[1em] leading-tight bg-white/15 border-white/55 text-white hover:bg-white/25 hover:text-white'
                        : 'inline-flex h-[2.12em] min-h-[26px] shrink-0 items-center justify-center gap-x-[0.35em] whitespace-nowrap rounded-md border px-[0.55em] py-0 text-[1em] leading-tight bg-black/35 border-dashed border-white/50 text-white hover:bg-black/50 hover:text-white'
                    }
                  >
                    {showAdvanced ? (
                      <>
                        <ChevronUp className="h-[1.1em] w-[1.1em] shrink-0" />
                        <span className="hidden min-[420px]:inline">Ocultar filtros avançados</span>
                        <span className="min-[420px]:hidden">Menos</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-[1.1em] w-[1.1em] shrink-0" />
                        <span className="hidden min-[420px]:inline">Filtros avançados</span>
                        <span className="min-[420px]:hidden">Filtros</span>
                      </>
                    )}
                  </Button>

                  {hasActiveFilters && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleClearFilters}
                      className="inline-flex h-[2.12em] min-h-[26px] shrink-0 items-center justify-center whitespace-nowrap rounded-md border px-[0.55em] py-0 text-[1em] leading-tight text-white border-white/50 bg-black/20 hover:bg-black/35 hover:text-white"
                    >
                      <span className="hidden min-[380px]:inline">Limpar filtros</span>
                      <span className="inline min-[380px]:hidden">Limpar</span>
                    </Button>
                  )}

                  <span
                    className="mx-[0.2em] hidden h-[1.35em] w-px shrink-0 self-center bg-white/25 sm:block"
                    aria-hidden={true}
                  />

                  {categoryChips.map(([key, label]) => (
                    <Button
                      key={key}
                      type="button"
                      size="sm"
                      variant={category === key ? 'default' : 'outline'}
                      onClick={() => setCategory(key)}
                      className={
                        category === key
                          ? 'inline-flex h-[2.12em] min-h-[26px] shrink-0 items-center justify-center whitespace-nowrap rounded-md border px-[0.55em] py-0 text-[1em] leading-tight'
                          : 'inline-flex h-[2.12em] min-h-[26px] shrink-0 items-center justify-center whitespace-nowrap rounded-md border px-[0.55em] py-0 text-[1em] leading-tight bg-black/35 border-white/45 text-white hover:bg-black/50 hover:text-white'
                      }
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {showAdvanced && (
              <div className="border-t border-white/30 pt-4 space-y-4 text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="filter-category" className="text-sm font-medium mb-2 block text-white">
                    Categoria
                  </label>
                  <select
                    id="filter-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`flex h-11 w-full rounded-lg px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${heroFieldClass}`}
                  >
                    <option value="">Todas as categorias</option>
                    {Object.entries(categoriesMap).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="filter-business-type" className="text-sm font-medium mb-2 block text-white">
                    Tipo
                  </label>
                  <select
                    id="filter-business-type"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className={`flex h-11 w-full rounded-lg px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${heroFieldClass}`}
                  >
                    <option value="">Todos os tipos</option>
                    {Object.entries(BUSINESS_TYPES).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="filter-state" className="text-sm font-medium mb-2 block text-white">
                    Estado
                  </label>
                  <select
                    id="filter-state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className={`flex h-11 w-full rounded-lg px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${heroFieldClass}`}
                  >
                    <option value="">Todos os estados</option>
                    {STATES_SUL.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="filter-city" className="text-sm font-medium mb-2 block text-white">
                    Cidade
                  </label>
                  <Input
                    id="filter-city"
                    placeholder="Ex.: Pelotas"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={`h-11 rounded-lg ${heroFieldClass}`}
                  />
                  <p className="text-xs text-white/70 mt-1.5">
                    Filtro por cidade do anúncio. Se a busca principal não achar, use este campo.
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs md:text-sm font-medium text-white">🌾 Filtro por Cultura:</span>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-white">Faixa de Preço</label>
                  <div className="grid grid-cols-2 gap-2">
                    <CurrencyInput
                      placeholder="Mínimo"
                      value={minPrice}
                      onChange={(v) => setMinPrice(v)}
                      className={`h-11 rounded-lg ${heroFieldClass}`}
                    />
                    <CurrencyInput
                      placeholder="Máximo"
                      value={maxPrice}
                      onChange={(v) => setMaxPrice(v)}
                      className={`h-11 rounded-lg ${heroFieldClass}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-white">Ano do Modelo</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="De (ex: 2015)"
                      value={minYear}
                      onChange={(e) => setMinYear(e.target.value)}
                      className={`h-11 rounded-lg ${heroFieldClass}`}
                    />
                    <Input
                      type="number"
                      placeholder="Até (ex: 2024)"
                      value={maxYear}
                      onChange={(e) => setMaxYear(e.target.value)}
                      className={`h-11 rounded-lg ${heroFieldClass}`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-white">
                    ⭐ Horas de Motor
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Mínimo (ex: 0)"
                      value={minEngineHours}
                      onChange={(e) => setMinEngineHours(e.target.value)}
                      className={`h-11 rounded-lg ${heroFieldClass}`}
                    />
                    <Input
                      type="number"
                      placeholder="Máximo (ex: 5000)"
                      value={maxEngineHours}
                      onChange={(e) => setMaxEngineHours(e.target.value)}
                      className={`h-11 rounded-lg ${heroFieldClass}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-white">Potência (cv)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Mínimo (ex: 75)"
                      value={minPower}
                      onChange={(e) => setMinPower(e.target.value)}
                      className={`h-11 rounded-lg ${heroFieldClass}`}
                    />
                    <Input
                      type="number"
                      placeholder="Máximo (ex: 200)"
                      value={maxPower}
                      onChange={(e) => setMaxPower(e.target.value)}
                      className={`h-11 rounded-lg ${heroFieldClass}`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block text-white">Opções de Negociação</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-white">
                    <input
                      type="checkbox"
                      checked={acceptsTradeDown}
                      onChange={(e) => setAcceptsTradeDown(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-white">Aceita troca</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-white">
                    <input
                      type="checkbox"
                      checked={acceptsGrains}
                      onChange={(e) => setAcceptsGrains(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-white">Aceita grãos como pagamento</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-white">
                    <input
                      type="checkbox"
                      checked={acceptsFinancing}
                      onChange={(e) => setAcceptsFinancing(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-white">Aceita financiamento</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-white">
                    <input
                      type="checkbox"
                      checked={isVerifiedSeller}
                      onChange={(e) => setIsVerifiedSeller(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-white">Apenas vendedores verificados</span>
                  </label>
                </div>
              </div>
              </div>
            )}

          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="text-sm text-muted-foreground">
            {isLoading ? (
              'Carregando...'
            ) : isError ? (
              'Não foi possível carregar o total.'
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
              <option value="recent">Destaques e mais recentes</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="hours-asc">Menos horas de uso</option>
              <option value="year-desc">Mais novos (ano)</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <MachineSkeletonGrid count={6} />
        ) : isError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro ao buscar máquinas</AlertTitle>
            <AlertDescription className="flex flex-col gap-3">
              <p>{getMachinesListErrorMessage(error)}</p>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
                  Tentar novamente
                </Button>
                {hasActiveFilters && (
                  <Button type="button" variant="outline" size="sm" onClick={handleClearFilters}>
                    Limpar filtros
                  </Button>
                )}
              </div>
            </AlertDescription>
          </Alert>
        ) : allMachines.length > 0 ? (
          <>
            {/* Grid com altura fixa otimizada */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
              {allMachines.map((machine, index) => (
                <MachineCard key={machine.id} machine={machine} priority={index === 0} />
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