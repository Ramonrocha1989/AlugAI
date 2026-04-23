import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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

export function useCategories() {
  const query = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });

  const categories = query.data || [];

  // Mapa slug → label
  const categoriesMap: Record<string, string> = {};
  categories.forEach(cat => {
    categoriesMap[cat.slug] = cat.name;
  });

  // Mapa slug → URL da imagem
  const iconsMap: Record<string, string> = {};
  categories.forEach(cat => {
    iconsMap[cat.slug] = cat.icon;
  });

  return {
    categories,
    categoriesMap,
    iconsMap,
    isLoading: query.isLoading,
  };
}
