import { httpClient } from '@/lib/http-client';

const api = httpClient;

export const adminService = {
  getStats: async () => {
    const { data } = await api.get('/admin/stats');
    return data;
  },

  getUsers: async (params: { page?: number; limit?: number; search?: string; plan?: string; status?: string; userType?: string }) => {
    const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== '' && v !== undefined));
    const { data } = await api.get('/admin/users', { params: cleanParams });
    return data;
  },

  banUser: async (id: string, isBanned: boolean) => {
    const { data } = await api.patch(`/admin/users/${id}/ban`, { isBanned });
    return data;
  },

  verifyUser: async (id: string, isVerifiedSeller: boolean) => {
    const { data } = await api.patch(`/admin/users/${id}/verify`, { isVerifiedSeller });
    return data;
  },

  updateUserPlan: async (id: string, plan: string, expiresAt: string | null) => {
    const { data } = await api.patch(`/admin/users/${id}/plan`, { plan, expiresAt });
    return data;
  },

  getMachines: async (params: { page?: number; limit?: number; status?: string; search?: string }) => {
    const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== '' && v !== undefined));
    const { data } = await api.get('/admin/machines', { params: cleanParams });
    return data;
  },

  updateMachineStatus: async (id: string, status: string) => {
    const { data } = await api.patch(`/admin/machines/${id}/status`, { status });
    return data;
  },

  featureMachine: async (id: string, isFeatured: boolean) => {
    const { data } = await api.patch(`/admin/machines/${id}/feature`, { isFeatured });
    return data;
  },

  deleteMachine: async (id: string) => {
    await api.delete(`/admin/machines/${id}`);
  },

  getReviews: async (params: { page?: number; limit?: number }) => {
    const { data } = await api.get('/admin/reviews', { params });
    return data;
  },

  deleteReview: async (id: string) => {
    await api.delete(`/admin/reviews/${id}`);
  },

  getSettings: async () => {
    const { data } = await api.get('/admin/settings');
    return data;
  },

  updateSettings: async (settings: any) => {
    const { data } = await api.post('/admin/settings', settings);
    return data;
  },

  createBanner: async (banner: any) => {
    const { data } = await api.post('/admin/banners', banner);
    return data;
  },

  deleteBanner: async (id: string) => {
    await api.delete(`/admin/banners/${id}`);
  },

  // Planos
  getPlans: async () => {
    const { data } = await api.get('/admin/plans');
    return data;
  },

  updatePlan: async (id: string, planData: any) => {
    const { data } = await api.put(`/admin/plans/${id}`, planData);
    return data;
  },

  // Categorias
  getCategories: async () => {
    const { data } = await api.get('/admin/categories');
    return data;
  },

  createCategory: async (category: any) => {
    const { data } = await api.post('/admin/categories', category);
    return data;
  },

  updateCategory: async (id: string, category: any) => {
    const { data } = await api.put(`/admin/categories/${id}`, category);
    return data;
  },

  deleteCategory: async (id: string) => {
    await api.delete(`/admin/categories/${id}`);
  },

  // Verificações
  getVerificationRequests: async (params: { page?: number; limit?: number; status?: string }) => {
    const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== '' && v !== undefined));
    const { data } = await api.get('/admin/verification-requests', { params: cleanParams });
    return data;
  },

  approveVerification: async (id: string) => {
    const { data } = await api.post(`/admin/verification-requests/${id}/approve`);
    return data;
  },

  rejectVerification: async (id: string, reason?: string) => {
    const { data } = await api.post(`/admin/verification-requests/${id}/reject`, { reason });
    return data;
  },

  // Solicitar verificação (usuário)
  requestVerification: async (body: any) => {
    const { data } = await api.post('/verification/request', body);
    return data;
  },
};
