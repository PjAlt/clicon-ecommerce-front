
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart, Minus, Plus } from 'lucide-react';
import { Product } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';
import { useBackendCart } from '@/hooks/useBackendCart';
import { toast } from '@/hooks/use-toast';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal = ({ product, isOpen, onClose }: QuickViewModalProps) => {
  const { user } = useAuth();
  const userId = user?.nameid ? parseInt(user.nameid, 10) : 0;
  const { addToCart } = useBackendCart(userId);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  if (!product) return null;

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
      addToCart(product.id, quantity);
      toast({
        title: "Added to Cart",
        description: `${quantity} x ${product.name} has been added to your cart`,
      });
      onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Quick View - {product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="relative">
            {discountPercentage > 0 && (
              <Badge className="absolute top-2 left-2 z-10 bg-red-500 hover:bg-red-600">
                -{discountPercentage}%
              </Badge>
            )}
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
            
            {/* Rating */}
            <div className="flex items-center space-x-2">
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
              <span className="text-sm text-gray-500">
                ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-2xl text-gray-900">
                  Rs. {product.currentPrice.toLocaleString()}
                </span>
                {product.hasProductDiscount && (
                  <span className="text-lg text-gray-500 line-through">
                    Rs. {product.marketPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {product.formattedSavings && (
                <p className="text-sm text-green-600 font-medium">
                  Save {product.formattedSavings}
                </p>
              )}
            </div>

            {/* Stock Status */}
            <Badge 
              variant={product.isInStock ? "secondary" : "destructive"}
              className="text-sm"
            >
              {product.stockStatus}
            </Badge>

            {/* Description */}
            <p className="text-gray-600 text-sm line-clamp-3">{product.description}</p>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= product.availableStock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                className="w-full"
                disabled={isLoading || !product.isInStock}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isLoading ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button variant="outline" className="w-full">
                <Heart className="h-4 w-4 mr-2" />
                Add to Wishlist
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
