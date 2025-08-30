import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { gtm } from '@/lib/gtm';
import { useLocation } from 'react-router-dom';

interface GTMContextType {
  trackPageView: (title: string, path: string) => void;
  trackFormSubmission: (formType: 'business_form' | 'contact_form' | 'requirement_form', additionalData?: any) => void;
  trackUserInteraction: (interactionType: string, additionalData?: any) => void;
  trackConversion: (conversionType: string, additionalData?: any) => void;
  setUserProperties: (properties: Record<string, any>) => void;
}

const GTMContext = createContext<GTMContextType | undefined>(undefined);

interface GTMProviderProps {
  children: ReactNode;
}

export function GTMProvider({ children }: GTMProviderProps) {
  const location = useLocation();

  // Track page views on route changes
  useEffect(() => {
    const pageTitle = document.title;
    const pagePath = location.pathname + location.search;
    
    gtm.trackPageView(pageTitle, pagePath);
  }, [location]);

  const contextValue: GTMContextType = {
    trackPageView: gtm.trackPageView.bind(gtm),
    trackFormSubmission: gtm.trackFormSubmission.bind(gtm),
    trackUserInteraction: gtm.trackUserInteraction.bind(gtm),
    trackConversion: gtm.trackConversion.bind(gtm),
    setUserProperties: gtm.setUserProperties.bind(gtm),
  };

  return (
    <GTMContext.Provider value={contextValue}>
      {children}
    </GTMContext.Provider>
  );
}

export function useGTM() {
  const context = useContext(GTMContext);
  if (context === undefined) {
    throw new Error('useGTM must be used within a GTMProvider');
  }
  return context;
}