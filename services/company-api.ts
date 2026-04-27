import { Company } from '@/types';
import { Machine } from '@/types/machine';
import { httpClient } from '@/lib/http-client';

const api = httpClient;

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
