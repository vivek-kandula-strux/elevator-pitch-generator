// Google Tag Manager Integration
// Replace GTM-XXXXXX with your actual GTM container ID

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export interface GTMEvent {
  event: string;
  [key: string]: any;
}

export interface FormSubmissionEvent extends GTMEvent {
  event: 'form_submission';
  form_type: 'business_form' | 'contact_form' | 'requirement_form';
  form_step?: string;
  company?: string;
  category?: string;
}

export interface PageViewEvent extends GTMEvent {
  event: 'page_view';
  page_title: string;
  page_location: string;
  page_path: string;
}

export interface UserInteractionEvent extends GTMEvent {
  event: 'user_interaction';
  interaction_type: 'button_click' | 'modal_open' | 'service_select' | 'navigation';
  element_id?: string;
  element_text?: string;
  service_category?: string;
}

export interface ConversionEvent extends GTMEvent {
  event: 'conversion';
  conversion_type: 'pitch_generated' | 'form_completed' | 'requirement_submitted';
  conversion_id?: string;
  conversion_value?: number;
}

class GTMManager {
  private gtmId: string;
  private isInitialized: boolean = false;
  private isDebug: boolean = false;

  constructor() {
    this.gtmId = import.meta.env.PROD ? 'GTM-XXXXXX' : 'GTM-DEBUG';
    this.isDebug = !import.meta.env.PROD;
    this.initialize();
  }

  private initialize(): void {
    if (typeof window === 'undefined') return;

    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];
    
    // Replace the placeholder GTM ID in the script
    if (this.gtmId !== 'GTM-XXXXXX' && this.gtmId !== 'GTM-DEBUG') {
      this.replaceGTMId();
    }

    this.isInitialized = true;
    
    if (this.isDebug) {
      console.log('GTM Manager initialized in debug mode');
    }
  }

  private replaceGTMId(): void {
    // Update the GTM script src with the actual container ID
    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => {
      if (script.src && script.src.includes('GTM-XXXXXX')) {
        script.src = script.src.replace('GTM-XXXXXX', this.gtmId);
      }
    });

    // Update the noscript iframe src
    const noscriptIframe = document.querySelector('noscript iframe');
    if (noscriptIframe) {
      const src = noscriptIframe.getAttribute('src');
      if (src && src.includes('GTM-XXXXXX')) {
        noscriptIframe.setAttribute('src', src.replace('GTM-XXXXXX', this.gtmId));
      }
    }
  }

  public push(event: GTMEvent): void {
    if (!this.isInitialized || typeof window === 'undefined') {
      if (this.isDebug) {
        console.warn('GTM not initialized, event not sent:', event);
      }
      return;
    }

    // Add timestamp to all events
    const eventWithTimestamp = {
      ...event,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
    };

    window.dataLayer.push(eventWithTimestamp);

    if (this.isDebug) {
      console.log('GTM Event sent:', eventWithTimestamp);
    }
  }

  public trackPageView(title: string, path: string): void {
    this.push({
      event: 'page_view',
      page_title: title,
      page_location: window.location.href,
      page_path: path,
    });
  }

  public trackFormSubmission(
    formType: FormSubmissionEvent['form_type'],
    additionalData?: Partial<FormSubmissionEvent>
  ): void {
    this.push({
      event: 'form_submission',
      form_type: formType,
      ...additionalData,
    });
  }

  public trackUserInteraction(
    interactionType: UserInteractionEvent['interaction_type'],
    additionalData?: Partial<UserInteractionEvent>
  ): void {
    this.push({
      event: 'user_interaction',
      interaction_type: interactionType,
      ...additionalData,
    });
  }

  public trackConversion(
    conversionType: ConversionEvent['conversion_type'],
    additionalData?: Partial<ConversionEvent>
  ): void {
    this.push({
      event: 'conversion',
      conversion_type: conversionType,
      ...additionalData,
    });
  }

  public setUserProperties(properties: Record<string, any>): void {
    this.push({
      event: 'user_properties_set',
      user_properties: properties,
    });
  }

  public isReady(): boolean {
    return this.isInitialized;
  }
}

// Export singleton instance
export const gtm = new GTMManager();