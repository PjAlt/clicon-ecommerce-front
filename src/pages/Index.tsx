
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { apiClient } from '@/lib/api';
import { Product, Category, BannerEvent, ApiResponse, PaginatedResponse } from '@/types/api';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, TrendingUp, Zap } from 'lucide-react';

const Index = () => {
  // Fetch featured products
  const { data: productsResponse } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => apiClient.getProducts({
      pageNumber: 1,
      pageSize: 8,
      prioritizeEventProducts: true
    }),
  });

  // Fetch products on sale
  const { data: saleProductsResponse } = useQuery({
    queryKey: ['products', 'on-sale'],
    queryFn: () => apiClient.getProductsOnSale(1, 6),
  });

  // Fetch categories
  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.getCategories(1, 6),
  });

  // Fetch banner events
  const { data: bannerEventsResponse } = useQuery({
    queryKey: ['banner-events'],
    queryFn: () => apiClient.getBannerEvents(1, 3),
  });

  const products = (productsResponse as { data?: Product[] })?.data || [];
  const saleProducts = (saleProductsResponse as { data?: Product[] })?.data || [];
  const categories = (categoriesResponse as { data?: Category[] })?.data || [];
  const bannerEvents = (bannerEventsResponse as { data?: { data?: BannerEvent[] } })?.data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">
              Summer Sale For All Items - Save Up To 70%
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Discover amazing deals on electronics, home & kitchen, and more!
            </p>
            <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100">
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Banner Events */}
      {bannerEvents.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Special Events</h2>
              <p className="text-gray-600">Limited time offers you can't miss</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bannerEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <Zap className="h-6 w-6 text-orange-500 mr-2" />
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-semibold">
                      {event.statusBadge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-orange-500">
                      {event.formattedDiscount}
                    </span>
                    <Button variant="outline">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
              <p className="text-gray-600">Browse our wide range of categories</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category) => (
                <div key={category.id} className="text-center group cursor-pointer">
                  <div className="bg-gray-100 rounded-lg p-6 mb-4 group-hover:bg-orange-100 transition-colors">
                    <img
                      src={category.imageUrl || '/placeholder.svg'}
                      alt={category.name}
                      className="w-16 h-16 mx-auto object-cover rounded"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
                    {category.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products on Sale */}
      {saleProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Products on Sale</h2>
                <p className="text-gray-600">Don't miss these amazing deals</p>
              </div>
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
                <p className="text-gray-600">Handpicked items just for you</p>
              </div>
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <TrendingUp className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-3xl font-bold mb-2">10K+</h3>
              <p className="text-gray-300">Happy Customers</p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-3xl font-bold mb-2">4.8/5</h3>
              <p className="text-gray-300">Average Rating</p>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-3xl font-bold mb-2">24/7</h3>
              <p className="text-gray-300">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-2 rounded-lg font-bold text-xl">
                  C
                </div>
                <span className="text-2xl font-bold">Clicon</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your trusted marketplace for quality products from verified sellers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Electronics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Home & Kitchen</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fashion</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Clicon. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
