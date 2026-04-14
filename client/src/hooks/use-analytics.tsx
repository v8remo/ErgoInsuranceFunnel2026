import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { trackPageView, initAnalytics, trackScrollDepth, getLeadValue } from '@/lib/analytics';

export const useAnalytics = () => {
  const [location] = useLocation();
  const prevLocationRef = useRef<string>(location);
  const analyticsInitialized = useRef<boolean>(false);
  
  // Initialize analytics on first render
  useEffect(() => {
    if (!analyticsInitialized.current) {
      initAnalytics();
      analyticsInitialized.current = true;
    }
  }, []);

  // Track page views when location changes
  useEffect(() => {
    if (location !== prevLocationRef.current) {
      trackPageView(location);
      prevLocationRef.current = location;
    }
  }, [location]);

  // Track scroll depth for engagement metrics
  useEffect(() => {
    let ticking = false;
    const scrollDepths = new Set<number>();

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollPercent = Math.round((scrollTop / docHeight) * 100);

          // Track major scroll milestones
          [25, 50, 75, 100].forEach(milestone => {
            if (scrollPercent >= milestone && !scrollDepths.has(milestone)) {
              scrollDepths.add(milestone);
              trackScrollDepth(milestone);
            }
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    // Only track scroll on main content pages
    if (location === '/' || location.startsWith('/versicherung/')) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [location]);

  // Track time on page
  useEffect(() => {
    const startTime = Date.now();
    
    return () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      
      // Only track if user spent more than 10 seconds on page
      if (timeOnPage > 10) {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'page_timing', {
            event_category: 'Engagement',
            event_label: location,
            value: timeOnPage,
            custom_parameters: {
              time_on_page_seconds: timeOnPage
            }
          });
        }
      }
    };
  }, [location]);
};

// Hook for tracking specific user interactions
export const useTrackInteraction = () => {
  const trackClick = (elementName: string, additionalData?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'User Interaction',
        event_label: elementName,
        ...additionalData
      });
    }

    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'ElementClick', {
        element_name: elementName,
        ...additionalData
      });
    }
  };

  const trackFormStart = (formName: string, insuranceType?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'form_start', {
        event_category: 'Form Interaction',
        event_label: formName,
        insurance_type: insuranceType
      });
    }

    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'BeginCheckout', {
        content_name: formName,
        content_category: 'Insurance Form'
      });
    }
  };

  const trackFormSubmit = (formName: string, insuranceType?: string, success: boolean = true) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', success ? 'form_submit' : 'form_error', {
        event_category: 'Form Interaction',
        event_label: formName,
        insurance_type: insuranceType
      });
    }

    if (typeof window !== 'undefined' && window.fbq && success) {
      window.fbq('track', 'CompleteRegistration', {
        content_name: formName,
        content_category: 'Insurance Form'
      });
    }
  };

  return {
    trackClick,
    trackFormStart,
    trackFormSubmit
  };
};

// Hook for tracking business-specific events
export const useInsuranceTracking = () => {
  const trackInsuranceView = (insuranceType: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_item', {
        event_category: 'Insurance',
        item_id: insuranceType,
        item_name: `${insuranceType} Insurance`,
        item_category: 'Insurance Product'
      });
    }

    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_type: 'product',
        content_ids: [insuranceType],
        content_name: `${insuranceType} Insurance`
      });
    }
  };

  const trackQuoteRequest = (insuranceType: string, customerAge: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'generate_lead', {
        event_category: 'Business Goal',
        currency: 'EUR',
        value: getLeadValue(insuranceType),
        insurance_type: insuranceType,
        customer_age: customerAge
      });
    }

    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead', {
        value: getLeadValue(insuranceType),
        currency: 'EUR',
        content_name: `${insuranceType} Quote Request`,
        content_category: 'Insurance'
      });
    }
  };

  const trackPhoneCall = (insuranceType?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'phone_call', {
        event_category: 'Contact',
        event_label: 'Phone Call Initiated',
        insurance_type: insuranceType
      });
    }

    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Contact', {
        content_name: 'Phone Call',
        content_category: 'Contact Method'
      });
    }
  };

  return {
    trackInsuranceView,
    trackQuoteRequest,
    trackPhoneCall
  };
};

