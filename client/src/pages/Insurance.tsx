import { useParams, Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import FunnelOverlay from "@/components/FunnelOverlay";
import '@/styles/funnel.css';
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trackEvent, trackConversion, trackAppointmentConversion } from "@/lib/analytics";
import { insuranceConfig } from "@/lib/insurance-config";
import { useQuery } from "@tanstack/react-query";
import sittingPhoto from "@assets/optimized/ich_bin_da.webp";
import beraterBranding from "@assets/optimized/unbenannt1.webp";
import { Award, Shield, Handshake, Clock, Star, Instagram, ExternalLink, Mail, Phone, MessageSquare, ChevronRight } from "lucide-react";
import TrustBar from "@/components/TrustBar";
import FAQSection from "@/components/FAQSection";
import type { Content } from "@shared/schema";

const insuranceFAQs: Record<string, { question: string; answer: string }[]> = {
  hausrat: [
    { question: "Was deckt die Hausratversicherung ab?", answer: "Die Hausratversicherung schützt Ihr gesamtes Hab und Gut in der Wohnung gegen Schäden durch Feuer, Einbruchdiebstahl, Leitungswasser, Sturm und Hagel. Auch Fahrräder und Wertsachen können mitversichert werden." },
    { question: "Wie hoch sollte die Versicherungssumme sein?", answer: "Als Faustregel gilt: ca. 650 Euro pro Quadratmeter Wohnfläche. Bei einer 80-qm-Wohnung wären das rund 52.000 Euro. Wir berechnen gerne die optimale Summe für Sie." },
    { question: "Sind Elementarschäden mitversichert?", answer: "Elementarschäden wie Hochwasser, Starkregen oder Erdrutsch sind in der Grunddeckung oft nicht enthalten. Wir empfehlen den Einschluss als Zusatzbaustein – besonders in der Region Ganderkesee und Delmenhorst." },
  ],
  haftpflicht: [
    { question: "Warum ist eine Haftpflichtversicherung so wichtig?", answer: "In Deutschland haften Sie unbegrenzt für Schäden, die Sie anderen zufügen. Ohne Haftpflichtversicherung kann ein einziger Unfall Ihre finanzielle Existenz bedrohen. Experten empfehlen eine Deckungssumme von mindestens 10 Millionen Euro." },
    { question: "Wer ist in der Haftpflicht mitversichert?", answer: "In der Familienhaftpflicht sind Ihr Partner, Ihre Kinder (auch volljährige in Ausbildung) und Haustiere mitversichert. Singles können eine günstigere Einzelpolice wählen." },
    { question: "Was kostet eine Haftpflichtversicherung?", answer: "Eine gute Privathaftpflicht gibt es bereits ab 8 Euro im Monat. Für Familien beginnen die Tarife bei etwa 12 Euro monatlich. Wir finden den passenden Tarif für Ihre Situation." },
  ],
  wohngebaeude: [
    { question: "Was schützt die Wohngebäudeversicherung?", answer: "Die Wohngebäudeversicherung schützt Ihr Haus gegen Schäden durch Feuer, Leitungswasser, Sturm und Hagel. Das Gebäude selbst, Garagen, Carports und fest verbaute Elemente wie Heizungen und Sanitäranlagen sind versichert." },
    { question: "Brauche ich zusätzlich Elementarschutz?", answer: "In der Region Ganderkesee, Delmenhorst und Oldenburg empfehlen wir den Elementarschutz ausdrücklich. Starkregen und Überschwemmungen nehmen zu – ohne diesen Baustein bleiben Sie auf den Kosten sitzen." },
    { question: "Wie wird die Versicherungssumme berechnet?", answer: "Die Versicherungssumme orientiert sich am Wiederaufbauwert Ihres Gebäudes (Wert 1914). Wir berechnen diesen Wert exakt anhand Ihrer Gebäudedaten, damit Sie weder unter- noch überversichert sind." },
  ],
  rechtsschutz: [
    { question: "Welche Bereiche deckt die Rechtsschutzversicherung ab?", answer: "Die ERGO Rechtsschutzversicherung umfasst Privatrecht, Berufsrecht, Verkehrsrecht und Wohnrecht. Anwalts-, Gerichts- und Gutachterkosten werden übernommen – deutschlandweit und oft auch im Ausland." },
    { question: "Gibt es eine Wartezeit?", answer: "Ja, bei den meisten Rechtsschutzversicherungen gilt eine Wartezeit von 3 Monaten. Verkehrsrechtsschutz ist davon oft ausgenommen. Strafrechtliche Angelegenheiten sind nicht versichert." },
    { question: "Lohnt sich eine Rechtsschutzversicherung?", answer: "Bereits ein einfacher Rechtsstreit kann schnell 5.000 bis 10.000 Euro kosten. Die Rechtsschutzversicherung gibt Ihnen die Sicherheit, Ihr Recht durchzusetzen, ohne finanzielle Risiken." },
  ],
  zahnzusatz: [
    { question: "Was zahlt die Zahnzusatzversicherung?", answer: "Die Zahnzusatzversicherung übernimmt Kosten für Zahnersatz (Kronen, Brücken, Implantate), Zahnbehandlungen und professionelle Zahnreinigung, die Ihre gesetzliche Krankenkasse nicht oder nur teilweise bezahlt." },
    { question: "Gibt es Wartezeiten oder Leistungsbegrenzungen?", answer: "In den ersten Jahren gelten oft Summenbegrenzungen (z.B. max. 1.000 Euro im ersten Jahr). Wartezeiten betragen meist 8 Monate für Zahnersatz. Je früher Sie abschließen, desto besser die Konditionen." },
    { question: "Ab welchem Alter sollte man eine Zahnzusatz haben?", answer: "Am besten so früh wie möglich – die Beiträge sind günstiger und es gibt weniger Ausschlüsse. Ab 30 steigt der Bedarf an Zahnersatz deutlich. Wir beraten Sie gerne zum optimalen Zeitpunkt." },
  ],
};

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' as const },
  transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
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
  { label: 'Wohngebäude', icon: '🏘️', type: 'wohngebaeude', source: 'hero_quiz' },
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
  wohngebaeude: 'wohngebaeude',
  rechtsschutz: 'rechtsschutz',
  zahnzusatz: 'zahnzusatz',
};

const QUIZ_TO_FUNNEL: Record<string, { type: string; label: string }> = {
  kfz: { type: 'kfz', label: 'Kfz-Versicherung' },
  hausrat: { type: 'hausrat', label: 'Hausrat & Haftpflicht' },
  wohngebaeude: { type: 'wohngebaeude', label: 'Wohngebäude' },
  rechtsschutz: { type: 'rechtsschutz', label: 'Rechtsschutz' },
  zahnzusatz: { type: 'zahnzusatz', label: 'Zahnzusatz' },
  bu: { type: 'berufsunfaehigkeit', label: 'Berufsunfähigkeit' },
  gewerbe: { type: 'gewerbe', label: 'Gewerbe & Betrieb' },
};

export default function Insurance() {
  const { type } = useParams();
  const [funnelOpen, setFunnelOpen] = useState(false);
  const [funnelInsuranceType, setFunnelInsuranceType] = useState<string | undefined>(type);
  const insurance = insuranceConfig[type as keyof typeof insuranceConfig];
  const [funnelInsuranceLabel, setFunnelInsuranceLabel] = useState<string | undefined>(insurance?.title);

  // Load content from database
  const { data: content } = useQuery<Content>({
    queryKey: ['/api/content', 'insurance', type],
    queryFn: async () => {
      const response = await fetch(`/api/content/insurance/${type}`);
      if (!response.ok) return null;
      return response.json();
    }
  });

  useEffect(() => {
    if (type) {
      trackEvent("insurance_page_view", { insurance_type: type });
    }
  }, [type]);

  useEffect(() => {
    setFunnelInsuranceType(type);
    setFunnelInsuranceLabel(insurance?.title);
  }, [type, insurance?.title]);

  if (!insurance) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Versicherung nicht gefunden</h1>
          <p className="text-gray-600">Die angeforderte Versicherung existiert nicht.</p>
        </div>
      </div>
    );
  }

  const handleStartFunnel = () => {
    setFunnelOpen(true);
    trackEvent("funnel_started", { insurance_type: type });
  };

  const closeFunnel = () => {
    setFunnelOpen(false);
    setFunnelInsuranceType(type);
    setFunnelInsuranceLabel(insurance?.title);
  };

  return (
    <>
      <SEO
        title={`${insurance.title} – ERGO Agentur Stübe Ganderkesee`}
        description={`${insurance.title} bei Ihrer ERGO Agentur in Ganderkesee. Persönliche Beratung, kostenlose Analyse bestehender Verträge und 15% Bündelnachlass ab 5 Versicherungen.`}
        keywords={`${insurance.title}, ERGO ${insurance.title}, ${insurance.title} Ganderkesee, ${insurance.title} Delmenhorst, ${insurance.title} Oldenburg, Versicherungsvergleich, Morino Stübe`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": insurance.title,
          "description": insurance.description,
          "provider": {
            "@type": "InsuranceAgency",
            "name": "ERGO Agentur Stübe",
            "telephone": "+4915566771019",
            "email": "morino.stuebe@ergo.de",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Friedensstraße 91 A",
              "addressLocality": "Ganderkesee",
              "postalCode": "27777",
              "addressRegion": "Niedersachsen",
              "addressCountry": "DE"
            }
          },
          "offers": {
            "@type": "Offer",
            "description": "Kostenlose Analyse bestehender Verträge und 15% Bündelnachlass ab 5 Versicherungen",
            "availability": "https://schema.org/InStock"
          },
          "areaServed": [
            { "@type": "City", "name": "Ganderkesee" },
            { "@type": "City", "name": "Delmenhorst" },
            { "@type": "City", "name": "Oldenburg" }
          ]
        }}
        additionalStructuredData={type && insuranceFAQs[type] ? [{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": insuranceFAQs[type].map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        }] : undefined}
      />
      <Breadcrumb />
      <main className="min-h-screen pb-16 sm:pb-0">
        {/* Hero Section */}
        <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-[#E2001A] via-[#c5001a] to-[#8b0011] text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="max-w-5xl mx-auto relative">
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
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
                  {insurance.title} –{' '}
                  <span className="bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                    Optimal versichert mit ERGO
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  className="text-base sm:text-lg text-white/90 max-w-xl mx-auto lg:mx-0 mb-3 leading-relaxed"
                >
                  Persönliche Beratung, kostenlose Analyse und 15% Bündelnachlass ab 5 ERGO-Versicherungen.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                  className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-white/80 mb-2"
                >
                  <span className="flex items-center gap-1"><span className="text-green-300">✓</span> Ohne Wartezeit</span>
                  <span className="flex items-center gap-1"><span className="text-green-300">✓</span> Sofortige Deckung</span>
                  <span className="flex items-center gap-1"><span className="text-green-300">✓</span> 15% Bündelnachlass</span>
                </motion.div>
              </div>

              {/* Quiz Card */}
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
                      const preSelectedType = type ? (TYPE_TO_QUIZ[type] ?? 'all') : 'all';
                      const isPreSelected = opt.type === preSelectedType && preSelectedType !== 'all';
                      const isAll = opt.type === 'all';
                      return (
                        <button
                          key={opt.type}
                          onClick={() => {
                            trackEvent('quiz_option_clicked', { option: opt.type, source: opt.source, page: `insurance_${type}` });
                            if (isAll) {
                              // "Alle prüfen" = generic consultation, no type (maps to general_consultation)
                              setFunnelInsuranceType(undefined);
                              setFunnelInsuranceLabel(undefined);
                            } else if (isPreSelected) {
                              // Pre-selected tile = current page's canonical URL type
                              setFunnelInsuranceType(type);
                              setFunnelInsuranceLabel(insurance.title);
                            } else {
                              const mapping = QUIZ_TO_FUNNEL[opt.type] ?? { type: type || '', label: insurance.title };
                              setFunnelInsuranceType(mapping.type);
                              setFunnelInsuranceLabel(mapping.label);
                            }
                            handleStartFunnel();
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
                              Aktuell
                            </span>
                          )}
                          <span className="text-2xl leading-none shrink-0">{opt.icon}</span>
                          <span className={`font-semibold text-sm ${isAll ? 'text-white' : isPreSelected ? 'text-[#E2001A]' : 'text-gray-800 group-hover:text-[#E2001A]'}`}>
                            {opt.label}
                          </span>
                          <ChevronRight className={`w-4 h-4 ml-auto shrink-0 ${isAll ? 'text-white/80' : isPreSelected ? 'text-[#E2001A]' : 'text-gray-400 group-hover:text-[#E2001A]'}`} />
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                    <p className="text-[10px] sm:text-xs text-gray-400">🔒 100% kostenlos & unverbindlich · DSGVO-konform</p>
                    <a
                      href={`https://wa.me/4915566771019?text=${encodeURIComponent('Hallo, ich möchte eine kostenlose Analyse meiner ' + insurance.title + ' und Informationen zum 15% Bündelnachlass!')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => { trackEvent('whatsapp_clicked', { source: 'insurance_hero_quiz', insurance_type: type }); trackConversion(); }}
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

        {/* Features Section */}
        <motion.section {...fadeInUp} className="py-12 sm:py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-high-contrast mb-3 sm:mb-4 px-2 leading-tight text-center">
                Ihre 3 wichtigsten Vorteile
              </h2>
              <p className="text-sm sm:text-base lg:text-xl text-medium-contrast text-readable px-2">
                Warum sich über 1000 Kunden für unsere {insurance.title} entschieden haben
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {insurance.features.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-4 sm:pt-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-ergo-red-light rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-ergo-red rounded-full" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-high-contrast mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-medium-contrast text-readable">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section {...fadeInUp} className="py-12 sm:py-16 bg-ergo-gray">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-2 leading-tight text-center">
                Das ist enthalten
              </h2>
              <p className="text-sm sm:text-base lg:text-xl text-gray-700 px-2">
                Ihre konkreten Leistungen bei der {insurance.title}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {insurance.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 sm:mr-4 mt-0.5 sm:mt-1 flex-shrink-0">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{benefit.title}</h4>
                    <p className="text-gray-700 text-sm sm:text-base">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Expert Section */}
        <motion.section {...fadeInUp} className="py-12 sm:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-2 leading-tight text-center">
                Ihr Versicherungsexperte
              </h2>
              <p className="text-sm sm:text-base lg:text-xl text-gray-700 px-2">
                Persönliche Beratung mit über 10 Jahren Erfahrung
              </p>
            </div>

            <Card className="bg-ergo-gray shadow-lg">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-2xl overflow-hidden shadow-lg">
                      <img 
                        src={sittingPhoto} 
                        alt="Morino Stübe - Ihr Versicherungsexperte" 
                        className="w-full h-full object-contain bg-white"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-xl sm:text-2xl font-bold text-ergo-dark mb-2">
                      Morino Stübe
                    </h3>
                    <p className="text-base sm:text-lg font-semibold text-ergo-red mb-3 sm:mb-4">
                      Versicherungsfachmann nach § 84 HGB
                    </p>
                    <div className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                      <p className="mb-2">
                        <span className="font-semibold">ERGO Ganderkesee</span><br />
                        Friedensstraße 91 A, 27777 Ganderkesee
                      </p>
                      <p className="text-xs sm:text-sm">
                        Tel: 01556 6771019 | E-Mail: morino.stuebe@ergo.de
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-ergo-red" />
                        <span>Zertifizierter Experte</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-ergo-red" />
                        <span>Über 10 Jahre Erfahrung</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Handshake className="w-4 h-4 text-ergo-red" />
                        <span>Persönliche Beratung</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-ergo-red" />
                        <span>Schnelle Abwicklung</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        <TrustBar />

        {/* Berater & Testsieger Section */}
        <motion.section {...fadeInUp} className="py-10 sm:py-14 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                <img
                  src={beraterBranding}
                  alt="Morino Stübe – Ihr ERGO Berater"
                  className="w-32 h-40 sm:w-40 sm:h-52 rounded-2xl object-contain shadow-lg border-2 border-gray-100 bg-white"
                  loading="lazy"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Ihr Berater: Morino Stübe</h2>
                <p className="text-ergo-red font-semibold text-sm mb-3">ERGO Versicherungsfachmann · Ganderkesee</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Ich berate Sie persönlich und transparent zur {insurance.title}. Gemeinsam finden wir die beste Lösung für Ihre Situation – kostenlos und unverbindlich. Besuchen Sie mich in Ganderkesee oder wir beraten Sie digital per Video oder WhatsApp.
                </p>
                <div className="flex flex-wrap gap-3 mb-4">
                  <a
                    href="https://www.instagram.com/morino_stuebe/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-pink-600 hover:text-pink-700 font-medium"
                    onClick={() => trackEvent('instagram_clicked', { source: 'insurance_page', type })}
                  >
                    <Instagram className="w-4 h-4" />
                    @morino_stuebe
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: "Zahnzusatz", rating: "SEHR GUT (0,5)", source: "Stiftung Warentest '24" },
                    { label: "BU-Versicherung", rating: "SEHR GUT", source: "Finanztest '24" },
                    { label: "Kfz Best-Tarif", rating: "HERVORRAGEND", source: "Franke & Bornberg '25" },
                    { label: "Service", rating: "11x Champion", source: "ServiceValue '25" },
                  ].map((award) => (
                    <div key={award.label} className="bg-gray-50 rounded-lg p-2.5 text-center border border-gray-100">
                      <Award className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
                      <p className="text-xs font-bold text-gray-900 leading-tight">{award.rating}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{award.label}</p>
                      <p className="text-[10px] text-gray-400">{award.source}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {type && insuranceFAQs[type] && (
          <FAQSection
            title={`Häufige Fragen zur ${insurance.title}`}
            subtitle="Weitere Fragen? Kontaktieren Sie uns direkt – Morino Stübe berät Sie persönlich in Ganderkesee, Delmenhorst und Oldenburg."
            faqs={insuranceFAQs[type]}
            className="bg-white"
          />
        )}

        {/* Final CTA Section with Urgency */}
        <motion.section {...fadeInUp} className="py-12 sm:py-16 bg-gradient-to-r from-ergo-red to-red-700 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 px-2 leading-tight text-white">
              Kostenlose Analyse & 15% Bündelnachlass
            </h2>
            <p className="text-sm sm:text-base lg:text-xl mb-6 sm:mb-8 px-2 text-white/90">
              <strong>Immer kostenlos:</strong> Vollständige Analyse Ihrer bestehenden {insurance.title} plus Optimierung und günstigere Alternativen.
              <strong> 15% Bündelnachlass ab 5 Versicherungen!</strong> Bereits <span className="text-yellow-300 font-bold">{Math.floor(15 + new Date().getHours() * 0.8)} Kunden</span> haben heute gespart!
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  onClick={() => {
                    trackEvent('final_cta_clicked', { insurance_type: type, source: 'bottom_section', value: 15 });
                    handleStartFunnel();
                  }}
                >
                  🚀 KOSTENLOSE ANALYSE + 15% NACHLASS
                </Button>
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-lg font-bold"
                  onClick={() => {
                    trackEvent('final_whatsapp_clicked', { insurance_type: type, source: 'bottom_section' });
                    const whatsappUrl = 'https://wa.me/4915566771019?text=Hallo, ich möchte eine kostenlose Analyse meiner ' + insurance.title + ' und Infos zum 15% Bündelnachlass ab 5 Versicherungen!';
                    trackAppointmentConversion(whatsappUrl);
                  }}
                >
                  💬 Sofortige WhatsApp Beratung
                </Button>
                <Link href="/termin">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-ergo-red px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-lg font-bold w-full"
                    onClick={() => trackEvent('booking_page_clicked', { insurance_type: type, source: 'bottom_section' })}
                  >
                    📅 Termin buchen
                  </Button>
                </Link>
              </div>
              <p className="text-sm font-medium mt-3 text-white/80">
                ✅ Kostenlose Analyse • Optimierung bestehender Verträge • 15% Bündelnachlass ab 5 Versicherungen
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-medium text-white/90">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>100% kostenlos & unverbindlich</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Antwort binnen 2 Minuten</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Sticky Mobile CTA Bar */}
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-3 py-2 flex gap-2 sm:hidden safe-area-bottom">
          <button
            onClick={() => {
              handleStartFunnel();
              trackEvent('sticky_cta_clicked', { insurance_type: type });
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#E2001A] to-[#c5001a] text-white font-semibold text-sm min-h-[44px] py-3 rounded-xl whitespace-nowrap shadow-lg shadow-red-500/20 animate-pulse-subtle"
          >
            <Mail className="w-4 h-4 shrink-0" />
            Kostenlose Analyse
          </button>
          <a
            href="https://wa.me/4915566771019"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackEvent('sticky_whatsapp_clicked', { insurance_type: type });
              trackConversion();
            }}
            className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold text-sm px-4 min-h-[44px] py-3 rounded-xl active:scale-[0.97] transition-transform whitespace-nowrap"
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            WhatsApp
          </a>
        </div>

        <FunnelOverlay
          isOpen={funnelOpen}
          onClose={closeFunnel}
          insuranceType={funnelInsuranceType}
          insuranceLabel={funnelInsuranceLabel}
        />
      </main>
    </>
  );
}
