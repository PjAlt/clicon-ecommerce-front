
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { apiClient } from '@/lib/api';
import { Product, Category, BannerEvent } from '@/types/api';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, TrendingUp, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  // Fetch featured products
  const { data: productsResponse } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => apiClient.getProducts({
      pageNumber: 1,
      pageSize: 8,
      prioritizeEventProducts: true
    }),
  });

  // Fetch products on sale (Best Deals)
  const { data: saleProductsResponse } = useQuery({
    queryKey: ['products', 'on-sale'],
    queryFn: () => apiClient.getProductsOnSale(1, 8),
  });

  // Fetch categories
  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.getCategories(1, 8),
  });

  // Fetch banner events
  const { data: bannerEventsResponse } = useQuery({
    queryKey: ['banner-events'],
    queryFn: () => apiClient.getBannerEvents(1, 5),
  });

  const products = (productsResponse as any)?.data || [];
  const saleProducts = (saleProductsResponse as any)?.data || [];
  const categories = (categoriesResponse as any)?.data || [];
  const bannerEvents = (bannerEventsResponse as any)?.data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Banner Carousel */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <Carousel className="w-full">
            <CarouselContent>
              {bannerEvents.length > 0 ? bannerEvents.map((event: any) => (
                <CarouselItem key={event.id}>
                  <div className="py-20">
                    <div className="max-w-2xl">
                      <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                        {event.statusBadge}
                      </span>
                      <h1 className="text-5xl font-bold mb-6">
                        {event.name}
                      </h1>
                      <p className="text-xl mb-8 opacity-90">
                        {event.description}
                      </p>
                      <div className="flex items-center space-x-4 mb-8">
                        <span className="text-3xl font-bold text-yellow-300">
                          {event.formattedDiscount}
                        </span>
                      </div>
                      <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                        Shop Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              )) : (
                <CarouselItem>
                  <div className="py-20">
                    <div className="max-w-2xl">
                      <h1 className="text-5xl font-bold mb-6">
                        Summer Sale For All Items
                      </h1>
                      <p className="text-xl mb-8 opacity-90">
                        Discover amazing deals on electronics, home & kitchen, and more!
                      </p>
                      <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                        Shop Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      </section>

      {/* Shop with Category Section */}
      {categories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
                <p className="text-gray-600">Browse our wide range of categories</p>
              </div>
              <Button 
                variant="outline"
                onClick={() => navigate('/categories')}
              >
                View All Categories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {categories.map((category: any) => (
                    <CarouselItem key={category.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/6">
                      <div 
                        className="text-center group cursor-pointer"
                        onClick={() => navigate(`/category/${category.id}`)}
                      >
                        <div className="bg-gray-100 rounded-lg p-6 mb-4 group-hover:bg-blue-100 transition-colors">
                          <img
                            src={category.imageUrl || '/placeholder.svg'}
                            alt={category.name}
                            className="w-16 h-16 mx-auto object-cover rounded"
                          />
                        </div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                          {category.name}
                        </h3>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
              </Carousel>
            </div>
          </div>
        </section>
      )}

      {/* Best Deals Section */}
      {saleProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Best Deals</h2>
                <p className="text-gray-600">Don't miss these amazing deals</p>
              </div>
              <Button 
                variant="outline"
                onClick={() => navigate('/shop')}
              >
                View All Deals
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {saleProducts.map((product: any) => (
                    <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <ProductCard product={product} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
              </Carousel>
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
              <Button 
                variant="outline"
                onClick={() => navigate('/shop')}
              >
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to our Newsletter</h2>
          <p className="text-xl opacity-90 mb-8">Get the latest updates on new products and deals</p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg text-gray-900"
            />
            <Button className="bg-white text-blue-600 hover:bg-gray-100 rounded-l-none">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <TrendingUp className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-3xl font-bold mb-2">10K+</h3>
              <p className="text-gray-300">Happy Customers</p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-3xl font-bold mb-2">4.8/5</h3>
              <p className="text-gray-300">Average Rating</p>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="h-12 w-12 text-blue-500 mb-4" />
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
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-lg font-bold text-xl">
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
