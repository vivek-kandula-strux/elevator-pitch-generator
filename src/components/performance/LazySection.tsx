import { Suspense, ReactNode } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { SkeletonLoader } from '@/components/loading/SkeletonLoader';

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export const LazySection = ({ 
  children, 
  fallback, 
  threshold = 0.1, 
  rootMargin = '100px',
  className 
}: LazySectionProps) => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true
  });

  const defaultFallback = (
    <div className="space-y-4 p-6">
      <SkeletonLoader className="h-8 w-3/4" />
      <SkeletonLoader className="h-4 w-full" />
      <SkeletonLoader className="h-4 w-2/3" />
    </div>
  );

  return (
    <div ref={ref as any} className={className}>
      {isIntersecting ? (
        <Suspense fallback={fallback || defaultFallback}>
          {children}
        </Suspense>
      ) : (
        fallback || defaultFallback
      )}
    </div>
  );
};