import { useEffect } from 'react';

// Web Vitals monitoring with Core Web Vitals thresholds
export const WebVitalsMonitor = () => {
  useEffect(() => {
    // Measure Largest Contentful Paint (LCP)
    const observeLCP = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        const lcp = lastEntry.startTime;
        console.log('LCP:', lcp);
        
        // Send to analytics
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            metric_name: 'LCP',
            metric_value: Math.round(lcp),
            metric_rating: lcp <= 2500 ? 'good' : lcp <= 4000 ? 'needs_improvement' : 'poor'
          });
        }
        
        observer.disconnect();
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    };

    // Measure First Input Delay (FID) 
    const observeFID = () => {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as any;
          const fid = fidEntry.processingStart - fidEntry.startTime;
          console.log('FID:', fid);
          
          if (window.gtag) {
            window.gtag('event', 'web_vitals', {
              metric_name: 'FID',
              metric_value: Math.round(fid),
              metric_rating: fid <= 100 ? 'good' : fid <= 300 ? 'needs_improvement' : 'poor'
            });
          }
        }
      });
      
      observer.observe({ entryTypes: ['first-input'] });
    };

    // Measure Cumulative Layout Shift (CLS)
    const observeCLS = () => {
      let clsValue = 0;
      let clsEntries: any[] = [];
      
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const clsEntry = entry as any;
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value;
            clsEntries.push(clsEntry);
          }
        }
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
      
      // Send CLS when page is about to unload
      window.addEventListener('beforeunload', () => {
        console.log('CLS:', clsValue);
        
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            metric_name: 'CLS',
            metric_value: Math.round(clsValue * 1000) / 1000,
            metric_rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs_improvement' : 'poor'
          });
        }
      });
    };

    // Initialize observers
    if ('PerformanceObserver' in window) {
      observeLCP();
      observeFID();
      observeCLS();
    }

    // Measure Time to First Byte (TTFB)
    const measureTTFB = () => {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navEntry) {
        const ttfb = navEntry.responseStart - navEntry.requestStart;
        console.log('TTFB:', ttfb);
        
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            metric_name: 'TTFB',
            metric_value: Math.round(ttfb),
            metric_rating: ttfb <= 600 ? 'good' : ttfb <= 1500 ? 'needs_improvement' : 'poor'
          });
        }
      }
    };

    measureTTFB();
  }, []);

  return null;
};

// Hook for manual performance measurements
export const usePerformanceMeasurement = () => {
  const measureTask = (taskName: string, task: () => void | Promise<void>) => {
    return async () => {
      const startTime = performance.now();
      await task();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.log(`${taskName} took ${duration.toFixed(2)}ms`);
      
      if (window.gtag) {
        window.gtag('event', 'timing_complete', {
          name: taskName,
          value: Math.round(duration)
        });
      }
    };
  };

  const markMilestone = (milestoneName: string) => {
    if ('performance' in window && 'mark' in performance) {
      performance.mark(milestoneName);
      console.log(`Milestone: ${milestoneName} at ${performance.now().toFixed(2)}ms`);
    }
  };

  return { measureTask, markMilestone };
};