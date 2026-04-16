import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'wouter';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import SEO from '@/components/SEO';
import FunnelOverlay from '@/components/FunnelOverlay';
import FAQSection from '@/components/FAQSection';
import { trackEvent, trackConversion } from '@/lib/analytics';
import { type SpartenConfig } from '@/data/spartenConfig';
import {
  Phone, Shield, Star, Users, Clock, CheckCircle,
  MessageCircle, Award, ArrowRight, ChevronRight, MessageSquare
} from 'lucide-react';
import beraterPhoto from '@assets/optimized/ich_bin_da.webp';

interface SpartenLandingPageProps {
  config: SpartenConfig;
}

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' as const },
  transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true, margin: '-60px' as const },
};

const staggerChild = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
};

function AnimatedCounter({ target, suffix = '', duration = 2 }: { target: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { duration: duration * 1000 });

  useEffect(() => {
    if (isInView) motionVal.set(target);
  }, [isInView, target, motionVal]);

  useEffect(() => {
    const unsubscribe = springVal.on('change', (v) => {
      if (ref.current) ref.current.textContent = Math.round(v) + suffix;
    });
    return unsubscribe;
  }, [springVal, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

const QUIZ_OPTIONS = [
  { label: 'Kfz-Versicherung', icon: '🚗', type: 'kfz', source: 'hero_quiz' },
  { label: 'Hausrat & Haftpflicht', icon: '🏠', type: 'hausrat', source: 'hero_quiz' },
  { label: 'Rechtsschutz', icon: '⚖️', type: 'rechtsschutz', source: 'hero_quiz' },
  { label: 'Zahnzusatz', icon: '🦷', type: 'zahnzusatz', source: 'hero_quiz' },
  { label: 'Berufsunfähigkeit', icon: '💼', type: 'bu', source: 'hero_quiz' },
  { label: 'Gewerbe & Betrieb', icon: '🏢', type: 'gewerbe', source: 'lp_gewerbe' },
  { label: 'Alle prüfen', icon: '✅', type: 'all', source: 'hero_quiz' },
];

const TYPE_TO_QUIZ: Record<string, string> = {
  kfz: 'kfz',
  hausrat: 'hausrat',
  haftpflicht: 'hausrat',
  rechtsschutz: 'rechtsschutz',
  berufsunfaehigkeit: 'bu',
  zahnzusatz: 'zahnzusatz',
  gewerbe: 'gewerbe',
};

const QUIZ_TO_CANONICAL_TYPE: Record<string, string> = {
  kfz: 'kfz',
  hausrat: 'hausrat',
  rechtsschutz: 'rechtsschutz',
  zahnzusatz: 'zahnzusatz',
  bu: 'berufsunfaehigkeit',
  gewerbe: 'gewerbe',
};

const ergoAwards = [
  { label: 'Zahnzusatz', rating: 'SEHR GUT (0,5)', source: 'Stiftung Warentest \'24' },
  { label: 'BU-Versicherung', rating: 'SEHR GUT', source: 'Finanztest \'24' },
  { label: 'Kfz Best-Tarif', rating: 'HERVORRAGEND', source: 'Franke & Bornberg \'25' },
  { label: 'Service', rating: '11x Champion', source: 'ServiceValue \'25' },
];

function ExplainerVideo({ src }: { src: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      className="py-10 md:py-14 px-4"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <p className="text-xs font-semibold text-ergo-red uppercase tracking-widest mb-2">Erklärvideo</p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Zahnzusatz einfach erklärt
          </h2>
          <p className="text-gray-500 text-sm mt-2">In wenigen Minuten verstehen Sie, worauf es bei der Zahnzusatzversicherung ankommt.</p>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gray-900 aspect-video">
          {!isPlaying ? (
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-4 group"
              aria-label="Video abspielen"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/90 to-cyan-700/80" />
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 sm:w-9 sm:h-9 text-ergo-red ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-base sm:text-lg">Video abspielen</p>
                  <p className="text-white/70 text-xs sm:text-sm mt-0.5">Zahnzusatz-Leitfaden · ERGO Stübe</p>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-black/40 text-white/70 text-xs px-2 py-1 rounded-full">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm-1 14.5v-9l6 4.5-6 4.5z" /></svg>
                Wird erst bei Klick geladen
              </div>
            </button>
          ) : (
            <video
              src={src}
              className="w-full h-full object-cover"
              controls
              autoPlay
              preload="auto"
            />
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-3">
          🔒 Das Video wird nur bei Klick geladen – keine Auswirkung auf die Ladezeit der Seite.
        </p>
      </div>
    </motion.section>
  );
}

export default function SpartenLandingPage({ config }: SpartenLandingPageProps) {
  const [showFunnel, setShowFunnel] = useState(false);
  const [funnelType, setFunnelType] = useState<string | undefined>(config.insuranceType);
  const [funnelLabel, setFunnelLabel] = useState<string | undefined>(config.seo.title.split(' – ')[0]);
  const [funnelInitialStep, setFunnelInitialStep] = useState<number | undefined>(undefined);

  useEffect(() => {
    trackEvent('sparten_lp_view', { sparte: config.slug, source: config.source });
  }, [config.slug]);

  const closeFunnel = useCallback(() => {
    setShowFunnel(false);
    setFunnelType(config.insuranceType);
    setFunnelLabel(config.seo.title.split(' – ')[0]);
    setFunnelInitialStep(undefined);
  }, [config.insuranceType, config.seo.title]);

  const openFunnel = useCallback((opts?: { type?: string; label?: string; initialStep?: number }) => {
    if (opts !== undefined) {
      // Explicit quiz-card click: apply provided values (undefined = "Alle prüfen" = generic consultation)
      setFunnelType(opts.type);
      setFunnelLabel(opts.label);
      setFunnelInitialStep(opts.initialStep);
    }
    // When called without opts (non-quiz CTA), keep existing funnelType (= config.insuranceType default)
    setShowFunnel(true);
    trackEvent('sparten_lp_cta_click', { sparte: config.slug, source: config.source });
  }, [config.slug, config.source]);

  const whatsappNumber = "15566771019";
  const preSelectedQuizType = TYPE_TO_QUIZ[config.insuranceType] ?? 'all';

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": config.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
    }))
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": config.seo.title.split(' – ')[0],
    "provider": {
      "@type": "LocalBusiness",
      "name": "ERGO Versicherung Morino Stübe",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Bergedorfer Str. 11",
        "addressLocality": "Ganderkesee",
        "postalCode": "27777",
        "addressCountry": "DE"
      },
      "telephone": "+4915566771019"
    },
    "areaServed": { "@type": "City", "name": "Ganderkesee" }
  };

  return (
    <>
      <SEO
        title={config.seo.title}
        description={config.seo.description}
        keywords={config.seo.keywords}
        structuredData={faqSchema}
        additionalStructuredData={[serviceSchema]}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
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

        {/* Hero Section */}
        <section className={`bg-gradient-to-br ${config.hero.gradient} text-white py-14 md:py-20 px-4 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="max-w-5xl mx-auto relative">
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
              {/* Left: Text */}
              <div className="flex-1 text-center lg:text-left mb-10 lg:mb-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full text-xs font-medium mb-5"
                >
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                    ))}
                  </div>
                  <span>4,9/5 · über 3.500 zufriedene Kunden</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
                >
                  {config.hero.headline}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  className="text-base sm:text-lg text-white/90 max-w-xl mx-auto lg:mx-0 mb-3 leading-relaxed"
                >
                  {config.hero.subheadline}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                  className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-white/80 mb-2"
                >
                  <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-green-300" /> Kostenlos & unverbindlich</span>
                  <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-green-300" /> Keine Verpflichtung</span>
                  <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-green-300" /> DSGVO-konform</span>
                </motion.div>
              </div>

              {/* Right: Quiz Card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.5 }}
                className="w-full lg:w-[420px] lg:flex-shrink-0"
              >
                <div className="rounded-2xl border-2 border-white/20 bg-white shadow-2xl shadow-black/20 p-4 sm:p-5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#E2001A] mb-1">Kostenlose Analyse – In 2 Minuten</p>
                  <p className="text-sm sm:text-base font-bold text-gray-900 mb-4 leading-snug">
                    Was möchten Sie versichern?
                  </p>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {QUIZ_OPTIONS.map((opt) => {
                      const isPreSelected = opt.type === preSelectedQuizType;
                      const isAll = opt.type === 'all';
                      return (
                        <button
                          key={opt.type}
                          onClick={() => {
                            trackEvent('quiz_option_clicked', { option: opt.type, source: opt.source, sparte: config.slug });
                            openFunnel({
                              type: isAll ? undefined : (isPreSelected ? config.insuranceType : (QUIZ_TO_CANONICAL_TYPE[opt.type] ?? opt.type)),
                              label: isAll ? undefined : opt.label,
                              initialStep: isAll ? undefined : 2,
                            });
                          }}
                          className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all active:scale-[0.98] group relative
                            ${isAll
                              ? 'border-[#E2001A] bg-gradient-to-r from-[#E2001A] to-[#c5001a] text-white hover:shadow-lg hover:shadow-red-500/25 sm:col-span-2'
                              : isPreSelected
                                ? 'border-[#E2001A] bg-red-50 shadow-sm'
                                : 'border-gray-200 bg-gray-50 hover:border-[#E2001A] hover:bg-red-50'
                            }`}
                        >
                          {isPreSelected && !isAll && (
                            <span className="absolute -top-1.5 -right-1.5 bg-[#E2001A] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                              Empfohlen
                            </span>
                          )}
                          <span className="text-2xl leading-none shrink-0">{opt.icon}</span>
                          <span className={`font-semibold text-sm ${isAll ? 'text-white' : isPreSelected ? 'text-[#E2001A]' : 'text-gray-800 group-hover:text-[#E2001A]'}`}>
                            {opt.label}
                          </span>
                          <ChevronRight className={`w-4 h-4 ml-auto shrink-0 group-hover:translate-x-0.5 transition-transform ${isAll ? 'text-white/80' : isPreSelected ? 'text-[#E2001A]' : 'text-gray-400 group-hover:text-[#E2001A]'}`} />
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                    <p className="text-[10px] sm:text-xs text-gray-400">🔒 100% kostenlos & unverbindlich · DSGVO-konform</p>
                    <a
                      href={`https://wa.me/49${whatsappNumber}?text=${encodeURIComponent(`Hallo Herr Stübe, ich interessiere mich für die ${config.seo.title.split(' – ')[0]}. Können Sie mich beraten?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => { trackEvent('whatsapp_clicked', { source: 'sparten_hero_quiz', sparte: config.slug }); trackConversion(); }}
                      className="flex items-center gap-1.5 text-[#25d366] hover:text-[#1da851] transition-colors text-xs font-semibold whitespace-nowrap shrink-0"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Lieber WhatsApp
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Glassmorphism Stats Band */}
        <motion.section {...fadeInUp} className="px-4 py-8 max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/60 p-4 sm:p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E2001A] via-[#003781] to-[#E2001A] rounded-t-2xl" />
            <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 divide-x divide-gray-200/60">
              {[
                { value: 3500, suffix: '+', label: 'Zufriedene Kunden' },
                { value: 15, suffix: '+', label: 'Produkte' },
                { value: 24, suffix: 'h', label: 'Reaktionszeit' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="text-center"
                >
                  <div className="text-2xl sm:text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-[#E2001A] to-[#003781] bg-clip-text text-transparent">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 mt-1.5 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section {...fadeInUp} className="py-10 md:py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 mb-3">
              Ihre Vorteile bei ERGO
            </h2>
            <p className="text-center text-gray-500 text-sm mb-10 max-w-xl mx-auto">
              Persönliche Beratung statt anonymer Online-Vergleich – das macht den Unterschied.
            </p>
            <motion.div
              {...staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
              {config.benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={i}
                    {...staggerChild}
                    className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-ergo-red/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-ergo-red" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1">{benefit.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.section>

        {/* Explainer Video (only when config provides one) */}
        {config.explainerVideo && <ExplainerVideo src={config.explainerVideo} />}

        {/* Advisor Profile Section */}
        <motion.section {...fadeInUp} className="px-4 pb-10 md:pb-16 max-w-3xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/60 p-5 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E2001A] via-[#003781] to-[#E2001A] rounded-t-2xl" />
            <div className="flex flex-col items-center text-center gap-5 md:flex-row md:text-left md:items-start">
              <motion.img
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                src={beraterPhoto}
                alt="Morino Stübe - ERGO Versicherungsfachmann in Ganderkesee"
                className="w-32 h-40 md:w-40 md:h-52 rounded-2xl object-contain border-[3px] border-ergo-red shadow-lg shrink-0 bg-white"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-1 md:text-2xl">Morino Stübe</h2>
                <p className="text-ergo-red font-semibold text-sm mb-3 md:text-base">ERGO Versicherungsfachmann · Ganderkesee</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 md:text-base">
                  Ich berate Sie persönlich und transparent zur {config.seo.title.split(' – ')[0]}. Gemeinsam finden wir die beste Lösung für Ihre Situation – kostenlos und unverbindlich.
                </p>
                <div className="flex flex-col gap-2 text-xs text-gray-500 md:text-sm">
                  <span className="flex items-center justify-center md:justify-start gap-1.5">
                    <Shield className="w-4 h-4 text-ergo-red shrink-0" />
                    Vermittlerregister-Nr. D-5H7J-7DUI1-10
                  </span>
                  <span className="flex items-center justify-center md:justify-start gap-1.5">
                    <Star className="w-4 h-4 text-yellow-500 shrink-0 fill-yellow-500" />
                    ERGO als starker Partner seit 1906
                  </span>
                </div>
              </div>
              <img
                src="/attached_assets/ergo-logo-hq.svg"
                alt="ERGO Logo"
                className="h-10 md:h-14 w-auto shrink-0 hidden md:block"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </motion.section>

        {/* Reviews */}
        <motion.section {...fadeInUp} className="py-10 md:py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-8">
              Das sagen unsere Kunden
            </h2>
            <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {config.reviews.map((review, i) => (
                <motion.div key={i} {...staggerChild} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3 italic">"{review.text}"</p>
                  <p className="text-xs font-semibold text-gray-500">– {review.name}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Awards Band */}
        <motion.section {...fadeInUp} className="py-10 md:py-14 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-center text-gray-900 mb-2">ERGO – Mehrfach ausgezeichnet</h2>
            <p className="text-center text-gray-500 text-sm mb-8">Von unabhängigen Testinstituten bewertet</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ergoAwards.map((award) => (
                <div key={award.label} className="bg-white rounded-xl p-4 text-center border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
                  <Award className="w-7 h-7 text-yellow-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-ergo-red uppercase tracking-wide mb-1">{award.rating}</p>
                  <p className="text-sm font-semibold text-gray-900 mb-1">{award.label}</p>
                  <p className="text-[10px] text-gray-500">{award.source}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FAQ */}
        <FAQSection
          title="Häufige Fragen"
          faqs={config.faqs}
          className="bg-gray-50"
        />

        {/* Final CTA */}
        <motion.section {...fadeInUp} className="py-14 md:py-20 px-4 bg-gradient-to-br from-[#003781] to-[#005ab4] text-white">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-1.5 rounded-full text-xs font-medium mb-5">
              <Clock className="w-4 h-4" />
              {config.urgency.subtext}
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
              {config.urgency.text}
            </h2>
            <p className="text-blue-100 text-sm sm:text-base mb-8 max-w-xl mx-auto">
              Kostenlose, unverbindliche Beratung von Ihrem persönlichen ERGO-Berater Morino Stübe in Ganderkesee.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => openFunnel()}
                className="inline-flex items-center justify-center gap-2 bg-white text-[#003781] font-bold px-7 py-4 rounded-xl text-base hover:bg-gray-100 transition-colors min-h-[52px] shadow-lg"
              >
                <Phone className="w-5 h-5" /> Jetzt beraten lassen
              </button>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hallo Herr Stübe, ich interessiere mich für die ${config.seo.title.split(' – ')[0]}. Können Sie mich beraten?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25d366] text-white font-bold px-6 py-4 rounded-xl text-base hover:bg-[#1da851] transition-colors min-h-[52px]"
              >
                <MessageCircle className="w-5 h-5" /> Per WhatsApp anfragen
              </a>
            </div>
          </div>
        </motion.section>

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
          onClose={closeFunnel}
          insuranceType={funnelType}
          insuranceLabel={funnelLabel}
          source={config.source}
          initialStep={funnelInitialStep}
        />
      )}
    </>
  );
}
