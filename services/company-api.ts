import axios from 'axios';
import { Company } from '@/types';
import { Machine } from '@/types/machine';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const companyService = {
  getCompany: async (id: string): Promise<Company> => {
    const { data } = await api.get<Company>(`/companies/${id}`);
    return data;
  },

  getCompanyMachines: async (companyId: string): Promise<Machine[]> => {
    const { data } = await api.get(`/companies/${companyId}/machines`);
    return data;
  },
};
