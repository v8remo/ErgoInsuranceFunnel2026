import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";
import FunnelOverlay from "@/components/FunnelOverlay";
import '@/styles/funnel.css';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trackEvent, trackConversion, trackAppointmentConversion } from "@/lib/analytics";
import { Award, Shield, Handshake, Clock, ChevronDown, Phone, MessageCircle, Check, X, Heart, Briefcase, Users, Building2, Star, TrendingUp, Umbrella, Wallet, Mail, MessageSquare, ChevronRight } from "lucide-react";
import TrustBar from "@/components/TrustBar";
import FAQSection from "@/components/FAQSection";
import beraterPhoto from "@assets/optimized/ich_bin_da.webp";

const products = [
  {
    id: "private-rente",
    icon: Wallet,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    name: "ERGO Private Rentenversicherung",
    short: "3 Produktfamilien: Chance, Balance und Index – passend zu Ihrer Risikobereitschaft und Ihren Zielen.",
    highlights: ["Ab 25€/Monat", "100% Beitragsgarantie (Balance/Index)", "FFF+ Bestnote Franke & Bornberg", "Flexible Auszahlung"],
    target: "Alle Altersgruppen",
    features: [
      { title: "3 Anlagestrategien", description: "Chance (fondsgebunden), Balance (Mischanlage) und Index (MSCI World / Munich Re Index) – Sie wählen Ihre Strategie" },
      { title: "Steuerfreie Fondswechsel", description: "Innerhalb der Versicherung beliebig oft umschichten ohne Kapitalertragssteuer" },
      { title: "Lebenslange Rente garantiert", description: "Garantierte monatliche Rente – das Langlebigkeitsrisiko ist abgesichert" }
    ],
    benefits: [
      { title: "Bis zu 20 Fonds gleichzeitig", description: "Große Fondsauswahl inkl. nachhaltiger ESG-Optionen" },
      { title: "12x/Jahr kostenlos wechseln", description: "Flexible Fondsumschichtung ohne Gebühren" },
      { title: "Halbeinkünfteverfahren", description: "Bei Kapitalauszahlung nach 12 Jahren und ab 62: nur 50% der Erträge steuerpflichtig" },
      { title: "Hinterbliebenenabsicherung", description: "Optionaler Schutz für Partner und Familie" },
      { title: "Beitragsbefreiung bei BU", description: "Weiterzahlung durch Versicherer bei Berufsunfähigkeit" },
      { title: "Online-Depot-Einsicht", description: "Jederzeit Ihr Investment im Blick" }
    ],
    detailSections: [
      { title: "🚀 Chance", text: "Rein fondsgebunden mit bis zu 20 Fonds. Maximale Renditechancen, keine Beitragsgarantie. Ideal für renditeorientierte Sparer mit langem Anlagehorizont." },
      { title: "⚖️ Balance", text: "Kombination aus Fonds, Sicherungsvermögen und Indexbeteiligung. 100% Beitragsgarantie zum Rentenbeginn. Flexible Aufteilung jederzeit änderbar." },
      { title: "📊 Index", text: "Partizipation am MSCI World (30%) oder Munich Re Index (105%). Jährliche Gewinnsicherung, kein Verlustrisiko auf den Beitrag. 100% Beitragsgarantie." }
    ],
    steuerInfo: "In der Ansparphase sind Fondswechsel steuerfrei. Bei Auszahlung als Rente wird nur der geringe Ertragsanteil besteuert. Bei Kapitalauszahlung nach 12 Jahren und ab 62 gilt das Halbeinkünfteverfahren – nur 50% der Erträge steuerpflichtig.",
    questions: [
      { type: "radio" as const, question: "Welche Anlagestrategie bevorzugen Sie?", name: "strategy", options: ["Renditeorientiert (Chance)", "Ausgewogen (Balance)", "Sicherheitsorientiert (Index)", "Bin unsicher – bitte beraten"] },
      { type: "select" as const, question: "Wann möchten Sie in Rente gehen?", name: "retirement_age", options: ["Ab 62 Jahre", "Ab 65 Jahre", "Ab 67 Jahre", "Noch nicht sicher"] }
    ]
  },
  {
    id: "basis-rente",
    icon: Building2,
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-50",
    name: "ERGO Basis-Rente (Rürup)",
    short: "Staatlich geförderte Basisversorgung – Beiträge zu 100% steuerlich absetzbar. Ideal für Selbstständige und Gutverdiener.",
    highlights: ["100% steuerlich absetzbar", "Max. 27.565€/Jahr absetzbar", "Pfändungssicher", "Lebenslange Rente"],
    target: "Selbstständige & Gutverdiener",
    features: [
      { title: "Maximale Steuerersparnis", description: "Beiträge 2025 zu 100% als Sonderausgaben absetzbar – bis zu 27.565€/Jahr (Ledige)" },
      { title: "Pfändungs- und Hartz-IV-sicher", description: "Ihr angespartes Kapital ist geschützt vor Zugriff durch Gläubiger" },
      { title: "Flexible Anlagestrategien", description: "Wahl zwischen Chance, Balance und Index – genau wie bei der privaten Rente" }
    ],
    benefits: [
      { title: "100% steuerlich absetzbar", description: "Sofortige Steuerersparnis durch volle Absetzbarkeit der Beiträge" },
      { title: "Lebenslange garantierte Rente", description: "Monatliche Rente bis zum Lebensende" },
      { title: "Kombination mit BU-Schutz", description: "BU-Beiträge werden ebenfalls steuerlich gefördert" },
      { title: "Flexible Beitragszahlung", description: "Regelmäßige Beiträge und/oder Zuzahlungen möglich" },
      { title: "Hinterbliebenenrente", description: "Absicherung des Ehepartners optional möglich" },
      { title: "Schutz vor Altersarmut", description: "Zweite Säule der Altersvorsorge neben der gesetzlichen Rente" }
    ],
    steuerInfo: "Beiträge zur Basis-Rente sind 2025 zu 100% als Sonderausgaben absetzbar – bis zu 27.565€ für Ledige und 55.130€ für Verheiratete. Die spätere Rente wird nachgelagert besteuert – in der Regel zu einem deutlich niedrigeren Steuersatz als im Berufsleben.",
    questions: [
      { type: "radio" as const, question: "Sind Sie selbstständig oder angestellt?", name: "employment", options: ["Selbstständig/Freiberufler", "Angestellt (Gutverdiener)", "Beamter"] },
      { type: "select" as const, question: "Wie hoch ist Ihr zu versteuerndes Jahreseinkommen?", name: "income", options: ["40.000-60.000€", "60.000-80.000€", "80.000-100.000€", "Über 100.000€"] }
    ]
  },
  {
    id: "betriebliche-av",
    icon: Briefcase,
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    name: "ERGO Betriebliche Altersvorsorge",
    short: "Vom Bruttoeinkommen sparen – mit verpflichtendem Arbeitgeberzuschuss von mindestens 15%.",
    highlights: ["Mind. 15% AG-Zuschuss", "Steuer- & SV-frei bis 302€/Monat", "Portabel bei Jobwechsel", "BU integrierbar"],
    target: "Angestellte",
    features: [
      { title: "Arbeitgeberzuschuss gesichert", description: "Ihr Arbeitgeber muss mindestens 15% Zuschuss auf die Entgeltumwandlung zahlen – gesetzlich vorgeschrieben" },
      { title: "Brutto-Sparen", description: "Beiträge werden vom Bruttoeinkommen abgezogen – Sie sparen Steuern und Sozialabgaben" },
      { title: "Portabilität garantiert", description: "Bei Arbeitgeberwechsel nehmen Sie Ihren Vertrag einfach mit" }
    ],
    benefits: [
      { title: "Steuerfreie Einzahlung", description: "Bis zu 302€/Monat steuer- und sozialabgabenfrei einzahlen" },
      { title: "15% Arbeitgeberzuschuss", description: "Gesetzlich vorgeschriebener Mindestzuschuss vom Chef" },
      { title: "BU-Absicherung integrierbar", description: "Berufsunfähigkeitsschutz steuerlich gefördert einschließen" },
      { title: "Lebenslange Rente oder Kapital", description: "Flexible Auszahlung im Rentenalter" },
      { title: "Arbeitgeberwechsel problemlos", description: "Vertrag wird einfach zum neuen Arbeitgeber übertragen" },
      { title: "Hinterbliebenenversorgung", description: "Absicherung der Familie optional möglich" }
    ],
    questions: [
      { type: "radio" as const, question: "Bietet Ihr Arbeitgeber bereits eine bAV an?", name: "employer_bav", options: ["Ja, möchte wechseln/ergänzen", "Nein, möchte starten", "Bin nicht sicher"] },
      { type: "select" as const, question: "Wie viel möchten Sie monatlich einzahlen?", name: "monthly_amount", options: ["50-100€", "100-200€", "200-302€", "Über 302€"] }
    ]
  },
  {
    id: "risiko-leben",
    icon: Shield,
    iconColor: "text-red-600",
    bgColor: "bg-red-50",
    name: "ERGO Risikolebensversicherung",
    short: "Finanzielle Absicherung Ihrer Familie im Todesfall. 3 Tarifvarianten: Grundschutz, Komfort, Premium.",
    highlights: ["Ab 1,97€/Monat", "Focus Money: Hervorragend", "Kinderschutz Plus (Premium)", "Nachversicherungsgarantie"],
    target: "Familien & Immobilienbesitzer",
    features: [
      { title: "Bezahlbarer Familienschutz", description: "100.000€ Todesfallleistung bereits ab 1,97€ monatlich – günstige Absicherung für Ihre Liebsten" },
      { title: "Vorgezogene Todesfallleistung", description: "Auszahlung bereits bei schwerer, unheilbarer Erkrankung – schon ab dem Grundtarif" },
      { title: "Kinderschutz Plus (Premium)", description: "Monatliche Waisenrente: 250€ für Halbwaisen, 500€ für Vollwaisen bis zum 18. Geburtstag" }
    ],
    benefits: [
      { title: "3 Tarifvarianten", description: "Grundschutz, Komfort oder Premium – passend zu Ihrem Budget" },
      { title: "Steuerfreie Auszahlung", description: "Die Todesfallleistung ist für Ihre Familie einkommensteuerfrei" },
      { title: "Nachversicherungsgarantie", description: "Erhöhung ohne erneute Gesundheitsprüfung bei Heirat, Geburt oder Immobilienkauf" },
      { title: "Flexible Versicherungssumme", description: "50.000 bis 300.000€ frei wählbar" },
      { title: "Konstant oder fallend", description: "Konstante, linear oder annuitätisch fallende Summe – ideal zur Kreditabsicherung" },
      { title: "Focus Money: Hervorragend", description: "Top-Bewertung in der Kategorie Serviceversicherer (Heft 43/2025)" }
    ],
    questions: [
      { type: "radio" as const, question: "Warum möchten Sie eine Risikolebensversicherung?", name: "reason", options: ["Familienabsicherung", "Immobilienkredit absichern", "Geschäftspartner absichern", "Sonstiges"] },
      { type: "select" as const, question: "Welche Versicherungssumme schwebt Ihnen vor?", name: "sum", options: ["50.000-100.000€", "100.000-200.000€", "200.000-300.000€", "Höher – bitte beraten"] }
    ]
  },
  {
    id: "bu-versicherung",
    icon: Umbrella,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
    name: "ERGO Berufsunfähigkeitsversicherung",
    short: "Sichern Sie Ihr wichtigstes Kapital: Ihre Arbeitskraft. Jeder Vierte wird im Berufsleben berufsunfähig.",
    highlights: ["Kein Verweis auf andere Berufe", "Ab 6 Monate Prognose", "Komfort & Premium Tarife", "Weltweiter Schutz"],
    target: "Alle Berufstätigen",
    features: [
      { title: "Kein Berufsverweis", description: "Sie werden nicht auf einen anderen Beruf verwiesen – Ihre konkrete Tätigkeit zählt" },
      { title: "Schnelle Leistung", description: "BU-Rente bereits ab einer Prognose von 6 Monaten – nicht erst bei dauerhafter Berufsunfähigkeit" },
      { title: "Weltweiter Schutz", description: "Versicherungsschutz gilt weltweit – auch bei Auslandsaufenthalt oder Auswanderung" }
    ],
    benefits: [
      { title: "Komfort- und Premium-Tarif", description: "Zwei Leistungsstufen für individuellen Schutz" },
      { title: "Nachversicherungsgarantie", description: "Erhöhung ohne erneute Gesundheitsprüfung bei wichtigen Lebensereignissen" },
      { title: "Beitragsbefreiung im Leistungsfall", description: "Keine Beitragszahlung während Sie BU-Rente erhalten" },
      { title: "Dynamische Anpassung", description: "Automatische Erhöhung zum Inflationsschutz" },
      { title: "Überbrückungshilfe", description: "Soforthilfe bei plötzlicher Berufsunfähigkeit" },
      { title: "Für alle Berufe", description: "Vom Handwerker bis zum Akademiker – individuelle Beitragsberechnung" }
    ],
    questions: [
      { type: "radio" as const, question: "In welchem Bereich arbeiten Sie?", name: "occupation_area", options: ["Büro/Verwaltung", "Handwerk/Produktion", "Gesundheit/Pflege", "Selbstständig/Freiberufler"] },
      { type: "select" as const, question: "Welche monatliche BU-Rente benötigen Sie?", name: "bu_monthly", options: ["500-1.000€", "1.000-1.500€", "1.500-2.000€", "Über 2.000€"] }
    ]
  },
  {
    id: "body-protect",
    icon: Heart,
    iconColor: "text-pink-600",
    bgColor: "bg-pink-50",
    name: "ERGO Body Protect",
    short: "Grundfähigkeitsversicherung – die clevere und günstigere Alternative zur BU. Bis zu 40 versicherte Fähigkeiten.",
    highlights: ["Günstiger als BU", "Weniger Gesundheitsfragen", "3 Tarife: Basis/Komfort/Premium", "Sport Plus einmalig am Markt"],
    target: "Handwerker & körperlich Tätige",
    features: [
      { title: "Deutlich günstiger als BU", description: "Grundfähigkeitsschutz zu einem Bruchteil der BU-Kosten – ideal für preisbewusste Kunden" },
      { title: "Weniger Gesundheitsfragen", description: "Einfachere Antragstellung – auch mit Vorerkrankungen oft möglich" },
      { title: "Sport Plus – einmalig am Markt", description: "Absicherung Ihrer sportlichen Fähigkeiten: Koordination, Gelenkbeweglichkeit, Herz-Kreislauf" }
    ],
    benefits: [
      { title: "Bis zu 40 versicherte Fähigkeiten", description: "Sehen, Hören, Gehen, Greifen, Treppensteigen und viele mehr" },
      { title: "3 Tarifvarianten", description: "Grundschutz (körperlich), Komfort (+erweitert), Premium (+kognitiv)" },
      { title: "Psyche Plus Baustein", description: "Leistung bei psychischen Erkrankungen wie Depression oder PTBS" },
      { title: "Pflege Plus Baustein", description: "Verdopplung der Leistung bei Pflegebedürftigkeit – lebenslang" },
      { title: "Umwandlungsoption zur BU", description: "Später zur ERGO BU wechseln – ohne erneute Gesundheitsprüfung" },
      { title: "Berufsunabhängig", description: "Schutz für jeden – Angestellte, Selbstständige, Studierende, Hausfrauen/-männer" }
    ],
    questions: [
      { type: "radio" as const, question: "Warum interessieren Sie sich für Body Protect?", name: "reason_bp", options: ["Günstiger als BU", "Vorerkrankungen (BU schwierig)", "Ergänzung zur bestehenden BU", "Sport-Absicherung"] },
      { type: "radio" as const, question: "Sind Sie körperlich oder geistig tätig?", name: "work_type", options: ["Überwiegend körperlich", "Überwiegend geistig", "Beides gemischt"] }
    ]
  },
  {
    id: "sterbegeld",
    icon: Users,
    iconColor: "text-gray-600",
    bgColor: "bg-gray-100",
    name: "ERGO Sterbegeldversicherung",
    short: "Entlasten Sie Ihre Angehörigen von den finanziellen Belastungen einer Bestattung. Ohne Gesundheitsfragen.",
    highlights: ["Keine Gesundheitsfragen", "Bis 20.000€ Versicherungssumme", "Doppelte Summe bei Unfall", "3 Tarifvarianten"],
    target: "Ältere Kunden & Familien",
    features: [
      { title: "Keine Gesundheitsfragen", description: "Garantierte Aufnahme ohne Gesundheitsprüfung – für alle von 40 bis 85 Jahre" },
      { title: "Doppelte Leistung bei Unfall", description: "Bei Unfalltod wird die doppelte Versicherungssumme ausgezahlt – sofort, auch in der Wartezeit" },
      { title: "Flex-Option", description: "Auszahlung zu Lebzeiten am Ende der Beitragszahlungsdauer möglich" }
    ],
    benefits: [
      { title: "3 Tarifvarianten", description: "Grundschutz (bis 15.000€), Komfort und Premium (bis 20.000€)" },
      { title: "Schnelle Auszahlung", description: "Unbürokratische Leistung im Trauerfall" },
      { title: "Konstante Beiträge", description: "Der Beitrag bleibt über die gesamte Laufzeit gleich" },
      { title: "Sofortschutz bei Unfalltod", description: "Volle Leistung ab Tag 1 bei Unfall" },
      { title: "Sterbevorsorge-Service", description: "Kostenloser Ordner, telefonische Rechtsberatung, Bestatter-Empfehlungen" },
      { title: "Dynamik optional", description: "Jährliche automatische Anpassung der Versicherungssumme wählbar" }
    ],
    additionalInfo: "Durchschnittliche Bestattungskosten: Erdbestattung ca. 8.000€, Feuerbestattung ca. 6.000€, Seebestattung ca. 4.000€. Eine Sterbegeldversicherung verhindert, dass Ihre Angehörigen diese Kosten tragen müssen.",
    questions: [
      { type: "radio" as const, question: "Welche Bestattungsart bevorzugen Sie?", name: "burial_type", options: ["Erdbestattung", "Feuerbestattung", "Seebestattung", "Noch nicht entschieden"] },
      { type: "select" as const, question: "Welche Versicherungssumme möchten Sie?", name: "sterbegeld_sum", options: ["3.000-5.000€", "5.000-10.000€", "10.000-15.000€", "15.000-20.000€"] }
    ]
  }
];

const comparisonData = [
  { label: "Anlageform", chance: "Fondsgebunden", balance: "Mischanlage (Fonds + Sicherung + Index)", index: "Indexbeteiligung" },
  { label: "Fondsauswahl", chance: "Bis zu 20 Fonds", balance: "Bis zu 20 Fonds + Index", index: "MSCI World / Munich Re Index" },
  { label: "Beitragsgarantie", chance: false, balance: true, index: true },
  { label: "Partizipationsrate", chance: "100% Fondsperformance", balance: "Variabel", index: "30% (MSCI) / 105% (Munich Re)" },
  { label: "Mindestbeitrag", chance: "25€/Monat", balance: "25€/Monat", index: "25€/Monat" },
  { label: "Rating", chance: "FFF+ (Bestnote)", balance: "FFF+ (Bestnote)", index: "FFF+ (Bestnote)" },
  { label: "Zielgruppe", chance: "Renditeorientierte", balance: "Flexible Anleger", index: "Sicherheitsbewusste" }
];

const faqs = [
  {
    id: "rente-alter",
    question: "Ab wann kann ich in Rente gehen?",
    answer: "Bei der privaten Rentenversicherung können Sie den Rentenbeginn flexibel wählen – frühestens ab dem 62. Lebensjahr. Je länger Sie einzahlen, desto höher fällt Ihre monatliche Rente aus. Eine vorzeitige Kapitalauszahlung ist unter bestimmten Bedingungen ebenfalls möglich."
  },
  {
    id: "beitrag-pause",
    question: "Was passiert, wenn ich den Beitrag nicht mehr zahlen kann?",
    answer: "Bei finanziellen Engpässen gibt es flexible Lösungen: Beitragsfreistellung (der Vertrag läuft beitragsfrei weiter), Beitragsreduzierung oder vorübergehende Stundung. Ihr angespartes Kapital bleibt in jedem Fall erhalten."
  },
  {
    id: "ergo-vs-etf",
    question: "Warum ERGO Rentenversicherung statt ETF-Depot?",
    answer: "Die ERGO Rentenversicherung bietet steuerliche Vorteile, die ein ETF-Depot nicht hat: Fondswechsel sind steuerfrei, bei Auszahlung als Rente wird nur der geringe Ertragsanteil besteuert, und bei Kapitalauszahlung gilt das Halbeinkünfteverfahren. Zudem bietet die Versicherung eine lebenslange Rente – das Langlebigkeitsrisiko ist abgesichert."
  },
  {
    id: "bu-wichtig",
    question: "Brauche ich eine Berufsunfähigkeitsversicherung?",
    answer: "Statistisch wird jeder Vierte im Lauf des Berufslebens berufsunfähig. Die staatliche Erwerbsminderungsrente reicht bei weitem nicht aus, um den Lebensstandard zu halten. Eine BU-Versicherung ist daher für jeden Berufstätigen dringend empfohlen – je früher Sie abschließen, desto günstiger."
  },
  {
    id: "body-vs-bu",
    question: "Was ist der Unterschied zwischen Body Protect und BU?",
    answer: "Die BU zahlt, wenn Sie Ihren konkreten Beruf nicht mehr ausüben können. Body Protect zahlt, wenn Sie bestimmte Grundfähigkeiten (Sehen, Gehen, Greifen etc.) verlieren – unabhängig vom Beruf. Body Protect ist deutlich günstiger und hat weniger Gesundheitsfragen. Ideal als Alternative oder Ergänzung zur BU."
  },
  {
    id: "chance-balance-index",
    question: "Was ist der Unterschied zwischen Chance, Balance und Index?",
    answer: "Chance ist rein fondsgebunden mit maximalen Renditechancen, aber ohne Beitragsgarantie. Balance kombiniert Fonds, Sicherungsvermögen und Indexbeteiligung mit 100% Beitragsgarantie. Index partizipiert am MSCI World oder Munich Re Index – Gewinne werden jährlich gesichert, Verluste auf den Beitrag sind ausgeschlossen."
  },
  {
    id: "steuer-ruerup",
    question: "Wie funktioniert die steuerliche Förderung bei der Rürup-Rente?",
    answer: "Bei der Basis-Rente (Rürup) können Sie 2025 bis zu 27.565€ pro Jahr (bei Verheirateten 55.130€) zu 100% als Sonderausgaben von der Steuer absetzen. Die spätere Rente wird nachgelagert besteuert – in der Regel zu einem deutlich niedrigeren Steuersatz als im Berufsleben."
  },
  {
    id: "sterbegeld-kosten",
    question: "Wie hoch sind durchschnittliche Bestattungskosten?",
    answer: "Eine Erdbestattung kostet durchschnittlich ca. 8.000€, eine Feuerbestattung ca. 6.000€ und eine Seebestattung ca. 4.000€. Dazu kommen oft noch Grabpflege, Trauerfeier und weitere Nebenkosten. Ohne Sterbegeldversicherung tragen Ihre Angehörigen diese Kosten."
  }
];

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
  { label: 'Zahnzusatz', icon: '🦷', type: 'zahnzusatz', source: 'hero_quiz' },
  { label: 'Berufsunfähigkeit', icon: '💼', type: 'bu', source: 'hero_quiz' },
  { label: 'Gewerbe & Betrieb', icon: '🏢', type: 'gewerbe', source: 'lp_gewerbe' },
  { label: 'Alle prüfen', icon: '✅', type: 'all', source: 'hero_quiz' },
];

const QUIZ_TO_PRODUCT: Record<string, string> = {
  kfz: 'kfz',
  hausrat: 'hausrat',
  zahnzusatz: 'zahnzusatz',
  bu: 'bu-versicherung',
  gewerbe: 'gewerbe',
};

const PRODUCT_TO_FUNNEL_TYPE: Record<string, string> = {
  'bu-versicherung': 'berufsunfaehigkeit',
};

const QUIZ_PRODUCT_TO_LABEL: Record<string, string> = {
  kfz: 'Kfz-Versicherung',
  hausrat: 'Hausrat & Haftpflicht',
  zahnzusatz: 'Zahnzusatz',
  'bu-versicherung': 'Berufsunfähigkeit',
  berufsunfaehigkeit: 'Berufsunfähigkeit',
  gewerbe: 'Gewerbe & Betrieb',
};

export default function LebenVorsorge() {
  const [funnelOpen, setFunnelOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>("private-rente");
  const [openProduct, setOpenProduct] = useState<string | null>(null);
  useEffect(() => {
    trackEvent("leben_vorsorge_page_view", { page: "leben-vorsorge" });
  }, []);

  const handleStartFunnel = (productId?: string | null) => {
    if (productId === null) {
      setSelectedProduct(undefined);
    } else if (productId !== undefined) {
      setSelectedProduct(productId);
    }
    setFunnelOpen(true);
    trackEvent("funnel_started", { insurance_type: "leben-vorsorge", product: productId || "general" });
  };

  const closeFunnel = () => {
    setFunnelOpen(false);
    setSelectedProduct("private-rente");
  };

  const toggleProduct = (id: string) => {
    setOpenProduct(openProduct === id ? null : id);
  };

  return (
    <>
      <SEO
        title="Leben & Vorsorge – Private Altersvorsorge & Absicherung | ERGO Agentur Stübe Ganderkesee"
        description="Private Rentenversicherung, Berufsunfähigkeit, Risikoleben & betriebliche Altersvorsorge bei ERGO. Persönliche Beratung von Morino Stübe in Ganderkesee, Delmenhorst und Oldenburg."
        keywords="Leben Vorsorge, Private Rentenversicherung, Altersvorsorge, Berufsunfähigkeitsversicherung, Risikolebensversicherung, Rürup Rente, betriebliche Altersvorsorge, Body Protect, Sterbegeldversicherung, ERGO Ganderkesee, Morino Stübe"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Leben & Vorsorge – ERGO Agentur Stübe",
          "description": "Private Rentenversicherung, Berufsunfähigkeit, Risikoleben & betriebliche Altersvorsorge bei ERGO Ganderkesee",
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
            "description": "Kostenlose Analyse bestehender Verträge und persönliche Beratung zu Altersvorsorge & Absicherung",
            "availability": "https://schema.org/InStock"
          },
          "areaServed": [
            { "@type": "City", "name": "Ganderkesee" },
            { "@type": "City", "name": "Delmenhorst" },
            { "@type": "City", "name": "Oldenburg" }
          ]
        }}
        additionalStructuredData={[{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        }]}
      />
      <Breadcrumb items={[
        { label: "Versicherungen", href: "/" },
        { label: "Leben & Vorsorge" }
      ]} />
      <main className="min-h-screen pb-16 sm:pb-0">
        {/* Hero Section */}
        <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-[#003781] via-[#004fa0] to-[#001f5c] text-white relative overflow-hidden">
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
                  Leben & Vorsorge –{' '}
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    Ihre Zukunft gut abgesichert
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  className="text-base sm:text-lg text-white/90 max-w-xl mx-auto lg:mx-0 mb-3 leading-relaxed"
                >
                  Von der privaten Altersvorsorge über Berufsunfähigkeit bis zur Risikolebensversicherung – persönliche Beratung vom Experten.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                  className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-white/80 mb-2"
                >
                  <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-green-300" /> 7 Produktlinien</span>
                  <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-green-300" /> FFF+ Bestnote</span>
                  <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-green-300" /> Steuervorteile sichern</span>
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
                      const isPreSelected = opt.type === 'bu';
                      const isAll = opt.type === 'all';
                      return (
                        <button
                          key={opt.type}
                          onClick={() => {
                            trackEvent('quiz_option_clicked', { option: opt.type, source: opt.source, page: 'leben-vorsorge' });
                            handleStartFunnel(isAll ? null : QUIZ_TO_PRODUCT[opt.type]);
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
                      href="https://wa.me/4915566771019?text=Hallo%20Herr%20St%C3%BCbe%2C%20ich%20m%C3%B6chte%20mich%20zum%20Thema%20Leben%20%26%20Vorsorge%20kostenlos%20beraten%20lassen."
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => { trackEvent('whatsapp_clicked', { source: 'leben_hero_quiz' }); trackConversion(); }}
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

        {/* Products Overview */}
        <motion.section {...fadeInUp} className="py-12 sm:py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-high-contrast mb-3 sm:mb-4 px-2 leading-tight">
                7 starke Lösungen für Ihre Zukunft
              </h2>
              <p className="text-sm sm:text-base lg:text-xl text-medium-contrast text-readable px-2">
                Von der Altersvorsorge bis zur Absicherung – ERGO bietet für jede Lebensphase das passende Produkt
              </p>
            </div>

            <div className="space-y-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden border-gray-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-start gap-4">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 ${product.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <product.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${product.iconColor}`} />
                        </div>
                        <div className="flex-1 w-full">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900">{product.name}</h3>
                            <Badge className="bg-blue-100 text-blue-800 text-xs self-start">{product.target}</Badge>
                          </div>
                          <p className="text-sm sm:text-base text-gray-600 mb-4">{product.short}</p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {product.highlights.map((h, i) => (
                              <span key={i} className="inline-flex items-center gap-1 text-xs sm:text-sm bg-green-50 text-green-700 px-2.5 py-1 rounded-full border border-green-200">
                                <Check className="w-3 h-3 flex-shrink-0" />
                                {h}
                              </span>
                            ))}
                          </div>

                          {/* Feature Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                            {product.features.map((feature, i) => (
                              <div key={i} className="bg-gray-50 rounded-lg p-3">
                                <h4 className="font-semibold text-sm text-gray-900 mb-1">{feature.title}</h4>
                                <p className="text-xs text-gray-600 leading-relaxed">{feature.description}</p>
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                              className="bg-ergo-red hover:bg-ergo-red-hover text-white font-bold flex-1"
                              onClick={() => {
                                trackEvent('product_cta_clicked', { product: product.id, source: 'product_card' });
                                handleStartFunnel(product.id);
                              }}
                            >
                              Kostenlose Beratung anfordern
                            </Button>
                            <Button
                              variant="outline"
                              className="border-gray-300 text-gray-700 hover:bg-gray-50"
                              onClick={() => toggleProduct(product.id)}
                            >
                              {openProduct === product.id ? "Weniger anzeigen" : "Alle Details"}
                              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${openProduct === product.id ? "rotate-180" : ""}`} />
                            </Button>
                            <Button
                              variant="outline"
                              className="border-green-300 text-green-700 hover:bg-green-50"
                              onClick={() => {
                                trackEvent('product_whatsapp_clicked', { product: product.id });
                                const whatsappUrl = 'https://wa.me/4915566771019?text=' + encodeURIComponent(`Hallo Herr Stübe, ich interessiere mich für die ${product.name} und möchte mich kostenlos beraten lassen.`);
                                trackAppointmentConversion(whatsappUrl);
                              }}
                            >
                              <MessageCircle className="w-4 h-4 mr-1" />
                              WhatsApp
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <div className={`overflow-hidden transition-all duration-300 ${openProduct === product.id ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"}`}>
                      <div className="border-t bg-gray-50 p-4 sm:p-6">
                        {product.detailSections && (
                          <div className="mb-6">
                            <h4 className="font-bold text-base text-gray-900 mb-3">Die 3 Produktfamilien</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {product.detailSections.map((section, i) => (
                                <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                                  <h5 className="font-bold text-sm mb-2">{section.title}</h5>
                                  <p className="text-xs text-gray-600 leading-relaxed">{section.text}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <h4 className="font-bold text-base text-gray-900 mb-3">Alle Leistungen im Detail</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                          {product.benefits.map((benefit, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                              <div>
                                <h5 className="font-semibold text-sm text-gray-900">{benefit.title}</h5>
                                <p className="text-xs text-gray-600">{benefit.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {product.steuerInfo && (
                          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                            <h4 className="font-bold text-sm text-blue-800 mb-2">Steuervorteile</h4>
                            <p className="text-sm text-blue-700 leading-relaxed">{product.steuerInfo}</p>
                          </div>
                        )}

                        {product.additionalInfo && (
                          <div className="bg-amber-50 rounded-lg p-4 mb-6 border border-amber-200">
                            <p className="text-sm text-amber-800 leading-relaxed">{product.additionalInfo}</p>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            className="bg-ergo-red hover:bg-ergo-red-hover text-white font-bold"
                            onClick={() => {
                              trackEvent('product_detail_cta_clicked', { product: product.id });
                              handleStartFunnel(product.id);
                            }}
                          >
                            Jetzt kostenlos beraten lassen
                          </Button>
                          <Button
                            variant="outline"
                            className="border-green-300 text-green-700 hover:bg-green-50"
                            onClick={() => {
                              const whatsappUrl = 'https://wa.me/4915566771019?text=' + encodeURIComponent(`Hallo Herr Stübe, ich habe mir die ${product.name} angeschaut und hätte gerne eine persönliche Beratung. Können Sie mich zurückrufen?`);
                              trackAppointmentConversion(whatsappUrl);
                            }}
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Rückruf vereinbaren
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Comparison Table - Renten-Produktfamilien */}
        <motion.section {...fadeInUp} className="py-12 sm:py-16 bg-ergo-gray">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-2 leading-tight">
                Die 3 Renten-Produktfamilien im Vergleich
              </h2>
              <p className="text-sm sm:text-base lg:text-xl text-gray-700 px-2">
                Chance vs. Balance vs. Index – finden Sie Ihre passende Strategie
              </p>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
                <thead>
                  <tr>
                    <th className="text-left p-4 bg-gray-50"></th>
                    <th className="p-4 bg-ergo-red text-white text-center font-bold">Chance</th>
                    <th className="p-4 bg-ergo-dark text-white text-center font-bold">Balance</th>
                    <th className="p-4 bg-ergo-red text-white text-center font-bold">Index</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-4 font-semibold text-gray-900 text-sm">{row.label}</td>
                      {(["chance", "balance", "index"] as const).map((col) => (
                        <td key={col} className="p-4 text-center text-sm">
                          {typeof row[col] === "boolean" ? (
                            row[col] ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-red-400 mx-auto" />
                            )
                          ) : (
                            <span className="text-gray-700">{row[col]}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {[
                { key: "chance" as const, title: "Chance", color: "border-ergo-red", bg: "bg-ergo-red" },
                { key: "balance" as const, title: "Balance", color: "border-gray-800", bg: "bg-ergo-dark" },
                { key: "index" as const, title: "Index", color: "border-ergo-red", bg: "bg-ergo-red" }
              ].map((variant) => (
                <div key={variant.key} className={`border-l-4 ${variant.color} bg-white rounded-lg shadow-sm p-5`}>
                  <h3 className="font-bold text-lg mb-3">{variant.title}</h3>
                  <div className="space-y-2">
                    {comparisonData.map((row, i) => (
                      <div key={i} className="flex justify-between items-center text-sm py-1 border-b border-gray-100 last:border-0">
                        <span className="text-gray-600">{row.label}</span>
                        <span className="font-medium text-gray-900 text-right ml-4">
                          {typeof row[variant.key] === "boolean" ? (
                            row[variant.key] ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <X className="w-4 h-4 text-red-400" />
                            )
                          ) : (
                            <span className="text-xs">{row[variant.key]}</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button
                size="lg"
                className="bg-ergo-red hover:bg-ergo-red-hover text-white font-bold px-8 py-4"
                onClick={() => {
                  trackEvent('comparison_cta_clicked', { source: 'comparison_table' });
                  handleStartFunnel("private-rente");
                }}
              >
                Welche Strategie passt zu mir? Kostenlos beraten lassen
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Steuervorteile Section */}
        <motion.section {...fadeInUp} className="py-12 sm:py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-2 leading-tight">
                Steuervorteile: ETF-Depot vs. ERGO Rentenversicherung
              </h2>
              <p className="text-sm sm:text-base lg:text-xl text-gray-700 px-2">
                Warum die Rentenversicherung steuerlich oft die klügere Wahl ist
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <TrendingUp className="w-8 h-8 text-gray-400" />
                    <h3 className="text-lg font-bold text-gray-900">ETF-Depot</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "Fondswechsel löst Kapitalertragssteuer aus (ca. 26,4%)",
                      "Jährliche Vorabpauschale auf Erträge",
                      "Kein Langlebigkeitsschutz – Kapital kann aufgebraucht werden",
                      "Volle Besteuerung der Gewinne bei Entnahme"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-ergo-red">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <Star className="w-8 h-8 text-ergo-red" />
                    <h3 className="text-lg font-bold text-ergo-red">ERGO Rentenversicherung</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      ["Fondswechsel steuerfrei", "beliebig oft umschichten ohne Kapitalertragssteuer"],
                      ["Ertragsanteilbesteuerung", "nur geringer Anteil der Rente wird besteuert"],
                      ["Halbeinkünfteverfahren", "nur 50% der Erträge steuerpflichtig (ab 62, nach 12 Jahren)"],
                      ["Lebenslange Rente", "Langlebigkeitsrisiko abgesichert – garantierte Zahlung"]
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700"><strong>{item[0]}</strong> – {item[1]}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.section>

        {/* Expert Section – Glassmorphism */}
        <motion.section {...fadeInUp} className="px-4 pb-10 md:pb-16 max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-6">Ihr Versicherungsexperte</h2>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/60 p-5 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E2001A] via-[#003781] to-[#E2001A] rounded-t-2xl" />
            <div className="flex flex-col items-center text-center gap-5 md:flex-row md:text-left md:items-start">
              <motion.img
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                src={beraterPhoto}
                alt="Morino Stübe - ERGO Versicherungsfachmann in Ganderkesee"
                className="w-32 h-40 md:w-40 md:h-52 rounded-2xl object-contain border-[3px] border-ergo-red shadow-lg shrink-0 bg-white"
                loading="lazy"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1 md:text-2xl">Morino Stübe</h3>
                <p className="text-ergo-red font-semibold text-sm mb-3 md:text-base">ERGO Versicherungsfachmann · Leben & Vorsorge Spezialist</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 md:text-base">
                  Ich berate Sie persönlich und transparent zu allen Fragen rund um Altersvorsorge und Absicherung – von der privaten Rente über Berufsunfähigkeit bis zur Risikolebensversicherung.
                </p>
                <div className="flex flex-col gap-2 text-xs text-gray-500 md:text-sm">
                  <span className="flex items-center justify-center md:justify-start gap-1.5">
                    <Shield className="w-4 h-4 text-ergo-red shrink-0" />
                    Vermittlerregister-Nr. D-5H7J-7DUI1-10
                  </span>
                  <span className="flex items-center justify-center md:justify-start gap-1.5">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 shrink-0" />
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

        <TrustBar />

        <FAQSection
          title="Häufige Fragen zu Leben & Vorsorge"
          subtitle="Weitere Fragen? Kontaktieren Sie uns direkt – Morino Stübe berät Sie persönlich in Ganderkesee, Delmenhorst und Oldenburg."
          faqs={faqs.map(f => ({ question: f.question, answer: f.answer }))}
          className="bg-ergo-gray"
        />

        {/* Final CTA Section */}
        <motion.section {...fadeInUp} className="py-12 sm:py-16 bg-gradient-to-r from-ergo-red to-red-700 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 px-2 leading-tight">
              Kostenlose Analyse Ihrer Altersvorsorge!
            </h2>
            <p className="text-sm sm:text-base lg:text-xl mb-6 sm:mb-8 px-2 text-white/90">
              <strong>Immer kostenlos:</strong> Vollständige Analyse Ihrer Altersvorsorge und Absicherung.
              <strong> Persönliche Beratung durch Ihren ERGO-Experten vor Ort.</strong>
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  onClick={() => {
                    trackEvent('final_cta_clicked', { insurance_type: 'leben-vorsorge', source: 'bottom_section', value: 15 });
                    handleStartFunnel();
                  }}
                >
                  KOSTENLOSE BERATUNG STARTEN
                </Button>
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-lg font-bold"
                  onClick={() => {
                    trackEvent('final_whatsapp_clicked', { insurance_type: 'leben-vorsorge', source: 'bottom_section' });
                    const whatsappUrl = 'https://wa.me/4915566771019?text=' + encodeURIComponent('Hallo Herr Stübe, ich möchte mich zum Thema Leben & Vorsorge kostenlos beraten lassen. Welche Produkte empfehlen Sie mir?');
                    trackAppointmentConversion(whatsappUrl);
                  }}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Sofortige WhatsApp Beratung
                </Button>
              </div>
              <p className="text-sm font-medium mt-3 text-white/80">
                Kostenlose Analyse - Optimierung bestehender Verträge - Persönliche Beratung vom Experten
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-medium text-white/80">
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
              setFunnelOpen(true);
              trackEvent('sticky_cta_clicked', { source: 'leben_vorsorge' });
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#E2001A] to-[#c5001a] text-white font-semibold text-sm min-h-[44px] py-3 rounded-xl whitespace-nowrap shadow-lg shadow-red-500/20 animate-pulse-subtle"
          >
            <Mail className="w-4 h-4 shrink-0" />
            Kostenlose Beratung
          </button>
          <a
            href="https://wa.me/4915566771019"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackConversion()}
            className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold text-sm px-4 min-h-[44px] py-3 rounded-xl active:scale-[0.97] transition-transform whitespace-nowrap"
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            WhatsApp
          </a>
        </div>

        <FunnelOverlay
          isOpen={funnelOpen}
          onClose={closeFunnel}
          insuranceType={(selectedProduct && (PRODUCT_TO_FUNNEL_TYPE[selectedProduct] ?? selectedProduct)) || 'leben-vorsorge'}
          insuranceLabel={selectedProduct ? (products.find(p => p.id === selectedProduct)?.name ?? QUIZ_PRODUCT_TO_LABEL[selectedProduct] ?? 'Leben & Vorsorge') : 'Leben & Vorsorge'}
        />
      </main>
    </>
  );
}
