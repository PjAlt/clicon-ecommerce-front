
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types/api';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard = ({ product, className }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.canAddToCart) {
      toast({
        title: "Cannot add to cart",
        description: "This product is currently unavailable",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      addToCart(product);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDiscountPercentage = () => {
    if (product.pricing?.totalDiscountPercentage) {
      return Math.round(product.pricing.totalDiscountPercentage);
    }
    return 0;
  };

  const getImageUrl = () => {
    if (product.images && product.images.length > 0) {
      const mainImage = product.images.find(img => img.isMain) || product.images[0];
      return `https://localhost:7028/${mainImage.imageUrl}`;
    }
    return '/placeholder.svg';
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardContent className="p-0">
        <Link to={`/product/${product.id}`} className="block">
          {/* Image container */}
          <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
            <img
              src={imageError ? '/placeholder.svg' : getImageUrl()}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.isOnSale && getDiscountPercentage() > 0 && (
                <Badge variant="destructive" className="text-xs">
                  -{getDiscountPercentage()}%
                </Badge>
              )}
              {!product.isInStock && (
                <Badge variant="secondary" className="text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Quick action buttons */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="secondary" className="h-8 w-8">
                <Heart className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" className="h-8 w-8">
                <Eye className="h-4 w-4" />
              </Button>
            </div>

            {/* Add to cart overlay */}
            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                onClick={handleAddToCart}
                disabled={!product.canAddToCart || isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600"
                size="sm"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isLoading ? 'Adding...' : 'Add to Cart'}
              </Button>
            </div>
          </div>

          {/* Product info */}
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-orange-500 transition-colors">
              {product.name}
            </h3>
            
            {/* Rating and reviews */}
            <div className="flex items-center gap-1 mb-2">
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
              <span className="text-xs text-gray-500">({product.reviews})</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-gray-900">
                {product.displayPrice}
              </span>
              {product.hasProductDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  {product.formattedMarketPrice}
                </span>
              )}
            </div>

            {/* Savings */}
            {product.isOnSale && product.totalSavingsAmount > 0 && (
              <p className="text-sm text-green-600 font-medium">
                {product.formattedSavings}
              </p>
            )}

            {/* Stock status */}
            <div className="mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                product.isInStock
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.stockStatus}
              </span>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};
