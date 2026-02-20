import axios from 'axios';
import { Proposal, CreateProposalData, CounterProposalData } from '@/types/proposal';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  withCredentials: true, // Enviar cookies automaticamente
  headers: {
    'Content-Type': 'application/json',
  },
});

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Remover interceptor que redireciona em 401
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('currentUser');
//       localStorage.removeItem('token');
//       if (typeof window !== 'undefined') {
//         window.location.href = '/login';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export const proposalsService = {
  // Criar proposta
  create: async (data: CreateProposalData): Promise<Proposal> => {
    if (USE_MOCK) {
      await delay(300);
      return {} as Proposal;
    }
    const { data: proposal } = await api.post<Proposal>('/proposals', data);
    return proposal;
  },

  // Listar propostas
  getAll: async (type: 'sent' | 'received' = 'received'): Promise<Proposal[]> => {
    if (USE_MOCK) {
      await delay(300);
      return [];
    }
    const { data } = await api.get<Proposal[]>(`/proposals?type=${type}`);
    return data;
  },

  // Marcar como vista
  markAsViewed: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(100);
      return;
    }
    await api.patch(`/proposals/${id}/view`);
  },

  // Aceitar proposta
  accept: async (id: string): Promise<Proposal> => {
    if (USE_MOCK) {
      await delay(300);
      return {} as Proposal;
    }
    const { data } = await api.patch<Proposal>(`/proposals/${id}/accept`);
    return data;
  },

  // Recusar proposta
  reject: async (id: string): Promise<Proposal> => {
    if (USE_MOCK) {
      await delay(300);
      return {} as Proposal;
    }
    const { data } = await api.patch<Proposal>(`/proposals/${id}/reject`);
    return data;
  },

  // Contra-proposta
  counter: async (id: string, data: CounterProposalData): Promise<Proposal> => {
    if (USE_MOCK) {
      await delay(300);
      return {} as Proposal;
    }
    const { data: proposal } = await api.patch<Proposal>(`/proposals/${id}/counter`, data);
    return proposal;
  },

  // Cancelar proposta
  cancel: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(300);
      return;
    }
    await api.delete(`/proposals/${id}`);
  },
};
