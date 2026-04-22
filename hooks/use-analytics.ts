import { useQuery } from '@tanstack/react-query';
import { AnalyticsSummary, CategoryBenchmarks, MachineCategory } from '@/types/machine';
import { apiRequest } from '@/lib/api-refresh';

export function useAnalyticsSummary() {
  const isAuthenticated = typeof window !== 'undefined' && !!localStorage.getItem('currentUser');

  return useQuery<AnalyticsSummary>({
    queryKey: ['analytics-summary'],
    queryFn: () => apiRequest('/analytics/summary', { method: 'GET' }),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useCategoryBenchmarks(category: MachineCategory | undefined) {
  const isAuthenticated = typeof window !== 'undefined' && !!localStorage.getItem('currentUser');

  return useQuery<CategoryBenchmarks>({
    queryKey: ['category-benchmarks', category],
    queryFn: () => apiRequest(`/analytics/category-benchmarks?category=${category}`, { method: 'GET' }),
    enabled: isAuthenticated && !!category,
    staleTime: 1000 * 60 * 10,
    retry: false,
  });
}
