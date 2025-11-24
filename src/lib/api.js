import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_SUPABASE_URL?.replace('/rest/v1', '') || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('supabase.auth.token');
    if (token) {
      const parsedToken = typeof token === 'string' ? JSON.parse(token)?.access_token : token;
      if (parsedToken) {
        config.headers.Authorization = `Bearer ${parsedToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('auth_token');
      localStorage.removeItem('supabase.auth.token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Functions
export const api = {
  // Products
  getProducts: (params) => 
    apiClient.get('/products', { params }),
  
  getProduct: (slug) => 
    apiClient.get(`/products/${slug}`),
  
  // Cart
  addToCart: (data) => 
    apiClient.post('/cart', data),
  
  getCart: () => 
    apiClient.get('/cart'),
  
  updateCartItem: (id, data) => 
    apiClient.put(`/cart/${id}`, data),
  
  removeFromCart: (id) => 
    apiClient.delete(`/cart/${id}`),
  
  // Orders
  createOrder: (data) => 
    apiClient.post('/orders', data),
  
  getOrders: () => 
    apiClient.get('/user/orders'),
  
  getOrder: (id) => 
    apiClient.get(`/user/orders/${id}`),
  
  // Auth
  login: (credentials) => 
    apiClient.post('/auth/login', credentials),
  
  register: (data) => 
    apiClient.post('/auth/register', data),
  
  logout: () => 
    apiClient.post('/auth/logout'),
  
  // User
  getProfile: () => 
    apiClient.get('/user/profile'),
  
  updateProfile: (data) => 
    apiClient.put('/user/profile', data),
  
  // Downloads
  getDownloads: () => 
    apiClient.get('/user/downloads'),
  
  generateDownloadLink: (id) => 
    apiClient.post(`/user/downloads/${id}/generate`),
};

export default api;

