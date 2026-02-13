import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Machine, MachineFilters } from '@/types/machine';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const { token } = JSON.parse(user);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});

interface MachinesPageResponse {
  data: Machine[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function useInfiniteMachines(filters?: MachineFilters) {
  return useInfiniteQuery({
    queryKey: ['machines-infinite', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<MachinesPageResponse>('/machines', {
        params: {
          ...filters,
          page: pageParam,
          limit: 20,
        },
      });
      return data;
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
