import { useEffect } from 'react';

interface ResourcePreloaderProps {
  preloadImages?: string[];
  preloadFonts?: string[];
  preloadScripts?: string[];
  preloadStyles?: string[];
}

export const ResourcePreloader = ({ 
  preloadImages = [],
  preloadFonts = [],
  preloadScripts = [],
  preloadStyles = []
}: ResourcePreloaderProps) => {
  useEffect(() => {
    // Preload critical images
    preloadImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // Preload fonts
    preloadFonts.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.href = href;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Preload scripts
    preloadScripts.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = src;
      document.head.appendChild(link);
    });

    // Preload stylesheets
    preloadStyles.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      document.head.appendChild(link);
    });
  }, [preloadImages, preloadFonts, preloadScripts, preloadStyles]);

  return null;
};

// Hook for dynamic resource preloading
export const useResourcePreloader = () => {
  const preloadImage = (src: string) => {
    const img = new Image();
    img.src = src;
  };

  const preloadRoute = (path: string) => {
    // Preload route chunks
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        import(/* webpackChunkName: "route-[request]" */ `../pages${path}`);
      });
    }
  };

  const preloadComponent = (importFn: () => Promise<any>) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        importFn();
      });
    }
  };

  return { preloadImage, preloadRoute, preloadComponent };
};