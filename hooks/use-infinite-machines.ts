import { useInfiniteQuery } from '@tanstack/react-query';
import { httpClient } from '@/lib/http-client';
import { Machine, MachineFilters } from '@/types/machine';

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
      const { data } = await httpClient.get<MachinesPageResponse>('/machines', {
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
    staleTime: 1000 * 60,
  });
}
