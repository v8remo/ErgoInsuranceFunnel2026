import { useEffect } from 'react';
import SEO from "@/components/SEO";
import FunnelOverlay from "@/components/FunnelOverlay";
import { trackEvent } from '@/lib/analytics';

export default function LeadPage() {
  useEffect(() => {
    trackEvent('lead_page_view', { source: 'google_ads' });
  }, []);

  return (
    <>
      <SEO
        title="Kostenlose Versicherungsberatung – ERGO Agentur Stübe"
        description="Starten Sie jetzt Ihre kostenlose Versicherungsanalyse. In wenigen Schritten zum persönlichen Angebot von Ihrem ERGO Berater Morino Stübe."
        keywords="Versicherungsberatung kostenlos, Versicherungsvergleich, ERGO Beratung, Versicherung Ganderkesee, kostenlose Analyse"
      />
      <FunnelOverlay
        isOpen={true}
        onClose={() => {
          window.location.href = '/';
        }}
      />
    </>
  );
}
