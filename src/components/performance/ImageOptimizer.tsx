import { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  placeholder?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
}

export const OptimizedImage = ({
  src,
  alt,
  className,
  priority = false,
  placeholder,
  sizes,
  loading = 'lazy'
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Use intersection observer for lazy loading (unless priority)
  const { ref: observerRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true
  });

  const shouldLoad = priority || isIntersecting;

  useEffect(() => {
    if (shouldLoad && imgRef.current) {
      const img = imgRef.current;
      
      const handleLoad = () => {
        setIsLoaded(true);
        // Remove placeholder blur once loaded
        img.style.filter = 'none';
      };
      
      const handleError = () => {
        setHasError(true);
      };

      img.addEventListener('load', handleLoad);
      img.addEventListener('error', handleError);

      return () => {
        img.removeEventListener('load', handleLoad);
        img.removeEventListener('error', handleError);
      };
    }
  }, [shouldLoad]);

  // Preload critical images
  useEffect(() => {
    if (priority) {
      const preloadImg = new Image();
      preloadImg.src = src;
    }
  }, [src, priority]);

  return (
    <div
      ref={observerRef as any}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Placeholder */}
      {placeholder && !isLoaded && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse"
          style={{
            backgroundImage: `url(${placeholder})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(10px)'
          }}
        />
      )}
      
      {/* Actual image */}
      {shouldLoad && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={loading}
          sizes={sizes}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            filter: isLoaded ? 'none' : 'blur(5px)',
            transition: 'filter 0.3s ease-out, opacity 0.3s ease-out'
          }}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      )}
      
      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
};

// Optimized background image component
export const OptimizedBackgroundImage = ({
  src,
  className,
  children,
  priority = false
}: {
  src: string;
  className?: string;
  children?: React.ReactNode;
  priority?: boolean;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: true
  });

  const shouldLoad = priority || isIntersecting;

  useEffect(() => {
    if (shouldLoad) {
      const img = new Image();
      img.onload = () => setIsLoaded(true);
      img.src = src;
    }
  }, [shouldLoad, src]);

  return (
    <div
      ref={ref as any}
      className={`relative ${className}`}
      style={{
        backgroundImage: isLoaded ? `url(${src})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Placeholder gradient while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-subtle animate-pulse" />
      )}
      
      {children}
    </div>
  );
};