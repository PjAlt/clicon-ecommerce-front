
// API Response Types
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  marketPrice: number;
  costPrice: number;
  discountPrice?: number;
  stockQuantity: number;
  reservedStock: number;
  sku: string;
  weight: string;
  reviews: number;
  rating: number;
  dimensions: string;
  isDeleted: boolean;
  categoryId: number;
  subSubCategoryId: number;
  availableStock: number;
  isInStock: boolean;
  hasProductDiscount: boolean;
  basePrice: number;
  productDiscountAmount: number;
  formattedMarketPrice: string;
  formattedBasePrice: string;
  formattedDiscountAmount: string;
  stockStatus: string;
  images: ProductImage[];
  pricing?: ProductPricing;
  stock?: any;
  currentPrice: number;
  isOnSale: boolean;
  canAddToCart: boolean;
  displayPrice: string;
  displayStatus: string;
  totalSavingsAmount: number;
  formattedSavings: string;
}

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  isMain: boolean;
  isDeleted: boolean;
}

export interface ProductPricing {
  productId: number;
  originalPrice: number;
  basePrice: number;
  effectivePrice: number;
  productDiscountAmount: number;
  eventDiscountAmount: number;
  totalDiscountAmount: number;
  totalDiscountPercentage: number;
  hasProductDiscount: boolean;
  hasEventDiscount: boolean;
  hasAnyDiscount: boolean;
  isOnSale: boolean;
  activeEventId?: number;
  activeEventName?: string;
  eventTagLine?: string;
  promotionType?: string;
  eventStartDate?: string;
  eventEndDate?: string;
  hasActiveEvent: boolean;
  isEventActive: boolean;
  eventTimeRemaining?: string;
  isEventExpiringSoon: boolean;
  formattedOriginalPrice: string;
  formattedEffectivePrice: string;
  formattedSavings: string;
  formattedDiscountBreakdown: string;
  eventStatus: string;
  isPriceStable: boolean;
  calculatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  subCategories?: SubCategory[];
  products?: Product[];
  productCount?: number;
  productsOnSale?: number;
  averagePrice?: number;
  minPrice?: number;
  maxPrice?: number;
  hasProductsOnSale?: boolean;
  salePercentage?: number;
  priceRange?: string;
}

export interface SubCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  subSubCategories?: SubSubCategory[];
}

export interface SubSubCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  subCategoryId: number;
  subCategory?: SubCategory;
  products?: Product[];
}

export interface Store {
  id: number;
  name: string;
  ownerName: string;
  imageUrl: string;
  isDeleted: boolean;
  address?: StoreAddress;
}

export interface StoreAddress {
  id: number;
  storeId: number;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

export interface BannerEvent {
  id: number;
  name: string;
  description: string;
  tagLine: string;
  eventType: number;
  promotionType: number;
  discountValue: number;
  maxDiscountAmount: number;
  minOrderValue: number;
  startDateNepal: string;
  endDateNepal: string;
  startDateNepalString: string;
  endDateNepalString: string;
  startDateUtcString: string;
  endDateUtcString: string;
  activeTimeSlot: string;
  maxUsageCount: number;
  currentUsageCount: number;
  maxUsagePerUser: number;
  priority: number;
  isActive: boolean;
  isDeleted: boolean;
  status: number;
  createdAt: string;
  updatedAt: string;
  productIds: number[];
  totalProductsCount: number;
  totalRulesCount: number;
  hasActiveTimeSlot: boolean;
  isCurrentlyActive: boolean;
  isExpired: boolean;
  daysRemaining: number;
  timeStatus: string;
  formattedDiscount: string;
  formattedDateRangeNepal: string;
  fromattedDateRangeUtc: string;
  statusBadge: string;
  priorityBadge: string;
  usagePercentage: number;
  remainingUsage: number;
  isUsageLimitReached: boolean;
  timeZoneInfo: any;
  images: any[];
  rules: any[];
  eventProducts: any[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  contact: string;
  createdAt: string;
  imageUrl: string;
  isDeleted: boolean;
  addresses?: Address[];
}

export interface DecodedUser {
  email: string;
  nameid: string;
  unique_name: string;
}

export interface Address {
  id: number;
  userId: number;
  street: string;
  city: string;
  province: string;
  postalCode: string;
}

// Updated Notification interface to match backend API response
export interface Notification {
  id: number;
  userId: number;
  email: string;
  orderId: number;
  title: string;
  message: string;
  type: string;
  status: string;
  isRead: boolean;
  orderDate: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  succeeded?: boolean;
  errors?: any;
}

export interface PaginatedResponse<T> {
  message: string;
  data: T[];
}

export interface AuthResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  message: string;
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  product: Product;
}
