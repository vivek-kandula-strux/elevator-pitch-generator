import { useEffect, useState } from 'react';
import { measureFCP, measureLoadTime } from '@/utils/performanceMonitor';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  cls: number | null;
  fid: number | null;
  ttfb: number | null;
}

export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    cls: null,
    fid: null,
    ttfb: null,
  });

  useEffect(() => {
    // Core Web Vitals measurement
    const measureWebVitals = () => {
      // First Contentful Paint
      measureFCP();

      // Largest Contentful Paint
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
          }
        });
      });
      
      if ('PerformanceObserver' in window) {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      }

      // Time to First Byte
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        setMetrics(prev => ({ 
          ...prev, 
          ttfb: navigation.responseStart - navigation.requestStart 
        }));
      }

      return () => {
        observer.disconnect();
      };
    };

    measureWebVitals();
  }, []);

  // Development-only performance display
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-background/80 backdrop-blur border rounded-lg p-3 text-xs font-mono z-50">
      <div className="text-primary font-semibold mb-2">Performance</div>
      <div>FCP: {metrics.fcp ? `${metrics.fcp.toFixed(0)}ms` : 'measuring...'}</div>
      <div>LCP: {metrics.lcp ? `${metrics.lcp.toFixed(0)}ms` : 'measuring...'}</div>
      <div>TTFB: {metrics.ttfb ? `${metrics.ttfb.toFixed(0)}ms` : 'measuring...'}</div>
    </div>
  );
};