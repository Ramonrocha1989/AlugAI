import axios from 'axios';
import { Machine } from '@/types/machine';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock storage para favoritos
const getFavorites = (): string[] => {
  if (typeof window === 'undefined') return [];
  const user = localStorage.getItem('currentUser');
  if (!user) return [];
  const { id } = JSON.parse(user);
  const stored = localStorage.getItem(`favorites_${id}`);
  return stored ? JSON.parse(stored) : [];
};

const saveFavorites = (favorites: string[]) => {
  if (typeof window === 'undefined') return;
  const user = localStorage.getItem('currentUser');
  if (!user) return;
  const { id } = JSON.parse(user);
  localStorage.setItem(`favorites_${id}`, JSON.stringify(favorites));
};

interface FavoriteResponse {
  id: string;
  createdAt: string;
  machine: Machine;
}

export const favoritesService = {
  // Adicionar favorito
  add: async (machineId: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(300);
      const favorites = getFavorites();
      if (!favorites.includes(machineId)) {
        favorites.push(machineId);
        saveFavorites(favorites);
      }
      return;
    }
    
    await api.post('/favorites', { machineId });
  },

  // Remover favorito
  remove: async (machineId: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(300);
      const favorites = getFavorites();
      const filtered = favorites.filter(id => id !== machineId);
      saveFavorites(filtered);
      return;
    }
    
    await api.delete(`/favorites/${machineId}`);
  },

  // Listar favoritos com dados completos das máquinas
  listWithMachines: async (): Promise<Machine[]> => {
    if (USE_MOCK) {
      await delay(300);
      return [];
    }
    
    const { data } = await api.get<FavoriteResponse[]>('/favorites');
    return data.map(fav => fav.machine);
  },

  // Listar apenas IDs dos favoritos
  list: async (): Promise<string[]> => {
    if (USE_MOCK) {
      await delay(300);
      return getFavorites();
    }
    
    const { data } = await api.get<FavoriteResponse[]>('/favorites');
    return data.map(fav => fav.machine.id);
  },

  // Verificar se está favoritado
  isFavorited: async (machineId: string): Promise<boolean> => {
    if (USE_MOCK) {
      await delay(100);
      const favorites = getFavorites();
      return favorites.includes(machineId);
    }
    
    const { data } = await api.get<{ isFavorited: boolean }>(`/favorites/check/${machineId}`);
    return data.isFavorited;
  },
};
