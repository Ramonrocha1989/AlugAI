import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  withCredentials: true, // Enviar cookies automaticamente
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor removido - não redirecionar automaticamente em 401

export const adminService = {
  getStats: async () => {
    const { data } = await api.get('/admin/stats');
    return data;
  },

  getUsers: async (params: { page?: number; limit?: number; search?: string }) => {
    const { data } = await api.get('/admin/users', { params });
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

  getMachines: async (params: { page?: number; limit?: number; status?: string }) => {
    const { data } = await api.get('/admin/machines', { params });
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
};
