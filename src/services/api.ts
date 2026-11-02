import {
  User,
  Product,
  Farm,
  CropRecord,
  LivestockRecord,
  FinancialRecord,
  Article,
  Order,
  Message,
} from '../types/index.ts';

const API_BASE = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Network error occurred' }));
    throw new Error(errorData.error || `HTTP error ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  async login(email: string, password?: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async register(data: Partial<User>): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateProfile(data: Partial<User>): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return handleResponse(res);
  },

  // Products
  async getProducts(params?: {
    category?: string;
    search?: string;
    sellerId?: string;
    status?: string;
  }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.sellerId) query.set('sellerId', params.sellerId);
    if (params?.status) query.set('status', params.status);

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    return handleResponse<Product[]>(res);
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return handleResponse<Product>(res);
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse<Product>(res);
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Farms & Management
  async getFarms(userId?: string): Promise<Farm[]> {
    const url = userId ? `${API_BASE}/farms?userId=${userId}` : `${API_BASE}/farms`;
    const res = await fetch(url);
    return handleResponse<Farm[]>(res);
  },

  async createFarm(farm: Partial<Farm>): Promise<Farm> {
    const res = await fetch(`${API_BASE}/farms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(farm),
    });
    return handleResponse<Farm>(res);
  },

  async updateFarm(id: string, updates: Partial<Farm>): Promise<Farm> {
    const res = await fetch(`${API_BASE}/farms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse<Farm>(res);
  },

  async getCrops(userId?: string, farmId?: string): Promise<CropRecord[]> {
    const query = new URLSearchParams();
    if (userId) query.set('userId', userId);
    if (farmId) query.set('farmId', farmId);
    const res = await fetch(`${API_BASE}/crops?${query.toString()}`);
    return handleResponse<CropRecord[]>(res);
  },

  async createCrop(crop: Partial<CropRecord>): Promise<CropRecord> {
    const res = await fetch(`${API_BASE}/crops`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(crop),
    });
    return handleResponse<CropRecord>(res);
  },

  async updateCrop(id: string, updates: Partial<CropRecord>): Promise<CropRecord> {
    const res = await fetch(`${API_BASE}/crops/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse<CropRecord>(res);
  },

  async deleteCrop(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/crops/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  async getLivestock(userId?: string, farmId?: string): Promise<LivestockRecord[]> {
    const query = new URLSearchParams();
    if (userId) query.set('userId', userId);
    if (farmId) query.set('farmId', farmId);
    const res = await fetch(`${API_BASE}/livestock?${query.toString()}`);
    return handleResponse<LivestockRecord[]>(res);
  },

  async createLivestock(record: Partial<LivestockRecord>): Promise<LivestockRecord> {
    const res = await fetch(`${API_BASE}/livestock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    return handleResponse<LivestockRecord>(res);
  },

  async updateLivestock(id: string, updates: Partial<LivestockRecord>): Promise<LivestockRecord> {
    const res = await fetch(`${API_BASE}/livestock/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse<LivestockRecord>(res);
  },

  async deleteLivestock(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/livestock/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  // Financials
  async getFinancials(userId?: string): Promise<FinancialRecord[]> {
    const url = userId ? `${API_BASE}/financials?userId=${userId}` : `${API_BASE}/financials`;
    const res = await fetch(url);
    return handleResponse<FinancialRecord[]>(res);
  },

  async createFinancial(record: Partial<FinancialRecord>): Promise<FinancialRecord> {
    const res = await fetch(`${API_BASE}/financials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    return handleResponse<FinancialRecord>(res);
  },

  async deleteFinancial(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/financials/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  // Orders
  async getOrders(userId?: string, role?: string): Promise<Order[]> {
    const query = new URLSearchParams();
    if (userId) query.set('userId', userId);
    if (role) query.set('role', role);
    const res = await fetch(`${API_BASE}/orders?${query.toString()}`);
    return handleResponse<Order[]>(res);
  },

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return handleResponse<Order>(res);
  },

  async updateOrderStatus(id: string, status: Order['orderStatus']): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return handleResponse<Order>(res);
  },

  // Payments / M-Pesa Express
  async simulateMpesaExpress(params: {
    phoneNumber: string;
    amount: number;
    accountReference?: string;
  }): Promise<{
    ResponseCode: string;
    CustomerMessage: string;
    SimulatedReceipt: string;
    CheckoutRequestID: string;
    LiveDarajaReady: boolean;
    DarajaConfigInfo: {
      endpoint: string;
      environment: string;
      passKeyNotice: string;
    };
  }> {
    const res = await fetch(`${API_BASE}/payments/mpesa-express`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return handleResponse(res);
  },

  // Articles
  async getArticles(category?: string, search?: string): Promise<Article[]> {
    const query = new URLSearchParams();
    if (category) query.set('category', category);
    if (search) query.set('search', search);
    const res = await fetch(`${API_BASE}/articles?${query.toString()}`);
    return handleResponse<Article[]>(res);
  },

  async createArticle(data: Partial<Article>): Promise<Article> {
    const res = await fetch(`${API_BASE}/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Article>(res);
  },

  async deleteArticle(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/articles/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  // Messages
  async getMessages(userId: string): Promise<Message[]> {
    const res = await fetch(`${API_BASE}/messages?userId=${userId}`);
    return handleResponse<Message[]>(res);
  },

  async sendMessage(message: Partial<Message>): Promise<Message> {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    return handleResponse<Message>(res);
  },

  async markMessageRead(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/messages/${id}/read`, { method: 'PATCH' });
    return handleResponse(res);
  },

  // Admin
  async getAdminStats(): Promise<{
    totalUsers: number;
    farmersCount: number;
    buyersCount: number;
    suppliersCount: number;
    expertsCount: number;
    productsCount: number;
    activeProductsCount: number;
    ordersCount: number;
    totalSalesVolume: number;
    articlesCount: number;
    recentUsers: User[];
  }> {
    const res = await fetch(`${API_BASE}/admin/stats`);
    return handleResponse(res);
  },

  async getAdminUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/admin/users`);
    return handleResponse<User[]>(res);
  },
};
