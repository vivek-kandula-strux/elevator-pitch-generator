import { useEffect } from 'react';

// Critical CSS inlining for above-the-fold content
export const CriticalCSS = () => {
  useEffect(() => {
    // Inline critical styles for instant render
    const criticalStyles = `
      /* Critical above-the-fold styles */
      .hero-container {
        min-height: 100vh;
        background: linear-gradient(180deg, #11141a, #1a1d24);
        position: relative;
        overflow: hidden;
      }
      
      .hero-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 2rem;
        text-align: center;
        position: relative;
        z-index: 10;
      }
      
      .hero-title {
        font-size: clamp(2.5rem, 5vw, 4rem);
        font-weight: 700;
        color: #f1f5f9;
        margin-bottom: 1.5rem;
        line-height: 1.1;
        letter-spacing: -0.02em;
      }
      
      .hero-subtitle {
        font-size: clamp(1.125rem, 2vw, 1.5rem);
        color: #94a3b8;
        margin-bottom: 2rem;
        max-width: 600px;
        line-height: 1.5;
      }
      
      .hero-cta {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem 2rem;
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        color: white;
        border-radius: 1rem;
        font-weight: 600;
        text-decoration: none;
        transition: transform 0.2s ease;
      }
      
      .hero-cta:hover {
        transform: translateY(-2px);
      }
      
      .loading-screen {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: linear-gradient(180deg, #11141a, #1a1d24);
      }
      
      .loading-spinner {
        width: 3rem;
        height: 3rem;
        border: 3px solid transparent;
        border-top: 3px solid #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      /* Hide non-critical content during initial load */
      .deferred-content {
        opacity: 0;
        animation: fadeInDeferred 0.5s ease-out 0.5s forwards;
      }
      
      @keyframes fadeInDeferred {
        to { opacity: 1; }
      }
    `;

    // Check if critical styles are already injected
    if (!document.querySelector('#critical-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'critical-styles';
      styleElement.innerHTML = criticalStyles;
      document.head.appendChild(styleElement);
    }

    // Remove critical CSS after main CSS loads
    const timer = setTimeout(() => {
      const criticalStylesElement = document.querySelector('#critical-styles');
      if (criticalStylesElement) {
        criticalStylesElement.remove();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return null;
};

// Hook to defer non-critical CSS loading
export const useDeferredCSS = () => {
  useEffect(() => {
    // Defer non-critical CSS loading
    const deferCSS = () => {
      const nonCriticalCSS = [
        // Add any non-critical CSS files here
      ];

      nonCriticalCSS.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = 'print';
        link.onload = () => {
          link.media = 'all';
        };
        document.head.appendChild(link);
      });
    };

    // Load deferred CSS after main content
    if (document.readyState === 'complete') {
      deferCSS();
    } else {
      window.addEventListener('load', deferCSS);
      return () => window.removeEventListener('load', deferCSS);
    }
  }, []);
};