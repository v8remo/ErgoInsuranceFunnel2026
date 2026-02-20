import { useState } from 'react';
import { Link } from 'wouter';
import { Phone, Mail, Shield, Star, CheckCircle, MapPin, MessageSquare, FileText, AlertTriangle, Award, Trophy, Instagram, ExternalLink } from 'lucide-react';
import { trackEvent, trackConversion } from '@/lib/analytics';
import FunnelOverlay from './FunnelOverlay';
import '@/styles/funnel.css';

import ichBinDaPhoto from '@assets/Untitled_(2)_1771598345647.png';
import sittingPhoto from '@assets/ich_bin_da_1771598345650.png';
import portraitPhoto from '@assets/image_(1)_1771598345651.png';
import beraterBranding from '@assets/Unbenannt_(1)_1771598345651.png';
import standingPhoto from '@assets/image_1771598345651.png';

const awards = [
  { source: 'Stiftung Warentest', product: 'Zahnzusatz', rating: 'SEHR GUT (0,5)', label: 'Testsieger 2024', color: 'bg-yellow-50 border-yellow-300' },
  { source: 'Stiftung Warentest', product: 'Reisekranken', rating: 'GUT (2,3)', label: 'Testsieger 2024', color: 'bg-yellow-50 border-yellow-300' },
  { source: 'Finanztest', product: 'BU-Versicherung', rating: 'SEHR GUT', label: '2024', color: 'bg-green-50 border-green-300' },
  { source: 'Franke & Bornberg', product: 'Kfz-Versicherung', rating: 'HERVORRAGEND', label: '2025', color: 'bg-blue-50 border-blue-300' },
  { source: 'ServiceValue', product: 'Service-Champion', rating: '11× in Folge', label: '2025', color: 'bg-purple-50 border-purple-300' },
  { source: 'Branchen-Champion', product: 'Rechtsschutz', rating: 'Platz 1 Kundenzufriedenheit', label: '2025', color: 'bg-red-50 border-red-300' },
];

export default function ProfessionalErgoLanding() {
  const [showFunnel, setShowFunnel] = useState(false);

  const whatsappNumber = "15566771019";
  const whatsappMessage = encodeURIComponent(
    "Hallo Herr Stübe, ich interessiere mich für eine persönliche Beratung zu meinen Versicherungen. Können wir einen Termin vereinbaren?"
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      {/* ──────── HERO ──────── */}
      <section className="px-4 pt-8 pb-10 md:pt-16 md:pb-20 text-center max-w-3xl mx-auto">
        <span className="inline-block bg-ergo-red text-white text-xs font-bold tracking-wide uppercase px-4 py-1.5 rounded-full mb-5 md:text-sm">
          ERGO Versicherungsfachmann · Ganderkesee
        </span>

        <h1 className="text-xl font-extrabold text-gray-900 leading-tight mb-4 sm:text-2xl md:text-4xl lg:text-5xl">
          Ihre ERGO Agentur in Ganderkesee –{' '}
          <span className="text-ergo-red">Persönliche Beratung rund um Ihre Absicherung</span>
        </h1>

        <p className="text-base text-gray-600 leading-relaxed mb-8 md:text-lg max-w-2xl mx-auto">
          Ob Kfz, Zahnzusatz, Wohngebäude oder Haftpflicht – wir beraten Sie individuell und transparent.
        </p>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
          <button
            onClick={() => {
              setShowFunnel(true);
              trackEvent('cta_beratung_clicked', { source: 'hero_section' });
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-ergo-red text-white font-semibold text-sm px-5 py-3.5 rounded-xl shadow-md active:scale-[0.97] transition-transform whitespace-nowrap md:text-base md:px-6 md:py-4"
          >
            <Mail className="w-4 h-4 shrink-0 md:w-5 md:h-5" />
            Jetzt Beratung anfragen
          </button>

          <a
            href={`https://wa.me/49${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackEvent('whatsapp_clicked', { source: 'hero_section' });
              trackConversion();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-green-500 text-green-600 font-semibold text-sm px-5 py-3.5 rounded-xl active:scale-[0.97] transition-transform whitespace-nowrap md:text-base md:px-6 md:py-4"
          >
            <MessageSquare className="w-4 h-4 shrink-0 md:w-5 md:h-5" />
            Direkt über WhatsApp
          </a>

          <div className="grid grid-cols-2 gap-2 sm:contents">
            <Link
              href="/dokumente"
              className="flex items-center justify-center gap-1 border-2 border-[#003781] text-[#003781] font-semibold text-xs px-2.5 py-3 rounded-xl active:scale-[0.97] transition-transform text-center leading-tight sm:text-sm sm:px-5 sm:py-3.5 sm:w-auto sm:gap-2 md:text-base md:px-6 md:py-4"
            >
              <FileText className="w-4 h-4 shrink-0 hidden sm:block md:w-5 md:h-5" />
              Dokument einreichen
            </Link>

            <Link
              href="/schaden"
              className="flex items-center justify-center gap-1 border-2 border-[#E2001A] text-[#E2001A] font-semibold text-xs px-2.5 py-3 rounded-xl active:scale-[0.97] transition-transform text-center leading-tight sm:text-sm sm:px-5 sm:py-3.5 sm:w-auto sm:gap-2 md:text-base md:px-6 md:py-4"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 hidden sm:block md:w-5 md:h-5" />
              Schaden melden
            </Link>
          </div>

          <Link
            href="/kennzeichen"
            className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-[#003781] text-[#003781] font-semibold text-xs px-2.5 py-3 rounded-xl active:scale-[0.97] transition-transform text-center leading-tight sm:text-sm sm:px-5 sm:py-3.5 sm:gap-2 md:text-base md:px-6 md:py-4"
          >
            EVB & Kennzeichen anfordern
          </Link>
        </div>
      </section>

      {/* ──────── VERTRAUEN / BERATER ──────── */}
      <section className="px-4 pb-10 md:pb-16 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 md:p-8">
          <div className="flex flex-col items-center text-center gap-5 md:flex-row md:text-left md:items-start">
            <img
              src={portraitPhoto}
              alt="Morino Stübe - ERGO Versicherungsfachmann"
              className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-[3px] border-ergo-red shadow-md shrink-0"
              loading="eager"
            />

            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-1 md:text-2xl">Morino Stübe</h2>
              <p className="text-ergo-red font-semibold text-sm mb-3 md:text-base">ERGO Versicherungsfachmann</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 md:text-base">
                Mit über 3 Jahren Erfahrung in der Versicherungsbranche berate ich Sie kompetent und verständlich zu allen Fragen rund um Ihre Absicherung.
              </p>

              <div className="flex flex-col gap-2 text-xs text-gray-500 md:text-sm">
                <span className="flex items-center justify-center md:justify-start gap-1.5">
                  <Shield className="w-4 h-4 text-ergo-red shrink-0" />
                  Vermittlerregister-Nr. D-5H7J-7DUI1-10
                </span>
                <span className="flex items-center justify-center md:justify-start gap-1.5">
                  <Star className="w-4 h-4 text-yellow-500 shrink-0" />
                  ERGO als starker Partner seit 1906
                </span>
              </div>
            </div>

            <img
              src="/attached_assets/ergo-logo-hq.svg"
              alt="ERGO Logo"
              className="h-10 md:h-14 w-auto shrink-0 hidden md:block"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* ──────── PHOTO GALLERY ──────── */}
      <section className="px-4 pb-10 md:pb-16 max-w-3xl mx-auto">
        <h2 className="text-lg font-bold text-gray-900 text-center mb-6 sm:text-xl md:text-3xl md:mb-8">
          Ihr Berater – persönlich & nahbar
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <div className="col-span-2 md:col-span-1 md:row-span-2">
            <img
              src={ichBinDaPhoto}
              alt="Morino Stübe – Ich bin für dich da"
              className="w-full h-full object-cover rounded-2xl shadow-md border border-gray-100"
              loading="lazy"
            />
          </div>
          <div>
            <img
              src={beraterBranding}
              alt="Morino Stübe – Dein ERGO Berater"
              className="w-full h-full object-cover rounded-2xl shadow-md border border-gray-100"
              loading="lazy"
            />
          </div>
          <div>
            <img
              src={standingPhoto}
              alt="Morino Stübe – stehend"
              className="w-full h-full object-cover rounded-2xl shadow-md border border-gray-100"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ──────── VORTEILE ──────── */}
      <section className="px-4 pb-10 md:pb-16 max-w-3xl mx-auto">
        <h2 className="text-lg font-bold text-gray-900 text-center mb-6 sm:text-xl md:text-3xl md:mb-8">
          Ihre Vorteile bei der ERGO Agentur Stübe
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {[
            {
              title: 'Individuelle Beratung zu allen relevanten Versicherungen',
              text: 'Kfz, Haftpflicht, Hausrat, Wohngebäude, Rechtsschutz, Zahnzusatz, BU und Lebensversicherung'
            },
            {
              title: 'Transparente Gegenüberstellung von Leistungen & Beiträgen',
              text: 'Klare Vergleiche und verständliche Erklärungen aller Tarifoptionen'
            },
            {
              title: 'Unterstützung im Schadenfall – persönlich & direkt vor Ort',
              text: 'Schnelle Hilfe und persönliche Betreuung wenn Sie uns brauchen'
            },
            {
              title: 'Moderne digitale Beratung per WhatsApp, Telefon oder Video',
              text: 'Flexible Beratungstermine, die zu Ihrem Zeitplan passen'
            }
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-6 flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1 md:text-base">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed md:text-sm">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────── TESTSIEGER / AWARDS ──────── */}
      <section className="px-4 pb-10 md:pb-16 max-w-4xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <span className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 text-xs font-bold uppercase tracking-wide px-4 py-1.5 rounded-full mb-4">
            <Trophy className="w-4 h-4" />
            Ausgezeichnet
          </span>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl md:text-3xl">
            ERGO – Vielfach ausgezeichnet & getestet
          </h2>
          <p className="text-sm text-gray-500 mt-2 md:text-base max-w-xl mx-auto">
            Unabhängige Tests bestätigen: ERGO bietet Top-Leistungen zu fairen Konditionen.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {awards.map((award) => (
            <div
              key={award.product}
              className={`rounded-xl border-2 ${award.color} p-4 md:p-5 flex flex-col items-center text-center transition-shadow hover:shadow-md`}
            >
              <Award className="w-8 h-8 text-ergo-red mb-2" />
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{award.source}</p>
              <h3 className="font-bold text-gray-900 text-sm md:text-base mt-1">{award.product}</h3>
              <span className="inline-block bg-white text-ergo-red font-extrabold text-xs md:text-sm px-3 py-1 rounded-full mt-2 border border-ergo-red/20">
                {award.rating}
              </span>
              <p className="text-xs text-gray-400 mt-2">{award.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ──────── INSTAGRAM ──────── */}
      <section className="px-4 pb-10 md:pb-16 max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 border border-pink-200 rounded-2xl shadow-lg p-6 md:p-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] text-white mb-4 shadow-md">
            <Instagram className="w-7 h-7" />
          </div>

          <h2 className="text-lg font-bold text-gray-900 mb-2 sm:text-xl md:text-3xl">
            Folgen Sie mir auf Instagram
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-md mx-auto md:text-base">
            Versicherungstipps, Einblicke in meinen Berateralltag und aktuelle Angebote – direkt auf Ihrem Smartphone.
          </p>

          <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6 max-w-sm mx-auto">
            <div className="aspect-square rounded-xl bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center overflow-hidden">
              <img src={sittingPhoto} alt="Instagram Preview" className="w-full h-full object-cover rounded-xl" loading="lazy" />
            </div>
            <div className="aspect-square rounded-xl bg-gradient-to-br from-purple-200 to-orange-200 flex items-center justify-center overflow-hidden">
              <img src={ichBinDaPhoto} alt="Instagram Preview" className="w-full h-full object-cover rounded-xl" loading="lazy" />
            </div>
            <div className="aspect-square rounded-xl bg-gradient-to-br from-orange-200 to-pink-200 flex items-center justify-center overflow-hidden">
              <img src={standingPhoto} alt="Instagram Preview" className="w-full h-full object-cover rounded-xl" loading="lazy" />
            </div>
          </div>

          <a
            href="https://www.instagram.com/morino_stuebe/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('instagram_clicked', { source: 'instagram_section' })}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-md active:scale-[0.97] transition-transform md:text-base md:px-8 md:py-4"
          >
            <Instagram className="w-5 h-5" />
            @morino_stuebe
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ──────── LEAD-MAGNET CTA ──────── */}
      <section className="px-4 pb-12 md:pb-20 max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-blue-50 to-green-50 border border-blue-200 rounded-2xl shadow-lg p-6 text-center md:p-10">
          <h2 className="text-lg font-bold text-gray-900 mb-3 sm:text-xl md:text-3xl">
            Persönlicher Bedarfs-Check
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-lg mx-auto md:text-lg">
            Wir prüfen mit Ihnen gemeinsam, ob Ihre Absicherung noch zu Ihrer Lebenssituation passt. Unverbindlich und kostenfrei.
          </p>

          <button
            onClick={() => {
              setShowFunnel(true);
              trackEvent('lead_magnet_clicked', { source: 'bedarfs_check' });
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-ergo-red text-white font-semibold text-sm px-5 py-3.5 rounded-xl shadow-md active:scale-[0.97] transition-transform whitespace-nowrap md:text-base md:px-6 md:py-4 mx-auto"
          >
            <MapPin className="w-5 h-5 shrink-0" />
            Jetzt Bedarfs-Check starten
          </button>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-5 text-xs text-gray-500 md:text-sm">
            <span>🔒 Datenschutz nach DSGVO</span>
            <span>📋 Unverbindlich & kostenfrei</span>
            <span>⭐ Persönliche Beratung vor Ort</span>
          </div>

          <Link href="/dokumente" className="inline-block mt-4 text-sm text-[#003781] hover:underline">
            Oder: Dokument einreichen & unterschreiben →
          </Link>
        </div>
      </section>

      {/* ──────── FOOTER ──────── */}
      <footer className="px-4 pb-20 sm:pb-12 max-w-3xl mx-auto">
        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link href="/impressum" className="hover:text-gray-600">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-gray-600">Datenschutz</Link>
            <Link href="/erstinformation" className="hover:text-gray-600">Erstinformation</Link>
            <Link href="/dokumente" className="hover:text-gray-600">Dokumente einreichen</Link>
            <Link href="/schaden" className="hover:text-gray-600">Schaden melden</Link>
            <Link href="/kennzeichen" className="hover:text-gray-600">EVB & Kennzeichen</Link>
            <button onClick={() => { import('@/lib/analytics').then(m => { m.revokeMarketingConsent(); localStorage.removeItem(m.CONSENT_KEY); window.location.reload(); }); }} className="hover:text-gray-600 cursor-pointer">Cookie-Einstellungen</button>
          </div>
          <span>© {new Date().getFullYear()} ERGO Agentur Stübe</span>
        </div>
      </footer>

      {/* ──────── STICKY MOBILE CTA ──────── */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 px-3 py-2.5 flex gap-2 sm:hidden safe-area-bottom">
        <button
          onClick={() => {
            setShowFunnel(true);
            trackEvent('cta_sticky_clicked', { source: 'sticky_bar' });
          }}
          className="flex-1 flex items-center justify-center gap-1.5 bg-ergo-red text-white font-semibold text-xs py-2.5 rounded-lg active:scale-[0.97] transition-transform whitespace-nowrap"
        >
          <Mail className="w-3.5 h-3.5 shrink-0" />
          Beratung anfragen
        </button>
        <a
          href={`https://wa.me/49${whatsappNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackEvent('whatsapp_sticky_clicked', { source: 'sticky_bar' });
            trackConversion();
          }}
          className="flex items-center justify-center gap-1.5 bg-green-500 text-white font-semibold text-xs px-3 py-2.5 rounded-lg active:scale-[0.97] transition-transform whitespace-nowrap"
        >
          <Phone className="w-3.5 h-3.5 shrink-0" />
          WhatsApp
        </a>
      </div>

      <FunnelOverlay isOpen={showFunnel} onClose={() => setShowFunnel(false)} />
    </div>
  );
}
