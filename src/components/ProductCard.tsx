
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';
import { useBackendCart } from '@/hooks/useBackendCart';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const { user } = useAuth();
  const userId = user?.nameid ? parseInt(user.nameid, 10) : 0;
  const { addItem } = useBackendCart(userId);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await addItem(product.id, 1);
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const primaryImage = product.images?.find(img => img.isMain) || product.images?.[0];
  const imageUrl = primaryImage?.imageUrl 
    ? `${import.meta.env.VITE_API_BASE_URL}${primaryImage.imageUrl}`
    : '/placeholder.svg';

  const discountPercentage = product.hasProductDiscount
    ? Math.round(((product.marketPrice - product.currentPrice) / product.marketPrice) * 100)
    : 0;

  return (
    <Card className={`group relative overflow-hidden hover:shadow-lg transition-all duration-300 ${className}`}>
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <Badge className="absolute top-2 left-2 z-10 bg-red-500 hover:bg-red-600">
          -{discountPercentage}%
        </Badge>
      )}

      {/* Wishlist Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
      >
        <Heart className="h-4 w-4" />
      </Button>

      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Link to={`/products/${product.id}`}>
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
          
          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
            <Button size="sm" variant="secondary" asChild>
              <Link to={`/products/${product.id}`}>
                <Eye className="h-4 w-4 mr-1" />
                View
              </Link>
            </Button>
            <Button 
              size="sm" 
              onClick={handleAddToCart}
              disabled={isLoading || !product.isInStock}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {isLoading ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          {/* Product Name */}
          <Link to={`/products/${product.id}`}>
            <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-gray-900">
                Rs. {product.currentPrice.toLocaleString()}
              </span>
              {product.hasProductDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  Rs. {product.marketPrice.toLocaleString()}
                </span>
              )}
            </div>
            {product.formattedSavings && (
              <p className="text-xs text-green-600 font-medium">
                Save {product.formattedSavings}
              </p>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center justify-between">
            <Badge 
              variant={product.isInStock ? "secondary" : "destructive"}
              className="text-xs"
            >
              {product.stockStatus}
            </Badge>
            {product.isInStock && (
              <span className="text-xs text-gray-500">
                {product.availableStock} left
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button 
            className="w-full mt-3" 
            onClick={handleAddToCart}
            disabled={isLoading || !product.isInStock}
            variant={product.isInStock ? "default" : "secondary"}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isLoading ? 'Adding...' : product.isInStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
