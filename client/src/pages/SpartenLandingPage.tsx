import { useState, useEffect, useCallback } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import FunnelOverlay from '@/components/FunnelOverlay';
import FAQSection from '@/components/FAQSection';
import { trackEvent, trackConversion } from '@/lib/analytics';
import { type SpartenConfig } from '@/data/spartenConfig';
import {
  Phone, Shield, Star, Clock, CheckCircle2, MessageCircle, Award,
  ChevronRight, MessageSquare, CarFront, Home, Scale, SmilePlus,
  BriefcaseBusiness, Building2, Layers3, Play,
} from 'lucide-react';
import beraterPhoto from '@assets/optimized/ich_bin_da.webp';

interface SpartenLandingPageProps {
  config: SpartenConfig;
}

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' as const },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
};

const QUIZ_OPTIONS = [
  { label: 'Kfz-Versicherung', icon: CarFront, type: 'kfz', source: 'hero_quiz' },
  { label: 'Hausrat & Haftpflicht', icon: Home, type: 'hausrat', source: 'hero_quiz' },
  { label: 'Rechtsschutz', icon: Scale, type: 'rechtsschutz', source: 'hero_quiz' },
  { label: 'Zahnzusatz', icon: SmilePlus, type: 'zahnzusatz', source: 'hero_quiz' },
  { label: 'Berufsunfähigkeit', icon: BriefcaseBusiness, type: 'bu', source: 'hero_quiz' },
  { label: 'Gewerbe & Betrieb', icon: Building2, type: 'gewerbe', source: 'lp_gewerbe' },
  { label: 'Alle prüfen', icon: Layers3, type: 'all', source: 'hero_quiz' },
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

  return (
    <motion.section {...fadeInUp} className="py-10 md:py-14 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <p className="ergo-eyebrow">Erklärvideo</p>
          <h2 className="text-2xl md:text-[28px]">Zahnzusatz einfach erklärt</h2>
          <p className="text-ergo-stone text-sm mt-2">In wenigen Minuten verstehen Sie, worauf es bei der Zahnzusatzversicherung ankommt.</p>
        </div>

        <div className="relative ergo-card overflow-hidden aspect-video bg-ergo-ink">
          {!isPlaying ? (
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-4 group bg-ergo-ink"
              aria-label="Video abspielen"
            >
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center">
                  <Play className="w-7 h-7 sm:w-9 sm:h-9 text-ergo-red ml-1" fill="currentColor" />
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-base sm:text-lg">Video abspielen</p>
                  <p className="text-white/70 text-xs sm:text-sm mt-0.5">Zahnzusatz-Leitfaden · ERGO Agentur Stübe</p>
                </div>
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

        <p className="text-center text-xs text-ergo-mute mt-3">
          Das Video wird erst bei Klick geladen – keine Auswirkung auf die Ladezeit der Seite.
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
      setFunnelType(opts.type);
      setFunnelLabel(opts.label);
      setFunnelInitialStep(opts.initialStep);
    }
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
    "url": `https://ergo-ganderkesee.de/${config.slug}`,
    "description": config.seo.description,
    "provider": {
      "@type": "InsuranceAgency",
      "name": "ERGO Versicherung Morino Stübe",
      "@id": "https://ergo-ganderkesee.de",
      "url": "https://ergo-ganderkesee.de",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Friedensstraße 91 A",
        "addressLocality": "Ganderkesee",
        "postalCode": "27777",
        "addressCountry": "DE"
      },
      "telephone": "+4915566771019"
    },
    "areaServed": [
      { "@type": "City", "name": "Ganderkesee" },
      { "@type": "City", "name": "Delmenhorst" },
      { "@type": "City", "name": "Oldenburg" }
    ]
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

      <div className="bg-white min-h-screen">
        {/* Hero */}
        <section className="border-b border-ergo-line">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-12 md:pt-16 md:pb-16">
            <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">

              {/* Links: Text */}
              <div className="flex-1 mb-10 lg:mb-0">
                <p className="ergo-eyebrow">ERGO Agentur Stübe · Ganderkesee</p>
                <h1 className="text-[30px] leading-[1.25] md:text-[40px] mb-4 max-w-xl">
                  {config.hero.headline}
                </h1>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-ergo-yellow fill-ergo-yellow" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-ergo-ink">4,9/5</span>
                  <span className="text-xs text-ergo-mute">über 3.500 zufriedene Kunden</span>
                </div>

                <p className="text-base sm:text-lg text-ergo-stone max-w-xl mb-5 leading-relaxed">
                  {config.hero.subheadline}
                </p>

                <ul className="ergo-check-list text-sm text-ergo-ink max-w-md">
                  <li>Kostenlos & unverbindlich</li>
                  <li>Keine Verpflichtung</li>
                  <li>DSGVO-konform</li>
                </ul>
              </div>

              {/* Rechts: Quiz-Karte */}
              <div className="w-full lg:w-[420px] lg:flex-shrink-0">
                <div className="ergo-card p-4 sm:p-5">
                  <p className="ergo-eyebrow mb-1">Kostenlose Analyse – in 2 Minuten</p>
                  <p className="font-serif text-lg font-bold text-ergo-ink mb-4">
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
                          className={
                            isAll
                              ? 'ergo-btn ergo-btn--primary sm:col-span-2 justify-between px-5'
                              : `ergo-option flex items-center gap-3 px-4 py-3 text-left relative ${isPreSelected ? 'selected' : ''}`
                          }
                        >
                          {isAll ? (
                            <>
                              <span className="flex items-center gap-3"><opt.icon className="w-5 h-5" />{opt.label}</span>
                              <ChevronRight className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              {isPreSelected && (
                                <span className="absolute -top-2 right-3 bg-ergo-red text-white text-[10px] font-bold px-2 py-0.5 rounded-pill leading-none">
                                  Empfohlen
                                </span>
                              )}
                              <opt.icon className="w-5 h-5 text-ergo-red shrink-0" />
                              <span className={`font-semibold text-sm ${isPreSelected ? 'text-ergo-red' : 'text-ergo-ink'}`}>
                                {opt.label}
                              </span>
                              <ChevronRight className="w-4 h-4 ml-auto shrink-0 text-ergo-mute" />
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-3 border-t border-ergo-line flex items-center justify-between gap-3">
                    <p className="text-xs text-ergo-mute">100% kostenlos & unverbindlich</p>
                    <a
                      href={`https://wa.me/49${whatsappNumber}?text=${encodeURIComponent(`Hallo Herr Stübe, ich interessiere mich für die ${config.seo.title.split(' – ')[0]}. Können Sie mich beraten?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => { trackEvent('whatsapp_clicked', { source: 'sparten_hero_quiz', sparte: config.slug }); trackConversion(); }}
                      className="flex items-center gap-1.5 text-[#1da851] hover:underline text-xs font-bold whitespace-nowrap shrink-0"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Lieber WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistik-Band */}
        <motion.section {...fadeInUp} className="bg-ergo-gray border-b border-ergo-line">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
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

        {/* Vorteile */}
        <motion.section {...fadeInUp} className="py-12 md:py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-[28px] text-center mb-3">Ihre Vorteile bei ERGO</h2>
            <p className="text-center text-ergo-stone text-sm mb-10 max-w-xl mx-auto">
              Persönliche Beratung statt anonymer Online-Vergleich – das macht den Unterschied.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {config.benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <div key={i} className="ergo-card p-5">
                    <div className="flex items-start gap-4">
                      <span className="ergo-icon-disc w-10 h-10"><Icon className="w-5 h-5" /></span>
                      <div>
                        <h3 className="font-sans font-bold text-ergo-ink text-sm sm:text-base mb-1">{benefit.title}</h3>
                        <p className="text-ergo-stone text-sm leading-relaxed">{benefit.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Erklärvideo (falls vorhanden) */}
        {config.explainerVideo && <ExplainerVideo src={config.explainerVideo} />}

        {/* Berater-Profil */}
        <motion.section {...fadeInUp} className="px-4 pb-12 md:pb-16 max-w-3xl mx-auto">
          <div className="ergo-card p-5 md:p-8">
            <div className="flex flex-col items-center text-center gap-5 md:flex-row md:text-left md:items-start">
              <img
                src={beraterPhoto}
                alt="Morino Stübe - ERGO Versicherungsfachmann in Ganderkesee"
                className="w-32 h-40 md:w-40 md:h-52 rounded-lg object-contain border border-ergo-line shrink-0 bg-white"
              />
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl mb-1">Morino Stübe</h2>
                <p className="text-ergo-red font-bold text-sm mb-3 md:text-base">ERGO Versicherungsfachmann · Ganderkesee</p>
                <p className="text-ergo-stone text-sm leading-relaxed mb-4 md:text-base">
                  Ich berate Sie persönlich und transparent zur {config.seo.title.split(' – ')[0]}. Gemeinsam finden
                  wir die beste Lösung für Ihre Situation – kostenlos und unverbindlich.
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
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </motion.section>

        {/* Kundenstimmen */}
        <motion.section {...fadeInUp} className="py-12 md:py-16 px-4 bg-ergo-gray border-y border-ergo-line">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-[28px] text-center mb-8">Das sagen unsere Kunden</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {config.reviews.map((review, i) => (
                <div key={i} className="ergo-card p-5">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-ergo-yellow fill-ergo-yellow" />
                    ))}
                  </div>
                  <p className="text-ergo-ink text-sm leading-relaxed mb-3">„{review.text}"</p>
                  <p className="text-xs font-semibold text-ergo-mute">– {review.name}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Auszeichnungen */}
        <motion.section {...fadeInUp} className="py-12 md:py-14 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl text-center mb-2">ERGO – mehrfach ausgezeichnet</h2>
            <p className="text-center text-ergo-stone text-sm mb-8">Von unabhängigen Testinstituten bewertet</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ergoAwards.map((award) => (
                <div key={award.label} className="ergo-card p-4 text-center">
                  <span className="ergo-icon-disc w-10 h-10 mb-2"><Award className="w-4 h-4" /></span>
                  <p className="text-xs font-bold text-ergo-red mb-1">{award.rating}</p>
                  <p className="text-sm font-semibold text-ergo-ink mb-1">{award.label}</p>
                  <p className="text-[10px] text-ergo-mute">{award.source}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FAQ */}
        <FAQSection
          title="Häufige Fragen"
          faqs={config.faqs}
          className="bg-ergo-gray border-y border-ergo-line"
        />

        {/* Abschluss-CTA */}
        <motion.section {...fadeInUp} className="ergo-section--red py-14 md:py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="inline-flex items-center gap-2 text-white/85 text-sm font-semibold mb-4">
              <Clock className="w-4 h-4" />
              {config.urgency.subtext}
            </p>
            <h2 className="text-2xl md:text-[28px] mb-4">{config.urgency.text}</h2>
            <p className="text-white/90 text-sm sm:text-base mb-8 max-w-xl mx-auto">
              Kostenlose, unverbindliche Beratung von Ihrem persönlichen ERGO-Berater Morino Stübe in Ganderkesee.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => openFunnel()} className="ergo-btn ergo-btn--inverted">
                <Phone className="w-5 h-5" /> Jetzt beraten lassen
              </button>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hallo Herr Stübe, ich interessiere mich für die ${config.seo.title.split(' – ')[0]}. Können Sie mich beraten?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ergo-btn ergo-btn--whatsapp"
              >
                <MessageCircle className="w-5 h-5" /> Per WhatsApp anfragen
              </a>
            </div>
          </div>
        </motion.section>

        {/* Minimaler LP-Footer */}
        <footer className="bg-ergo-gray border-t border-ergo-line text-ergo-stone py-6 px-4 text-center text-xs">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/impressum" className="hover:text-ergo-red hover:underline transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-ergo-red hover:underline transition-colors">Datenschutz</Link>
            <Link href="/erstinformation" className="hover:text-ergo-red hover:underline transition-colors">Erstinformation</Link>
          </div>
          <p className="mt-3">&copy; 2026 ERGO Agentur Stübe · Morino Stübe · Vermittlerregister-Nr. D-5H7J-7DUI1-10</p>
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
