import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { proposalsService } from '@/services/proposals-api';
import { CreateProposalData, CounterProposalData } from '@/types/proposal';
import { useAuthReady } from './use-auth-ready';

type ProposalsQueryOpts = { enabled?: boolean };

// Hook para listar propostas recebidas
export function useReceivedProposals(opts?: ProposalsQueryOpts) {
  const { isAuthenticated, isBootstrapping } = useAuthReady();
  const allowFetch = opts?.enabled !== false;

  return useQuery({
    queryKey: ['proposals', 'received'],
    queryFn: () => proposalsService.getAll('received'),
    enabled: isAuthenticated && !isBootstrapping && allowFetch,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

// Hook para listar propostas enviadas
export function useSentProposals(opts?: ProposalsQueryOpts) {
  const { isAuthenticated, isBootstrapping } = useAuthReady();
  const allowFetch = opts?.enabled !== false;

  return useQuery({
    queryKey: ['proposals', 'sent'],
    queryFn: () => proposalsService.getAll('sent'),
    enabled: isAuthenticated && !isBootstrapping && allowFetch,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

// Hook para criar proposta
export function useCreateProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProposalData) => proposalsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals', 'sent'] });
    },
  });
}

// Hook para aceitar proposta
export function useAcceptProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => proposalsService.accept(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    },
  });
}

// Hook para recusar proposta
export function useRejectProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => proposalsService.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    },
  });
}

// Hook para contra-proposta
export function useCounterProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CounterProposalData }) =>
      proposalsService.counter(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    },
  });
}

// Hook para cancelar proposta
export function useCancelProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => proposalsService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals', 'sent'] });
    },
  });
}
