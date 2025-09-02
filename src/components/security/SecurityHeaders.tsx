/**
 * Security Headers Component
 * Adds security-related meta tags and CSP headers
 */

import { useEffect } from 'react';

export const SecurityHeaders = () => {
  useEffect(() => {
    // Add Content Security Policy meta tag
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://sgggqrcwfcbtyianduyo.supabase.co https://api.openai.com https://www.google-analytics.com",
      "frame-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');
    
    // Remove existing CSP meta tag if present
    const existingCsp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (existingCsp) {
      existingCsp.remove();
    }
    
    document.head.appendChild(cspMeta);

    // Add other security headers via meta tags
    const securityMetas = [
      { name: 'referrer', content: 'strict-origin-when-cross-origin' },
      { httpEquiv: 'X-Content-Type-Options', content: 'nosniff' },
      { httpEquiv: 'X-Frame-Options', content: 'DENY' },
      { httpEquiv: 'X-XSS-Protection', content: '1; mode=block' },
      { httpEquiv: 'Strict-Transport-Security', content: 'max-age=31536000; includeSubDomains' }
    ];

    const addedMetas: HTMLMetaElement[] = [];

    securityMetas.forEach(meta => {
      const metaElement = document.createElement('meta');
      if (meta.name) metaElement.name = meta.name;
      if (meta.httpEquiv) metaElement.httpEquiv = meta.httpEquiv;
      metaElement.content = meta.content;
      document.head.appendChild(metaElement);
      addedMetas.push(metaElement);
    });

    // Cleanup function
    return () => {
      cspMeta.remove();
      addedMetas.forEach(meta => meta.remove());
    };
  }, []);

  return null; // This component doesn't render anything
};