import { useParams, Link } from "wouter";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FunnelOverlay from "@/components/FunnelOverlay";
import '@/styles/funnel.css';
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";
import { trackEvent, trackConversion, trackAppointmentConversion } from "@/lib/analytics";
import { insuranceConfig } from "@/lib/insurance-config";
import { useQuery } from "@tanstack/react-query";
import sittingPhoto from "@assets/optimized/ich_bin_da.webp";
import beraterBranding from "@assets/optimized/unbenannt1.webp";
import {
  Award, Shield, Handshake, Clock, Star, Instagram, ExternalLink, Mail,
  MessageSquare, MessageCircle, ChevronRight, CheckCircle2, CarFront, Home,
  Building, Building2, Scale, SmilePlus, BriefcaseBusiness, LayoutGrid, CalendarDays,
} from "lucide-react";
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
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' as const },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
};

const QUIZ_OPTIONS = [
  { label: 'Kfz-Versicherung', icon: CarFront, type: 'kfz', source: 'hero_quiz' },
  { label: 'Hausrat & Haftpflicht', icon: Home, type: 'hausrat', source: 'hero_quiz' },
  { label: 'Wohngebäude', icon: Building, type: 'wohngebaeude', source: 'hero_quiz' },
  { label: 'Rechtsschutz', icon: Scale, type: 'rechtsschutz', source: 'hero_quiz' },
  { label: 'Zahnzusatz', icon: SmilePlus, type: 'zahnzusatz', source: 'hero_quiz' },
  { label: 'Berufsunfähigkeit', icon: BriefcaseBusiness, type: 'bu', source: 'hero_quiz' },
  { label: 'Gewerbe & Betrieb', icon: Building2, type: 'gewerbe', source: 'lp_gewerbe' },
  { label: 'Alle prüfen', icon: LayoutGrid, type: 'all', source: 'hero_quiz' },
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
          <h1 className="text-2xl mb-4">Versicherung nicht gefunden</h1>
          <p className="text-ergo-stone">Die angeforderte Versicherung existiert nicht.</p>
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
      <main className="min-h-screen bg-white pb-16 sm:pb-0">
        {/* Hero Section */}
        <section className="border-b border-ergo-line">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-12 md:pt-16 md:pb-16">
            <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">
              <div className="flex-1 mb-10 lg:mb-0">
                <p className="ergo-eyebrow">ERGO Agentur Stübe · Ganderkesee</p>
                <h1 className="text-[30px] leading-[1.25] md:text-[40px] mb-4 max-w-xl">
                  {insurance.title} – Optimal versichert mit ERGO
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
                  Persönliche Beratung, kostenlose Analyse und 15% Bündelnachlass ab 5 ERGO-Versicherungen.
                </p>

                <ul className="ergo-check-list text-sm text-ergo-ink max-w-md">
                  <li>Ohne Wartezeit</li>
                  <li>Sofortige Deckung</li>
                  <li>15% Bündelnachlass</li>
                </ul>
              </div>

              {/* Quiz Card */}
              <div className="w-full lg:w-[420px] lg:flex-shrink-0">
                <div className="ergo-card p-4 sm:p-5">
                  <p className="ergo-eyebrow mb-1">Kostenlose Analyse – In 2 Minuten</p>
                  <p className="font-serif text-lg font-bold text-ergo-ink mb-4">
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
                                  Aktuell
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
                    <p className="text-xs text-ergo-mute">100% kostenlos & unverbindlich · DSGVO-konform</p>
                    <a
                      href={`https://wa.me/4915566771019?text=${encodeURIComponent('Hallo, ich möchte eine kostenlose Analyse meiner ' + insurance.title + ' und Informationen zum 15% Bündelnachlass!')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => { trackEvent('whatsapp_clicked', { source: 'insurance_hero_quiz', insurance_type: type }); trackConversion(); }}
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

        {/* Features Section */}
        <motion.section {...fadeInUp} className="py-12 sm:py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl md:text-[28px] mb-3 sm:mb-4 px-2 text-center">
                Ihre 3 wichtigsten Vorteile
              </h2>
              <p className="text-sm sm:text-base text-ergo-stone px-2">
                Warum sich über 1000 Kunden für unsere {insurance.title} entschieden haben
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {insurance.features.map((feature, index) => (
                <div key={index} className="ergo-card p-5 sm:p-6 text-center">
                  <span className="ergo-icon-disc w-10 h-10 mx-auto mb-3 sm:mb-4">
                    <CheckCircle2 className="w-5 h-5" />
                  </span>
                  <h3 className="font-sans font-bold text-ergo-ink text-base sm:text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-ergo-stone">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section {...fadeInUp} className="py-12 sm:py-16 bg-ergo-gray border-y border-ergo-line">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl md:text-[28px] mb-3 sm:mb-4 px-2 text-center">
                Das ist enthalten
              </h2>
              <p className="text-sm sm:text-base text-ergo-stone px-2">
                Ihre konkreten Leistungen bei der {insurance.title}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {insurance.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-ergo-check mr-3 sm:mr-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-sans font-bold text-ergo-ink mb-1 text-sm sm:text-base">{benefit.title}</h4>
                    <p className="text-ergo-stone text-sm sm:text-base">{benefit.description}</p>
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
              <h2 className="text-2xl md:text-[28px] mb-3 sm:mb-4 px-2 text-center">
                Ihr Versicherungsexperte
              </h2>
              <p className="text-sm sm:text-base text-ergo-stone px-2">
                Persönliche Beratung mit über 10 Jahren Erfahrung
              </p>
            </div>

            <div className="ergo-card p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-lg overflow-hidden border border-ergo-line bg-white">
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
                  <h3 className="text-xl sm:text-2xl mb-2">
                    Morino Stübe
                  </h3>
                  <p className="text-base sm:text-lg font-bold text-ergo-red mb-3 sm:mb-4">
                    Versicherungsfachmann nach § 84 HGB
                  </p>
                  <div className="text-ergo-stone mb-4 sm:mb-6 text-sm sm:text-base">
                    <p className="mb-2">
                      <span className="font-semibold">ERGO Ganderkesee</span><br />
                      Friedensstraße 91 A, 27777 Ganderkesee
                    </p>
                    <p className="text-xs sm:text-sm">
                      Tel: 01556 6771019 | E-Mail: morino.stuebe@ergo.de
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-ergo-ink">
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
            </div>
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
                  className="w-32 h-40 sm:w-40 sm:h-52 rounded-lg object-contain border border-ergo-line bg-white"
                  loading="lazy"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl mb-1">Ihr Berater: Morino Stübe</h2>
                <p className="text-ergo-red font-bold text-sm mb-3">ERGO Versicherungsfachmann · Ganderkesee</p>
                <p className="text-ergo-stone text-sm leading-relaxed mb-4">
                  Ich berate Sie persönlich und transparent zur {insurance.title}. Gemeinsam finden wir die beste Lösung für Ihre Situation – kostenlos und unverbindlich. Besuchen Sie mich in Ganderkesee oder wir beraten Sie digital per Video oder WhatsApp.
                </p>
                <div className="flex flex-wrap gap-3 mb-4">
                  <a
                    href="https://www.instagram.com/morino_stuebe/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-ergo-red hover:text-ergo-red-hover hover:underline font-bold"
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
                    <div key={award.label} className="ergo-card p-2.5 text-center">
                      <span className="ergo-icon-disc w-8 h-8 mx-auto mb-1"><Award className="w-4 h-4" /></span>
                      <p className="text-xs font-bold text-ergo-red leading-tight">{award.rating}</p>
                      <p className="text-[10px] text-ergo-stone mt-0.5">{award.label}</p>
                      <p className="text-[10px] text-ergo-mute">{award.source}</p>
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

        {/* Final CTA Section */}
        <motion.section {...fadeInUp} className="ergo-section--red py-14 md:py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-[28px] mb-3 sm:mb-4 px-2">
              Kostenlose Analyse & 15% Bündelnachlass
            </h2>
            <p className="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 px-2 text-white/90">
              <strong>Immer kostenlos:</strong> Vollständige Analyse Ihrer bestehenden {insurance.title} plus Optimierung und günstigere Alternativen.
              <strong> 15% Bündelnachlass ab 5 Versicherungen!</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
              <button
                className="ergo-btn ergo-btn--inverted"
                onClick={() => {
                  trackEvent('final_cta_clicked', { insurance_type: type, source: 'bottom_section', value: 15 });
                  handleStartFunnel();
                }}
              >
                KOSTENLOSE ANALYSE + 15% NACHLASS
              </button>
              <button
                className="ergo-btn ergo-btn--whatsapp"
                onClick={() => {
                  trackEvent('final_whatsapp_clicked', { insurance_type: type, source: 'bottom_section' });
                  const whatsappUrl = 'https://wa.me/4915566771019?text=Hallo, ich möchte eine kostenlose Analyse meiner ' + insurance.title + ' und Infos zum 15% Bündelnachlass ab 5 Versicherungen!';
                  trackAppointmentConversion(whatsappUrl);
                }}
              >
                <MessageCircle className="w-5 h-5" />
                Sofortige WhatsApp Beratung
              </button>
              <Link href="/termin">
                <button
                  className="ergo-btn border-white text-white hover:bg-white hover:text-ergo-red w-full"
                  onClick={() => trackEvent('booking_page_clicked', { insurance_type: type, source: 'bottom_section' })}
                >
                  <CalendarDays className="w-5 h-5" />
                  Termin buchen
                </button>
              </Link>
            </div>
            <p className="text-sm font-medium mb-6 sm:mb-8 text-white/80">
              Kostenlose Analyse • Optimierung bestehender Verträge • 15% Bündelnachlass ab 5 Versicherungen
            </p>

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
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-ergo-line px-3 py-2 flex gap-2 sm:hidden safe-area-bottom">
          <button
            onClick={() => {
              handleStartFunnel();
              trackEvent('sticky_cta_clicked', { insurance_type: type });
            }}
            className="ergo-btn ergo-btn--primary ergo-btn--sm flex-1 whitespace-nowrap"
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
            className="ergo-btn ergo-btn--whatsapp ergo-btn--sm whitespace-nowrap"
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
