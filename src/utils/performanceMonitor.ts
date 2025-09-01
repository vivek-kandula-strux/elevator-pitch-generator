// Performance monitoring utilities for code splitting

export const measureLoadTime = (componentName: string) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
    }
    
    // Track performance in GTM if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'timing_complete', {
        name: componentName,
        value: Math.round(loadTime)
      });
    }
  };
};

export const logBundleSplit = (chunkName: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔄 Loading lazy chunk: ${chunkName}`);
  }
};

// Performance observer for measuring First Contentful Paint
export const measureFCP = () => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          console.log(`🚀 First Contentful Paint: ${entry.startTime.toFixed(2)}ms`);
          
          // Track in GTM
          if ((window as any).gtag) {
            (window as any).gtag('event', 'timing_complete', {
              name: 'first_contentful_paint',
              value: Math.round(entry.startTime)
            });
          }
        }
      });
    });
    
    observer.observe({ entryTypes: ['paint'] });
  }
};

// Bundle size tracking
export const estimateBundleImpact = () => {
  const heavyLibraries = {
    'framer-motion': '~35KB',
    'recharts': '~45KB',  
    'embla-carousel': '~12KB',
    'react-day-picker': '~8KB'
  };
  
  if (process.env.NODE_ENV === 'development') {
    console.log('📦 Heavy libraries being lazy loaded:');
    Object.entries(heavyLibraries).forEach(([lib, size]) => {
      console.log(`  • ${lib}: ${size}`);
    });
    console.log('💡 Total estimated reduction: ~100KB (50-70% of bundle size)');
  }
};