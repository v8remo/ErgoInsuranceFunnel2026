import { useState } from "react";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { ChevronDown, Phone, MessageCircle, Check, X } from "lucide-react";

const products = [
  {
    id: "private-rente",
    icon: "🏦",
    name: "ERGO Private Rentenversicherung",
    short: "3 Produktfamilien für Ihre private Altersvorsorge – von renditeorientiert bis sicherheitsbewusst",
    highlights: ["Ab 25€/Monat", "Steuervorteile", "FFF+ Bestnote", "Flexible Auszahlung"],
    target: "Alle Altersgruppen",
    details: {
      description: "Die ERGO Private Rentenversicherung bietet Ihnen drei maßgeschneiderte Produktfamilien: Chance, Balance und Index. So finden Sie genau die Lösung, die zu Ihrer Risikobereitschaft und Ihren Zielen passt.",
      features: [
        "Wahl zwischen 3 Anlagestrategien",
        "Lebenslange Rentenzahlung garantiert",
        "Kapitalentnahme oder Verrentung möglich",
        "Hinterbliebenenabsicherung optional",
        "Beitragsbefreiung bei BU möglich",
        "FFF+ Bestnote von Franke & Bornberg"
      ],
      audience: "Für alle, die privat für das Alter vorsorgen möchten – egal ob Berufseinsteiger oder erfahrene Sparer.",
      subSections: [
        { title: "🚀 Chance", text: "Fondsgebunden, bis zu 20 Fonds wählbar, maximale Renditechancen, keine Beitragsgarantie." },
        { title: "⚖️ Balance", text: "Mischung aus Sicherheit und Rendite, Beitragsgarantie zum Rentenbeginn, geringeres Risiko." },
        { title: "📊 Index", text: "Partizipation am EURO STOXX 50 Index, jährliche Sicherung der Gewinne, kein Verlustrisiko auf den Beitrag." }
      ],
      gemeinsam: ["Steuerlich begünstigte Auszahlung", "Flexible Zuzahlungen möglich", "Rentengarantiezeit wählbar", "Hinterbliebenenschutz optional"],
      steuervorteile: "In der Ansparphase sind Fondswechsel steuerfrei. Bei Auszahlung als Rente wird nur der Ertragsanteil besteuert. Bei Kapitalauszahlung nach 12 Jahren und ab 62 gilt das Halbeinkünfteverfahren."
    }
  },
  {
    id: "zukunfts-rente",
    icon: "🚀",
    name: "ERGO Zukunfts-Rente Chance",
    short: "Fondsgebundene Rentenversicherung mit modernem Rentenkonzept und ESG-Optionen",
    highlights: ["Bis zu 20 Fonds", "12x/Jahr kostenfrei wechseln", "ESG-Optionen", "Ab 25€/Monat"],
    target: "Junge Sparer",
    details: {
      description: "Die Zukunfts-Rente Chance ist ideal für alle, die auf maximale Renditechancen setzen. Mit bis zu 20 Fonds und nachhaltigen ESG-Optionen investieren Sie modern und flexibel.",
      features: [
        "Bis zu 20 Fonds gleichzeitig besparen",
        "12x pro Jahr kostenfrei Fonds wechseln",
        "Nachhaltige ESG-Fonds verfügbar",
        "Modernes Rentenkonzept mit Ablaufmanagement",
        "Zuzahlungen und Entnahmen flexibel",
        "Online-Depot-Einsicht jederzeit"
      ],
      audience: "Ideal für junge Menschen mit langem Anlagehorizont, die von Aktienmarktchancen profitieren möchten."
    }
  },
  {
    id: "basis-rente",
    icon: "🏛️",
    name: "ERGO Basis-Rente (Rürup)",
    short: "Staatlich geförderte Basisversorgung – Beiträge zu 100% steuerlich absetzbar",
    highlights: ["100% absetzbar", "Lebenslange Rente", "Ab 25€/Monat", "Ideal für Selbstständige"],
    target: "Selbstständige & Gutverdiener",
    details: {
      description: "Die Basis-Rente (Rürup) ist die staatlich geförderte Altersvorsorge für Selbstständige und Gutverdiener. Ihre Beiträge sind zu 100% steuerlich absetzbar – das senkt Ihre Steuerlast sofort.",
      features: [
        "Beiträge 2025 zu 100% absetzbar (max. 27.565€/Jahr)",
        "Lebenslange garantierte Rente",
        "Schutz vor Pfändung und Hartz IV",
        "Kombination mit BU-Absicherung möglich",
        "Wahl zwischen Chance, Balance und Index",
        "Flexible Beitragszahlung"
      ],
      audience: "Perfekt für Selbstständige, Freiberufler und Gutverdiener, die Steuern sparen und gleichzeitig fürs Alter vorsorgen möchten."
    }
  },
  {
    id: "betriebliche-av",
    icon: "🏢",
    name: "ERGO Betriebliche Altersvorsorge",
    short: "Vom Bruttoeinkommen sparen – mit verpflichtendem Arbeitgeberzuschuss",
    highlights: ["Mind. 15% AG-Zuschuss", "Steuerersparnis", "Portabel", "BU integrierbar"],
    target: "Angestellte",
    details: {
      description: "Mit der betrieblichen Altersvorsorge (bAV) sparen Sie direkt vom Bruttoeinkommen – und Ihr Arbeitgeber muss mindestens 15% dazulegen. So bauen Sie effizient Vermögen auf.",
      features: [
        "Mindestens 15% Arbeitgeberzuschuss gesetzlich vorgeschrieben",
        "Beiträge aus dem Bruttoeinkommen (vor Steuern und Sozialabgaben)",
        "Portabilität bei Arbeitgeberwechsel",
        "BU-Absicherung integrierbar",
        "Steuer- und sozialabgabenfreie Einzahlung bis 302€/Monat",
        "Lebenslange Rente oder Kapitalzahlung"
      ],
      audience: "Für alle Angestellten, die vom Bruttoeinkommen sparen und den verpflichtenden Arbeitgeberzuschuss nutzen möchten."
    }
  },
  {
    id: "risiko-leben",
    icon: "🛡️",
    name: "ERGO Risikolebensversicherung",
    short: "Finanzielle Absicherung Ihrer Familie im Todesfall – günstig und flexibel",
    highlights: ["3-5x Jahreseinkommen empfohlen", "Dread-Disease-Baustein", "Nachversicherungsgarantie", "Steuerfrei im Todesfall"],
    target: "Familien & Immobilienbesitzer",
    details: {
      description: "Die Risikolebensversicherung sichert Ihre Familie finanziell ab, falls Ihnen etwas zustößt. Empfohlen wird eine Versicherungssumme vom 3- bis 5-fachen Ihres Jahreseinkommens.",
      features: [
        "Versicherungssumme frei wählbar",
        "Dread-Disease-Baustein: Vorauszahlung bei schwerer Krankheit",
        "Nachversicherungsgarantie bei Lebensereignissen",
        "Auszahlung im Todesfall steuerfrei",
        "Konstante oder fallende Versicherungssumme",
        "Günstige Beiträge ab wenigen Euro pro Monat"
      ],
      audience: "Unverzichtbar für Familien mit Kindern, Immobilienbesitzer mit Kredit und Alleinverdiener."
    }
  },
  {
    id: "bu-versicherung",
    icon: "💼",
    name: "ERGO Berufsunfähigkeitsversicherung",
    short: "Sichern Sie Ihr wichtigstes Kapital: Ihre Arbeitskraft",
    highlights: ["Kein Verweis auf andere Berufe", "Ab 6 Monate Prognose", "Komfort & Premium Tarife", "Für alle Berufe"],
    target: "Alle Berufstätigen",
    details: {
      description: "Jeder Vierte wird im Lauf seines Berufslebens berufsunfähig. Die ERGO BU-Versicherung zahlt eine monatliche Rente, wenn Sie Ihren Beruf aus gesundheitlichen Gründen nicht mehr ausüben können.",
      features: [
        "Kein Verweis auf andere Berufe",
        "Leistung bereits ab 6 Monate Prognose",
        "Komfort- und Premium-Tarif verfügbar",
        "Nachversicherungsgarantie ohne erneute Gesundheitsprüfung",
        "Beitragsbefreiung im Leistungsfall",
        "Weltweiter Versicherungsschutz"
      ],
      audience: "Für alle Berufstätigen – vom Handwerker bis zum Akademiker. Je früher Sie abschließen, desto günstiger die Beiträge."
    }
  },
  {
    id: "body-protect",
    icon: "💪",
    name: "ERGO Body Protect",
    short: "Grundfähigkeitsversicherung – die clevere Alternative zur BU",
    highlights: ["Günstiger als BU", "Weniger Gesundheitsfragen", "3 Tarifvarianten", "Sport/Psyche/Pflege Bausteine"],
    target: "Handwerker & körperlich Tätige",
    details: {
      description: "ERGO Body Protect versichert Ihre körperlichen und geistigen Grundfähigkeiten. Wenn Sie z.B. nicht mehr heben, knien oder Treppen steigen können, erhalten Sie eine monatliche Rente.",
      features: [
        "Deutlich günstiger als klassische BU",
        "Weniger Gesundheitsfragen bei Antragstellung",
        "3 Tarifvarianten: Basis, Komfort, Premium",
        "Zusatzbausteine: Sport, Psyche, Pflege",
        "Leistung bei Verlust von Grundfähigkeiten",
        "Ideal als Ergänzung oder Alternative zur BU"
      ],
      audience: "Besonders geeignet für Handwerker, körperlich Tätige und alle, die eine günstige Alternative zur BU suchen."
    }
  },
  {
    id: "sterbegeld",
    icon: "🕊️",
    name: "ERGO Sterbegeldversicherung",
    short: "Entlasten Sie Ihre Angehörigen – ohne Gesundheitsprüfung",
    highlights: ["Keine Gesundheitsfragen", "Bis 20.000€", "Doppelte Summe bei Unfall", "Schnelle Auszahlung"],
    target: "Ältere Kunden & Familien",
    details: {
      description: "Die Sterbegeldversicherung sorgt dafür, dass Ihre Angehörigen im Trauerfall nicht auch noch finanzielle Sorgen haben. Bestattungskosten von 7.000–10.000€ sind keine Seltenheit.",
      features: [
        "Keine Gesundheitsfragen bei Antragstellung",
        "Versicherungssumme bis 20.000€",
        "Doppelte Auszahlung bei Unfalltod",
        "Schnelle und unbürokratische Auszahlung",
        "Beiträge bleiben konstant",
        "Sofortiger Schutz bei Unfalltod"
      ],
      audience: "Für alle, die ihre Familie von den finanziellen Belastungen einer Bestattung entlasten möchten."
    }
  }
];

const comparisonData = [
  { label: "Anlageform", chance: "Fondsgebunden", balance: "Mischanlage", index: "Indexbeteiligung" },
  { label: "Fondsauswahl", chance: "Bis zu 20 Fonds", balance: "Vordefinierte Mischung", index: "EURO STOXX 50" },
  { label: "Beitragsgarantie", chance: false, balance: true, index: true },
  { label: "Indexbeteiligung", chance: false, balance: false, index: true },
  { label: "Mindestbeitrag", chance: "25€/Monat", balance: "25€/Monat", index: "25€/Monat" },
  { label: "Rating", chance: "FFF+ (Bestnote)", balance: "FFF+ (Bestnote)", index: "FFF+ (Bestnote)" },
  { label: "Zielgruppe", chance: "Renditeorientierte", balance: "Sicherheitsbewusste", index: "Chancenorientierte" }
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
    question: "Warum ERGO statt ETF-Depot?",
    answer: "Die ERGO Rentenversicherung bietet steuerliche Vorteile, die ein ETF-Depot nicht hat: Fondswechsel sind steuerfrei, bei Auszahlung als Rente wird nur der geringe Ertragsanteil besteuert, und bei Kapitalauszahlung gilt das Halbeinkünfteverfahren. Zudem bietet die Versicherung eine lebenslange Rente – das Langlebigkeitsrisiko ist abgesichert."
  },
  {
    id: "bu-wichtig",
    question: "Brauche ich eine Berufsunfähigkeitsversicherung?",
    answer: "Statistisch wird jeder Vierte im Lauf des Berufslebens berufsunfähig. Die staatliche Erwerbsminderungsrente reicht bei weitem nicht aus, um den Lebensstandard zu halten. Eine BU-Versicherung ist daher für jeden Berufstätigen dringend empfohlen – je früher Sie abschließen, desto günstiger."
  },
  {
    id: "chance-balance-index",
    question: "Was ist der Unterschied zwischen Chance, Balance und Index?",
    answer: "Chance ist rein fondsgebunden mit maximalen Renditechancen, aber ohne Beitragsgarantie. Balance kombiniert Sicherheit und Rendite mit einer Beitragsgarantie zum Rentenbeginn. Index partizipiert am EURO STOXX 50 – Gewinne werden jährlich gesichert, Verluste auf den Beitrag sind ausgeschlossen."
  },
  {
    id: "vorzeitig-entnehmen",
    question: "Kann ich mein Geld vorzeitig entnehmen?",
    answer: "Ja, bei der privaten Rentenversicherung sind Teilentnahmen und Kapitalauszahlungen möglich. Beachten Sie jedoch: Bei Entnahme vor dem 62. Lebensjahr oder vor 12 Jahren Vertragslaufzeit entfallen die steuerlichen Vorteile. Wir beraten Sie gerne zu den optimalen Zeitpunkten."
  },
  {
    id: "steuer-ruerup",
    question: "Wie funktioniert die steuerliche Förderung bei der Rürup-Rente?",
    answer: "Bei der Basis-Rente (Rürup) können Sie 2025 bis zu 27.565€ pro Jahr (bei Verheirateten das Doppelte) zu 100% als Sonderausgaben von der Steuer absetzen. Die spätere Rente wird nachgelagert besteuert – in der Regel zu einem niedrigeren Steuersatz als im Berufsleben."
  }
];

export default function LebenVorsorge() {
  const [openProduct, setOpenProduct] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleProduct = (id: string) => {
    setOpenProduct(openProduct === id ? null : id);
  };

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const whatsAppBase = "https://wa.me/4915566771019?text=";

  return (
    <>
      <SEO
        title="Leben & Vorsorge – Private Altersvorsorge & Absicherung | ERGO Agentur Stübe Ganderkesee"
        description="Private Rentenversicherung, Berufsunfähigkeit, Risikoleben & betriebliche Altersvorsorge bei ERGO. Persönliche Beratung von Morino Stübe in Ganderkesee."
        keywords="Leben Vorsorge, Private Rentenversicherung, Altersvorsorge, Berufsunfähigkeitsversicherung, Risikolebensversicherung, Rürup Rente, betriebliche Altersvorsorge, ERGO Ganderkesee, Morino Stübe"
      />

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#003781] to-[#001d42] text-white py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Leben & Vorsorge
            </h1>
            <p className="text-xl sm:text-2xl font-light mb-6 text-blue-200">
              Ihre Zukunft. Gut abgesichert.
            </p>
            <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
              Von der privaten Altersvorsorge über Berufsunfähigkeit bis zur Risikolebensversicherung – 
              wir finden gemeinsam die passende Absicherung für jede Lebensphase.
            </p>
            <a
              href={`${whatsAppBase}${encodeURIComponent("Hallo Herr Stübe, ich interessiere mich für das Thema Leben & Vorsorge und möchte mich kostenlos beraten lassen.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-ergo-red hover:bg-red-700 text-white font-bold px-8 py-4 rounded-lg text-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Kostenlose Beratung vereinbaren
            </a>
          </div>
        </section>

        {/* Hinweis Banner */}
        <div className="bg-amber-50 border-y border-amber-200 py-3 px-4">
          <p className="text-center text-sm text-amber-800 max-w-4xl mx-auto">
            Alle Angaben sind unverbindlich. Für individuelle Beitragsberechnung und verbindliche Angebote kontaktieren Sie mich persönlich.
          </p>
        </div>

        {/* Product Cards Grid */}
        <section className="py-12 sm:py-16 bg-gray-50 scroll-mt-20" id="produkte">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Unsere Produkte im Überblick</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">8 starke Lösungen für Ihre finanzielle Absicherung und Altersvorsorge</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product) => (
                <div key={product.id}>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <span className="text-4xl">{product.icon}</span>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                        <span className="inline-block bg-blue-100 text-[#003781] text-xs font-semibold px-2.5 py-1 rounded-full">
                          {product.target}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{product.short}</p>

                    <ul className="space-y-2 mb-5 flex-1">
                      {product.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => toggleProduct(product.id)}
                      className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-[#003781] border border-[#003781] rounded-lg hover:bg-[#003781] hover:text-white transition-colors"
                    >
                      {openProduct === product.id ? "Weniger anzeigen" : "Details anzeigen"}
                      <ChevronDown className={`w-4 h-4 transition-transform ${openProduct === product.id ? "rotate-180" : ""}`} />
                    </button>
                  </div>

                  {/* Expanded Detail Section */}
                  <div className={`overflow-hidden transition-all duration-300 ${openProduct === product.id ? "max-h-[2000px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <p className="text-gray-700 mb-4 leading-relaxed">{product.details.description}</p>

                      {product.details.subSections && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                          {product.details.subSections.map((sub, i) => (
                            <div key={i} className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-bold text-sm mb-2">{sub.title}</h4>
                              <p className="text-xs text-gray-600 leading-relaxed">{sub.text}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {product.details.gemeinsam && (
                        <div className="mb-5">
                          <h4 className="font-bold text-sm text-gray-900 mb-2">Gemeinsame Features</h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {product.details.gemeinsam.map((g, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                {g}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {product.details.steuervorteile && (
                        <div className="bg-blue-50 rounded-lg p-4 mb-5">
                          <h4 className="font-bold text-sm text-[#003781] mb-2">Steuervorteile</h4>
                          <p className="text-sm text-gray-700 leading-relaxed">{product.details.steuervorteile}</p>
                        </div>
                      )}

                      <h4 className="font-bold text-sm text-gray-900 mb-2">Alle Leistungen</h4>
                      <ul className="space-y-2 mb-5">
                        {product.details.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <div className="bg-gray-50 rounded-lg p-4 mb-5">
                        <h4 className="font-bold text-sm text-gray-900 mb-1">Zielgruppe</h4>
                        <p className="text-sm text-gray-600">{product.details.audience}</p>
                      </div>

                      <a
                        href={`${whatsAppBase}${encodeURIComponent(`Hallo Herr Stübe, ich interessiere mich für die ${product.name} und möchte mich kostenlos beraten lassen.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-ergo-red hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg transition-colors text-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Jetzt beraten lassen
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vergleichstabelle */}
        <section className="py-12 sm:py-16 bg-white scroll-mt-20" id="vergleich">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Die 3 Renten-Produktfamilien im Vergleich</h2>
              <p className="text-gray-600">Chance vs. Balance vs. Index – finden Sie Ihre passende Strategie</p>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-4 bg-gray-50 rounded-tl-lg"></th>
                    <th className="p-4 bg-[#003781] text-white text-center font-bold">🚀 Chance</th>
                    <th className="p-4 bg-[#004a9f] text-white text-center font-bold">⚖️ Balance</th>
                    <th className="p-4 bg-[#003781] text-white text-center font-bold rounded-tr-lg">📊 Index</th>
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
                { key: "chance" as const, title: "🚀 Chance", color: "border-blue-500" },
                { key: "balance" as const, title: "⚖️ Balance", color: "border-blue-400" },
                { key: "index" as const, title: "📊 Index", color: "border-blue-600" }
              ].map((variant) => (
                <div key={variant.key} className={`border-l-4 ${variant.color} bg-white rounded-lg shadow-sm p-5`}>
                  <h3 className="font-bold text-lg mb-3">{variant.title}</h3>
                  <div className="space-y-2">
                    {comparisonData.map((row, i) => (
                      <div key={i} className="flex justify-between items-center text-sm py-1 border-b border-gray-100 last:border-0">
                        <span className="text-gray-600">{row.label}</span>
                        <span className="font-medium text-gray-900">
                          {typeof row[variant.key] === "boolean" ? (
                            row[variant.key] ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <X className="w-4 h-4 text-red-400" />
                            )
                          ) : (
                            row[variant.key]
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Steuervorteile Section */}
        <section className="py-12 sm:py-16 bg-gray-50 scroll-mt-20" id="steuervorteile">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Steuervorteile: ETF-Depot vs. ERGO Rentenversicherung</h2>
              <p className="text-gray-600">Warum die Rentenversicherung steuerlich oft die klügere Wahl ist</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">📈</span>
                  <h3 className="text-lg font-bold text-gray-900">ETF-Depot</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm">
                    <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Fondswechsel löst Kapitalertragssteuer aus (ca. 26,4%)</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Jährliche Vorabpauschale auf Erträge</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Kein Langlebigkeitsschutz – Kapital kann aufgebraucht werden</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Volle Besteuerung der Gewinne bei Entnahme</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl border-2 border-[#003781] p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">🏦</span>
                  <h3 className="text-lg font-bold text-[#003781]">ERGO Rentenversicherung</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Fondswechsel steuerfrei</strong> – beliebig oft umschichten</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Ertragsanteilbesteuerung</strong> – nur geringer Anteil der Rente wird besteuert</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Halbeinkünfteverfahren</strong> – nur 50% der Erträge steuerpflichtig (ab 62, nach 12 Jahren)</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Lebenslange Rente</strong> – Langlebigkeitsrisiko abgesichert</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 sm:py-16 bg-white scroll-mt-20" id="faq">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Häufige Fragen</h2>
              <p className="text-gray-600">Antworten auf die wichtigsten Fragen zu Leben & Vorsorge</p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 text-sm sm:text-base pr-4">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openFaq === faq.id ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === faq.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-gradient-to-br from-[#003781] to-[#001d42] text-white py-14 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Lassen Sie sich kostenlos beraten</h2>
            <p className="text-blue-200 text-lg mb-2">Morino Stübe – Ihr ERGO Fachberater in Ganderkesee</p>
            <p className="text-blue-300 text-sm mb-8">Persönlich, unverbindlich und auf Ihre Situation zugeschnitten.</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="tel:015566771019"
                className="inline-flex items-center gap-2 bg-white text-[#003781] font-bold px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors text-base w-full sm:w-auto justify-center"
              >
                <Phone className="w-5 h-5" />
                015566771019
              </a>
              <a
                href={`${whatsAppBase}${encodeURIComponent("Hallo Herr Stübe, ich möchte mich kostenlos zum Thema Leben & Vorsorge beraten lassen.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-lg transition-colors text-base w-full sm:w-auto justify-center"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp schreiben
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
