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
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#003781] rounded-full flex items-center justify-center text-white text-lg shrink-0">
              🍪
            </div>
            <h2 className="text-lg font-bold text-gray-900">Cookie-Einstellungen</h2>
          </div>

          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten.
            Einige Cookies sind technisch notwendig, andere helfen uns, unser Angebot zu verbessern
            und Werbung gezielt auszuspielen.
          </p>

          {showDetails && (
            <div className="mb-4 space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">Notwendige Cookies</span>
                  <span className="text-xs text-green-700 ml-auto">Immer aktiv</span>
                </div>
                <p className="text-xs text-gray-600">
                  Diese Cookies sind für den Betrieb der Website erforderlich und können nicht deaktiviert werden.
                  Sie ermöglichen grundlegende Funktionen wie Seitennavigation und Zugriff auf geschützte Bereiche.
                </p>
                <p className="text-xs text-gray-500 mt-1">Rechtsgrundlage: § 25 Abs. 2 TDDDG, Art. 6 Abs. 1 lit. f DSGVO</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center text-white text-xs">i</div>
                  <span className="text-sm font-semibold text-gray-800">Marketing & Analyse</span>
                  <span className="text-xs text-blue-700 ml-auto">Einwilligung erforderlich</span>
                </div>
                <p className="text-xs text-gray-600">
                  Diese Cookies ermöglichen es uns, Ihr Nutzungsverhalten zu analysieren (Google Analytics)
                  und Werbung gezielt auszuspielen (Google Ads). Die Daten werden an Google Ireland Ltd. übermittelt.
                </p>
                <p className="text-xs text-gray-500 mt-1">Rechtsgrundlage: § 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO</p>
                <p className="text-xs text-gray-500">Speicherdauer: bis zu 24 Monate</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <button
              onClick={handleAcceptAll}
              className="w-full bg-[#E2001A] text-white font-semibold py-3 rounded-xl text-sm active:scale-[0.97] transition-transform min-h-[48px]"
            >
              Alle akzeptieren
            </button>
            <button
              onClick={handleNecessaryOnly}
              className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl text-sm active:scale-[0.97] transition-transform min-h-[48px]"
            >
              Nur notwendige Cookies
            </button>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-[#003781] font-semibold hover:underline"
            >
              {showDetails ? 'Details ausblenden' : 'Details anzeigen'}
            </button>
            <div className="flex gap-3">
              <Link href="/datenschutz" className="text-xs text-gray-500 hover:text-gray-700">Datenschutz</Link>
              <Link href="/impressum" className="text-xs text-gray-500 hover:text-gray-700">Impressum</Link>
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
      className="text-xs text-gray-500 hover:text-gray-700 underline"
    >
      Cookie-Einstellungen
    </button>
  );
}
