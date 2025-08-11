// Define the gtag function globally
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    gtag_report_conversion: (url?: string) => boolean;
    gtag_report_appointment_conversion: (url?: string) => boolean;
    fbq: (...args: any[]) => void;
  }
}

// Initialize Google Analytics with Google Ads ID
export const initGA = () => {
  const measurementId = 'AW-17132012984'; // Google Ads ID
  
  // Note: The Google tag is already loaded in index.html
  // This function ensures gtag is available for tracking
  if (typeof window !== 'undefined' && window.gtag) {
    console.log('Google Analytics (Google Ads) initialized with ID:', measurementId);
  } else {
    console.warn('Google Analytics not loaded. Check if gtag script is properly included.');
  }
};

// Initialize Meta Pixel
export const initMetaPixel = () => {
  const pixelId = import.meta.env.VITE_META_PIXEL_ID;

  if (!pixelId) {
    console.warn('Missing Meta Pixel ID: VITE_META_PIXEL_ID');
    return;
  }

  // Meta Pixel initialization
  const script = document.createElement('script');
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${pixelId}');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(script);

  // Add noscript pixel for users with JavaScript disabled
  const noscript = document.createElement('noscript');
  const img = document.createElement('img');
  img.height = 1;
  img.width = 1;
  img.style.display = 'none';
  img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
  noscript.appendChild(img);
  document.head.appendChild(noscript);
};

// Track page views - useful for single-page applications
export const trackPageView = (url: string) => {
  if (typeof window === 'undefined') return;
  
  // Google Analytics tracking with Google Ads ID
  if (window.gtag) {
    const measurementId = 'AW-17132012984'; // Google Ads ID
    window.gtag('config', measurementId, {
      page_path: url,
      page_title: document.title,
      page_location: window.location.href
    });
  }

  // Meta Pixel page view tracking
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }
};

// Track events for conversions and user interactions
export const trackEvent = (
  action: string, 
  parameters?: {
    event_category?: string;
    event_label?: string;
    value?: number;
    insurance_type?: string;
    lead_value?: number;
    step?: number;
    [key: string]: any;
  }
) => {
  if (typeof window === 'undefined') return;
  
  // Google Analytics event tracking
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: parameters?.event_category || 'engagement',
      event_label: parameters?.event_label,
      value: parameters?.value || parameters?.lead_value,
      custom_parameters: {
        insurance_type: parameters?.insurance_type,
        step: parameters?.step,
        ...parameters
      }
    });
  }

  // Meta Pixel event tracking
  if (window.fbq) {
    // Map common events to Meta Pixel standard events
    const eventMap: Record<string, string> = {
      'insurance_selected': 'InitiateCheckout',
      'funnel_started': 'BeginCheckout',
      'funnel_step_completed': 'AddPaymentInfo',
      'lead_generated': 'Lead',
      'combo_package_selected': 'Contact',
      'admin_login': 'CompleteRegistration',
      'leads_exported': 'Search'
    };

    const metaEvent = eventMap[action] || 'CustomEvent';
    
    if (metaEvent === 'Lead' && parameters?.lead_value) {
      window.fbq('track', 'Lead', {
        value: parameters.lead_value,
        currency: 'EUR',
        content_name: parameters.insurance_type || 'Insurance Lead'
      });
    } else if (metaEvent === 'InitiateCheckout' && parameters?.insurance_type) {
      window.fbq('track', 'InitiateCheckout', {
        content_name: parameters.insurance_type,
        content_category: 'Insurance'
      });
    } else {
      window.fbq('track', metaEvent, parameters);
    }
  }

  // Console logging for development
  if (import.meta.env.DEV) {
    console.log('Event tracked:', { action, parameters });
  }
};

// Track specific insurance-related events
export const trackInsuranceEvent = (
  insuranceType: string,
  eventType: 'view' | 'interest' | 'funnel_start' | 'funnel_complete' | 'lead_generated',
  additionalData?: Record<string, any>
) => {
  const eventNames = {
    view: 'insurance_page_view',
    interest: 'insurance_interest',
    funnel_start: 'funnel_started',
    funnel_complete: 'funnel_completed',
    lead_generated: 'lead_generated'
  };

  trackEvent(eventNames[eventType], {
    event_category: 'Insurance',
    insurance_type: insuranceType,
    ...additionalData
  });
};

// Track conversion funnel steps
export const trackFunnelStep = (
  insuranceType: string,
  step: number,
  stepName: string,
  completed: boolean = false
) => {
  trackEvent(completed ? 'funnel_step_completed' : 'funnel_step_started', {
    event_category: 'Funnel',
    insurance_type: insuranceType,
    step: step,
    step_name: stepName,
    event_label: `${insuranceType} - Step ${step}: ${stepName}`
  });
};

// Initialize all analytics on app start
export const initAnalytics = () => {
  if (typeof window === 'undefined') return;

  // Initialize Google Analytics
  initGA();
  
  // Initialize Meta Pixel
  initMetaPixel();

  // Track initial page view
  trackPageView(window.location.pathname);

  if (import.meta.env.DEV) {
    console.log('Analytics initialized');
  }
};

// Enhanced conversion tracking for lead generation
export const trackLeadGeneration = (leadData: {
  insuranceType: string;
  age: string;
  location: string;
  leadValue?: number;
}) => {
  const value = leadData.leadValue || getLeadValue(leadData.insuranceType);
  
  // Google Ads Conversion tracking
  if (window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': 'AW-17132012984/lead_generated',
      'value': value,
      'currency': 'EUR',
      'custom_parameters': {
        'insurance_type': leadData.insuranceType,
        'age_group': leadData.age,
        'location': leadData.location
      }
    });
  }
  
  trackEvent('lead_generated', {
    event_category: 'Conversion',
    insurance_type: leadData.insuranceType,
    lead_value: value,
    customer_age_group: leadData.age,
    customer_location: leadData.location,
    value: value
  });

  // Track Meta Pixel Lead event with enhanced data
  if (window.fbq) {
    window.fbq('track', 'Lead', {
      value: value,
      currency: 'EUR',
      content_name: `${leadData.insuranceType} Insurance Lead`,
      content_category: 'Insurance',
      custom_data: {
        age_group: leadData.age,
        location: leadData.location,
        product_type: leadData.insuranceType
      }
    });
  }
};

// Get estimated lead value based on insurance type
const getLeadValue = (insuranceType: string): number => {
  const leadValues: Record<string, number> = {
    hausrat: 50,
    haftpflicht: 40,
    wohngebaeude: 100,
    rechtsschutz: 60,
    zahnzusatz: 45,
    kombi: 150
  };
  
  return leadValues[insuranceType] || 50;
};

// Track user engagement metrics
export const trackEngagement = (
  action: string,
  element: string,
  location?: string
) => {
  trackEvent('user_engagement', {
    event_category: 'Engagement',
    event_label: action,
    engagement_element: element,
    page_location: location || window.location.pathname
  });
};

// Track scroll depth for content optimization
export const trackScrollDepth = (percentage: number) => {
  if (percentage % 25 === 0) { // Track at 25%, 50%, 75%, 100%
    trackEvent('scroll_depth', {
      event_category: 'Engagement',
      event_label: `${percentage}%`,
      value: percentage
    });
  }
};

// Error tracking for debugging
export const trackError = (error: string, location: string) => {
  trackEvent('error_occurred', {
    event_category: 'Error',
    event_label: error,
    error_location: location
  });
};

// Track Google Ads conversions with proper callback
export const trackConversion = (url?: string) => {
  if (typeof window === 'undefined' || !window.gtag_report_conversion) {
    console.warn('Google Ads conversion tracking not available');
    return false;
  }
  
  return window.gtag_report_conversion(url);
};

// Track Google Ads appointment conversions with proper callback
export const trackAppointmentConversion = (url?: string) => {
  if (typeof window === 'undefined' || !window.gtag_report_appointment_conversion) {
    console.warn('Google Ads appointment conversion tracking not available');
    return false;
  }
  
  return window.gtag_report_appointment_conversion(url);
};
