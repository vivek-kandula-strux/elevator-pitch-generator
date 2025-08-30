import { useCallback } from 'react';
import { useGTM } from '@/contexts/GTMContext';

export function useGTMTracking() {
  const gtm = useGTM();

  const trackButtonClick = useCallback((buttonText: string, elementId?: string) => {
    gtm.trackUserInteraction('button_click', {
      element_text: buttonText,
      element_id: elementId,
    });
  }, [gtm]);

  const trackModalOpen = useCallback((modalType: string) => {
    gtm.trackUserInteraction('modal_open', {
      modal_type: modalType,
    });
  }, [gtm]);

  const trackServiceSelection = useCallback((category: string, serviceName?: string) => {
    gtm.trackUserInteraction('service_select', {
      service_category: category,
      service_name: serviceName,
    });
  }, [gtm]);

  const trackNavigation = useCallback((destination: string, source?: string) => {
    gtm.trackUserInteraction('navigation', {
      destination,
      source,
    });
  }, [gtm]);

  const trackFormStart = useCallback((formType: 'business_form' | 'contact_form' | 'requirement_form') => {
    gtm.trackUserInteraction('form_start', {
      form_type: formType,
    });
  }, [gtm]);

  const trackFormStep = useCallback((formType: 'business_form' | 'contact_form' | 'requirement_form', step: string) => {
    gtm.trackUserInteraction('form_step', {
      form_type: formType,
      form_step: step,
    });
  }, [gtm]);

  const trackFormError = useCallback((formType: 'business_form' | 'contact_form' | 'requirement_form', error: string) => {
    gtm.trackUserInteraction('form_error', {
      form_type: formType,
      error_message: error,
    });
  }, [gtm]);

  const trackPitchGeneration = useCallback((company: string, category: string, recordId?: string) => {
    gtm.trackConversion('pitch_generated', {
      conversion_id: recordId,
      company,
      category,
      conversion_value: 1,
    });
  }, [gtm]);

  const trackRequirementSubmission = useCallback((serviceCategory: string, budget?: string) => {
    gtm.trackConversion('requirement_submitted', {
      service_category: serviceCategory,
      budget_range: budget,
      conversion_value: 1,
    });
  }, [gtm]);

  return {
    trackButtonClick,
    trackModalOpen,
    trackServiceSelection,
    trackNavigation,
    trackFormStart,
    trackFormStep,
    trackFormError,
    trackPitchGeneration,
    trackRequirementSubmission,
    trackFormSubmission: gtm.trackFormSubmission,
    trackConversion: gtm.trackConversion,
    setUserProperties: gtm.setUserProperties,
  };
}