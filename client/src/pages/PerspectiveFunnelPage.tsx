import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Cal, { getCalApi } from '@calcom/embed-react';
import { Link } from 'wouter';
import SEO from '@/components/SEO';
import { trackEvent, trackConversion } from '@/lib/analytics';
import { Phone, Shield, Star, ChevronDown, ChevronUp, Check, ArrowRight, X } from 'lucide-react';
import advisorPhoto from '@assets/optimized/ich_bin_da.webp';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dsgvo: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dsgvo?: string;
}

const insuranceOptions = [
  { icon: '🚗', label: 'Kfz-Versicherung', value: 'kfz' },
  { icon: '🏡', label: 'Hausrat', value: 'hausrat' },
  { icon: '⚖️', label: 'Haftpflicht', value: 'haftpflicht' },
  { icon: '🏛️', label: 'Rechtsschutz', value: 'rechtsschutz' },
  { icon: '💼', label: 'Berufsunfähigkeit', value: 'berufsunfaehigkeit' },
  { icon: '🦷', label: 'Zahnzusatz', value: 'zahnzusatz' },
  { icon: '🏠', label: 'Wohngebäude', value: 'wohngebaeude' },
  { icon: '🚑', label: 'Unfallversicherung', value: 'unfall' },
  { icon: '✈️', label: 'Reiseversicherung', value: 'reise' },
  { icon: '💰', label: 'Altersvorsorge / Rente', value: 'altersvorsorge' },
  { icon: '❤️', label: 'Risikolebensversicherung', value: 'risikoleben' },
  { icon: '🐾', label: 'Tierversicherung', value: 'tier' },
  { icon: '🏢', label: 'Gewerbe / Betrieb', value: 'gewerbe' },
  { icon: '🏥', label: 'Krankenzusatz / PKV', value: 'kranken' },
  { icon: '🧓', label: 'Pflegeversicherung', value: 'pflege' },
  { icon: '📋', label: 'Sonstiges / Anderes', value: 'sonstiges' },
];

const testimonials = [
  {
    name: 'Thomas M.',
    location: 'Ganderkesee',
    text: 'Herr Stübe hat meine komplette Versicherungssituation analysiert und mir gezeigt, wo ich überversichert war. Jetzt spare ich 40 € im Monat!',
    initials: 'TM',
    color: 'bg-blue-500',
  },
  {
    name: 'Sandra K.',
    location: 'Delmenhorst',
    text: 'Endlich ein Berater, der sich wirklich Zeit nimmt. Die kostenlose Analyse war super ausführlich – ich fühle mich jetzt rundherum gut abgesichert.',
    initials: 'SK',
    color: 'bg-purple-500',
  },
  {
    name: 'Markus B.',
    location: 'Oldenburg',
    text: 'Schnell, unkompliziert und ehrlich. Herr Stübe hat mir sogar von einer Versicherung abgeraten, die ich nicht brauche. So muss Beratung sein!',
    initials: 'MB',
    color: 'bg-green-600',
  },
];

const faqItems = [
  {
    q: 'Was kostet die Beratung?',
    a: 'Die Beratung ist 100 % kostenlos und unverbindlich. Ich werde für meine Dienstleistung von ERGO vergütet – Sie zahlen nichts extra.',
  },
  {
    q: 'Wie läuft die Beratung ab?',
    a: 'Nach Ihrer Anfrage melde ich mich innerhalb von 24 Stunden. Wir besprechen alles telefonisch, per Videocall oder persönlich in meinem Büro in Ganderkesee – ganz wie es Ihnen passt.',
  },
  {
    q: 'Muss ich ERGO-Kunde werden?',
    a: 'Nein. Die Analyse zeigt Ihnen zuerst, wo Sie stehen. Ein Abschluss ist nie Bedingung und entsteht nur, wenn Sie wirklich überzeugt sind.',
  },
  {
    q: 'Welche Versicherungen kann ich prüfen lassen?',
    a: 'Kfz, Hausrat, Haftpflicht, Rechtsschutz, Berufsunfähigkeit, Zahnzusatz, Lebens- und Risikoversicherung – und viele mehr. Sprechen Sie mich einfach an.',
  },
  {
    q: 'Kann ich auch bestehende Verträge prüfen lassen?',
    a: 'Ja, gerade das ist einer der häufigsten Gründe für eine Beratung. Ich schaue mir Ihre bestehenden Verträge an und sage Ihnen ehrlich, ob Sie gut abgesichert sind oder Optimierungsbedarf besteht.',
  },
  {
    q: 'Wie schnell erhalte ich ein Angebot?',
    a: 'In vielen Fällen kann ich Ihnen bereits im Erstgespräch ein individuelles Angebot unterbreiten. Für komplexere Absicherungen erhalten Sie es innerhalb von 1-2 Werktagen.',
  },
];

const comparisonRows = [
  { feature: 'Persönliche Beratung', ergo: true, others: false },
  { feature: 'Kostenlose Analyse', ergo: true, others: false },
  { feature: 'Bis zu 15% Bündelrabatt', ergo: true, others: false },
  { feature: '24h Reaktionszeit', ergo: true, others: null },
  { feature: 'Schadenbegleitung persönlich', ergo: true, others: false },
  { feature: 'Vor Ort in Ganderkesee', ergo: true, others: false },
];

const ADVISOR_STATS = [
  { end: 3500, suffix: '+', label: 'Kunden' },
  { end: 4.9, decimals: 1, suffix: '/5', label: 'Sterne' },
  { end: 15, suffix: '+', label: 'Jahre Erfahrung' },
  { end: 97, suffix: '%', label: 'Weiterempfehlung' },
];

function StarRating({ count = 5, size = 'sm' }: { count?: number; size?: 'sm' | 'md' }) {
  const cls = size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <span className="flex gap-0.5">
      {[...Array(count)].map((_, i) => (
        <Star key={i} className={`${cls} fill-yellow-400 text-yellow-400`} />
      ))}
    </span>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        className="w-full text-left py-4 flex items-center justify-between gap-4 font-semibold text-gray-900 text-sm sm:text-base hover:text-ergo-red transition-colors"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className="flex-shrink-0 text-gray-400">
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            key="faq-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-gray-600 text-sm sm:text-base leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AnimatedCounter({ end, suffix = '', decimals = 0, label }: {
  end: number;
  suffix?: string;
  decimals?: number;
  label: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const steps = 40;
    const step = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      const progress = current / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * end).toFixed(decimals)));
      if (current >= steps) {
        clearInterval(timer);
        setCount(end);
      }
    }, step);
    return () => clearInterval(timer);
  }, [inView, end, decimals]);

  const formatted = decimals > 0
    ? count.toFixed(decimals).replace('.', ',')
    : Math.round(count).toLocaleString('de-DE');

  return (
    <div ref={ref} className="text-center">
      <div className="text-xl sm:text-2xl font-bold text-ergo-red">
        {formatted}{suffix}
      </div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

export default function PerspectiveFunnelPage() {
  const [selectedInsurance, setSelectedInsurance] = useState('');
  const [selectedInsuranceLabel, setSelectedInsuranceLabel] = useState('');
  const [sonstigesText, setSonstigesText] = useState('');
  const [hasExisting, setHasExisting] = useState('');
  const [timingPreference, setTimingPreference] = useState('');
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dsgvo: false,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showMobileCTA, setShowMobileCTA] = useState(false);
  const [utmData] = useState(() => {
    const url = new URL(window.location.href);
    return {
      source: url.searchParams.get('utm_source') || 'direct',
      medium: url.searchParams.get('utm_medium') || '',
      campaign: url.searchParams.get('utm_campaign') || '',
      term: url.searchParams.get('utm_term') || '',
      content: url.searchParams.get('utm_content') || '',
      gclid: url.searchParams.get('gclid') || '',
    };
  });

  const heroRef = useRef<HTMLElement>(null);
  const section2Ref = useRef<HTMLElement>(null);
  const section3Ref = useRef<HTMLElement>(null);
  const section4Ref = useRef<HTMLElement>(null);
  const section5Ref = useRef<HTMLElement>(null);
  const section6Ref = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLElement>(null);

  const sectionRefs = [heroRef, section2Ref, section3Ref, section4Ref, section5Ref, section6Ref, formRef];

  // IntersectionObserver: update currentSection bidirectionally based on scroll position
  useEffect(() => {
    const visibleSections = new Set<number>();
    const observers: IntersectionObserver[] = [];

    const updateSection = () => {
      if (visibleSections.size === 0) return;
      const maxVisible = Math.max(...Array.from(visibleSections));
      setCurrentSection(maxVisible);
    };

    sectionRefs.forEach((ref, idx) => {
      if (!ref.current) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            visibleSections.add(idx);
          } else {
            visibleSections.delete(idx);
          }
          updateSection();
        },
        { threshold: 0.25, rootMargin: '-60px 0px 0px 0px' }
      );
      observer.observe(ref.current);
      observers.push(observer);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  useEffect(() => {
    const checkCTA = () => {
      if (submitted) return;
      const heroEl = heroRef.current;
      const formEl = formRef.current;
      if (!heroEl || !formEl) return;
      const heroPassed = heroEl.getBoundingClientRect().bottom < 0;
      const formTop = formEl.getBoundingClientRect().top;
      const nearForm = formTop - window.innerHeight < 200;
      setShowMobileCTA(heroPassed && !nearForm);
    };
    window.addEventListener('scroll', checkCTA, { passive: true });
    return () => window.removeEventListener('scroll', checkCTA);
  }, [submitted]);

  const progress = Math.min(100, Math.round((currentSection / 6) * 100));

  useEffect(() => {
    trackEvent('perspective_funnel_section', {
      event_category: 'Funnel',
      event_label: `section_${currentSection}`,
    });
  }, [currentSection]);

  useEffect(() => {
    if (!submitted) return;
    (async () => {
      const cal = await getCalApi({ namespace: 'beratung-termin' });
      cal('ui', { hideEventTypeDetails: false });
      cal('on', {
        action: 'bookingSuccessful',
        callback: () => {
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'conversion', {
              send_to: 'AW-17132012984/AEwRCLKWlZgcELiLl-k_',
              value: 1.0,
              currency: 'EUR',
            });
          }
        },
      });
    })();
  }, [submitted]);

  const scrollTo = useCallback((idx: number) => {
    const ref = sectionRefs[idx];
    if (ref?.current) {
      const yOffset = -72;
      const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  const validateForm = () => {
    const errors: FormErrors = {};
    if (!formData.firstName.trim()) errors.firstName = 'Bitte Vornamen eingeben';
    if (!formData.lastName.trim()) errors.lastName = 'Bitte Nachnamen eingeben';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Bitte gültige E-Mail eingeben';
    }
    if (!formData.phone.trim()) errors.phone = 'Bitte Telefonnummer eingeben';
    if (!formData.dsgvo) errors.dsgvo = 'Bitte Datenschutz akzeptieren';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitLead = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          insuranceType: selectedInsurance || 'general_consultation',
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          location: 'Ganderkesee',
          age: '',
          specificData: {
            has_existing: hasExisting,
            timing_preference: timingPreference,
            ...(selectedInsurance === 'sonstiges' && sonstigesText ? { sonstiges_text: sonstigesText } : {}),
            utm: utmData,
          },
          source: 'lp_beratung_perspective',
          status: 'new',
        }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        setSubmitError(err.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
        setIsSubmitting(false);
        return;
      }
    } catch (e) {
      console.error('Lead submission error:', e);
      setSubmitError('Netzwerkfehler. Bitte prüfen Sie Ihre Verbindung und versuchen Sie es erneut.');
      setIsSubmitting(false);
      return;
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        send_to: 'AW-17132012984/AEwRCLKWlZgcELiLl-k_',
        value: 1.0,
        currency: 'EUR',
      });
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'perspective_funnel_lead_submitted', insurance_type: selectedInsurance });
    trackConversion();
    trackEvent('funnel_lead_submitted', {
      event_category: 'Conversion',
      event_label: selectedInsurance || 'general_consultation',
    });
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <>
      <SEO
        title="Kostenlose Versicherungsberatung – ERGO Agentur Stübe Ganderkesee"
        description="Starten Sie jetzt Ihre kostenlose Versicherungsanalyse. In wenigen Schritten zum persönlichen Angebot von Ihrem ERGO Berater Morino Stübe in Ganderkesee."
        keywords="Versicherungsberatung kostenlos, ERGO Beratung Ganderkesee, Versicherungsvergleich, kostenlose Analyse"
      />

      {/* Sticky header with animated progress bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link href="/">
            <span className="flex items-center gap-2 cursor-pointer">
              <Shield className="w-6 h-6 text-ergo-red flex-shrink-0" />
              <span className="font-bold text-gray-900 text-sm leading-tight">
                ERGO Agentur Stübe
                <span className="block text-[10px] font-normal text-gray-400 leading-tight">Ihr Berater in Ganderkesee</span>
              </span>
            </span>
          </Link>
          <div className="hidden sm:flex flex-1 max-w-xs items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-ergo-red rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ type: 'spring', stiffness: 80, damping: 20 }}
              />
            </div>
            <span className="text-xs text-gray-400 tabular-nums w-8">{progress}%</span>
          </div>
          <a
            href="tel:015566771019"
            className="inline-flex items-center gap-1.5 bg-ergo-red text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors flex-shrink-0"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">01556 677 1019</span>
            <span className="sm:hidden">Anrufen</span>
          </a>
        </div>
        <div className="sm:hidden h-1 bg-gray-200">
          <motion.div
            className="h-full bg-ergo-red"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          />
        </div>
      </header>

      <div className="pt-14 min-h-screen bg-white">

        {/* Section 1 – Hero + Q1 */}
        <section ref={heroRef} className="bg-gradient-to-br from-[#003781] via-[#004299] to-[#005ab4] text-white pt-12 pb-16 sm:pt-20 sm:pb-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full text-xs font-medium mb-5">
                <StarRating size="sm" />
                <span>4,9/5 · über 3.500 zufriedene Kunden</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                Sind Sie wirklich <span className="text-yellow-300">optimal abgesichert?</span>
              </h1>
              <p className="text-white/85 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                Beantworten Sie 3 kurze Fragen und erhalten Sie eine persönliche, kostenlose Versicherungsanalyse von Morino Stübe – Ihrem ERGO Berater vor Ort.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
              <p className="text-sm font-semibold text-white/70 uppercase tracking-widest mb-4">
                Frage 1 von 3 · Was möchten Sie absichern?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
                {insuranceOptions.map((opt, i) => (
                  <motion.button
                    key={opt.value}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.04 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSelectedInsurance(opt.value);
                      setSelectedInsuranceLabel(opt.label);
                      trackEvent('perspective_q1_selected', { event_label: opt.value });
                      if (opt.value !== 'sonstiges') {
                        scrollTo(1);
                      }
                    }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all cursor-pointer
                      ${selectedInsurance === opt.value
                        ? 'border-yellow-400 bg-yellow-400/20 shadow-lg'
                        : 'border-white/20 bg-white/10 hover:border-white/50 hover:bg-white/20'}
                    `}
                  >
                    <span className="text-3xl">{opt.icon}</span>
                    <span className="text-sm font-semibold text-white leading-tight text-center">{opt.label}</span>
                  </motion.button>
                ))}
              </div>

              {selectedInsurance === 'sonstiges' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 max-w-md mx-auto"
                >
                  <input
                    type="text"
                    value={sonstigesText}
                    onChange={e => setSonstigesText(e.target.value)}
                    placeholder="Welche Versicherung interessiert Sie?"
                    className="w-full bg-white/15 border-2 border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 text-sm focus:outline-none focus:border-yellow-400 focus:bg-white/20"
                  />
                  <motion.button
                    onClick={() => { if (sonstigesText.trim()) scrollTo(1); }}
                    whileHover={sonstigesText.trim() ? { scale: 1.02 } : {}}
                    whileTap={sonstigesText.trim() ? { scale: 0.97 } : {}}
                    className={`mt-3 w-full font-bold py-3 rounded-xl text-sm transition-colors ${
                      sonstigesText.trim()
                        ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 cursor-pointer'
                        : 'bg-white/20 text-white/40 cursor-not-allowed'
                    }`}
                  >
                    {sonstigesText.trim() ? 'Weiter →' : 'Bitte zuerst eingeben'}
                  </motion.button>
                </motion.div>
              )}

              <p className="mt-5 text-xs text-white/50">🔒 Unverbindlich & kostenlos · DSGVO-konform</p>
            </motion.div>
          </div>
        </section>

        {/* Section 2 – Trust + stacked avatars + Q2 */}
        <section ref={section2Ref} className="py-14 sm:py-20 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-10">
              {[
                { emoji: '🏆', label: 'ERGO Testsieger', sub: '2024' },
                { emoji: '⭐', label: '4,9 / 5 Sterne', sub: 'Kundenbewertung' },
                { emoji: '🤝', label: '100% kostenlos', sub: 'Keine Verpflichtung' },
                { emoji: '📍', label: 'Vor Ort', sub: 'Ganderkesee' },
              ].map(b => (
                <div key={b.label} className="flex flex-col items-center gap-1 min-w-[80px]">
                  <span className="text-3xl">{b.emoji}</span>
                  <span className="text-xs font-bold text-gray-900 text-center">{b.label}</span>
                  <span className="text-[10px] text-gray-500 text-center">{b.sub}</span>
                </div>
              ))}
            </div>

            {/* Stacked avatars social proof */}
            <div className="flex justify-center items-center gap-3 mb-12">
              <div className="flex -space-x-3">
                {['TM', 'SK', 'MB', 'JF', 'RK'].map((initials, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold flex-shrink-0
                      ${['bg-blue-500', 'bg-purple-500', 'bg-green-600', 'bg-orange-500', 'bg-pink-500'][i]}
                    `}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">3.500+ zufriedene Kunden</p>
                <div className="flex items-center gap-1">
                  <StarRating size="sm" />
                  <span className="text-xs text-gray-500">aus der Region</span>
                </div>
              </div>
            </div>

            {/* Q2 */}
            <div className="max-w-xl mx-auto text-center">
              <p className="text-xs font-semibold text-ergo-red uppercase tracking-widest mb-3">Frage 2 von 3</p>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Haben Sie bereits Versicherungen, die geprüft werden sollen?
              </h2>
              <p className="text-gray-500 text-sm mb-8">Kein Problem – ich schaue mir alles an, was Sie haben.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {[
                  { icon: '✅', label: 'Ja, bestehende Verträge prüfen', value: 'ja' },
                  { icon: '🆕', label: 'Nein, ich starte neu', value: 'nein' },
                ].map(opt => (
                  <motion.button
                    key={opt.value}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setHasExisting(opt.value);
                      trackEvent('perspective_q2_selected', { event_label: opt.value });
                      scrollTo(2);
                    }}
                    className={`flex-1 flex items-center gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all text-left font-semibold text-gray-800
                      ${hasExisting === opt.value
                        ? 'border-ergo-red bg-red-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-ergo-red/50 hover:bg-red-50/30'}
                    `}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <span className="text-sm sm:text-base">{opt.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 – Benefits + Testimonials + Q3 */}
        <section ref={section3Ref} className="py-14 sm:py-20 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-3 mb-14">
              {[
                { icon: '💰', text: 'Bis zu 15% Bündelrabatt ab 5 Versicherungen' },
                { icon: '⚡', text: 'Antwort innerhalb von 24 Stunden garantiert' },
                { icon: '🎯', text: 'Lücken erkennen – keine Doppelversicherungen mehr' },
                { icon: '🤝', text: 'Persönliche Beratung – kein anonymes Call-Center' },
                { icon: '📱', text: 'Vor Ort, per Video oder WhatsApp – Sie wählen' },
                { icon: '🛡️', text: 'ERGO – eine der größten deutschen Versicherungen' },
              ].map(b => (
                <div key={b.text} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100">
                  <span className="text-2xl flex-shrink-0">{b.icon}</span>
                  <span className="text-sm text-gray-700 font-medium leading-snug">{b.text}</span>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-14">
              {testimonials.map(t => (
                <div key={t.name} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${t.color}`}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{t.name}</p>
                      <p className="text-[10px] text-gray-400">{t.location}</p>
                    </div>
                    <StarRating size="sm" />
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed italic">"{t.text}"</p>
                </div>
              ))}
            </div>

            {/* Q3 */}
            <div className="max-w-xl mx-auto text-center">
              <p className="text-xs font-semibold text-ergo-red uppercase tracking-widest mb-3">Frage 3 von 3</p>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Wann möchten Sie beraten werden?
              </h2>
              <p className="text-gray-500 text-sm mb-8">Ich richte mich nach Ihren Wünschen.</p>
              <div className="flex flex-col gap-3">
                {[
                  { icon: '⚡', label: 'So schnell wie möglich', value: 'sofort' },
                  { icon: '📅', label: 'Diese Woche (Mo–Sa)', value: 'diese_woche' },
                  { icon: '🗓️', label: 'Flexibel – kein Stress', value: 'flexibel' },
                ].map(opt => (
                  <motion.button
                    key={opt.value}
                    whileHover={{ scale: 1.01, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setTimingPreference(opt.value);
                      trackEvent('perspective_q3_selected', { event_label: opt.value });
                      scrollTo(3);
                    }}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all text-left font-semibold text-gray-800
                      ${timingPreference === opt.value
                        ? 'border-ergo-red bg-red-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-ergo-red/50'}
                    `}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <span className="text-sm sm:text-base">{opt.label}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 – Comparison Table */}
        <section ref={section4Ref} className="py-14 sm:py-20 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold text-ergo-red uppercase tracking-widest mb-2">Warum ERGO Stübe?</p>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Was Sie woanders <span className="text-ergo-red">nicht bekommen</span>
              </h2>
            </div>
            <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
                <div className="p-4 text-sm font-semibold text-gray-500">Leistung</div>
                <div className="p-4 text-center text-sm font-bold text-ergo-red">ERGO Stübe</div>
                <div className="p-4 text-center text-sm font-semibold text-gray-400">Andere Anbieter</div>
              </div>
              {comparisonRows.map((row, i) => (
                <div key={i} className={`grid grid-cols-3 border-b border-gray-100 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <div className="p-4 text-sm text-gray-700 font-medium">{row.feature}</div>
                  <div className="p-4 flex justify-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-600">
                      <Check className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="p-4 flex justify-center">
                    {row.others === false ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-50 text-red-400">
                        <X className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="text-gray-400 text-lg">~</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={() => scrollTo(6)}
                className="inline-flex items-center gap-2 bg-ergo-red text-white font-bold px-8 py-4 rounded-xl hover:bg-red-700 transition-colors text-base shadow-md"
              >
                Jetzt kostenlos beraten lassen <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Section 5 – Advisor + Animated Stats */}
        <section ref={section5Ref} className="py-14 sm:py-20 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
              <div className="flex-shrink-0">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <img
                    src={advisorPhoto}
                    alt="Morino Stübe – Ihr ERGO Berater"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-xs font-semibold text-ergo-red uppercase tracking-widest mb-2">Ihr persönlicher Berater</p>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Morino Stübe</h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                  Ich bin seit über 15 Jahren selbstständiger ERGO Agenturinhaber in Ganderkesee. Mein Ziel ist es, Sie wirklich optimal abzusichern – ehrlich, transparent und ohne Druck.
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-6">
                  {ADVISOR_STATS.map(s => (
                    <AnimatedCounter
                      key={s.label}
                      end={s.end}
                      suffix={s.suffix}
                      decimals={s.decimals}
                      label={s.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6 – FAQ */}
        <section ref={section6Ref} className="py-14 sm:py-20 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold text-ergo-red uppercase tracking-widest mb-2">Häufige Fragen</p>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Alles was Sie wissen müssen</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {faqItems.map(item => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <button
                onClick={() => scrollTo(6)}
                className="inline-flex items-center gap-2 bg-ergo-red text-white font-bold px-8 py-4 rounded-xl hover:bg-red-700 transition-colors text-base shadow-md"
              >
                Jetzt Analyse starten <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Section 7 – Lead Form */}
        <section ref={formRef} className="py-14 sm:py-20 px-4 bg-gradient-to-br from-[#003781] to-[#005ab4]">
          <div className={`mx-auto transition-all duration-500 ${submitted ? 'max-w-3xl' : 'max-w-xl'}`}>
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="text-center mb-8">
                    <p className="text-xs font-semibold text-yellow-300 uppercase tracking-widest mb-2">Fast geschafft!</p>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      Wohin soll ich Ihre Analyse senden?
                    </h2>
                    <p className="text-white/75 text-sm">
                      {selectedInsuranceLabel ? `Thema: ${selectedInsuranceLabel} · ` : ''}
                      Ich melde mich innerhalb von 24 Stunden bei Ihnen.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Vorname *</label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))}
                          placeholder="Max"
                          className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ergo-red/40 ${formErrors.firstName ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Nachname *</label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))}
                          placeholder="Mustermann"
                          className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ergo-red/40 ${formErrors.lastName ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">E-Mail *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                        placeholder="max@beispiel.de"
                        className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ergo-red/40 ${formErrors.email ? 'border-red-400' : 'border-gray-300'}`}
                      />
                      {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                    </div>
                    <div className="mb-5">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Telefon *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+49 15566 771019"
                        className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ergo-red/40 ${formErrors.phone ? 'border-red-400' : 'border-gray-300'}`}
                      />
                      {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                    </div>

                    <div className="mb-6">
                      <label className={`flex items-start gap-3 cursor-pointer ${formErrors.dsgvo ? 'text-red-500' : 'text-gray-600'}`}>
                        <input
                          type="checkbox"
                          checked={formData.dsgvo}
                          onChange={e => setFormData(p => ({ ...p, dsgvo: e.target.checked }))}
                          className="mt-0.5 w-4 h-4 flex-shrink-0 accent-ergo-red"
                        />
                        <span className="text-xs leading-relaxed">
                          Ich stimme der Verarbeitung meiner Daten zur Kontaktaufnahme zu. Details in der{' '}
                          <Link href="/datenschutz">
                            <span className="underline hover:text-ergo-red cursor-pointer">Datenschutzerklärung</span>
                          </Link>.
                        </span>
                      </label>
                      {formErrors.dsgvo && <p className="text-red-500 text-xs mt-1 ml-7">{formErrors.dsgvo}</p>}
                    </div>

                    {submitError && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {submitError}
                      </div>
                    )}
                    <button
                      onClick={submitLead}
                      disabled={isSubmitting}
                      className="w-full bg-ergo-red text-white font-bold py-4 rounded-xl text-base hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Wird gesendet…
                        </span>
                      ) : (
                        'Kostenlose Analyse anfordern →'
                      )}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-3">
                      🔒 Ihre Daten sind sicher · DSGVO-konform · Keine Werbung
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      Super, {formData.firstName}! 🎉
                    </h2>
                    <p className="text-white/80 text-sm max-w-sm mx-auto">
                      Ihre Anfrage ist eingegangen. Wählen Sie jetzt direkt Ihren Wunschtermin:
                    </p>
                  </div>

                  <div className="rounded-2xl overflow-hidden shadow-2xl bg-white">
                    <Cal
                      namespace="beratung-termin"
                      calLink="morino-stuebe-ergo/erstberatung"
                      style={{ width: '100%', minHeight: 620 }}
                      config={{ layout: 'month_view' }}
                    />
                  </div>

                  <p className="text-center text-white/50 text-xs mt-4">
                    Kein passender Termin? Rufen Sie uns an:{' '}
                    <a href="tel:015566771019" className="underline text-white/70">
                      01556 677 1019
                    </a>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Footer mini */}
        <footer className="bg-[#002560] py-6 px-4 text-center">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-white/50 mb-2">
            <Link href="/impressum"><span className="hover:text-white cursor-pointer">Impressum</span></Link>
            <Link href="/datenschutz"><span className="hover:text-white cursor-pointer">Datenschutz</span></Link>
            <Link href="/erstinformation"><span className="hover:text-white cursor-pointer">Erstinformation</span></Link>
            <Link href="/"><span className="hover:text-white cursor-pointer">Startseite</span></Link>
          </div>
          <p className="text-xs text-white/30">© {new Date().getFullYear()} ERGO Versicherung Morino Stübe · Bergedorfer Str. 11, 27777 Ganderkesee</p>
        </footer>
      </div>

      {/* Mobile sticky CTA */}
      <AnimatePresence>
        {showMobileCTA && !submitted && (
          <motion.div
            key="mobile-cta"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white border-t border-gray-200 px-4 py-3 shadow-xl"
            style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom, 12px))' }}
          >
            <button
              onClick={() => scrollTo(6)}
              className="w-full bg-ergo-red text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2"
            >
              Jetzt kostenlos beraten lassen <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
