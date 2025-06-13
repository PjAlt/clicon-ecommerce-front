
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/api';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    
    if (!product.canAddToCart) {
      toast({
        title: "Product Unavailable",
        description: "This product is currently out of stock",
        variant: "destructive",
      });
      return;
    }

    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleQuickView = () => {
    setShowQuickView(true);
  };

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow">
        {/* Product Image */}
        <div className="relative cursor-pointer" onClick={handleProductClick}>
          <img
            src={product.images?.[0]?.imageUrl || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          
          {/* Sale Badge */}
          {product.isOnSale && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          )}

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                handleQuickView();
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          {/* Stock Status */}
          {!product.isInStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 
            className="font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-blue-600"
            onClick={handleProductClick}
          >
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center mb-3">
            <span className="text-lg font-bold text-gray-900">
              {product.displayPrice}
            </span>
            {product.hasProductDiscount && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {product.formattedMarketPrice}
              </span>
            )}
          </div>

          {/* Savings */}
          {product.isOnSale && (
            <div className="text-sm text-green-600 font-medium mb-3">
              {product.formattedSavings}
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={!product.canAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab="login"
      />

      {/* Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 z-10"
              onClick={() => setShowQuickView(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Quick View</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Image */}
                <div>
                  <img
                    src={product.images?.[0]?.imageUrl || '/placeholder.svg'}
                    alt={product.name}
                    className="w-full rounded-lg"
                  />
                </div>

                {/* Product Details */}
                <div>
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      {product.displayPrice}
                    </span>
                    {product.hasProductDiscount && (
                      <span className="text-lg text-gray-500 line-through ml-2">
                        {product.formattedMarketPrice}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-4">{product.description}</p>

                  {/* Stock Status */}
                  <div className="mb-4">
                    <span className={`inline-block px-2 py-1 rounded text-sm ${
                      product.isInStock 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.displayStatus}
                    </span>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center mb-4">
                    <span className="mr-3">Quantity:</span>
                    <div className="flex items-center border rounded">
                      <Button variant="ghost" size="sm">-</Button>
                      <span className="px-4 py-2">1</span>
                      <Button variant="ghost" size="sm">+</Button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button
                      onClick={handleAddToCart}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={!product.canAddToCart}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleProductClick}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
