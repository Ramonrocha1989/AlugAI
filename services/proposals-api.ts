import axios from 'axios';
import { Proposal, CreateProposalData, CounterProposalData } from '@/types/proposal';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const parsed = JSON.parse(stored);
      const token = parsed.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});

export const proposalsService = {
  // Criar proposta
  create: async (data: CreateProposalData): Promise<Proposal> => {
    const { data: proposal } = await api.post<Proposal>('/proposals', data);
    return proposal;
  },

  // Listar propostas
  getAll: async (type: 'sent' | 'received' = 'received'): Promise<Proposal[]> => {
    const { data } = await api.get<Proposal[]>(`/proposals?type=${type}`);
    return data;
  },

  // Marcar como vista
  markAsViewed: async (id: string): Promise<void> => {
    await api.patch(`/proposals/${id}/view`);
  },

  // Aceitar proposta
  accept: async (id: string): Promise<Proposal> => {
    const { data } = await api.patch<Proposal>(`/proposals/${id}/accept`);
    return data;
  },

  // Recusar proposta
  reject: async (id: string): Promise<Proposal> => {
    const { data } = await api.patch<Proposal>(`/proposals/${id}/reject`);
    return data;
  },

  // Contra-proposta
  counter: async (id: string, data: CounterProposalData): Promise<Proposal> => {
    const { data: proposal } = await api.patch<Proposal>(`/proposals/${id}/counter`, data);
    return proposal;
  },

  // Cancelar proposta
  cancel: async (id: string): Promise<void> => {
    await api.delete(`/proposals/${id}`);
  },
};
