import axios, { AxiosInstance } from 'axios';
import { QueryClient } from '@tanstack/react-query';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Setup the centralized Axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT from localStorage if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error handler - auto-logout on 401/403
api.interceptors.response.use(
  resp => resp,
  error => {
    if (
      error.response &&
      [401, 403].includes(error.response.status)
    ) {
      // Remove tokens and user data from storage, then reload page (or redirect to login)
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      window.location.href = '/'; // Home or login route
    }
    return Promise.reject(error);
  }
);

// Retain QueryClient for react-query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// ---- API wrapper class ----

class ApiClient {
  private axios: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axios = axiosInstance;
  }

  setToken(token: string) {
    // Saving token is now handled by interceptor, but keep for codebase compatibility
    localStorage.setItem('accessToken', token);
  }

  clearToken() {
    localStorage.removeItem('accessToken');
  }

  // Universal request - wrappers for GET/POST/PUT/DELETE

  private async request<T>(method: string, url: string, data?: any, config?: any): Promise<T> {
    const resp = await this.axios.request<T>({ method, url, data, ...config });
    return resp.data;
  }

  // ---------- Example endpoints: ----------
  // Products
  async getProducts(params: {
    pageNumber?: number;
    pageSize?: number;
    userId?: number;
    onSaleOnly?: boolean;
    prioritizeEventProducts?: boolean;
    searchTerm?: string;
  } = {}) {
    return this.request('get', '/products/getAllProducts', undefined, { params });
  }

  async getProductsOnSale(pageNumber = 1, pageSize = 20) {
    return this.request('get', '/products/onSale', undefined, { params: { PageNumber: pageNumber, PageSize: pageSize } });
  }

  async getProductById(productId: number) {
    return this.request('get', '/products/getProductById', undefined, { params: { productId } });
  }

  // Categories
  async getCategories(pageNumber = 1, pageSize = 10) {
    return this.request('get', '/category/getAllCategory', undefined, { params: { PageNumber: pageNumber, PageSize: pageSize } });
  }

  async getCategoryById(categoryId: number) {
    return this.request('get', '/category/getCategoryById', undefined, { params: { categoryId } });
  }

  async getProductsByCategory(categoryId: number, pageNumber = 1, pageSize = 10) {
    return this.request('get', '/category/getAllProdcutByCategoryById', undefined, { params: { categoryId, PageNumber: pageNumber, PageSize: pageSize } });
  }

  // Stores
  async getStores(pageNumber = 1, pageSize = 10) {
    return this.request('get', '/store/getAllStores', undefined, { params: { PageNumber: pageNumber, PageSize: pageSize } });
  }

  async getProductsByStore(storeId: number, pageNumber = 1, pageSize = 10) {
    return this.request('get', '/ProductStore/getAllProductByStoreId', undefined, { params: { StoreId: storeId, PageNumber: pageNumber, PageSize: pageSize } });
  }

  // Banner Events
  async getBannerEvents(pageNumber = 1, pageSize = 10) {
    return this.request('get', `/api/banner-events?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  // Sub Categories
  async getSubCategories(pageNumber = 1, pageSize = 10) {
    return this.request('get', `/subCategory/getAllSubCategory?PageNumber=${pageNumber}&PageSize=${pageSize}`);
  }

  async getSubCategoryById(subCategoryId: number) {
    return this.request('get', `/subCategory/getSubCategoryById?subCategoryId=${subCategoryId}`);
  }

  // Sub Sub Categories
  async getSubSubCategories(pageNumber = 1, pageSize = 10) {
    return this.request('get', `/subSubCategory/getAllSubSubCategory?PageNumber=${pageNumber}&PageSize=${pageSize}`);
  }

  async getSubSubCategoryById(subSubCategoryId: number) {
    return this.request('get', `/subSubCategory/getSubSubCategoryById?subSubCategoryId=${subSubCategoryId}`);
  }

  // Auth
  async register(userData: {
    id: number;
    name: string;
    email: string;
    password: string;
    contact: string;
  }) {
    return this.request('post', '/auth/register', userData);
  }

  async verifyOtp(email: string, otp: string) {
    return this.request('post', '/auth/verify-otp', { email, otp });
  }

  async login(email: string, password: string) {
    return this.request('post', '/auth/login', { email, password });
  }

  // Cart Management
  async addToCart(userId: number, productId: number, quantity: number) {
    return this.request('post', '/CartItem/create-cart', { userId, productId, quantity });
  }

  async getCartItems(userId: number, pageNumber = 1, pageSize = 10) {
    return this.request('get', `/CartItem/getCartItemByUserId?userId=${userId}&PageNumber=${pageNumber}&PageSize=${pageSize}`);
  }

  async updateCartItem(cartItemId: number, quantity: number) {
    return this.request('put', '/CartItem/update-cart', { cartItemId, quantity });
  }

  async removeFromCart(cartItemId: number) {
    return this.request('delete', `/CartItem/delete-cart?cartItemId=${cartItemId}`);
  }

  // Payment Methods
  async getPaymentMethods(pageNumber = 1, pageSize = 10) {
    return this.request('get', `/paymentMethod/getAllPaymentMethod?PageNumber=${pageNumber}&PageSize=${pageSize}`);
  }

  // Order Management
  async placeOrder(userId: number, shippingAddress: string, shippingCity: string) {
    console.log(`Placing order for user ${userId} with address "${shippingAddress}" in city "${shippingCity}"`);
    return this.request('post', '/Order/place-order', { userId, shippingAddress, shippingCity });
  }

  async createPaymentIntent(userId: number, orderId: number, paymentMethodId: number, description: string) {
    return this.request('post', '/Payment/create-payment-intent', { userId, orderId, paymentMethodId, description });
  }

  async verifyPayment(paymentRequestId: number, esewaTransactionId?: string, khaltiPidx?: string, status?: string) {
    const formData = new FormData();
    formData.append('PaymentRequestId', paymentRequestId.toString());
    if (esewaTransactionId) formData.append('EsewaTransactionId', esewaTransactionId);
    if (khaltiPidx) formData.append('KhaltiPidx', khaltiPidx);
    if (status) formData.append('Status', status);

    return this.request('post', '/Payment/verifyPayment', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
  }
}

export const apiClient = new ApiClient(api);
