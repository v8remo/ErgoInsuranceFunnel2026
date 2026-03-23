import { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'wouter';
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Phone, Mail, Shield, Star, CheckCircle, MapPin, MessageSquare, FileText, AlertTriangle, Award, Trophy, Instagram, ExternalLink, ChevronRight, ChevronDown } from 'lucide-react';
import { trackEvent, trackConversion } from '@/lib/analytics';
import FunnelOverlay from './FunnelOverlay';
import '@/styles/funnel.css';

import ichBinDaPhoto from '@assets/optimized/untitled2.webp';
import beraterPhoto from '@assets/optimized/ich_bin_da.webp';
import imagePhoto from '@assets/optimized/image.webp';

/* ═══════ Animation Helpers ═══════ */

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" as const },
  transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true, margin: "-60px" as const },
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

/* ═══════ Data ═══════ */

const awards = [
  { source: 'Stiftung Warentest', product: 'Zahnzusatz', rating: 'SEHR GUT (0,5)', color: 'bg-yellow-50 border-yellow-200' },
  { source: 'Stiftung Warentest', product: 'Reisekranken', rating: 'GUT (2,3)', color: 'bg-yellow-50 border-yellow-200' },
  { source: 'Finanztest', product: 'BU-Versicherung', rating: 'SEHR GUT', color: 'bg-green-50 border-green-200' },
  { source: 'Franke & Bornberg', product: 'Kfz-Versicherung', rating: 'HERVORRAGEND', color: 'bg-blue-50 border-blue-200' },
  { source: 'ServiceValue', product: 'Service-Champion', rating: '11x in Folge', color: 'bg-purple-50 border-purple-200' },
  { source: 'Branchen-Champion', product: 'Rechtsschutz', rating: 'Platz 1', color: 'bg-red-50 border-red-200' },
];

const testimonials = [
  { name: 'Sandra M.', location: 'Ganderkesee', text: 'Herr Stübe hat sich wirklich Zeit genommen und mir alles verständlich erklärt. Sehr empfehlenswert!', rating: 5 },
  { name: 'Thomas K.', location: 'Delmenhorst', text: 'Schnelle Hilfe im Schadenfall – das habe ich bei meinem vorherigen Versicherer so nie erlebt. Top Service!', rating: 5 },
  { name: 'Julia W.', location: 'Oldenburg', text: 'Durch den Bündel-Rabatt spare ich jetzt über 200€ im Jahr. Die Beratung war kompetent und transparent.', rating: 5 },
];

const faqItems = [
  {
    q: 'Ist die Erstberatung wirklich kostenlos?',
    a: 'Ja, die Erstberatung und der Versicherungscheck sind 100% kostenlos und unverbindlich. Sie erhalten eine individuelle Analyse Ihrer aktuellen Absicherung ohne versteckte Kosten.'
  },
  {
    q: 'Wie schnell kann ich einen Beratungstermin bekommen?',
    a: 'In der Regel können wir innerhalb von 24 Stunden einen Termin anbieten – ob online per Video, telefonisch oder persönlich vor Ort in Ganderkesee.'
  },
  {
    q: 'Kann ich auch bestehende Verträge von anderen Anbietern prüfen lassen?',
    a: 'Selbstverständlich. Wir analysieren Ihre bestehenden Verträge und zeigen Ihnen transparent, ob und wo Optimierungspotenzial besteht – ohne Wechselzwang.'
  },
  {
    q: 'Welche Versicherungen kann ich bei der ERGO Agentur Stübe abschließen?',
    a: 'Wir beraten zu allen gängigen Versicherungsprodukten: Kfz, Hausrat, Haftpflicht, Wohngebäude, Rechtsschutz, Zahnzusatz, Berufsunfähigkeit, Lebens- und Rentenversicherung.'
  },
];

/* ═══════ Component ═══════ */

const QUIZ_OPTIONS = [
  { label: 'Kfz-Versicherung', icon: '🚗', type: 'kfz' },
  { label: 'Hausrat & Haftpflicht', icon: '🏠', type: 'hausrat' },
  { label: 'Zahnzusatz', icon: '🦷', type: 'zahnzusatz' },
  { label: 'Berufsunfähigkeit', icon: '💼', type: 'bu' },
  { label: 'Alle prüfen', icon: '✅', type: 'all' },
];

export default function ProfessionalErgoLanding() {
  const [showFunnel, setShowFunnel] = useState(false);
  const [funnelInsuranceType, setFunnelInsuranceType] = useState<string | undefined>(undefined);
  const [funnelInsuranceLabel, setFunnelInsuranceLabel] = useState<string | undefined>(undefined);
  const [funnelInitialStep, setFunnelInitialStep] = useState<number | undefined>(undefined);
  const [funnelSource, setFunnelSource] = useState<string>('hero_section');

  const openFunnel = useCallback((opts?: { insuranceType?: string; insuranceLabel?: string; initialStep?: number; source?: string }) => {
    setFunnelInsuranceType(opts?.insuranceType ?? undefined);
    setFunnelInsuranceLabel(opts?.insuranceLabel ?? undefined);
    setFunnelInitialStep(opts?.initialStep ?? undefined);
    setFunnelSource(opts?.source ?? 'hero_section');
    setShowFunnel(true);
  }, []);

  const [videoPlaying, setVideoPlaying] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroParallaxY = useTransform(scrollYProgress, [0, 1], [0, 35]);

  const handlePlayVideo = useCallback(() => {
    setVideoPlaying(true);
    trackEvent('video_play', { video: 'vorstellung' });
    setTimeout(() => {
      if (videoRef.current) {
        const vid = videoRef.current;
        vid.onerror = (e) => { if (e instanceof Event) e.stopPropagation(); };
        const sources = vid.querySelectorAll('source');
        sources.forEach(s => { s.onerror = (e) => { if (e instanceof Event) e.stopPropagation(); }; });
        vid.load();
        vid.play().catch(() => {});
      }
    }, 150);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const whatsappNumber = "15566771019";
  const whatsappMessage = encodeURIComponent(
    "Hallo Herr Stübe, ich interessiere mich für eine persönliche Beratung zu meinen Versicherungen. Können wir einen Termin vereinbaren?"
  );

  // Dynamic available slots based on day
  const getAvailableSlots = () => {
    const day = new Date().getDay();
    if (day === 0 || day === 6) return 2;
    return 3 + (day % 3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">

      {/* ──────── E-SCOOTER KENNZEICHEN BANNER ──────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Link href="/kennzeichen?type=kennzeichen" onClick={() => trackEvent('escooter_banner_clicked', { source: 'top_banner' })}>
          <div className="mx-4 mt-4 md:mt-6 max-w-6xl md:mx-auto bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 rounded-2xl p-4 md:p-5 flex items-center gap-3 md:gap-5 shadow-lg cursor-pointer active:scale-[0.99] transition-transform group relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />
            <div className="relative flex items-center gap-3 md:gap-5 w-full">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/20 flex items-center justify-center text-2xl md:text-3xl shrink-0">🛴</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-block bg-white text-green-700 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Ab 01.03.2026</span>
                  <span className="inline-block bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide animate-pulse">Neu</span>
                </div>
                <p className="text-white font-bold text-sm md:text-base mt-1 leading-snug">Neue E-Scooter Kennzeichen – jetzt beantragen!</p>
                <p className="text-white/80 text-xs md:text-sm mt-0.5 hidden sm:block">Versicherungskennzeichen 2026/2027 ab 42 € – direkt online anfordern</p>
              </div>
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white/80 shrink-0 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* ──────── HERO ──────── */}
      <section ref={heroRef} className="px-4 pt-6 pb-10 md:pt-10 md:pb-16 max-w-6xl mx-auto relative overflow-hidden">
        {/* Subtle dot pattern background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="flex flex-col md:flex-row md:items-center md:gap-10 lg:gap-14 relative">
          {/* LEFT: Text + CTAs */}
          <div className="flex-1 text-center md:text-left mb-8 md:mb-0">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-block bg-gradient-to-r from-[#E2001A] to-[#c5001a] text-white text-xs font-bold tracking-wide uppercase px-4 py-1.5 rounded-full mb-5 md:text-sm shadow-lg shadow-red-500/20"
            >
              ERGO Versicherungsfachmann · Ganderkesee
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-xl font-extrabold text-gray-900 leading-tight mb-3 sm:text-2xl md:text-3xl lg:text-4xl"
            >
              Ihre ERGO Agentur in Ganderkesee –{' '}
              <span className="bg-gradient-to-r from-[#E2001A] to-[#003781] bg-clip-text text-transparent">
                Persönliche Beratung rund um Ihre Absicherung
              </span>
            </motion.h1>

            {/* Social Proof – above the fold */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4"
            >
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">4.9/5</span>
                <span className="text-xs text-gray-500">(247 Bewertungen)</span>
              </div>
              <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                Heute noch {getAvailableSlots()} freie Termine
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-base text-gray-600 leading-relaxed mb-6 md:text-lg max-w-xl"
            >
              Ob Kfz, Zahnzusatz, Wohngebäude oder Haftpflicht – wir beraten Sie individuell und transparent.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center md:justify-start sm:gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(226, 0, 26, 0.3)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  openFunnel({ source: 'hero_section' });
                  trackEvent('cta_beratung_clicked', { source: 'hero_section' });
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#E2001A] to-[#c5001a] text-white font-semibold text-sm px-5 py-3.5 rounded-xl shadow-lg shadow-red-500/20 whitespace-nowrap md:text-base md:px-6 md:py-4 transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0 md:w-5 md:h-5" />
                Kostenlose Analyse starten
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href={`https://wa.me/49${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent('whatsapp_clicked', { source: 'hero_section' });
                  trackConversion();
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-green-500 text-green-600 font-semibold text-sm px-5 py-3.5 rounded-xl whitespace-nowrap md:text-base md:px-6 md:py-4 hover:bg-green-50 transition-colors"
              >
                <MessageSquare className="w-4 h-4 shrink-0 md:w-5 md:h-5" />
                Direkt über WhatsApp
              </motion.a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="text-xs text-gray-400 mt-2 text-center md:text-left"
            >
              In nur 2 Minuten – 100% kostenlos & unverbindlich
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col gap-2 mt-3 sm:flex-row sm:flex-wrap sm:justify-center md:justify-start sm:gap-3"
            >
              <div className="grid grid-cols-2 gap-2 sm:contents">
                <Link
                  href="/dokumente"
                  className="flex items-center justify-center gap-1.5 border-2 border-[#003781] text-[#003781] font-semibold text-[13px] px-3 py-3 min-h-[44px] rounded-xl active:scale-[0.97] transition-all text-center leading-tight sm:text-sm sm:px-5 sm:py-3.5 sm:w-auto sm:gap-2 md:text-base md:px-6 md:py-4 hover:bg-[#003781]/5"
                >
                  <FileText className="w-4 h-4 shrink-0 hidden sm:block md:w-5 md:h-5" />
                  Dokument einreichen
                </Link>

                <Link
                  href="/schaden"
                  className="flex items-center justify-center gap-1.5 border-2 border-[#E2001A] text-[#E2001A] font-semibold text-[13px] px-3 py-3 min-h-[44px] rounded-xl active:scale-[0.97] transition-all text-center leading-tight sm:text-sm sm:px-5 sm:py-3.5 sm:w-auto sm:gap-2 md:text-base md:px-6 md:py-4 hover:bg-red-50"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 hidden sm:block md:w-5 md:h-5" />
                  Schaden melden
                </Link>
              </div>

              <Link
                href="/kennzeichen"
                className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-[#003781] text-[#003781] font-semibold text-[13px] px-3 py-3 min-h-[44px] rounded-xl active:scale-[0.97] transition-all text-center leading-tight sm:text-sm sm:px-5 sm:py-3.5 sm:gap-2 md:text-base md:px-6 md:py-4 hover:bg-[#003781]/5"
              >
                EVB & Kennzeichen anfordern
              </Link>
            </motion.div>

            {/* ── INLINE QUIZ CARD ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.75 }}
              className="mt-5 w-full"
              onViewportEnter={() => trackEvent('quiz_card_shown', { source: 'hero' })}
            >
              <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-md p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#E2001A] mb-1">Sofort-Analyse</p>
                <p className="text-sm font-semibold text-gray-800 mb-3 leading-snug">
                  Was möchten Sie versichern? <span className="font-normal text-gray-500">(wählen & direkt starten)</span>
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                  {QUIZ_OPTIONS.map((opt) => (
                    <button
                      key={opt.type}
                      onClick={() => {
                        const isAll = opt.type === 'all';
                        trackEvent('quiz_option_selected', { option: opt.type, source: 'hero_quiz' });
                        trackEvent('quiz_started', { option: opt.type, source: 'hero_quiz' });
                        openFunnel({
                          insuranceType: isAll ? undefined : opt.type,
                          insuranceLabel: isAll ? undefined : opt.label,
                          initialStep: isAll ? undefined : 2,
                          source: 'hero_quiz',
                        });
                      }}
                      className="flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-transparent bg-gray-50 hover:border-[#E2001A] hover:bg-red-50 active:scale-95 transition-all px-2 py-3 text-center group"
                    >
                      <span className="text-xl leading-none">{opt.icon}</span>
                      <span className="text-[11px] sm:text-xs font-semibold text-gray-700 group-hover:text-[#E2001A] leading-tight">{opt.label}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-2.5 text-[10px] text-gray-400 text-center">In 2 Min. zum persönlichen Angebot · kostenlos & unverbindlich</p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Video with parallax */}
          <motion.div
            style={{ y: heroParallaxY }}
            className="flex-shrink-0 w-full md:w-[45%] lg:w-[42%]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl aspect-video relative"
            >
              {!videoPlaying ? (
                <button
                  onClick={handlePlayVideo}
                  className="w-full h-full flex flex-col items-center justify-center group cursor-pointer"
                  aria-label="Video abspielen"
                >
                  <img
                    src={ichBinDaPhoto}
                    alt="Morino Stübe – ERGO Versicherungsberater Ganderkesee stellt sich vor"
                    className="absolute inset-0 w-full h-full object-cover object-top opacity-70"
                    width={640}
                    height={360}
                  />
                  <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 flex items-center justify-center shadow-2xl"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#E2001A" className="w-8 h-8 sm:w-10 sm:h-10 ml-1">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </motion.div>
                    <p className="text-white font-semibold text-sm sm:text-base mt-3 drop-shadow-lg">Video abspielen</p>
                  </div>
                </button>
              ) : (
                <video
                  ref={videoRef}
                  controls
                  playsInline
                  preload="metadata"
                  poster="/videos/vorstellung-poster.webp"
                  className="w-full h-full object-contain bg-black"
                  onError={(e) => { e.stopPropagation(); }}
                >
                  <source src="/videos/vorstellung.mp4" type="video/mp4" />
                  Ihr Browser unterstützt dieses Videoformat leider nicht.
                </video>
              )}
            </motion.div>
            <p className="text-center text-gray-400 text-xs mt-2">Morino Stübe – Ihr ERGO Berater</p>
          </motion.div>
        </div>
      </section>

      {/* ──────── STATISTIK-BAND ──────── */}
      <motion.section
        {...fadeInUp}
        className="px-4 pt-6 md:pt-8 pb-10 md:pb-16 max-w-4xl mx-auto"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/60 p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E2001A] via-[#003781] to-[#E2001A] rounded-t-2xl" />
          <div className="grid grid-cols-3 gap-4 md:gap-8 divide-x divide-gray-200/60">
          {[
            { value: 3500, suffix: '+', label: 'Zufriedene Kunden' },
            { value: 15, suffix: '+', label: 'Versicherungsprodukte' },
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
              <div className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-[#E2001A] to-[#003781] bg-clip-text text-transparent">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-xs md:text-sm text-gray-500 mt-1.5 font-medium">{stat.label}</p>
            </motion.div>
          ))}
          </div>
        </div>
      </motion.section>

      {/* ──────── VERTRAUEN / BERATER ──────── */}
      <motion.section {...fadeInUp} className="px-4 pb-10 md:pb-16 max-w-3xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/60 p-5 md:p-8 relative overflow-hidden">
          {/* Subtle gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E2001A] via-[#003781] to-[#E2001A] rounded-t-2xl" />

          <div className="flex flex-col items-center text-center gap-5 md:flex-row md:text-left md:items-start">
            <motion.img
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              src={beraterPhoto}
              alt="Morino Stübe - ERGO Versicherungsfachmann in Ganderkesee"
              className="w-32 h-40 md:w-40 md:h-52 rounded-2xl object-contain border-[3px] border-ergo-red shadow-lg shrink-0 bg-white"
              width={160}
              height={208}
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
              width={100}
              height={56}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </motion.section>

      {/* ──────── VORTEILE ──────── */}
      <motion.section {...fadeInUp} className="px-4 pb-10 md:pb-16 max-w-3xl mx-auto">
        <h2 className="text-lg font-bold text-gray-900 text-center mb-6 sm:text-xl md:text-3xl md:mb-8">
          Ihre Vorteile bei der ERGO Agentur Stübe
        </h2>

        <motion.div
          {...staggerContainer}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
        >
          {[
            {
              title: 'Individuelle Beratung zu allen relevanten Versicherungen',
              text: 'Kfz, Haftpflicht, Hausrat, Wohngebäude, Rechtsschutz, Zahnzusatz, BU und Lebensversicherung',
              accent: 'border-l-[#E2001A]'
            },
            {
              title: 'Transparente Gegenüberstellung von Leistungen & Beiträgen',
              text: 'Klare Vergleiche und verständliche Erklärungen aller Tarifoptionen',
              accent: 'border-l-[#003781]'
            },
            {
              title: 'Unterstützung im Schadenfall – persönlich & direkt vor Ort',
              text: 'Schnelle Hilfe und persönliche Betreuung wenn Sie uns brauchen',
              accent: 'border-l-green-500'
            },
            {
              title: 'Moderne digitale Beratung per WhatsApp, Telefon oder Video',
              text: 'Flexible Beratungstermine, die zu Ihrem Zeitplan passen',
              accent: 'border-l-amber-500'
            }
          ].map((item) => (
            <motion.div
              key={item.title}
              {...staggerChild}
              whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
              className={`bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm p-4 md:p-6 flex gap-3 border-l-4 ${item.accent} transition-shadow`}
            >
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1 md:text-base">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed md:text-sm">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <div className="section-divider max-w-lg mx-auto my-2" />

      {/* ──────── ONLINE TOOLS ──────── */}
      <motion.section {...fadeInUp} className="px-4 pb-10 md:pb-16 max-w-3xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <span className="inline-flex items-center gap-2 bg-[#003781]/10 text-[#003781] text-xs font-bold uppercase tracking-wide px-4 py-1.5 rounded-full mb-4">
            Jetzt ausprobieren
          </span>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl md:text-3xl">
            Unsere Online-Tools für Sie
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/versicherungscheck" onClick={() => trackEvent('tool_clicked', { tool: 'versicherungscheck' })}>
            <motion.div
              whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,55,129,0.12)" }}
              className="group bg-white border-2 border-blue-200 rounded-2xl p-5 md:p-6 hover:border-[#003781] transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-gradient-to-l from-[#003781] to-[#0052A5] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">KOSTENLOS</div>
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl mb-3"
              >🔍</motion.div>
              <h3 className="font-bold text-gray-900 text-base md:text-lg">Versicherungscheck</h3>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">In 2 Minuten Ihren Versicherungsbedarf ermitteln</p>
              <div className="mt-3 inline-flex items-center gap-1 text-[#003781] font-semibold text-sm group-hover:gap-2 transition-all">
                Jetzt starten <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          </Link>
          <Link href="/sparrechner" onClick={() => trackEvent('tool_clicked', { tool: 'sparrechner' })}>
            <motion.div
              whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(22,163,74,0.12)" }}
              className="group bg-white border-2 border-green-200 rounded-2xl p-5 md:p-6 hover:border-green-500 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-gradient-to-l from-green-600 to-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">BIS 15% SPAREN</div>
              <motion.div
                whileHover={{ rotate: -10, scale: 1.1 }}
                className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl mb-3"
              >💰</motion.div>
              <h3 className="font-bold text-gray-900 text-base md:text-lg">Bündel-Sparrechner</h3>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">Berechnen Sie Ihre Ersparnis mit dem ERGO Bündelnachlass</p>
              <div className="mt-3 inline-flex items-center gap-1 text-green-600 font-semibold text-sm group-hover:gap-2 transition-all">
                Jetzt berechnen <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          </Link>
        </div>
      </motion.section>

      {/* ──────── TESTSIEGER / AWARDS – Marquee ──────── */}
      <motion.section {...fadeInUp} className="px-4 pb-10 md:pb-16 max-w-4xl mx-auto">
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

        {/* Animated marquee */}
        <div className="relative overflow-hidden py-2">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="flex gap-4 whitespace-nowrap"
          >
            {[...awards, ...awards].map((award, i) => (
              <div
                key={`${award.product}-${i}`}
                className={`flex items-center gap-3 ${award.color} border rounded-full shadow-sm px-4 py-2.5 md:px-5 md:py-3 shrink-0`}
              >
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
                  <Award className="w-4.5 h-4.5 md:w-5 md:h-5 text-yellow-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-xs md:text-sm leading-tight">{award.product}</p>
                  <p className="text-xs text-gray-500 leading-tight">{award.source} · {award.rating}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ──────── TESTIMONIALS ──────── */}
      <motion.section {...fadeInUp} className="px-4 pb-10 md:pb-16 max-w-3xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl md:text-3xl">
            Das sagen unsere Kunden
          </h2>
        </div>

        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100 p-6 md:p-8 min-h-[180px] overflow-hidden">
          {/* Decorative quote */}
          <div className="absolute top-4 left-5 text-6xl md:text-7xl font-serif text-gray-100 select-none pointer-events-none leading-none">"</div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center relative"
            >
              <div className="flex justify-center mb-3">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed italic mb-4">
                "{testimonials[currentTestimonial].text}"
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E2001A] to-[#003781] flex items-center justify-center text-white font-bold text-sm">
                  {testimonials[currentTestimonial].name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 text-sm">{testimonials[currentTestimonial].name}</p>
                  <p className="text-xs text-gray-500">{testimonials[currentTestimonial].location}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentTestimonial(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentTestimonial ? 'bg-ergo-red w-6' : 'bg-gray-300'
                }`}
                aria-label={`Bewertung ${i + 1} anzeigen`}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* ──────── INSTAGRAM ──────── */}
      <motion.section {...fadeInUp} className="px-4 pb-10 md:pb-16 max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 border border-pink-200/50 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 md:p-10 text-center">
          <motion.div
            whileHover={{ rotate: 5, scale: 1.05 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] text-white mb-4 shadow-lg"
          >
            <Instagram className="w-7 h-7" />
          </motion.div>

          <h2 className="text-lg font-bold text-gray-900 mb-2 sm:text-xl md:text-3xl">
            Folgen Sie mir auf Instagram
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-md mx-auto md:text-base">
            Versicherungstipps, Einblicke in meinen Berateralltag und aktuelle Angebote – direkt auf Ihrem Smartphone.
          </p>

          <div className="mb-6 max-w-xs mx-auto">
            <div className="aspect-[4/5] rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center overflow-hidden shadow-lg">
              <img
                src={imagePhoto}
                alt="Morino Stübe Instagram Profil – Versicherungstipps und Einblicke"
                className="w-full h-full object-contain rounded-xl"
                loading="lazy"
                decoding="async"
                width={320}
                height={400}
              />
            </div>
          </div>

          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="https://www.instagram.com/morino_stuebe/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('instagram_clicked', { source: 'instagram_section' })}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-lg active:scale-[0.97] transition-transform md:text-base md:px-8 md:py-4"
          >
            <Instagram className="w-5 h-5" />
            @morino_stuebe
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        </div>
      </motion.section>

      <div className="section-divider max-w-lg mx-auto my-2" />

      {/* ──────── KUNDENSERVICE ──────── */}
      <motion.section {...fadeInUp} className="px-4 pb-10 md:pb-16 max-w-3xl mx-auto">
        <div className="text-center mb-5 md:mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Bereits Kunde?</p>
          <h2 className="text-base font-bold text-gray-900 sm:text-lg md:text-xl">
            Schneller Kundenservice
          </h2>
        </div>
        <motion.div
          {...staggerContainer}
          className="grid grid-cols-2 gap-3"
        >
          {[
            { href: '/schaden', icon: '🛡️', label: 'Schaden melden', sub: 'Mit Foto-Upload', bg: 'bg-red-50', tracking: 'schaden' },
            { href: '/kennzeichen', icon: '🚗', label: 'eVB & Kennzeichen', sub: 'eVB & Versicherungskennzeichen', bg: 'bg-amber-50', tracking: 'kennzeichen' },
            { href: '/dokumente', icon: '📄', label: 'Dokumente', sub: 'Einreichen & unterschreiben', bg: 'bg-blue-50', tracking: 'dokumente' },
            { href: '/termin', icon: '📅', label: 'Termin buchen', sub: 'Online-Terminvereinbarung', bg: 'bg-green-50', tracking: 'termin' },
          ].map((item) => (
            <Link key={item.href} href={item.href} onClick={() => trackEvent('tool_clicked', { tool: item.tracking })}>
              <motion.div
                {...staggerChild}
                whileHover={{ y: -4, boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }}
                className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-all cursor-pointer text-center"
              >
                <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center text-lg`}>{item.icon}</div>
                <span className="font-semibold text-gray-900 text-sm">{item.label}</span>
                <span className="text-[11px] text-gray-400 leading-tight">{item.sub}</span>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </motion.section>

      {/* ──────── FAQ ──────── */}
      <motion.section {...fadeInUp} className="px-4 pb-10 md:pb-16 max-w-3xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl md:text-3xl">
            Häufig gestellte Fragen
          </h2>
          <p className="text-sm text-gray-500 mt-2 md:text-base">
            Finden Sie schnell Antworten auf Ihre wichtigsten Fragen.
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50/50 transition-colors"
                aria-expanded={openFaq === i}
              >
                <span className="font-semibold text-gray-900 text-sm md:text-base pr-4">{item.q}</span>
                <motion.div
                  animate={{ rotate: openFaq === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <div className="px-4 pb-4 md:px-5 md:pb-5">
                      <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                      <button
                        onClick={() => {
                          openFunnel({ source: 'faq_section' });
                          trackEvent('faq_cta_clicked', { question: item.q });
                        }}
                        className="mt-3 text-sm font-semibold text-ergo-red hover:underline"
                      >
                        Weitere Fragen? Jetzt beraten lassen →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <div className="section-divider max-w-lg mx-auto my-2" />

      {/* ──────── LEAD-MAGNET CTA ──────── */}
      <motion.section {...fadeInUp} className="px-4 pb-12 md:pb-20 max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 border border-blue-200/50 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 text-center md:p-10 relative overflow-hidden">
          {/* Decorative gradient blob */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#E2001A]/10 to-[#003781]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-lg font-bold text-gray-900 mb-2 sm:text-xl md:text-3xl relative">
            Zahlen Sie zu viel für zu wenig Schutz?
          </h2>
          <p className="text-xs text-green-600 font-semibold mb-3 relative">
            Heute noch {getAvailableSlots()} Beratungsplätze frei
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-lg mx-auto md:text-lg relative">
            In nur 2 Minuten prüfen wir gemeinsam, ob Ihre Absicherung noch zu Ihrer Lebenssituation passt – unverbindlich und kostenfrei.
          </p>

          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 12px 35px rgba(226, 0, 26, 0.3)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              openFunnel({ source: 'lead_magnet' });
              trackEvent('lead_magnet_clicked', { source: 'bedarfs_check' });
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#E2001A] to-[#c5001a] text-white font-semibold text-sm px-5 py-3.5 rounded-xl shadow-lg shadow-red-500/20 whitespace-nowrap md:text-base md:px-6 md:py-4 mx-auto relative transition-colors"
          >
            <MapPin className="w-5 h-5 shrink-0" />
            Kostenlose Analyse starten
          </motion.button>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-5 text-xs text-gray-500 md:text-sm relative">
            <span className="flex items-center gap-1">🔒 DSGVO-konform</span>
            <span className="flex items-center gap-1">📋 Unverbindlich & kostenfrei</span>
            <span className="flex items-center gap-1">⭐ Persönliche Beratung</span>
          </div>

          <Link href="/dokumente" className="inline-block mt-4 text-sm text-[#003781] hover:underline relative">
            Oder: Dokument einreichen & unterschreiben →
          </Link>
        </div>
      </motion.section>


      {/* ──────── STICKY CTA BAR (Mobile) ──────── */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-3 py-2 flex gap-2 sm:hidden safe-area-bottom">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            openFunnel({ source: 'sticky_bar' });
            trackEvent('cta_sticky_clicked', { source: 'sticky_bar' });
          }}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#E2001A] to-[#c5001a] text-white font-semibold text-sm min-h-[44px] py-3 rounded-xl whitespace-nowrap shadow-lg shadow-red-500/20 animate-pulse-subtle"
        >
          <Mail className="w-4 h-4 shrink-0" />
          Kostenlose Analyse
        </motion.button>
        <a
          href={`https://wa.me/49${whatsappNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackEvent('whatsapp_sticky_clicked', { source: 'sticky_bar' });
            trackConversion();
          }}
          className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold text-sm px-4 min-h-[44px] py-3 rounded-xl active:scale-[0.97] transition-transform whitespace-nowrap"
        >
          <Phone className="w-4 h-4 shrink-0" />
          WhatsApp
        </a>
      </div>

      <FunnelOverlay
        isOpen={showFunnel}
        onClose={() => setShowFunnel(false)}
        insuranceType={funnelInsuranceType}
        insuranceLabel={funnelInsuranceLabel}
        initialStep={funnelInitialStep}
        source={funnelSource}
      />
    </div>
  );
}
