import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import SEO from '@/components/SEO';
import BestandskundenFunnel from '@/components/BestandskundenFunnel';
import { trackEvent } from '@/lib/analytics';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  FileText, Calendar, MessageCircle, Phone,
  Heart, Baby, Home, Truck, Briefcase, Sunset,
  CheckCircle, Users, Clock, Award, Gift, ArrowRight,
  ClipboardCheck, Star, Car, AlertTriangle, MapPin,
  CreditCard, XCircle, ChevronDown
} from 'lucide-react';

type BestandskundenContext =
  | 'jahrescheck'
  | 'heirat'
  | 'nachwuchs'
  | 'hauskauf'
  | 'umzug'
  | 'jobwechsel'
  | 'ruhestand';

interface Lebenslage {
  icon: typeof Heart;
  title: string;
  description: string;
  versicherungen: string[];
  color: string;
  funnelLabel: string;
  context: BestandskundenContext;
}

const lebenslagen: Lebenslage[] = [
  {
    icon: Heart,
    title: 'Heirat / Partnerschaft',
    description: 'Zusammenziehen, heiraten oder Partnerschaft eintragen? Viele Versicherungen lassen sich zusammenlegen und sparen.',
    versicherungen: ['Haftpflicht zusammenlegen', 'Hausrat anpassen', 'Risikolebensversicherung'],
    color: 'bg-pink-50 border-pink-200 text-pink-700',
    funnelLabel: 'Heirat / Partnerschaft',
    context: 'heirat',
  },
  {
    icon: Baby,
    title: 'Nachwuchs',
    description: 'Ein Baby verändert alles – auch Ihren Versicherungsbedarf. Schützen Sie Ihre Familie richtig ab.',
    versicherungen: ['Risikolebensversicherung', 'Unfallversicherung Familie', 'Krankenversicherung Kind'],
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    funnelLabel: 'Nachwuchs / Familie',
    context: 'nachwuchs',
  },
  {
    icon: Home,
    title: 'Hauskauf / Immobilie',
    description: 'Die größte Investition Ihres Lebens braucht den besten Schutz.',
    versicherungen: ['Wohngebäudeversicherung', 'Elementarschutz', 'Bauherrenhaftpflicht'],
    color: 'bg-green-50 border-green-200 text-green-700',
    funnelLabel: 'Hauskauf / Immobilie',
    context: 'hauskauf',
  },
  {
    icon: Truck,
    title: 'Umzug',
    description: 'Neue Adresse, neuer Wohnort – prüfen Sie, ob Ihre Versicherungen noch passen.',
    versicherungen: ['Hausrat Deckungssumme', 'Wohngebäude aktualisieren', 'Kfz-Regional­klasse'],
    color: 'bg-orange-50 border-orange-200 text-orange-700',
    funnelLabel: 'Umzug',
    context: 'umzug',
  },
  {
    icon: Briefcase,
    title: 'Jobwechsel / Selbstständigkeit',
    description: 'Ein neuer Job oder der Schritt in die Selbstständigkeit erfordert andere Absicherungen.',
    versicherungen: ['Berufsunfähigkeit prüfen', 'Betriebshaftpflicht', 'Private Krankenversicherung'],
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    funnelLabel: 'Jobwechsel / Selbstständigkeit',
    context: 'jobwechsel',
  },
  {
    icon: Sunset,
    title: 'Ruhestand',
    description: 'Im Ruhestand ändern sich Risiken und Bedürfnisse – optimieren Sie Ihren Schutz.',
    versicherungen: ['Sterbegeldversicherung', 'Pflegezusatz', 'Reiseversicherung'],
    color: 'bg-amber-50 border-amber-200 text-amber-700',
    funnelLabel: 'Ruhestand',
    context: 'ruhestand',
  },
];

const jahrescheckSteps = [
  { step: '1', title: 'Lebenssituation', desc: 'Wir erfassen Ihre aktuelle Lebens- und Familiensituation.' },
  { step: '2', title: 'Bestandsanalyse', desc: 'Wir prüfen alle Ihre bestehenden Versicherungen.' },
  { step: '3', title: 'Lücken erkennen', desc: 'Wir identifizieren fehlende oder unzureichende Absicherungen.' },
  { step: '4', title: 'Sparpotenzial', desc: 'Wir finden Einsparmöglichkeiten durch Bündelung und Optimierung.' },
  { step: '5', title: 'Empfehlung', desc: 'Sie erhalten eine persönliche, unverbindliche Handlungsempfehlung.' },
];

const schadenTypen = [
  { label: 'Kfz-Schaden', typ: 'kfz', icon: '🚗' },
  { label: 'Glasschaden', typ: 'glasschaden', icon: '🔲' },
  { label: 'Hausrat', typ: 'hausrat', icon: '🏠' },
  { label: 'Gebäude', typ: 'gebaeude', icon: '🏚️' },
  { label: 'Haftpflicht', typ: 'haftpflicht', icon: '⚖️' },
  { label: 'Sonstiges', typ: 'sonstiges', icon: '📋' },
];

const faqItems = [
  {
    question: 'Wie melde ich einen Schaden?',
    answer: 'Klicken Sie oben auf „Schaden melden" und wählen Sie die passende Schadensart. Das Online-Formular führt Sie Schritt für Schritt durch die Meldung. Alternativ erreichen Sie uns telefonisch unter 01556 6771019 oder per WhatsApp.',
  },
  {
    question: 'Was ist die ERGO-Notfallnummer?',
    answer: 'Die ERGO-Schaden-Hotline ist 0800 3746-000. Sie ist kostenlos und rund um die Uhr (24/7) erreichbar – bei Kfz-Unfällen, Einbruch, Wasserschäden oder anderen dringenden Schadenfällen.',
  },
  {
    question: 'Wie ändere ich meine Bankverbindung?',
    answer: 'Klicken Sie auf den Tile „Bankverbindung ändern" oder gehen Sie zu /dokumente?formular=aenderung. Dort füllen Sie den Änderungsantrag aus und übermitteln Ihre neue IBAN sicher an uns.',
  },
  {
    question: 'Wie kündige ich eine Versicherung?',
    answer: 'Über den Tile „Vertrag kündigen" oder unter /dokumente?formular=kuendigung können Sie ein rechtsgültiges Kündigungsschreiben erstellen. Wir leiten es für Sie an die entsprechende Versicherungsgesellschaft weiter.',
  },
  {
    question: 'Was ist der Bündelrabatt und wie berechne ich ihn?',
    answer: 'Ab 5 ERGO-Verträgen erhalten Sie einen Bündelrabatt von bis zu 15 % auf alle Beitragszahlungen. Der genaue Rabatt hängt von Ihren Vertragsarten ab. Im kostenlosen Jahrescheck ermitteln wir Ihr persönliches Sparpotenzial.',
  },
  {
    question: 'Wie kann ich meinen Berater wechseln?',
    answer: 'Unter „Dokument einreichen" finden Sie den Beraterwechsel-Antrag. Mit wenigen Klicks können Sie Ihre ERGO-Verträge zu Morino Stübe übertragen – kostenlos und ohne Kündigung Ihrer bestehenden Verträge.',
  },
  {
    question: 'Wie lange dauert die Schadenbearbeitung?',
    answer: 'Einfache Schadenfälle werden oft innerhalb weniger Tage bearbeitet. Bei komplexeren Schäden melden wir uns innerhalb von 24 Stunden bei Ihnen, um den weiteren Ablauf zu besprechen.',
  },
  {
    question: 'Was tun bei einem Kfz-Unfall?',
    answer: 'Stellen Sie zunächst die Sicherheit aller Beteiligten sicher und rufen Sie bei Verletzten den Notruf (110/112). Dann: Absichern, Fotos machen, Personalien austauschen, Polizei hinzuziehen wenn nötig. Melden Sie den Schaden danach über unser Online-Formular oder die Hotline 0800 3746-000.',
  },
];

export default function BestandskundenPage() {
  const [showFunnel, setShowFunnel] = useState(false);
  const [funnelContext, setFunnelContext] = useState<BestandskundenContext>('jahrescheck');
  const [funnelLabel, setFunnelLabel] = useState<string | undefined>();
  const [schadenExpanded, setSchadenExpanded] = useState(false);
  const schadenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!schadenExpanded) return;
    const handleClick = (e: MouseEvent) => {
      if (schadenRef.current && !schadenRef.current.contains(e.target as Node)) {
        setSchadenExpanded(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSchadenExpanded(false); };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [schadenExpanded]);

  const openFunnel = (context: BestandskundenContext, label?: string) => {
    setFunnelContext(context);
    setFunnelLabel(label);
    setShowFunnel(true);
    trackEvent('bestandskunden_funnel_open', { context, label: label || '' });
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
        <section className="bg-gradient-to-br from-[#003781] to-[#005ab4] text-white py-8 md:py-14 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4 text-yellow-300" />
              Exklusiv für ERGO-Kunden
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 leading-tight">
              Ihr persönlicher Service-Bereich
            </h1>
            <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
              Schnell, einfach und direkt bei Ihrem persönlichen Berater Morino Stübe.
            </p>
          </div>
        </section>

        <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-4 py-4">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2 shrink-0">
              <AlertTriangle className="w-6 h-6 text-yellow-200 shrink-0" />
              <span className="font-bold text-sm sm:text-base">Notfall-Hotline 24/7</span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm text-red-100 leading-snug">
                Bei Kfz-Unfall, Einbruch oder Wasserschaden: Sofort die ERGO-Schadenhotline anrufen
              </p>
            </div>
            <a
              href="tel:08003746000"
              className="inline-flex items-center gap-2 bg-white text-red-600 font-bold px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-sm shrink-0 min-h-[44px]"
            >
              <Phone className="w-4 h-4" />
              0800 3746-000
            </a>
          </div>
          <div className="max-w-4xl mx-auto mt-2">
            <p className="text-center text-xs text-red-100">
              Kostenlos · Rund um die Uhr · Gilt für: Kfz-Unfall, Einbruch, Glasschaden, Wasserschaden
            </p>
          </div>
        </div>

        <section className="py-8 md:py-12 px-4 -mt-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-widest mb-5">Was suchen Sie?</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-3">
              <div className="relative" ref={schadenRef}>
                <button
                  type="button"
                  onClick={() => setSchadenExpanded(v => !v)}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-6 text-center hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer group h-full min-h-[120px] w-full"
                >
                  <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-red-100 transition-colors">
                    <FileText className="w-7 h-7 text-red-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm">Schaden melden</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
                    Schadensart wählen
                    <ChevronDown className={`w-3 h-3 transition-transform ${schadenExpanded ? 'rotate-180' : ''}`} />
                  </p>
                </button>
                {schadenExpanded && (
                  <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                    {schadenTypen.map((t) => (
                      <Link key={t.typ + t.label} href={`/schaden?typ=${t.typ}`}>
                        <div
                          onClick={() => setSchadenExpanded(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 cursor-pointer text-sm font-medium text-gray-800 border-b border-gray-100 last:border-0"
                        >
                          <span className="text-base">{t.icon}</span>
                          {t.label}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/dokumente">
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-6 text-center hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer group h-full min-h-[120px]">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
                    <ClipboardCheck className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm">Dokument einreichen</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Kündigung, Upload, Beraterwechsel</p>
                </div>
              </Link>

              <Link href="/kennzeichen">
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-6 text-center hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer group h-full min-h-[120px]">
                  <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-amber-100 transition-colors">
                    <Car className="w-7 h-7 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm">eVB / Kennzeichen</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">eVB-Anfrage, Versicherungskennzeichen</p>
                </div>
              </Link>

              <Link href="/termin">
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-6 text-center hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer group h-full min-h-[120px]">
                  <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-green-100 transition-colors">
                    <Calendar className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm">Termin buchen</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Online oder vor Ort</p>
                </div>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <Link href="/dokumente?formular=aenderung">
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-6 text-center hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer group h-full min-h-[110px]">
                  <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-violet-100 transition-colors">
                    <MapPin className="w-6 h-6 text-violet-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm">Adresse ändern</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Umzug melden</p>
                </div>
              </Link>

              <Link href="/dokumente?formular=aenderung">
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-6 text-center hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer group h-full min-h-[110px]">
                  <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-teal-100 transition-colors">
                    <CreditCard className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm">Bankverbindung ändern</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Neue IBAN hinterlegen</p>
                </div>
              </Link>

              <Link href="/dokumente?formular=kuendigung">
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-6 text-center hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer group h-full min-h-[110px]">
                  <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-rose-100 transition-colors">
                    <XCircle className="w-6 h-6 text-rose-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm">Vertrag kündigen</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Kündigung erstellen</p>
                </div>
              </Link>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hallo Herr Stübe, ich bin Kunde bei ERGO und habe eine Frage.')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-6 text-center hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer group h-full min-h-[110px]">
                  <div className="w-12 h-12 bg-[#25d366]/10 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-[#25d366]/20 transition-colors">
                    <MessageCircle className="w-6 h-6 text-[#25d366]" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm">WhatsApp</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Direkt schreiben</p>
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
                    onClick={() => openFunnel(lage.context, lage.funnelLabel)}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <Icon className="w-6 h-6 shrink-0 mt-0.5" />
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base">{lage.title}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 leading-relaxed">{lage.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {lage.versicherungen.map((v) => (
                        <span key={v} className="inline-block bg-white/60 text-gray-700 text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full border border-current/10 leading-tight">
                          {v}
                        </span>
                      ))}
                    </div>
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
                Einmal im Jahr sollten Sie Ihre Versicherungen prüfen lassen. Unser systematisches 5-Schritte-Verfahren analysiert Ihre aktuelle Absicherung und deckt Lücken sowie Sparpotenziale auf.
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
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Häufige Fragen (FAQ)
              </h2>
              <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
                Antworten auf die wichtigsten Fragen rund um Ihren ERGO-Versicherungsschutz.
              </p>
            </div>
            <Accordion type="single" collapsible className="space-y-2">
              {faqItems.map((item, idx) => (
                <AccordionItem
                  key={idx}
                  value={`faq-${idx}`}
                  className="bg-white border border-gray-200 rounded-xl px-5 shadow-sm"
                >
                  <AccordionTrigger className="text-left text-sm sm:text-base font-semibold text-gray-900 py-4 hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-gray-600 pb-4 leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="py-10 md:py-16 px-4 bg-gray-50">
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

        <section className="py-10 md:py-14 px-4">
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

      </div>

      {showFunnel && (
        <BestandskundenFunnel
          isOpen={showFunnel}
          onClose={() => setShowFunnel(false)}
          context={funnelContext}
          label={funnelLabel}
        />
      )}
    </>
  );
}
