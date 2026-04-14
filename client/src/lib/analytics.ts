declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    gtag_report_conversion: (url?: string) => boolean;
    gtag_report_appointment_conversion: (url?: string) => boolean;
    loadGoogleAds: () => void;
    fbq: (...args: any[]) => void;
  }
}

export const CONSENT_KEY = 'ergo_cookie_consent';

export type ConsentChoice = 'all' | 'necessary' | null;

export const getConsent = (): ConsentChoice => {
  try {
    const val = localStorage.getItem(CONSENT_KEY);
    if (val === 'all' || val === 'necessary') return val;
    return null;
  } catch {
    return null;
  }
};

export const setConsent = (choice: ConsentChoice) => {
  try {
    if (choice) localStorage.setItem(CONSENT_KEY, choice);
  } catch {}
};

export const hasMarketingConsent = (): boolean => getConsent() === 'all';

export const loadTrackingScripts = () => {
  if (typeof window === 'undefined') return;
  if (!hasMarketingConsent()) return;

  if (window.loadGoogleAds) {
    window.loadGoogleAds();
  }

  initMetaPixel();
};

export const revokeMarketingConsent = () => {
  setConsent('necessary');

  try {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const name = cookie.split('=')[0].trim();
      if (name.startsWith('_ga') || name.startsWith('_gid') || name.startsWith('_gat') || name.startsWith('_fbp') || name.startsWith('_fbc')) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      }
    }
  } catch {}
};

export const initGA = () => {
  if (!hasMarketingConsent()) return;

  if (import.meta.env.DEV) {
    const measurementId = 'AW-17132012984';
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      console.log('Google Analytics (Google Ads) initialized with ID:', measurementId);
    }
  }
};

export const initMetaPixel = () => {
  if (!hasMarketingConsent()) return;

  const pixelId = import.meta.env.VITE_META_PIXEL_ID;

  if (!pixelId) {
    return;
  }

  if (typeof window.fbq === 'function') return;

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

  const noscript = document.createElement('noscript');
  const img = document.createElement('img');
  img.height = 1;
  img.width = 1;
  img.style.display = 'none';
  img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
  noscript.appendChild(img);
  document.head.appendChild(noscript);
};

export const trackPageView = (url: string) => {
  if (typeof window === 'undefined') return;
  if (!hasMarketingConsent()) return;

  if (window.gtag) {
    const measurementId = 'AW-17132012984';
    window.gtag('config', measurementId, {
      page_path: url,
      page_title: document.title,
      page_location: window.location.href
    });
  }

  if (window.fbq) {
    window.fbq('track', 'PageView');
  }
};

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
  if (!hasMarketingConsent()) return;

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

  if (window.fbq) {
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

  if (import.meta.env.DEV) {
    console.log('Event tracked:', { action, parameters });
  }
};

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

export const initAnalytics = () => {
  if (typeof window === 'undefined') return;

  if (hasMarketingConsent()) {
    loadTrackingScripts();
    initGA();
    trackPageView(window.location.pathname);
  }

  if (import.meta.env.DEV) {
    console.log('Analytics initialized', hasMarketingConsent() ? '(with marketing consent)' : '(necessary only)');
  }
};

export const trackLeadGeneration = (leadData: {
  insuranceType: string;
  age: string;
  location: string;
  leadValue?: number;
}) => {
  if (!hasMarketingConsent()) return;

  const value = leadData.leadValue || getLeadValue(leadData.insuranceType);

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

export const getLeadValue = (insuranceType: string): number => {
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

export const trackScrollDepth = (percentage: number) => {
  if (percentage % 25 === 0) {
    trackEvent('scroll_depth', {
      event_category: 'Engagement',
      event_label: `${percentage}%`,
      value: percentage
    });
  }
};

export const trackError = (error: string, location: string) => {
  trackEvent('error_occurred', {
    event_category: 'Error',
    event_label: error,
    error_location: location
  });
};

export const trackConversion = (url?: string) => {
  if (typeof window === 'undefined' || !window.gtag_report_conversion) return false;
  if (!hasMarketingConsent()) return false;
  return window.gtag_report_conversion(url);
};

export const trackAppointmentConversion = (url?: string) => {
  if (typeof window === 'undefined' || !window.gtag_report_appointment_conversion) return false;
  if (!hasMarketingConsent()) return false;
  return window.gtag_report_appointment_conversion(url);
};
