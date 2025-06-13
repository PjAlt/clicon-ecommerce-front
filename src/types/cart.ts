
export interface BackendCartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  isStockReserved: boolean;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  product: {
    id: number;
    name: string;
    slug: string;
    description: string;
    marketPrice: number;
    costPrice: number;
    discountPrice?: number;
    stockQuantity: number;
    isOnSale: boolean;
    displayPrice: string;
    formattedMarketPrice: string;
    currentPrice: number;
    images: Array<{
      id: number;
      imageUrl: string;
      isMain: boolean;
    }>;
  };
}

export interface PaymentMethod {
  id: number;
  name: string;
  logo: string;
  isActive: boolean;
  description?: string;
}

export interface OrderResponse {
  orderId: number;
  userId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface PaymentIntentResponse {
  paymentUrl: string;
  esewaTransactionId?: string;
  khaltiPidx?: string;
  paymentRequestId: number;
}
