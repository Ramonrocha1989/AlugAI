import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  withCredentials: true, // Enviar cookies automaticamente
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

// Interceptor para refresh automático
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/auth/refresh`,
            { refreshToken }
          );
          
          localStorage.setItem('accessToken', data.accessToken);
          if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
          }
          
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

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
};
