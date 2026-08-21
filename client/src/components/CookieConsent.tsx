import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { getConsent, setConsent, loadTrackingScripts, revokeMarketingConsent, initAnalytics, CONSENT_KEY } from '@/lib/analytics';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = getConsent();
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    setConsent('all');
    loadTrackingScripts();
    initAnalytics();
    setVisible(false);
  };

  const handleNecessaryOnly = () => {
    setConsent('necessary');
    revokeMarketingConsent();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center" role="dialog" aria-label="Cookie-Einstellungen">
      <div className="fixed inset-0 bg-black/40" onClick={() => {}} />
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-lg shadow-[0_8px_24px_rgba(38,38,38,0.2)] border-t sm:border border-ergo-line max-h-[90vh] overflow-y-auto">
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-lg font-bold text-ergo-ink">Cookie-Einstellungen</h2>
          </div>

          <p className="text-sm text-ergo-stone mb-4 leading-relaxed">
            Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten.
            Einige Cookies sind technisch notwendig, andere helfen uns, unser Angebot zu verbessern
            und Werbung gezielt auszuspielen.
          </p>

          {showDetails && (
            <div className="mb-4 space-y-3">
              <div className="bg-ergo-gray border border-ergo-line rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 bg-ergo-check rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-sm font-semibold text-ergo-ink">Notwendige Cookies</span>
                  <span className="text-xs text-ergo-check font-semibold ml-auto">Immer aktiv</span>
                </div>
                <p className="text-xs text-ergo-stone">
                  Diese Cookies sind für den Betrieb der Website erforderlich und können nicht deaktiviert werden.
                  Sie ermöglichen grundlegende Funktionen wie Seitennavigation und Zugriff auf geschützte Bereiche.
                </p>
                <p className="text-xs text-ergo-mute mt-1">Rechtsgrundlage: § 25 Abs. 2 TDDDG, Art. 6 Abs. 1 lit. f DSGVO</p>
              </div>

              <div className="bg-white border border-ergo-line rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 bg-ergo-red rounded-full flex items-center justify-center text-white text-xs">i</div>
                  <span className="text-sm font-semibold text-ergo-ink">Marketing & Analyse</span>
                  <span className="text-xs text-ergo-red font-semibold ml-auto">Einwilligung erforderlich</span>
                </div>
                <p className="text-xs text-ergo-stone">
                  Diese Cookies ermöglichen es uns, Ihr Nutzungsverhalten zu analysieren (Google Analytics)
                  und Werbung gezielt auszuspielen (Google Ads). Die Daten werden an Google Ireland Ltd. übermittelt.
                </p>
                <p className="text-xs text-ergo-mute mt-1">Rechtsgrundlage: § 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO</p>
                <p className="text-xs text-ergo-mute">Speicherdauer: bis zu 24 Monate</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <button
              onClick={handleAcceptAll}
              className="ergo-btn ergo-btn--primary w-full text-sm"
            >
              Alle akzeptieren
            </button>
            <button
              onClick={handleNecessaryOnly}
              className="ergo-btn ergo-btn--tertiary w-full text-sm"
            >
              Nur notwendige Cookies
            </button>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-ergo-line">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-ergo-red font-bold hover:underline"
            >
              {showDetails ? 'Details ausblenden' : 'Details anzeigen'}
            </button>
            <div className="flex gap-3">
              <Link href="/datenschutz" className="text-xs text-ergo-mute hover:text-ergo-red">Datenschutz</Link>
              <Link href="/impressum" className="text-xs text-ergo-mute hover:text-ergo-red">Impressum</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CookieSettingsButton() {
  const handleOpen = () => {
    revokeMarketingConsent();
    localStorage.removeItem(CONSENT_KEY);
    window.location.reload();
  };

  return (
    <button
      onClick={handleOpen}
      className="text-xs text-ergo-mute hover:text-ergo-red underline"
    >
      Cookie-Einstellungen
    </button>
  );
}
