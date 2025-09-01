// Performance optimization utilities

// Debounced resize handler for performance
export const createDebouncedResize = (callback: () => void, delay: number = 100) => {
  let timeoutId: NodeJS.Timeout;
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  };
};

// Throttled scroll handler
export const createThrottledScroll = (callback: () => void, delay: number = 16) => {
  let lastTime = 0;
  return () => {
    const now = Date.now();
    if (now - lastTime >= delay) {
      lastTime = now;
      callback();
    }
  };
};

// Image lazy loading with IntersectionObserver
export const createImageObserver = (callback: (entries: IntersectionObserverEntry[]) => void) => {
  if (!('IntersectionObserver' in window)) {
    return null;
  }
  
  return new IntersectionObserver(callback, {
    rootMargin: '50px 0px',
    threshold: 0.1
  });
};

// Prefetch resources on hover/focus
export const prefetchResource = (url: string, type: 'script' | 'style' | 'image' = 'script') => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = type;
  link.href = url;
  document.head.appendChild(link);
};

// Service Worker registration for caching
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('ServiceWorker registered:', registration);
    } catch (error) {
      console.log('ServiceWorker registration failed:', error);
    }
  }
};

// Memory cleanup utilities
export const cleanupEventListeners = (element: HTMLElement, events: string[]) => {
  events.forEach(event => {
    element.removeEventListener(event, () => {});
  });
};

// Performance monitoring helpers
export const measureRenderTime = (componentName: string) => {
  const startTime = performance.now();
  return () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    if (renderTime > 16) { // Log renders taking longer than 16ms
      console.warn(`${componentName} render took ${renderTime.toFixed(2)}ms`);
    }
    
    // Send to analytics if available
    if (window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: `${componentName}_render`,
        value: Math.round(renderTime)
      });
    }
  };
};

// Bundle size estimation
export const getBundleInfo = () => {
  if (process.env.NODE_ENV === 'development') {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    
    console.group('Bundle Analysis');
    console.log(`Scripts loaded: ${scripts.length}`);
    console.log(`Stylesheets loaded: ${styles.length}`);
    console.log('Script sources:', scripts.map(s => s.getAttribute('src')));
    console.groupEnd();
  }
};

// Critical resource hints
export const addResourceHints = () => {
  const hints = [
    { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
    { rel: 'preconnect', href: 'https://www.googletagmanager.com' }
  ];
  
  hints.forEach(hint => {
    const existing = document.querySelector(`link[href="${hint.href}"]`);
    if (!existing) {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      if (hint.rel === 'preconnect') {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    }
  });
};