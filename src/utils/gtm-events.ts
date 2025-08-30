// GTM Event Utilities and Constants
// Centralized event definitions for consistent tracking

export const GTM_EVENTS = {
  // Form Events
  FORM_SUBMISSION: 'form_submission',
  FORM_START: 'form_start',
  FORM_STEP: 'form_step',
  FORM_ERROR: 'form_error',
  
  // User Interactions
  BUTTON_CLICK: 'button_click',
  MODAL_OPEN: 'modal_open',
  SERVICE_SELECT: 'service_select',
  NAVIGATION: 'navigation',
  
  // Conversions
  PITCH_GENERATED: 'pitch_generated',
  REQUIREMENT_SUBMITTED: 'requirement_submitted',
  FORM_COMPLETED: 'form_completed',
  
  // Page Events
  PAGE_VIEW: 'page_view',
  USER_PROPERTIES_SET: 'user_properties_set',
} as const;

export const FORM_TYPES = {
  BUSINESS_FORM: 'business_form',
  CONTACT_FORM: 'contact_form',
  REQUIREMENT_FORM: 'requirement_form',
} as const;

export const INTERACTION_TYPES = {
  BUTTON_CLICK: 'button_click',
  MODAL_OPEN: 'modal_open',
  SERVICE_SELECT: 'service_select',
  NAVIGATION: 'navigation',
  FORM_START: 'form_start',
  FORM_STEP: 'form_step',
  FORM_ERROR: 'form_error',
} as const;

export const CONVERSION_TYPES = {
  PITCH_GENERATED: 'pitch_generated',
  REQUIREMENT_SUBMITTED: 'requirement_submitted',
  FORM_COMPLETED: 'form_completed',
} as const;

// Helper function to create standardized event objects
export function createGTMEvent(
  eventName: string,
  additionalData: Record<string, any> = {}
) {
  return {
    event: eventName,
    timestamp: new Date().toISOString(),
    page_path: window.location.pathname,
    page_url: window.location.href,
    user_agent: navigator.userAgent,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    ...additionalData,
  };
}

// Enhanced event creators for specific use cases
export const GTMEventCreators = {
  formSubmission: (formType: string, additionalData: Record<string, any> = {}) =>
    createGTMEvent(GTM_EVENTS.FORM_SUBMISSION, {
      form_type: formType,
      ...additionalData,
    }),

  conversion: (conversionType: string, additionalData: Record<string, any> = {}) =>
    createGTMEvent('conversion', {
      conversion_type: conversionType,
      conversion_value: 1,
      ...additionalData,
    }),

  userInteraction: (interactionType: string, additionalData: Record<string, any> = {}) =>
    createGTMEvent('user_interaction', {
      interaction_type: interactionType,
      ...additionalData,
    }),

  pageView: (title: string, path: string) =>
    createGTMEvent(GTM_EVENTS.PAGE_VIEW, {
      page_title: title,
      page_path: path,
      page_location: window.location.href,
    }),
};