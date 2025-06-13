import { QueryClient } from '@tanstack/react-query';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('accessToken');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('accessToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('accessToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Products
  async getProducts(params: {
    pageNumber?: number;
    pageSize?: number;
    userId?: number;
    onSaleOnly?: boolean;
    prioritizeEventProducts?: boolean;
    searchTerm?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    
    return this.request(`/products/getAllProducts?${searchParams}`);
  }

  async getProductsOnSale(pageNumber = 1, pageSize = 20) {
    return this.request(`/products/onSale?PageNumber=${pageNumber}&PageSize=${pageSize}`);
  }

  async getProductById(productId: number) {
    return this.request(`/products/getProductById?productId=${productId}`);
  }

  // Categories
  async getCategories(pageNumber = 1, pageSize = 10) {
    return this.request(`/category/getAllCategory?PageNumber=${pageNumber}&PageSize=${pageSize}`);
  }

  async getCategoryById(categoryId: number) {
    return this.request(`/category/getCategoryById?categoryId=${categoryId}`);
  }

  async getProductsByCategory(categoryId: number, pageNumber = 1, pageSize = 10) {
    return this.request(`/category/getAllProdcutByCategoryById?categoryId=${categoryId}&PageNumber=${pageNumber}&PageSize=${pageSize}`);
  }

  // Stores
  async getStores(pageNumber = 1, pageSize = 10) {
    return this.request(`/store/getAllStores?PageNumber=${pageNumber}&PageSize=${pageSize}`);
  }

  async getProductsByStore(storeId: number, pageNumber = 1, pageSize = 10) {
    return this.request(`/ProductStore/getAllProductByStoreId?StoreId=${storeId}&PageNumber=${pageNumber}&PageSize=${pageSize}`);
  }

  // Banner Events
  async getBannerEvents(pageNumber = 1, pageSize = 10) {
    return this.request(`/api/banner-events?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  // Sub Categories
  async getSubCategories(pageNumber = 1, pageSize = 10) {
    return this.request(`/subCategory/getAllSubCategory?PageNumber=${pageNumber}&PageSize=${pageSize}`);
  }

  async getSubCategoryById(subCategoryId: number) {
    return this.request(`/subCategory/getSubCategoryById?subCategoryId=${subCategoryId}`);
  }

  // Sub Sub Categories
  async getSubSubCategories(pageNumber = 1, pageSize = 10) {
    return this.request(`/subSubCategory/getAllSubSubCategory?PageNumber=${pageNumber}&PageSize=${pageSize}`);
  }

  async getSubSubCategoryById(subSubCategoryId: number) {
    return this.request(`/subSubCategory/getSubSubCategoryById?subSubCategoryId=${subSubCategoryId}`);
  }

  // Auth
  async register(userData: {
    id: number;
    name: string;
    email: string;
    password: string;
    contact: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyOtp(email: string, otp: string) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Cart Management
  async addToCart(userId: number, productId: number, quantity: number) {
    return this.request('/CartItem/create-cart', {
      method: 'POST',
      body: JSON.stringify({ userId, productId, quantity }),
    });
  }

  async getCartItems(userId: number, pageNumber = 1, pageSize = 10) {
    return this.request(`/CartItem/getCartItemByUserId?userId=${userId}&PageNumber=${pageNumber}&PageSize=${pageSize}`);
  }

  async updateCartItem(cartItemId: number, quantity: number) {
    return this.request('/CartItem/update-cart', {
      method: 'PUT',
      body: JSON.stringify({ cartItemId, quantity }),
    });
  }

  async removeFromCart(cartItemId: number) {
    return this.request(`/CartItem/delete-cart?cartItemId=${cartItemId}`, {
      method: 'DELETE',
    });
  }

  // Payment Methods
  async getPaymentMethods(pageNumber = 1, pageSize = 10) {
    return this.request(`/paymentMethod/getAllPaymentMethod?PageNumber=${pageNumber}&PageSize=${pageSize}`);
  }

  // Order Management
  async placeOrder(userId: number, shippingAddress: string, shippingCity: string) {
    return this.request('/Order/place-order', {
      method: 'POST',
      body: JSON.stringify({ userId, shippingAddress, shippingCity }),
    });
  }

  async createPaymentIntent(userId: number, orderId: number, paymentMethodId: number, description: string) {
    return this.request('/Payment/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ userId, orderId, paymentMethodId, description }),
    });
  }

  async verifyPayment(paymentRequestId: number, esewaTransactionId?: string, khaltiPidx?: string, status?: string) {
    const formData = new FormData();
    formData.append('PaymentRequestId', paymentRequestId.toString());
    if (esewaTransactionId) formData.append('EsewaTransactionId', esewaTransactionId);
    if (khaltiPidx) formData.append('KhaltiPidx', khaltiPidx);
    if (status) formData.append('Status', status);

    return this.request('/Payment/verifyPayment', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
