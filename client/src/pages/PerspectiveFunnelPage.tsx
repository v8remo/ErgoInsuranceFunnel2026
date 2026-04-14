import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Cal, { getCalApi } from '@calcom/embed-react';
import { Link } from 'wouter';
import SEO from '@/components/SEO';
import { trackEvent, trackConversion } from '@/lib/analytics';
import { Phone, Shield, Star, ChevronDown, ChevronUp, Check, ArrowRight, X, ChevronLeft } from 'lucide-react';
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
  { icon: '❤️', label: 'Risikoleben', value: 'risikoleben' },
  { icon: '🐾', label: 'Tierversicherung', value: 'tier' },
  { icon: '🏢', label: 'Gewerbe / Betrieb', value: 'gewerbe' },
  { icon: '🏥', label: 'Krankenzusatz / PKV', value: 'kranken' },
  { icon: '🧓', label: 'Pflege', value: 'pflege' },
  { icon: '📋', label: 'Sonstiges', value: 'sonstiges' },
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
  // Quiz state
  const [quizStep, setQuizStep] = useState(0); // 0=Q1, 1=Q2, 2=Q3
  const [quizDone, setQuizDone] = useState(false);
  const [slideDir, setSlideDir] = useState(1); // 1=forward, -1=back

  // Q1 multi-select
  const [selectedInsurances, setSelectedInsurances] = useState<string[]>([]);
  const [sonstigesText, setSonstigesText] = useState('');

  // Q2 & Q3
  const [hasExisting, setHasExisting] = useState('');
  const [timingPreference, setTimingPreference] = useState('');

  // Form
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
  const [calKey, setCalKey] = useState('initial');

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
  const formRef = useRef<HTMLElement>(null);

  // Mobile sticky CTA: show after hero, hide near form
  useEffect(() => {
    const checkCTA = () => {
      if (submitted) return;
      const heroEl = heroRef.current;
      const formEl = formRef.current;
      if (!heroEl || !formEl) return;
      const heroPassed = heroEl.getBoundingClientRect().bottom < 0;
      const nearForm = formEl.getBoundingClientRect().top - window.innerHeight < 200;
      setShowMobileCTA(heroPassed && !nearForm);
    };
    checkCTA();
    window.addEventListener('scroll', checkCTA, { passive: true });
    return () => window.removeEventListener('scroll', checkCTA);
  }, [submitted]);

  // Cal.com init on mount
  useEffect(() => {
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
  }, []);

  const scrollToForm = useCallback(() => {
    if (formRef.current) {
      const y = formRef.current.getBoundingClientRect().top + window.pageYOffset - 72;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  const advanceQuiz = (nextStep: number) => {
    setSlideDir(1);
    if (nextStep > 2) {
      setQuizDone(true);
      setTimeout(scrollToForm, 100);
    } else {
      setQuizStep(nextStep);
    }
  };

  const backQuiz = () => {
    setSlideDir(-1);
    setQuizStep(s => Math.max(0, s - 1));
  };

  const toggleInsurance = (value: string) => {
    setSelectedInsurances(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

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
    const insuranceLabel = selectedInsurances
      .map(v => insuranceOptions.find(o => o.value === v)?.label ?? v)
      .join(', ');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          insuranceType: selectedInsurances.join(', ') || 'general_consultation',
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          location: 'Ganderkesee',
          age: '',
          specificData: {
            has_existing: hasExisting,
            timing_preference: timingPreference,
            ...(selectedInsurances.includes('sonstiges') && sonstigesText
              ? { sonstiges_text: sonstigesText }
              : {}),
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
    window.dataLayer.push({ event: 'perspective_funnel_lead_submitted', insurance_type: selectedInsurances.join(',') });
    trackConversion();
    trackEvent('funnel_lead_submitted', {
      event_category: 'Conversion',
      event_label: selectedInsurances.join(',') || 'general_consultation',
    });
    setIsSubmitting(false);
    setSubmitted(true);
    setCalKey(`prefilled-${Date.now()}`);

    void insuranceLabel;
  };

  // Progress bar: quiz = 0..2 → 33/66/100%, after quiz = 100%
  const progress = quizDone || submitted ? 100 : Math.round(((quizStep + 1) / 3) * 100);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir * 60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir * -60, opacity: 0 }),
  };

  const q1CanContinue =
    selectedInsurances.length > 0 &&
    (!selectedInsurances.includes('sonstiges') || sonstigesText.trim().length > 0);

  return (
    <>
      <SEO
        title="Kostenlose Versicherungsberatung – ERGO Agentur Stübe Ganderkesee"
        description="Starten Sie jetzt Ihre kostenlose Versicherungsanalyse. In wenigen Schritten zum persönlichen Angebot von Ihrem ERGO Berater Morino Stübe in Ganderkesee."
        keywords="Versicherungsberatung kostenlos, ERGO Beratung Ganderkesee, Versicherungsvergleich, kostenlose Analyse"
      />

      {/* Sticky header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link href="/">
            <span className="flex items-center gap-2 cursor-pointer">
              <Shield className="w-6 h-6 text-ergo-red flex-shrink-0" />
              <span className="font-bold text-gray-900 text-sm">ERGO Stübe</span>
            </span>
          </Link>
          <div className="hidden sm:flex flex-1 items-center gap-3 max-w-xs">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-ergo-red rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ type: 'spring', stiffness: 80, damping: 20 }}
              />
            </div>
            <span className="text-xs text-gray-500 font-medium whitespace-nowrap">{progress}%</span>
          </div>
          <a
            href="tel:015566771019"
            className="flex items-center gap-1.5 text-ergo-red text-sm font-semibold hover:text-red-700 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">01556 677 1019</span>
            <span className="sm:hidden">Anrufen</span>
          </a>
        </div>
        <div className="sm:hidden h-1 bg-gray-100">
          <motion.div
            className="h-full bg-ergo-red"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          />
        </div>
      </header>

      <div className="pt-14 bg-white">

        {/* ── QUIZ SECTION ── */}
        <section
          ref={heroRef}
          className="bg-gradient-to-br from-[#003781] via-[#004299] to-[#005ab4] text-white px-4 pt-8 pb-12 sm:pt-12 sm:pb-16"
        >
          <div className="max-w-3xl mx-auto">

            {/* Step dots indicator */}
            {!quizDone && (
              <div className="flex items-center justify-center gap-3 mb-8">
                {[0, 1, 2].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <motion.div
                      animate={{
                        scale: i === quizStep ? 1.15 : 1,
                        backgroundColor: i < quizStep ? '#4ade80' : i === quizStep ? '#facc15' : 'rgba(255,255,255,0.25)',
                      }}
                      transition={{ duration: 0.3 }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ color: i <= quizStep ? '#1a1a1a' : 'rgba(255,255,255,0.6)' }}
                    >
                      {i < quizStep ? <Check className="w-4 h-4" /> : i + 1}
                    </motion.div>
                    {i < 2 && (
                      <motion.div
                        className="h-0.5 w-8 sm:w-14 rounded-full"
                        animate={{ backgroundColor: i < quizStep ? '#4ade80' : 'rgba(255,255,255,0.25)' }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Animated step content */}
            <AnimatePresence mode="wait" custom={slideDir}>
              {/* ── Q1: Multi-select ── */}
              {quizStep === 0 && !quizDone && (
                <motion.div
                  key="q1"
                  custom={slideDir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="text-center mb-6">
                    <p className="text-xs font-semibold text-yellow-300 uppercase tracking-widest mb-2">
                      Schritt 1 von 3
                    </p>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 leading-tight">
                      Was möchten Sie <span className="text-yellow-300">absichern?</span>
                    </h1>
                    <p className="text-white/75 text-sm">
                      Mehrfachauswahl möglich – wählen Sie alles was passt
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 mb-5">
                    {insuranceOptions.map((opt, i) => {
                      const selected = selectedInsurances.includes(opt.value);
                      return (
                        <motion.button
                          key={opt.value}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          whileHover={{ scale: 1.03, y: -1 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            toggleInsurance(opt.value);
                            trackEvent('perspective_q1_selected', { event_label: opt.value });
                          }}
                          className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all cursor-pointer
                            ${selected
                              ? 'border-yellow-400 bg-yellow-400/20 shadow-lg'
                              : 'border-white/20 bg-white/10 hover:border-white/50 hover:bg-white/20'}
                          `}
                        >
                          {selected && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-gray-900" />
                            </span>
                          )}
                          <span className="text-2xl">{opt.icon}</span>
                          <span className="text-xs font-semibold text-white leading-tight text-center">{opt.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Sonstiges text input */}
                  {selectedInsurances.includes('sonstiges') && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 max-w-md mx-auto"
                    >
                      <input
                        type="text"
                        value={sonstigesText}
                        onChange={e => setSonstigesText(e.target.value)}
                        placeholder="Was interessiert Sie?"
                        className="w-full bg-white/15 border-2 border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 text-sm focus:outline-none focus:border-yellow-400"
                      />
                    </motion.div>
                  )}

                  {/* Selection summary */}
                  {selectedInsurances.length > 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-xs text-yellow-300 mb-3"
                    >
                      {selectedInsurances.length === 1
                        ? '1 Versicherung ausgewählt'
                        : `${selectedInsurances.length} Versicherungen ausgewählt`}
                    </motion.p>
                  )}

                  <div className="flex justify-center">
                    <motion.button
                      onClick={() => q1CanContinue && advanceQuiz(1)}
                      whileHover={q1CanContinue ? { scale: 1.03 } : {}}
                      whileTap={q1CanContinue ? { scale: 0.97 } : {}}
                      className={`flex items-center gap-2 font-bold px-8 py-4 rounded-xl text-base transition-all shadow-lg ${
                        q1CanContinue
                          ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 cursor-pointer'
                          : 'bg-white/15 text-white/40 cursor-not-allowed'
                      }`}
                    >
                      {q1CanContinue ? (
                        <>Weiter <ArrowRight className="w-5 h-5" /></>
                      ) : (
                        'Bitte mindestens eine Auswahl treffen'
                      )}
                    </motion.button>
                  </div>
                  <p className="mt-4 text-center text-xs text-white/40">
                    🔒 Unverbindlich & kostenlos · DSGVO-konform
                  </p>
                </motion.div>
              )}

              {/* ── Q2: Existing contracts ── */}
              {quizStep === 1 && !quizDone && (
                <motion.div
                  key="q2"
                  custom={slideDir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="text-center mb-8">
                    <p className="text-xs font-semibold text-yellow-300 uppercase tracking-widest mb-2">
                      Schritt 2 von 3
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">
                      Haben Sie bereits <span className="text-yellow-300">bestehende Verträge?</span>
                    </h2>
                    <p className="text-white/75 text-sm">Kein Problem – ich schaue mir alles an.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-6">
                    {[
                      { icon: '✅', label: 'Ja – Verträge prüfen lassen', sub: 'Ich prüfe ob Sie zu viel zahlen', value: 'ja' },
                      { icon: '🆕', label: 'Nein – ich starte neu', sub: 'Ich baue Ihren Schutz von Grund auf', value: 'nein' },
                    ].map(opt => (
                      <motion.button
                        key={opt.value}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          setHasExisting(opt.value);
                          trackEvent('perspective_q2_selected', { event_label: opt.value });
                          setTimeout(() => advanceQuiz(2), 250);
                        }}
                        className={`flex-1 flex flex-col items-start gap-1 p-5 rounded-2xl border-2 cursor-pointer transition-all text-left
                          ${hasExisting === opt.value
                            ? 'border-yellow-400 bg-yellow-400/20 shadow-lg'
                            : 'border-white/25 bg-white/10 hover:border-white/60 hover:bg-white/20'}
                        `}
                      >
                        <span className="text-3xl mb-1">{opt.icon}</span>
                        <span className="font-bold text-white text-sm sm:text-base">{opt.label}</span>
                        <span className="text-white/60 text-xs">{opt.sub}</span>
                      </motion.button>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={backQuiz}
                      className="flex items-center gap-1.5 text-white/50 text-sm hover:text-white/80 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" /> Zurück
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── Q3: Timing ── */}
              {quizStep === 2 && !quizDone && (
                <motion.div
                  key="q3"
                  custom={slideDir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="text-center mb-8">
                    <p className="text-xs font-semibold text-yellow-300 uppercase tracking-widest mb-2">
                      Schritt 3 von 3 – Fast geschafft!
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">
                      Wann möchten Sie <span className="text-yellow-300">beraten werden?</span>
                    </h2>
                    <p className="text-white/75 text-sm">Ich richte mich nach Ihren Wünschen.</p>
                  </div>

                  <div className="flex flex-col gap-3 max-w-lg mx-auto mb-6">
                    {[
                      { icon: '⚡', label: 'So schnell wie möglich', sub: 'Ich melde mich innerhalb von 24h', value: 'sofort' },
                      { icon: '📅', label: 'Diese Woche (Mo–Sa)', sub: 'Termin noch diese Woche', value: 'diese_woche' },
                      { icon: '🗓️', label: 'Flexibel – kein Stress', sub: 'Ich wähle einen passenden Termin', value: 'flexibel' },
                    ].map(opt => (
                      <motion.button
                        key={opt.value}
                        whileHover={{ scale: 1.01, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setTimingPreference(opt.value);
                          trackEvent('perspective_q3_selected', { event_label: opt.value });
                          setTimeout(() => advanceQuiz(3), 250);
                        }}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all text-left
                          ${timingPreference === opt.value
                            ? 'border-yellow-400 bg-yellow-400/20 shadow-lg'
                            : 'border-white/25 bg-white/10 hover:border-white/60 hover:bg-white/20'}
                        `}
                      >
                        <span className="text-2xl flex-shrink-0">{opt.icon}</span>
                        <div className="flex-1">
                          <p className="font-bold text-white text-sm sm:text-base">{opt.label}</p>
                          <p className="text-white/60 text-xs mt-0.5">{opt.sub}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/40 flex-shrink-0" />
                      </motion.button>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={backQuiz}
                      className="flex items-center gap-1.5 text-white/50 text-sm hover:text-white/80 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" /> Zurück
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── Quiz done: scroll hint ── */}
              {quizDone && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-6"
                >
                  <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Perfekt! Ihre Angaben sind gespeichert.</h2>
                  <p className="text-white/75 text-sm mb-6">Füllen Sie jetzt das Formular aus – die Beratung ist kostenlos.</p>
                  <button
                    onClick={scrollToForm}
                    className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl hover:bg-yellow-300 transition-colors shadow-lg text-base"
                  >
                    Zum Formular <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trust bar below quiz */}
            {!quizDone && (
              <div className="mt-8 flex flex-wrap justify-center gap-5 sm:gap-8">
                {[
                  { emoji: '🏆', label: 'ERGO Testsieger 2024' },
                  { emoji: '⭐', label: '4,9/5 Sterne' },
                  { emoji: '🤝', label: '100% kostenlos' },
                  { emoji: '📍', label: 'Vor Ort Ganderkesee' },
                ].map(b => (
                  <div key={b.label} className="flex items-center gap-1.5 text-white/70 text-xs font-medium">
                    <span className="text-base">{b.emoji}</span>
                    {b.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Social proof + Benefits ── */}
        <section className="py-14 sm:py-20 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center items-center gap-3 mb-10">
              <div className="flex -space-x-3">
                {['TM', 'SK', 'MB', 'JF', 'RK'].map((initials, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold flex-shrink-0
                      ${['bg-blue-500', 'bg-purple-500', 'bg-green-600', 'bg-orange-500', 'bg-pink-500'][i]}`}
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

            <div className="grid sm:grid-cols-2 gap-3 mb-12">
              {[
                { icon: '💰', text: 'Bis zu 15% Bündelrabatt ab 5 Versicherungen' },
                { icon: '⚡', text: 'Antwort innerhalb von 24 Stunden garantiert' },
                { icon: '🎯', text: 'Lücken erkennen – keine Doppelversicherungen' },
                { icon: '🤝', text: 'Persönliche Beratung – kein anonymes Call-Center' },
                { icon: '📱', text: 'Vor Ort, per Video oder WhatsApp – Sie wählen' },
                { icon: '🛡️', text: 'ERGO – eine der größten deutschen Versicherungen' },
              ].map(b => (
                <div key={b.text} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <span className="text-2xl flex-shrink-0">{b.icon}</span>
                  <span className="text-sm text-gray-700 font-medium leading-snug">{b.text}</span>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {testimonials.map(t => (
                <div key={t.name} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
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
          </div>
        </section>

        {/* ── Comparison table ── */}
        <section className="py-14 sm:py-20 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold text-ergo-red uppercase tracking-widest mb-2">Warum ERGO Stübe?</p>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Was Sie woanders <span className="text-ergo-red">nicht bekommen</span>
              </h2>
            </div>
            <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="grid grid-cols-3 bg-white border-b border-gray-200">
                <div className="p-4 text-sm font-semibold text-gray-500">Leistung</div>
                <div className="p-4 text-center text-sm font-bold text-ergo-red">ERGO Stübe</div>
                <div className="p-4 text-center text-sm font-semibold text-gray-400">Andere</div>
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
                onClick={scrollToForm}
                className="inline-flex items-center gap-2 bg-ergo-red text-white font-bold px-8 py-4 rounded-xl hover:bg-red-700 transition-colors text-base shadow-md"
              >
                Jetzt kostenlos beraten lassen <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* ── Advisor ── */}
        <section className="py-14 sm:py-20 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
              <div className="flex-shrink-0">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-gray-100 shadow-xl">
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

        {/* ── FAQ ── */}
        <section className="py-14 sm:py-20 px-4 bg-gray-50">
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
                onClick={scrollToForm}
                className="inline-flex items-center gap-2 bg-ergo-red text-white font-bold px-8 py-4 rounded-xl hover:bg-red-700 transition-colors text-base shadow-md"
              >
                Jetzt Analyse starten <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* ── Lead Form + Calendar combined ── */}
        <section ref={formRef} className="py-14 sm:py-20 px-4 bg-gradient-to-br from-[#003781] to-[#005ab4]">
          <div className="max-w-5xl mx-auto">

            {/* Header */}
            <div className="text-center mb-8 sm:mb-10">
              <p className="text-xs font-semibold text-yellow-300 uppercase tracking-widest mb-2">Letzter Schritt</p>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Kontaktdaten eingeben &amp; Termin wählen
              </h2>
              <p className="text-white/70 text-sm max-w-md mx-auto">
                {selectedInsurances.length > 0
                  ? `Thema: ${selectedInsurances.map(v => insuranceOptions.find(o => o.value === v)?.label ?? v).join(', ')} · `
                  : ''}
                Alles in einem Schritt – kein Hin und Her.
              </p>
            </div>

            {/* Two-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">

              {/* ── Left: Form / Success ── */}
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xl">
                      <p className="text-xs font-semibold text-ergo-red uppercase tracking-widest mb-4">
                        1. Ihre Kontaktdaten
                      </p>
                      <div className="grid grid-cols-2 gap-3 mb-3">
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
                      <div className="mb-3">
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
                      <div className="mb-4">
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
                      <div className="mb-5">
                        <label className={`flex items-start gap-3 cursor-pointer ${formErrors.dsgvo ? 'text-red-500' : 'text-gray-600'}`}>
                          <input
                            type="checkbox"
                            checked={formData.dsgvo}
                            onChange={e => setFormData(p => ({ ...p, dsgvo: e.target.checked }))}
                            className="mt-0.5 w-4 h-4 flex-shrink-0 accent-ergo-red"
                          />
                          <span className="text-xs leading-relaxed">
                            Ich stimme der Verarbeitung meiner Daten zur Kontaktaufnahme zu.{' '}
                            <Link href="/datenschutz">
                              <span className="underline hover:text-ergo-red cursor-pointer">Datenschutzerklärung</span>
                            </Link>
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
                          'Anfrage senden & Termin wählen →'
                        )}
                      </button>
                      <p className="text-center text-xs text-gray-400 mt-3">
                        🔒 DSGVO-konform · Kostenlos · Keine Werbung
                      </p>
                    </div>

                    {/* Arrow hint on desktop */}
                    <div className="hidden lg:flex items-center justify-center gap-2 mt-4 text-white/50 text-xs">
                      <span>Nach dem Absenden Termin rechts wählen</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-7 text-center">
                      <div className="w-14 h-14 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Check className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        Super, {formData.firstName}! 🎉
                      </h3>
                      <p className="text-white/80 text-sm mb-5 leading-relaxed">
                        Ihre Anfrage ist eingegangen. Wählen Sie jetzt Ihren Wunschtermin im Kalender.
                      </p>
                      <div className="space-y-2 text-left">
                        {[
                          { label: 'Name', value: `${formData.firstName} ${formData.lastName}` },
                          { label: 'E-Mail', value: formData.email },
                          { label: 'Telefon', value: formData.phone },
                        ].map(item => (
                          <div key={item.label} className="flex gap-2 text-sm">
                            <span className="text-white/50 w-14 flex-shrink-0">{item.label}</span>
                            <span className="text-white font-medium">{item.value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-5 pt-4 border-t border-white/20">
                        <p className="text-white/60 text-xs">
                          Kein passender Termin?{' '}
                          <a href="tel:015566771019" className="underline text-white/80 font-semibold">
                            01556 677 1019
                          </a>
                        </p>
                      </div>
                    </div>
                    {/* Arrow pointing right on desktop */}
                    <div className="hidden lg:flex items-center justify-center gap-2 mt-4 text-yellow-300 text-xs font-semibold">
                      <span>Jetzt Termin im Kalender wählen</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Right: Calendar (always visible) ── */}
              <div className="rounded-2xl overflow-hidden shadow-2xl bg-white">
                <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">
                    {submitted ? '2. Wunschtermin wählen' : '2. Direkt Termin wählen (optional)'}
                  </span>
                  {submitted && (
                    <span className="ml-auto bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      Daten vorausgefüllt
                    </span>
                  )}
                </div>
                <Cal
                  key={calKey}
                  namespace="beratung-termin"
                  calLink="morino-stuebe-ergo/erstberatung"
                  style={{ width: '100%', minHeight: 'clamp(480px, 72vh, 660px)' }}
                  config={{
                    layout: 'month_view',
                    useSlotsViewOnSmallScreen: 'true',
                    ...(submitted ? {
                      name: `${formData.firstName} ${formData.lastName}`,
                      email: formData.email,
                    } : {}),
                  }}
                />
              </div>

            </div>
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
            className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-ergo-red px-4 py-3 shadow-2xl"
            style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom, 12px))' }}
          >
            <button
              onClick={scrollToForm}
              className="w-full bg-white text-ergo-red font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              Jetzt kostenlos beraten lassen <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
