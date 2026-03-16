import { useState } from 'react';
import { Link } from 'wouter';
import SEO from '@/components/SEO';
import FunnelOverlay from '@/components/FunnelOverlay';
import { trackEvent } from '@/lib/analytics';
import {
  Shield, FileText, Calendar, MessageCircle, Phone,
  Heart, Baby, Home, Truck, Briefcase, Sunset,
  CheckCircle, Users, Clock, Award, Gift, ArrowRight,
  ClipboardCheck, Star, ChevronRight
} from 'lucide-react';

interface Lebenslage {
  icon: typeof Heart;
  title: string;
  description: string;
  versicherungen: string[];
  color: string;
  funnelLabel: string;
}

const lebenslagen: Lebenslage[] = [
  {
    icon: Heart,
    title: 'Heirat / Partnerschaft',
    description: 'Zusammenziehen, heiraten oder Partnerschaft eintragen? Viele Versicherungen lassen sich zusammenlegen und sparen.',
    versicherungen: ['Haftpflicht zusammenlegen', 'Hausrat anpassen', 'Risikolebensversicherung'],
    color: 'bg-pink-50 border-pink-200 text-pink-700',
    funnelLabel: 'Heirat / Partnerschaft'
  },
  {
    icon: Baby,
    title: 'Nachwuchs',
    description: 'Ein Baby verändert alles – auch Ihren Versicherungsbedarf. Schützen Sie Ihre Familie richtig ab.',
    versicherungen: ['Risikolebensversicherung', 'Unfallversicherung Familie', 'Krankenversicherung Kind'],
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    funnelLabel: 'Nachwuchs / Familie'
  },
  {
    icon: Home,
    title: 'Hauskauf / Immobilie',
    description: 'Die größte Investition Ihres Lebens braucht den besten Schutz.',
    versicherungen: ['Wohngebäudeversicherung', 'Elementarschutz', 'Bauherrenhaftpflicht'],
    color: 'bg-green-50 border-green-200 text-green-700',
    funnelLabel: 'Hauskauf / Immobilie'
  },
  {
    icon: Truck,
    title: 'Umzug',
    description: 'Neue Adresse, neuer Wohnort – prüfen Sie, ob Ihre Versicherungen noch passen.',
    versicherungen: ['Hausrat Deckungssumme', 'Wohngebäude aktualisieren', 'Kfz-Regional­klasse'],
    color: 'bg-orange-50 border-orange-200 text-orange-700',
    funnelLabel: 'Umzug'
  },
  {
    icon: Briefcase,
    title: 'Jobwechsel / Selbstständigkeit',
    description: 'Ein neuer Job oder der Schritt in die Selbstständigkeit erfordert andere Absicherungen.',
    versicherungen: ['Berufsunfähigkeit prüfen', 'Betriebshaftpflicht', 'Private Krankenversicherung'],
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    funnelLabel: 'Jobwechsel / Selbstständigkeit'
  },
  {
    icon: Sunset,
    title: 'Ruhestand',
    description: 'Im Ruhestand ändern sich Risiken und Bedürfnisse – optimieren Sie Ihren Schutz.',
    versicherungen: ['Sterbegeldversicherung', 'Pflegezusatz', 'Reiseversicherung'],
    color: 'bg-amber-50 border-amber-200 text-amber-700',
    funnelLabel: 'Ruhestand'
  },
];

const jahrescheckSteps = [
  { step: '1', title: 'Lebenssituation', desc: 'Wir erfassen Ihre aktuelle Lebens- und Familiensituation.' },
  { step: '2', title: 'Bestandsanalyse', desc: 'Wir prüfen alle Ihre bestehenden Versicherungen.' },
  { step: '3', title: 'Lücken erkennen', desc: 'Wir identifizieren fehlende oder unzureichende Absicherungen.' },
  { step: '4', title: 'Sparpotenzial', desc: 'Wir finden Einsparmöglichkeiten durch Bündelung und Optimierung.' },
  { step: '5', title: 'Empfehlung', desc: 'Sie erhalten eine persönliche, unverbindliche Handlungsempfehlung.' },
];

export default function BestandskundenPage() {
  const [showFunnel, setShowFunnel] = useState(false);
  const [funnelSource, setFunnelSource] = useState('bestandskunden');
  const [funnelLabel, setFunnelLabel] = useState<string | undefined>();

  const openFunnel = (source: string, label?: string) => {
    setFunnelSource(source);
    setFunnelLabel(label);
    setShowFunnel(true);
    trackEvent('bestandskunden_funnel_open', { source, label: label || '' });
  };

  const whatsappNumber = "15566771019";

  return (
    <>
      <SEO
        title="Ihr Service-Bereich – ERGO Agentur Stübe | Bestandskunden"
        description="Alle Services für ERGO-Kunden auf einen Blick: Schaden melden, Dokumente einreichen, Jahrescheck buchen, Lebenslagen-Beratung. Persönlicher Service von Morino Stübe."
        keywords="ERGO Kundenservice, Bestandskunden Service, Versicherung Ganderkesee, Jahrescheck, Lebenslagen Versicherung"
      />

      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <Shield className="w-7 h-7 text-ergo-red" />
                <div>
                  <span className="font-bold text-gray-900 text-sm">ERGO Agentur Stübe</span>
                  <span className="text-[10px] text-gray-400 block leading-tight">Ihr persönlicher Berater</span>
                </div>
              </div>
            </Link>
            <a
              href="tel:015566771019"
              className="inline-flex items-center gap-1.5 bg-ergo-red text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">01556 6771019</span>
              <span className="sm:hidden">Anrufen</span>
            </a>
          </div>
        </header>

        <section className="bg-gradient-to-br from-[#003781] to-[#005ab4] text-white py-12 md:py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-1.5 rounded-full text-sm font-medium mb-5">
              <Star className="w-4 h-4 text-yellow-300" />
              Exklusiv für ERGO-Kunden
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Ihr persönlicher Service-Bereich
            </h1>
            <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Als Kunde der ERGO Agentur Stübe haben Sie Zugriff auf alle wichtigen Services –
              schnell, einfach und direkt bei Ihrem persönlichen Berater.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-14 px-4 -mt-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <Link href="/schaden">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 md:p-5 text-center hover:shadow-xl transition-shadow cursor-pointer group h-full">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-red-100 transition-colors">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm">Schaden melden</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1 hidden sm:block">Schnell & unkompliziert</p>
                </div>
              </Link>
              <Link href="/dokumente">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 md:p-5 text-center hover:shadow-xl transition-shadow cursor-pointer group h-full">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
                    <ClipboardCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm">Dokument einreichen</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1 hidden sm:block">Beraterwechsel, Kündigung</p>
                </div>
              </Link>
              <Link href="/termin">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 md:p-5 text-center hover:shadow-xl transition-shadow cursor-pointer group h-full">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-green-100 transition-colors">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm">Termin buchen</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1 hidden sm:block">Online oder vor Ort</p>
                </div>
              </Link>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hallo Herr Stübe, ich bin Kunde bei ERGO und habe eine Frage.')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 md:p-5 text-center hover:shadow-xl transition-shadow cursor-pointer group h-full">
                  <div className="w-12 h-12 bg-[#25d366]/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-[#25d366]/20 transition-colors">
                    <MessageCircle className="w-6 h-6 text-[#25d366]" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm">WhatsApp</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1 hidden sm:block">Direkt schreiben</p>
                </div>
              </a>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 md:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Lebenslagen – Versicherung anpassen
              </h2>
              <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
                Ihr Leben verändert sich? Prüfen Sie, ob Ihre Versicherungen noch passen. Wir beraten Sie kostenlos.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lebenslagen.map((lage) => {
                const Icon = lage.icon;
                return (
                  <button
                    key={lage.title}
                    type="button"
                    className={`rounded-xl border-2 p-5 ${lage.color} hover:shadow-lg transition-all group cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#003781] focus:ring-offset-2`}
                    onClick={() => openFunnel('bestandskunden_lebenslage', lage.funnelLabel)}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <Icon className="w-6 h-6 shrink-0 mt-0.5" />
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base">{lage.title}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 leading-relaxed">{lage.description}</p>
                    <ul className="space-y-1 mb-4">
                      {lage.versicherungen.map((v) => (
                        <li key={v} className="flex items-center gap-1.5 text-xs text-gray-700">
                          <ChevronRight className="w-3 h-3 shrink-0" />
                          {v}
                        </li>
                      ))}
                    </ul>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all">
                      Jetzt prüfen <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-10 md:py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 md:mb-10">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                <ClipboardCheck className="w-4 h-4" />
                Kostenlos & unverbindlich
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Der kostenlose Jahrescheck
              </h2>
              <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
                Einmal im Jahr sollten Sie Ihre Versicherungen prüfen lassen. Unser 5-Schritte-Verfahren zeigt Lücken und Sparpotenziale auf.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 md:gap-4 mb-8">
              {jahrescheckSteps.map((s, i) => (
                <div key={s.step} className="bg-white rounded-xl border border-gray-200 p-4 text-center relative">
                  <div className="w-8 h-8 bg-[#003781] text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                    {s.step}
                  </div>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm mb-1">{s.title}</h4>
                  <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                  {i < jahrescheckSteps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-300 absolute -right-3.5 top-1/2 -translate-y-1/2 hidden sm:block" />
                  )}
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-[#003781] to-[#005ab4] rounded-2xl p-6 md:p-8 text-white text-center">
              <h3 className="text-lg sm:text-xl font-bold mb-2">Jahrescheck jetzt anfragen</h3>
              <p className="text-sm text-blue-100 mb-5 max-w-lg mx-auto">
                Wir analysieren Ihre bestehenden Versicherungen und zeigen Ihnen, wo Sie bis zu 15% mit dem Bündelrabatt sparen können.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => openFunnel('jahrescheck', 'Jahrescheck')}
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#003781] font-bold px-6 py-3.5 rounded-xl hover:bg-gray-100 transition-colors min-h-[48px]"
                >
                  <ClipboardCheck className="w-4 h-4" /> Jahrescheck starten
                </button>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hallo Herr Stübe, ich möchte gerne meinen kostenlosen Jahrescheck durchführen. Wann hätten Sie Zeit?')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25d366] text-white font-bold px-6 py-3.5 rounded-xl hover:bg-[#1da851] transition-colors min-h-[48px]"
                >
                  <MessageCircle className="w-4 h-4" /> Per WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Ihre Vorteile als ERGO-Kunde
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Award, title: '15% Bündelrabatt', desc: 'Ab 5 Verträgen profitieren Sie von bis zu 15% Nachlass.' },
                { icon: ClipboardCheck, title: 'Kostenlose Analyse', desc: 'Regelmäßiger Check Ihrer Versicherungen – immer gratis.' },
                { icon: Clock, title: '24h Reaktionszeit', desc: 'Wir melden uns innerhalb von 24 Stunden bei Ihnen.' },
                { icon: Users, title: 'Persönlicher Berater', desc: 'Ein fester Ansprechpartner für alle Ihre Versicherungsfragen.' },
              ].map((v) => {
                const Icon = v.icon;
                return (
                  <div key={v.title} className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                    <div className="w-12 h-12 bg-[#003781]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-[#003781]" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{v.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-10 md:py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
                  <Gift className="w-8 h-8 text-amber-600" />
                </div>
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Empfehlen & Profitieren
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Kennen Sie jemanden, der eine gute Versicherungsberatung gebrauchen kann?
                    Empfehlen Sie uns weiter – als Dankeschön erwartet Sie und Ihren Freund eine kleine Überraschung!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hallo Herr Stübe, ich möchte gerne jemanden für eine Versicherungsberatung empfehlen.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#25d366] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1da851] transition-colors text-sm min-h-[44px]"
                    >
                      <MessageCircle className="w-4 h-4" /> Per WhatsApp empfehlen
                    </a>
                    <a
                      href="mailto:morino.stuebe@ergo.de?subject=Empfehlung%20f%C3%BCr%20Versicherungsberatung"
                      className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm min-h-[44px]"
                    >
                      Per E-Mail empfehlen
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Ihr Berater</h3>
            <p className="text-gray-600 text-sm mb-4">Morino Stübe – ERGO Agentur Ganderkesee</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:015566771019"
                className="inline-flex items-center justify-center gap-2 bg-ergo-red text-white font-semibold px-5 py-3 rounded-xl hover:bg-red-700 transition-colors text-sm min-h-[48px]"
              >
                <Phone className="w-4 h-4" /> 01556 6771019
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25d366] text-white font-semibold px-5 py-3 rounded-xl hover:bg-[#1da851] transition-colors text-sm min-h-[48px]"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>
        </section>

        <footer className="bg-gray-900 text-gray-400 py-6 px-4 text-center text-xs">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/impressum" className="hover:text-white transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link>
          </div>
          <p className="mt-3">&copy; 2026 ERGO Versicherung - Morino Stübe</p>
        </footer>
      </div>

      {showFunnel && (
        <FunnelOverlay
          isOpen={showFunnel}
          onClose={() => setShowFunnel(false)}
          insuranceLabel={funnelLabel}
          source={funnelSource}
        />
      )}
    </>
  );
}
