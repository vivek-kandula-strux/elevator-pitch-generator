import { Suspense, ReactNode } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface CriticalLoaderProps {
  children: ReactNode;
  fallback?: ReactNode;
  priority?: 'high' | 'medium' | 'low';
  threshold?: number;
  rootMargin?: string;
}

const CriticalFallback = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-muted rounded-lg w-3/4 mb-4"></div>
    <div className="h-4 bg-muted rounded w-full mb-2"></div>
    <div className="h-4 bg-muted rounded w-2/3"></div>
  </div>
);

export const CriticalLoader = ({ 
  children, 
  fallback = <CriticalFallback />,
  priority = 'medium',
  threshold = 0.1,
  rootMargin = priority === 'high' ? '200px' : '100px'
}: CriticalLoaderProps) => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true
  });

  return (
    <div ref={ref as any}>
      {isIntersecting ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
};

// High-priority wrapper for above-the-fold content
export const CriticalSection = ({ children }: { children: ReactNode }) => (
  <CriticalLoader priority="high" threshold={0} rootMargin="0px">
    {children}
  </CriticalLoader>
);

// Medium-priority wrapper for secondary content  
export const SecondarySection = ({ children }: { children: ReactNode }) => (
  <CriticalLoader priority="medium">
    {children}
  </CriticalLoader>
);

// Low-priority wrapper for footer/supplementary content
export const DeferredSection = ({ children }: { children: ReactNode }) => (
  <CriticalLoader priority="low" rootMargin="50px">
    {children}
  </CriticalLoader>
);