import { useState, useEffect } from 'react';
import { ExternalBlob } from '../backend';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

interface ImageGalleryProps {
  images: ExternalBlob[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (images && images.length > 0) {
      const urls = images.map(img => img.getDirectURL());
      setImageUrls(urls);
    }
  }, [images]);

  if (imageUrls.length === 0) return null;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="relative">
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-muted">
          <img
            src={imageUrls[currentIndex]}
            alt="Property main"
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setLightboxOpen(true)}
          />
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-4 right-4 backdrop-blur-sm"
            onClick={() => setLightboxOpen(true)}
          >
            <Maximize2 className="h-4 w-4 mr-2" />
            View Full Size
          </Button>
        </div>

        {imageUrls.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 shadow-lg"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 shadow-lg"
              onClick={handleNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm">
              {currentIndex + 1} / {imageUrls.length}
            </div>
          </>
        )}

        {imageUrls.length > 1 && (
          <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 gap-2">
            {imageUrls.map((url, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-transparent hover:border-border'
                }`}
              >
                <img
                  src={url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-0">
          <div className="relative bg-black flex items-center justify-center">
            <img
              src={imageUrls[currentIndex]}
              alt={`Property image ${currentIndex + 1}`}
              className="w-full h-auto max-h-[90vh] object-contain"
            />
            
            {imageUrls.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 text-white">
                  {currentIndex + 1} / {imageUrls.length}
                </div>
              </>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
