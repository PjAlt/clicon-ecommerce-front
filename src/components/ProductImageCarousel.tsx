
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductImage {
  imageUrl: string;
}

interface ProductImageCarouselProps {
  images: ProductImage[];
  productName: string;
}

export const ProductImageCarousel = ({ images, productName }: ProductImageCarouselProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
  
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const thumbnailsPerView = 4;
  const maxThumbnailStart = Math.max(0, images.length - thumbnailsPerView);

  const scrollThumbnailsLeft = () => {
    setThumbnailStartIndex(Math.max(0, thumbnailStartIndex - 1));
  };

  const scrollThumbnailsRight = () => {
    setThumbnailStartIndex(Math.min(maxThumbnailStart, thumbnailStartIndex + 1));
  };

  const visibleThumbnails = images.slice(thumbnailStartIndex, thumbnailStartIndex + thumbnailsPerView);

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="bg-white rounded-lg p-4 border">
        <img
          src={
    images[selectedImage]?.imageUrl
      ? images[selectedImage].imageUrl.startsWith('http')
        ? images[selectedImage].imageUrl
        : `${BASE_URL}/${images[selectedImage].imageUrl.replace(/^\/+/, '')}`
      : '/placeholder.svg'
          }
          alt={productName}
          className="w-full h-96 object-cover rounded-lg"
        />
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="relative">
          <div className="flex items-center space-x-2">
            {/* Left Arrow */}
            {thumbnailStartIndex > 0 && (
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={scrollThumbnailsLeft}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}

            {/* Thumbnails */}
            <div className="flex space-x-2 overflow-hidden">
              {visibleThumbnails.map((image, index) => {
  const actualIndex = thumbnailStartIndex + index;
  const thumbUrl = image.imageUrl
    ? image.imageUrl.startsWith('http')
      ? image.imageUrl
      : `${BASE_URL}/${image.imageUrl.replace(/^\/+/, '')}`
    : '/placeholder.svg';
  return (
    <img
      key={actualIndex}
      src={thumbUrl}
      alt={`${productName} ${actualIndex + 1}`}
      className={`w-16 h-16 object-cover rounded cursor-pointer border-2 transition-all ${
        selectedImage === actualIndex 
          ? 'border-blue-500 ring-2 ring-blue-200' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => setSelectedImage(actualIndex)}
    />
  );
})}
            </div>

            {/* Right Arrow */}
            {thumbnailStartIndex < maxThumbnailStart && (
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={scrollThumbnailsRight}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
