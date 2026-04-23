import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CATEGORIES } from '@/lib/constants';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
});

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  order: number;
  isActive: boolean;
  machineCount?: number;
}

async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get('/categories');
  return data;
}

const FALLBACK_CATEGORIES: Category[] = Object.entries(CATEGORIES).map(([key, name], index) => ({
  id: key,
  name,
  slug: name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  icon: key,
  order: index + 1,
  isActive: true,
}));

export function useCategories() {
  const query = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });

  const categories = query.data && query.data.length > 0 ? query.data : FALLBACK_CATEGORIES;

  // Mapa key → label pra compatibilidade (usa icon como key se for KEY, senão usa slug)
  const categoriesMap: Record<string, string> = {};
  categories.forEach(cat => {
    // Se icon é URL, usar o slug/name como key alternativa
    const key = cat.icon.startsWith('http') ? cat.slug.toUpperCase().replace(/-/g, '_') : cat.icon;
    categoriesMap[key] = cat.name;
  });

  // Mapa key → URL da imagem
  const iconsMap: Record<string, string> = {};
  categories.forEach(cat => {
    const key = cat.icon.startsWith('http') ? cat.slug.toUpperCase().replace(/-/g, '_') : cat.icon;
    iconsMap[key] = cat.icon;
  });

  return {
    categories,
    categoriesMap,
    iconsMap,
    isLoading: query.isLoading,
  };
}
