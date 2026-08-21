import { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, Shield, Star, CheckCircle2, MessageSquare, Award, Instagram, ExternalLink,
  ChevronRight, ChevronDown, CarFront, Home, SmilePlus, BriefcaseBusiness, Building2,
  Layers3, Clock3, Search, PiggyBank, FileText, AlertTriangle, Tag, CalendarDays, Ambulance, Play,
} from 'lucide-react';
import { trackEvent, trackConversion } from '@/lib/analytics';
import FunnelOverlay from './FunnelOverlay';
import '@/styles/funnel.css';

import ichBinDaPhoto from '@assets/optimized/untitled2.webp';
import beraterPhoto from '@assets/optimized/ich_bin_da.webp';
import imagePhoto from '@assets/optimized/image.webp';

/* ═══════ Ruhige Einblend-Animation (ERGO: wenig Motion) ═══════ */

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" as const },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
};

/* ═══════ Daten ═══════ */

const awards = [
  { source: 'Stiftung Warentest', product: 'Zahnzusatz', rating: 'SEHR GUT (0,5)' },
  { source: 'Stiftung Warentest', product: 'Reisekranken', rating: 'GUT (2,3)' },
  { source: 'Finanztest', product: 'BU-Versicherung', rating: 'SEHR GUT' },
  { source: 'Franke & Bornberg', product: 'Kfz-Versicherung', rating: 'HERVORRAGEND' },
  { source: 'ServiceValue', product: 'Service-Champion', rating: '11x in Folge' },
  { source: 'Branchen-Champion', product: 'Rechtsschutz', rating: 'Platz 1' },
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

const QUIZ_OPTIONS = [
  { label: 'Kfz-Versicherung', icon: CarFront, type: 'kfz', source: 'hero_quiz' },
  { label: 'Hausrat & Haftpflicht', icon: Home, type: 'hausrat', source: 'hero_quiz' },
  { label: 'Zahnzusatz', icon: SmilePlus, type: 'zahnzusatz', source: 'hero_quiz' },
  { label: 'Berufsunfähigkeit', icon: BriefcaseBusiness, type: 'bu', source: 'hero_quiz' },
  { label: 'Gewerbe & Betrieb', icon: Building2, type: 'gewerbe', source: 'lp_gewerbe' },
  { label: 'Alle prüfen', icon: Layers3, type: 'all', source: 'hero_quiz' },
];

const SERVICE_TILES = [
  { href: '/schaden', icon: Shield, label: 'Schaden melden', sub: 'KFZ, Hausrat & mehr', tracking: 'schaden' },
  { href: '/schaden-unfall', icon: Ambulance, label: 'Unfall melden', sub: 'Unfallversicherung', tracking: 'schaden_unfall' },
  { href: '/kennzeichen', icon: Tag, label: 'eVB & Kennzeichen', sub: 'eVB & Versicherungskennzeichen', tracking: 'kennzeichen' },
  { href: '/dokumente', icon: FileText, label: 'Dokumente', sub: 'Einreichen & unterschreiben', tracking: 'dokumente' },
  { href: '/termin', icon: CalendarDays, label: 'Termin buchen', sub: 'Online-Terminvereinbarung', tracking: 'termin' },
];

const BENEFITS = [
  {
    title: 'Individuelle Beratung zu allen relevanten Versicherungen',
    text: 'Kfz, Haftpflicht, Hausrat, Wohngebäude, Rechtsschutz, Zahnzusatz, BU und Lebensversicherung',
  },
  {
    title: 'Transparente Gegenüberstellung von Leistungen & Beiträgen',
    text: 'Klare Vergleiche und verständliche Erklärungen aller Tarifoptionen',
  },
  {
    title: 'Unterstützung im Schadenfall – persönlich & direkt vor Ort',
    text: 'Schnelle Hilfe und persönliche Betreuung, wenn Sie uns brauchen',
  },
  {
    title: 'Moderne digitale Beratung per WhatsApp, Telefon oder Video',
    text: 'Flexible Beratungstermine, die zu Ihrem Zeitplan passen',
  },
];

/* ═══════ Komponente ═══════ */

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
  const [showMobileSticky, setShowMobileSticky] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowMobileSticky(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const whatsappNumber = "15566771019";
  const whatsappMessage = encodeURIComponent(
    "Hallo Herr Stübe, ich interessiere mich für eine persönliche Beratung zu meinen Versicherungen. Können wir einen Termin vereinbaren?"
  );

  return (
    <div className="bg-white min-h-screen pb-24 sm:pb-0">

      {/* ──────── E-SCOOTER KENNZEICHEN BANNER ──────── */}
      <Link href="/kennzeichen?type=kennzeichen" onClick={() => trackEvent('escooter_banner_clicked', { source: 'top_banner' })}>
        <div className="bg-ergo-red hover:bg-ergo-red-hover transition-colors cursor-pointer">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-4">
            <span className="ergo-chip ergo-chip--yellow shrink-0 text-xs">Neu · Ab 01.03.2026</span>
            <p className="text-white text-sm font-semibold leading-snug flex-1 min-w-0">
              E-Scooter Versicherungskennzeichen 2026/2027 ab 42 € – direkt online anfordern
            </p>
            <ChevronRight className="w-5 h-5 text-white shrink-0" />
          </div>
        </div>
      </Link>

      {/* ──────── HERO ──────── */}
      <section className="border-b border-ergo-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-12 md:pt-16 md:pb-16">
          <div className="flex flex-col md:flex-row md:items-start md:gap-10 lg:gap-14">

            {/* LINKS: Text + Quiz */}
            <div className="flex-1 mb-10 md:mb-0">
              <p className="ergo-eyebrow">ERGO Agentur Stübe · Ganderkesee</p>
              <h1 className="text-[32px] leading-[1.2] md:text-[42px] md:leading-[1.25] mb-4 max-w-xl">
                Persönliche Beratung rund um Ihre Absicherung
              </h1>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-ergo-yellow fill-ergo-yellow" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-ergo-ink">4,9/5</span>
                  <span className="text-xs text-ergo-mute">(247 Bewertungen)</span>
                </div>
              </div>

              <p className="text-base md:text-lg text-ergo-stone leading-relaxed mb-8 max-w-xl">
                Kostenlose Versicherungsanalyse: Wir decken Lücken auf, vermeiden Doppelversicherungen
                und sichern Ihnen bis zu 15% Bündelnachlass.
              </p>

              {/* Quiz-Karte als Funnel-Einstieg */}
              <div className="ergo-card p-5 md:p-6 max-w-xl">
                <p className="ergo-eyebrow mb-1">Kostenlose Analyse – in 2 Minuten</p>
                <p className="font-serif text-lg md:text-xl font-bold text-ergo-ink mb-4">
                  Was möchten Sie versichern?
                </p>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {QUIZ_OPTIONS.map((opt) => {
                    const isAll = opt.type === 'all';
                    return (
                      <button
                        key={opt.type}
                        onClick={() => {
                          trackEvent('quiz_option_clicked', { option: opt.type, source: opt.source });
                          trackEvent('quiz_option_selected', { option: opt.type, source: opt.source });
                          trackEvent('quiz_started', { option: opt.type, source: opt.source });
                          openFunnel({
                            insuranceType: isAll ? undefined : opt.type,
                            insuranceLabel: isAll ? undefined : opt.label,
                            initialStep: isAll ? undefined : 2,
                            source: opt.source,
                          });
                        }}
                        className={
                          isAll
                            ? 'ergo-btn ergo-btn--primary sm:col-span-2 justify-between px-5'
                            : 'ergo-option flex items-center gap-3 px-4 py-3 text-left'
                        }
                      >
                        {isAll ? (
                          <>
                            <span className="flex items-center gap-3"><opt.icon className="w-5 h-5" />{opt.label}</span>
                            <ChevronRight className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            <opt.icon className="w-5 h-5 text-ergo-red shrink-0" />
                            <span className="font-semibold text-sm text-ergo-ink">{opt.label}</span>
                            <ChevronRight className="w-4 h-4 ml-auto shrink-0 text-ergo-mute" />
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 pt-3 border-t border-ergo-line flex items-center justify-between gap-3">
                  <p className="text-xs text-ergo-mute">100% kostenlos & unverbindlich · DSGVO-konform</p>
                  <a
                    href={`https://wa.me/49${whatsappNumber}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => { trackEvent('whatsapp_clicked', { source: 'hero_quiz' }); trackConversion(); }}
                    className="flex items-center gap-1.5 text-[#1da851] hover:underline text-xs font-bold whitespace-nowrap shrink-0"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Lieber WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* RECHTS: Video */}
            <div className="flex-shrink-0 w-full md:w-[42%] lg:w-[40%] md:pt-10">
              <div className="ergo-card overflow-hidden aspect-video relative">
                {!videoPlaying ? (
                  <button
                    onClick={handlePlayVideo}
                    className="w-full h-full flex flex-col items-center justify-center group cursor-pointer bg-ergo-gray"
                    aria-label="Video abspielen"
                  >
                    <img
                      src={ichBinDaPhoto}
                      alt="Morino Stübe – ERGO Versicherungsberater Ganderkesee stellt sich vor"
                      className="absolute inset-0 w-full h-full object-cover object-top"
                      width={640}
                      height={360}
                    />
                    <div className="absolute inset-0 bg-ergo-ink/30 group-hover:bg-ergo-ink/40 transition-colors" />
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border-2 border-white">
                        <Play className="w-7 h-7 text-ergo-red ml-1" fill="currentColor" />
                      </div>
                      <p className="text-white font-bold text-sm mt-3">Video abspielen</p>
                    </div>
                  </button>
                ) : (
                  <video
                    ref={videoRef}
                    controls
                    playsInline
                    preload="metadata"
                    poster="/videos/vorstellung-poster.webp"
                    className="w-full h-full object-contain bg-ergo-ink"
                    onError={(e) => { e.stopPropagation(); }}
                  >
                    <source src="/videos/vorstellung.mp4" type="video/mp4" />
                    Ihr Browser unterstützt dieses Videoformat leider nicht.
                  </video>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-ergo-mute mt-3">
                <span>Morino Stübe – Ihr ERGO Berater</span>
                <span className="flex items-center gap-1"><Clock3 className="w-3.5 h-3.5" /> Antwort innerhalb 24 h</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────── STATISTIK-BAND ──────── */}
      <motion.section {...fadeInUp} className="bg-ergo-gray border-b border-ergo-line">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-12">
          <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
            {[
              { value: '3.500+', label: 'Zufriedene Kunden' },
              { value: '15+', label: 'Produkte' },
              { value: '24h', label: 'Reaktionszeit' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-serif text-3xl md:text-5xl font-bold text-ergo-red">{stat.value}</div>
                <p className="text-xs md:text-sm text-ergo-stone mt-1.5 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ──────── VERTRAUEN / BERATER ──────── */}
      <motion.section {...fadeInUp} className="px-4 sm:px-6 py-12 md:py-16 max-w-3xl mx-auto">
        <div className="ergo-card p-5 md:p-8">
          <div className="flex flex-col items-center text-center gap-5 md:flex-row md:text-left md:items-start">
            <img
              src={beraterPhoto}
              alt="Morino Stübe - ERGO Versicherungsfachmann in Ganderkesee"
              className="w-32 h-40 md:w-40 md:h-52 rounded-lg object-contain border border-ergo-line shrink-0 bg-white"
              width={160}
              height={208}
            />

            <div className="flex-1">
              <h2 className="text-xl md:text-2xl mb-1">Morino Stübe</h2>
              <p className="text-ergo-red font-bold text-sm mb-3 md:text-base">ERGO Versicherungsfachmann</p>
              <p className="text-ergo-stone text-sm leading-relaxed mb-4 md:text-base">
                Mit über 3 Jahren Erfahrung in der Versicherungsbranche berate ich Sie kompetent und
                verständlich zu allen Fragen rund um Ihre Absicherung.
              </p>

              <div className="flex flex-col gap-2 text-xs text-ergo-stone md:text-sm">
                <span className="flex items-center justify-center md:justify-start gap-1.5">
                  <Shield className="w-4 h-4 text-ergo-red shrink-0" />
                  Vermittlerregister-Nr. D-5H7J-7DUI1-10
                </span>
                <span className="flex items-center justify-center md:justify-start gap-1.5">
                  <Award className="w-4 h-4 text-ergo-red shrink-0" />
                  ERGO als starker Partner seit 1906
                </span>
              </div>
            </div>

            <img
              src="/attached_assets/ergo-logo-hq.svg"
              alt="ERGO Logo"
              className="h-8 md:h-10 w-auto shrink-0 hidden md:block"
              width={100}
              height={40}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </motion.section>

      {/* ──────── VORTEILE ──────── */}
      <motion.section {...fadeInUp} className="px-4 sm:px-6 pb-12 md:pb-16 max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-[28px] text-center mb-8">
          Ihre Vorteile bei der ERGO Agentur Stübe
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {BENEFITS.map((item) => (
            <div key={item.title} className="ergo-card p-4 md:p-6 flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-ergo-check shrink-0 mt-0.5" />
              <div>
                <h3 className="font-sans font-bold text-ergo-ink text-sm mb-1 md:text-base">{item.title}</h3>
                <p className="text-ergo-stone text-xs leading-relaxed md:text-sm">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ──────── ONLINE TOOLS ──────── */}
      <motion.section {...fadeInUp} className="px-4 sm:px-6 pb-12 md:pb-16 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <p className="ergo-eyebrow">Jetzt ausprobieren</p>
          <h2 className="text-2xl md:text-[28px]">Unsere Online-Tools für Sie</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/versicherungscheck" onClick={() => trackEvent('tool_clicked', { tool: 'versicherungscheck' })}>
            <div className="ergo-tile p-5 md:p-6 cursor-pointer h-full">
              <span className="ergo-icon-disc mb-3"><Search className="w-5 h-5" /></span>
              <h3 className="text-base md:text-lg">Versicherungscheck</h3>
              <p className="text-sm text-ergo-stone mt-1 leading-relaxed">In 2 Minuten Ihren Versicherungsbedarf ermitteln – kostenlos.</p>
              <span className="mt-3 inline-flex items-center gap-1 text-ergo-red font-bold text-sm">
                Jetzt starten <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
          <Link href="/sparrechner" onClick={() => trackEvent('tool_clicked', { tool: 'sparrechner' })}>
            <div className="ergo-tile p-5 md:p-6 cursor-pointer h-full">
              <span className="ergo-icon-disc mb-3"><PiggyBank className="w-5 h-5" /></span>
              <h3 className="text-base md:text-lg">Bündel-Sparrechner</h3>
              <p className="text-sm text-ergo-stone mt-1 leading-relaxed">Berechnen Sie Ihre Ersparnis mit dem ERGO Bündelnachlass – bis zu 15%.</p>
              <span className="mt-3 inline-flex items-center gap-1 text-ergo-red font-bold text-sm">
                Jetzt berechnen <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>
      </motion.section>

      {/* ──────── TESTSIEGER / AWARDS ──────── */}
      <motion.section {...fadeInUp} className="bg-ergo-gray border-y border-ergo-line">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="text-center mb-8">
            <p className="ergo-eyebrow">Ausgezeichnet</p>
            <h2 className="text-2xl md:text-[28px]">ERGO – vielfach ausgezeichnet & getestet</h2>
            <p className="text-sm text-ergo-stone mt-2 md:text-base max-w-xl mx-auto">
              Unabhängige Tests bestätigen: ERGO bietet Top-Leistungen zu fairen Konditionen.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {awards.map((award) => (
              <div key={`${award.product}-${award.rating}`} className="ergo-card flex items-center gap-3 px-4 py-3">
                <span className="ergo-icon-disc w-10 h-10"><Award className="w-4 h-4" /></span>
                <div className="min-w-0">
                  <p className="font-bold text-ergo-ink text-sm leading-tight">{award.product}</p>
                  <p className="text-xs text-ergo-mute leading-tight mt-0.5">{award.source} · {award.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ──────── TESTIMONIALS ──────── */}
      <motion.section {...fadeInUp} className="px-4 sm:px-6 py-12 md:py-16 max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-[28px] text-center mb-8">Das sagen unsere Kunden</h2>

        <div className="ergo-card p-6 md:p-8 min-h-[180px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="flex justify-center mb-3">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-ergo-yellow fill-ergo-yellow" />
                ))}
              </div>
              <p className="text-ergo-ink text-sm md:text-base leading-relaxed mb-4">
                „{testimonials[currentTestimonial].text}"
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-full bg-ergo-red flex items-center justify-center text-white font-bold text-sm">
                  {testimonials[currentTestimonial].name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="font-bold text-ergo-ink text-sm">{testimonials[currentTestimonial].name}</p>
                  <p className="text-xs text-ergo-mute">{testimonials[currentTestimonial].location}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-2 mt-5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentTestimonial(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentTestimonial ? 'bg-ergo-red w-6' : 'bg-ergo-line w-2'
                }`}
                aria-label={`Bewertung ${i + 1} anzeigen`}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* ──────── INSTAGRAM ──────── */}
      <motion.section {...fadeInUp} className="px-4 sm:px-6 pb-12 md:pb-16 max-w-3xl mx-auto">
        <div className="ergo-card p-6 md:p-10 text-center">
          <span className="ergo-icon-disc mb-4"><Instagram className="w-6 h-6" /></span>
          <h2 className="text-2xl md:text-[28px] mb-2">Folgen Sie mir auf Instagram</h2>
          <p className="text-sm text-ergo-stone leading-relaxed mb-6 max-w-md mx-auto md:text-base">
            Versicherungstipps, Einblicke in meinen Berateralltag und aktuelle Angebote – direkt auf Ihrem Smartphone.
          </p>

          <div className="mb-6 max-w-xs mx-auto">
            <div className="aspect-[4/5] rounded-lg border border-ergo-line overflow-hidden bg-ergo-gray">
              <img
                src={imagePhoto}
                alt="Morino Stübe Instagram Profil – Versicherungstipps und Einblicke"
                className="w-full h-full object-contain"
                loading="lazy"
                decoding="async"
                width={320}
                height={400}
              />
            </div>
          </div>

          <a
            href="https://www.instagram.com/morino_stuebe/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('instagram_clicked', { source: 'instagram_section' })}
            className="ergo-btn ergo-btn--secondary"
          >
            <Instagram className="w-5 h-5" />
            @morino_stuebe
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </motion.section>

      {/* ──────── KUNDENSERVICE ──────── */}
      <motion.section {...fadeInUp} className="px-4 sm:px-6 pb-12 md:pb-16 max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <p className="ergo-eyebrow">Bereits Kunde?</p>
          <h2 className="text-xl md:text-2xl">Schneller Kundenservice</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {SERVICE_TILES.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => trackEvent('tool_clicked', { tool: item.tracking })}>
              <div className="ergo-tile flex flex-col items-center gap-2 p-4 cursor-pointer text-center h-full">
                <span className="ergo-icon-disc w-10 h-10"><item.icon className="w-4 h-4" /></span>
                <span className="font-bold text-ergo-ink text-sm">{item.label}</span>
                <span className="text-[11px] text-ergo-mute leading-tight">{item.sub}</span>
              </div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* ──────── FAQ ──────── */}
      <motion.section {...fadeInUp} className="px-4 sm:px-6 pb-12 md:pb-16 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-[28px]">Häufig gestellte Fragen</h2>
          <p className="text-sm text-ergo-stone mt-2 md:text-base">
            Finden Sie schnell Antworten auf Ihre wichtigsten Fragen.
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <div key={i} className="ergo-card overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-ergo-red-light transition-colors"
                aria-expanded={openFaq === i}
              >
                <span className="font-sans font-semibold text-ergo-ink text-sm md:text-base pr-4">{item.q}</span>
                <ChevronDown className={`w-5 h-5 text-ergo-red shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 md:px-5 md:pb-5 border-t border-ergo-line pt-3">
                  <p className="text-ergo-stone text-sm leading-relaxed">{item.a}</p>
                  <button
                    onClick={() => {
                      openFunnel({ source: 'faq_section' });
                      trackEvent('faq_cta_clicked', { question: item.q });
                    }}
                    className="mt-3 text-sm ergo-link"
                  >
                    Weitere Fragen? Jetzt beraten lassen
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.section>

      {/* ──────── ABSCHLUSS-CTA ──────── */}
      <motion.section {...fadeInUp} className="ergo-section--red">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-[28px] mb-3">Zahlen Sie zu viel für zu wenig Schutz?</h2>
          <p className="text-sm md:text-lg text-white/90 leading-relaxed mb-8 max-w-lg mx-auto">
            In nur 2 Minuten prüfen wir gemeinsam, ob Ihre Absicherung noch zu Ihrer Lebenssituation
            passt – unverbindlich und kostenfrei.
          </p>

          <button
            onClick={() => {
              openFunnel({ source: 'lead_magnet' });
              trackEvent('lead_magnet_clicked', { source: 'bedarfs_check' });
            }}
            className="ergo-btn ergo-btn--inverted"
          >
            Kostenlose Analyse starten
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 mt-6 text-xs md:text-sm text-white/85">
            <span>DSGVO-konform</span>
            <span>Unverbindlich & kostenfrei</span>
            <span>Persönliche Beratung</span>
          </div>

          <Link href="/dokumente" className="inline-block mt-5 text-sm text-white underline underline-offset-2 hover:no-underline">
            Oder: Dokument einreichen & unterschreiben
          </Link>
        </div>
      </motion.section>

      {/* ──────── STICKY CTA BAR (Mobil) ──────── */}
      <AnimatePresence>
        {showMobileSticky && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-ergo-line px-3 py-2 flex gap-2 md:hidden safe-area-bottom"
          >
            <Link
              href="/beratung"
              onClick={() => trackEvent('cta_sticky_clicked', { source: 'home_sticky_bar' })}
              className="ergo-btn ergo-btn--primary ergo-btn--sm flex-1"
            >
              Jetzt beraten lassen
            </Link>
            <a
              href={`https://wa.me/49${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent('whatsapp_sticky_clicked', { source: 'home_sticky_bar' });
                trackConversion();
              }}
              className="ergo-btn ergo-btn--whatsapp ergo-btn--sm"
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>

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
