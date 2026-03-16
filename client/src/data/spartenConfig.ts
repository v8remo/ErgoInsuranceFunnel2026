import { Car, Home, Users, Scale, ShieldAlert, Smile, Clock, Phone, Shield, Heart, FileCheck, Zap, Building, Umbrella, Briefcase, DollarSign, BadgeCheck, Stethoscope, Baby, Glasses } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface SpartenReview {
  name: string;
  text: string;
  rating: number;
}

export interface SpartenFAQ {
  question: string;
  answer: string;
}

export interface SpartenBenefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface SpartenConfig {
  slug: string;
  insuranceType: string;
  source: string;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
    gradient: string;
  };
  benefits: SpartenBenefit[];
  reviews: SpartenReview[];
  faqs: SpartenFAQ[];
  urgency: {
    text: string;
    subtext: string;
  };
}

export const spartenConfigs: Record<string, SpartenConfig> = {
  kfz: {
    slug: 'kfz',
    insuranceType: 'kfz',
    source: 'lp_kfz',
    seo: {
      title: 'Kfz-Versicherung Ganderkesee – Jetzt bis zu 30% sparen | ERGO',
      description: 'Kfz-Versicherung bei ERGO Agentur Stübe in Ganderkesee. Persönliche Beratung, Top-Tarife und bis zu 30% Ersparnis. Jetzt kostenlosen Vergleich starten!',
      keywords: 'Kfz-Versicherung, Autoversicherung, Kfz Ganderkesee, ERGO Kfz, Autoversicherung vergleichen, Kfz-Haftpflicht, Teilkasko, Vollkasko',
    },
    hero: {
      headline: 'Kfz-Versicherung – Jetzt bis zu 30% sparen',
      subheadline: 'Persönliche Beratung statt anonymer Online-Vergleich. Finden Sie den optimalen Tarif für Ihr Fahrzeug.',
      ctaText: 'Kostenlosen Vergleich starten',
      gradient: 'from-blue-900 to-blue-700',
    },
    benefits: [
      { icon: DollarSign, title: 'Bis zu 30% Ersparnis', description: 'Durch persönliche Tarifoptimierung und den ERGO Bündelnachlass sparen Sie bares Geld.' },
      { icon: Shield, title: 'Lückenloser Schutz', description: 'Haftpflicht, Teil- oder Vollkasko – genau der Schutz, den Ihr Fahrzeug braucht.' },
      { icon: Phone, title: 'Persönlicher Ansprechpartner', description: 'Bei Fragen oder im Schadenfall erreichen Sie uns direkt – keine Hotline-Warteschleifen.' },
      { icon: Zap, title: 'Schnelle Schadenregulierung', description: 'Im Schadenfall kümmern wir uns persönlich um die schnelle Abwicklung.' },
    ],
    reviews: [
      { name: 'Thomas M.', text: 'Habe durch den Wechsel zu ERGO über 200€ im Jahr gespart. Die Beratung war top – alles wurde verständlich erklärt.', rating: 5 },
      { name: 'Sandra K.', text: 'Nach einem Unfall hat Herr Stübe sich sofort gekümmert. Innerhalb von 2 Wochen war alles erledigt. Super Service!', rating: 5 },
      { name: 'Markus B.', text: 'Endlich ein Berater, der sich Zeit nimmt. Mein Kfz-Vertrag ist jetzt günstiger UND besser als vorher.', rating: 5 },
    ],
    faqs: [
      { question: 'Wie viel kann ich bei der Kfz-Versicherung sparen?', answer: 'Das hängt von Ihrem aktuellen Tarif, Fahrzeug und Schadenfreiheitsklasse ab. Durchschnittlich sparen unsere Kunden 20–30% beim Wechsel zu ERGO, plus bis zu 15% Bündelnachlass bei mehreren Verträgen.' },
      { question: 'Verliere ich meine Schadenfreiheitsklasse beim Wechsel?', answer: 'Nein! Ihre Schadenfreiheitsklasse wird 1:1 zum neuen Versicherer übertragen. Sie verlieren keine Rabatte.' },
      { question: 'Wann kann ich meine Kfz-Versicherung wechseln?', answer: 'Die reguläre Kündigungsfrist ist der 30. November. Aber auch bei Beitragserhöhungen oder nach einem Schadenfall haben Sie ein Sonderkündigungsrecht. Wir beraten Sie gerne.' },
      { question: 'Brauche ich Vollkasko oder reicht Teilkasko?', answer: 'Das hängt vom Alter und Wert Ihres Fahrzeugs ab. Bei Neuwagen empfehlen wir Vollkasko, bei älteren Fahrzeugen kann Teilkasko ausreichend sein. Wir erstellen Ihnen eine individuelle Empfehlung.' },
    ],
    urgency: {
      text: 'Noch heute Ihren kostenlosen Kfz-Vergleich sichern',
      subtext: 'Über 3.500 zufriedene Kunden vertrauen bereits auf unsere Beratung',
    },
  },
  hausrat: {
    slug: 'hausrat',
    insuranceType: 'hausrat',
    source: 'lp_hausrat',
    seo: {
      title: 'Hausratversicherung Ganderkesee – Ihr Zuhause optimal geschützt | ERGO',
      description: 'Hausratversicherung bei ERGO Agentur Stübe. Schutz vor Einbruch, Feuer, Wasser und Sturm. Individuelle Beratung in Ganderkesee. Jetzt kostenlos anfragen!',
      keywords: 'Hausratversicherung, Hausrat Ganderkesee, ERGO Hausrat, Einbruch Versicherung, Fahrrad versichern, Glasversicherung',
    },
    hero: {
      headline: 'Hausratversicherung – Ihr Zuhause rundum geschützt',
      subheadline: 'Schutz für alles, was Ihnen wichtig ist. Von Möbeln über Elektronik bis zum Fahrrad.',
      ctaText: 'Kostenlose Beratung anfragen',
      gradient: 'from-emerald-800 to-emerald-600',
    },
    benefits: [
      { icon: Home, title: 'Komplettschutz für Ihr Zuhause', description: 'Absicherung gegen Einbruch, Feuer, Leitungswasser und Sturm – alles in einem Vertrag.' },
      { icon: Shield, title: 'Fahrrad & E-Bike inklusive', description: 'Ihr Fahrrad und E-Bike sind rund um die Uhr gegen Diebstahl geschützt – auch unterwegs.' },
      { icon: Zap, title: 'Überspannungsschutz', description: 'Schutz für Ihre Elektronik bei Blitzeinschlag und Überspannung – Laptop, TV und Co. sind sicher.' },
      { icon: Umbrella, title: 'Elementarschutz optional', description: 'Erweitern Sie Ihren Schutz um Starkregen, Überschwemmung und Rückstau.' },
    ],
    reviews: [
      { name: 'Maria L.', text: 'Nach einem Wasserrohrbruch hat die ERGO schnell und unkompliziert gezahlt. Herr Stübe hat uns toll unterstützt.', rating: 5 },
      { name: 'Andreas W.', text: 'Mein E-Bike wurde gestohlen – dank der Hausratversicherung war der Schaden schnell ersetzt. Sehr empfehlenswert!', rating: 5 },
    ],
    faqs: [
      { question: 'Was deckt die Hausratversicherung ab?', answer: 'Die Hausratversicherung schützt Ihren gesamten Hausrat – von Möbeln über Kleidung bis hin zu Elektronik – gegen Einbruchdiebstahl, Feuer, Leitungswasser, Sturm und Hagel.' },
      { question: 'Wie hoch sollte die Versicherungssumme sein?', answer: 'Als Faustregel gilt: ca. 650€ pro Quadratmeter Wohnfläche. Wir berechnen gemeinsam die optimale Summe, damit Sie weder über- noch unterversichert sind.' },
      { question: 'Ist mein Fahrrad auch außerhalb der Wohnung versichert?', answer: 'Ja! Mit dem Fahrrad-Baustein ist Ihr Rad und E-Bike rund um die Uhr gegen Diebstahl geschützt – egal wo Sie es abstellen.' },
    ],
    urgency: {
      text: 'Schützen Sie Ihr Zuhause – kostenlose Analyse starten',
      subtext: 'Persönliche Beratung von Ihrem ERGO-Experten vor Ort',
    },
  },
  haftpflicht: {
    slug: 'haftpflicht',
    insuranceType: 'haftpflicht',
    source: 'lp_haftpflicht',
    seo: {
      title: 'Haftpflichtversicherung Ganderkesee – Die wichtigste Versicherung | ERGO',
      description: 'Private Haftpflichtversicherung bei ERGO Agentur Stübe. Die wichtigste Versicherung überhaupt – schon ab wenigen Euro monatlich. Jetzt beraten lassen!',
      keywords: 'Haftpflichtversicherung, Privathaftpflicht, Haftpflicht Ganderkesee, ERGO Haftpflicht, Haftpflicht günstig, Familienhaftpflicht',
    },
    hero: {
      headline: 'Haftpflichtversicherung – Die Nr. 1 Absicherung',
      subheadline: 'Ein kleines Missgeschick kann teuer werden. Die Haftpflicht schützt Sie vor finanziellen Folgen – schon ab wenigen Euro im Monat.',
      ctaText: 'Jetzt Angebot sichern',
      gradient: 'from-indigo-800 to-indigo-600',
    },
    benefits: [
      { icon: Shield, title: 'Bis zu 50 Mio. € Deckungssumme', description: 'Umfassender Schutz bei Personen-, Sach- und Vermögensschäden – weltweit.' },
      { icon: Users, title: 'Familienschutz inklusive', description: 'Partner und Kinder sind automatisch mitversichert – ohne Aufpreis.' },
      { icon: Building, title: 'Mietsachschäden abgedeckt', description: 'Schäden an der Mietwohnung wie zerkratzte Böden oder beschädigte Türen sind mitversichert.' },
      { icon: Heart, title: 'Gefälligkeitsschäden inklusive', description: 'Auch Schäden beim Helfen – z.B. beim Umzug eines Freundes – sind abgesichert.' },
    ],
    reviews: [
      { name: 'Julia F.', text: 'Mein Sohn hat beim Spielen eine teure Vase der Nachbarin zerbrochen. Die ERGO hat sofort gezahlt. Sehr erleichtert!', rating: 5 },
      { name: 'Peter H.', text: 'Hätte nie gedacht, dass die Haftpflicht so wichtig ist. Herr Stübe hat mir alles verständlich erklärt und ein super Angebot gemacht.', rating: 5 },
    ],
    faqs: [
      { question: 'Warum ist die Haftpflichtversicherung so wichtig?', answer: 'In Deutschland haften Sie unbegrenzt für Schäden, die Sie anderen zufügen. Ohne Haftpflichtversicherung müssen Sie mit Ihrem gesamten Vermögen dafür aufkommen. Ein Unfall mit Personenschaden kann schnell Millionen kosten.' },
      { question: 'Was kostet eine gute Haftpflichtversicherung?', answer: 'Eine leistungsstarke Privathaftpflicht gibt es bereits ab ca. 5–8€ pro Monat. Bei ERGO erhalten Sie Top-Leistungen zu einem fairen Preis.' },
      { question: 'Sind meine Kinder mitversichert?', answer: 'Ja! In der Familienhaftpflicht sind Ihr Partner und alle minderjährigen Kinder automatisch mitversichert. Auch volljährige Kinder in Erstausbildung können eingeschlossen werden.' },
      { question: 'Was ist mit Schäden an meiner Mietwohnung?', answer: 'Mietsachschäden an der gemieteten Wohnung sind in den ERGO-Tarifen standardmäßig mitversichert. Das umfasst z.B. zerkratzte Böden, beschädigte Türen oder Glasschäden.' },
    ],
    urgency: {
      text: 'Die wichtigste Versicherung – jetzt absichern',
      subtext: 'Schon ab wenigen Euro im Monat optimal geschützt',
    },
  },
  rechtsschutz: {
    slug: 'rechtsschutz',
    insuranceType: 'rechtsschutz',
    source: 'lp_rechtsschutz',
    seo: {
      title: 'Rechtsschutzversicherung Ganderkesee – Ihr Recht durchsetzen | ERGO',
      description: 'Rechtsschutzversicherung bei ERGO Agentur Stübe. Setzen Sie Ihr Recht durch – ohne Kostenrisiko. Privat, Beruf und Verkehr abgesichert. Jetzt beraten lassen!',
      keywords: 'Rechtsschutzversicherung, Rechtsschutz Ganderkesee, ERGO Rechtsschutz, Anwaltskosten, Verkehrsrechtsschutz, Arbeitsrechtsschutz',
    },
    hero: {
      headline: 'Rechtsschutzversicherung – Ihr Recht durchsetzen',
      subheadline: 'Ärger mit dem Vermieter, Probleme im Job oder ein Verkehrsunfall? Setzen Sie Ihr Recht durch – ohne Kostenrisiko.',
      ctaText: 'Kostenlos beraten lassen',
      gradient: 'from-slate-800 to-slate-600',
    },
    benefits: [
      { icon: Scale, title: 'Anwalts- & Gerichtskosten übernommen', description: 'Alle Kosten für Anwalt, Gericht und Gutachter werden von der Rechtsschutzversicherung getragen.' },
      { icon: Briefcase, title: 'Arbeitsrechtsschutz', description: 'Schutz bei Kündigung, Abmahnung und Gehaltsstreitigkeiten – besonders wichtig für Arbeitnehmer.' },
      { icon: Car, title: 'Verkehrsrechtsschutz inklusive', description: 'Bei Unfällen, Bußgeldbescheiden oder Streitigkeiten mit Werkstätten sind Sie abgesichert.' },
      { icon: Phone, title: 'Telefonische Rechtsberatung 24/7', description: 'Rund um die Uhr telefonische Erstberatung durch erfahrene Anwälte – sofort und kostenlos.' },
    ],
    reviews: [
      { name: 'Frank R.', text: 'Nach einer unberechtigten Kündigung hat die ERGO Rechtsschutz sofort reagiert. Dank des Anwalts habe ich eine Abfindung bekommen.', rating: 5 },
      { name: 'Claudia N.', text: 'Streit mit dem Vermieter wegen Schimmel. Die Rechtsschutzversicherung hat alle Kosten übernommen. Bin sehr froh, dass ich sie hatte.', rating: 5 },
    ],
    faqs: [
      { question: 'Welche Bereiche deckt die Rechtsschutzversicherung ab?', answer: 'Die ERGO Rechtsschutzversicherung umfasst Privatrechtsschutz, Berufsrechtsschutz und Verkehrsrechtsschutz. Optional können Sie Wohnungsrechtsschutz hinzubuchen.' },
      { question: 'Gibt es eine Wartezeit?', answer: 'Ja, die Wartezeit beträgt in der Regel 3 Monate. Für Verkehrsrechtsschutz entfällt die Wartezeit häufig. Bei einem Wechsel von einem anderen Anbieter kann die Wartezeit entfallen.' },
      { question: 'Kann ich mir meinen Anwalt selbst aussuchen?', answer: 'Ja, Sie haben bei ERGO freie Anwaltswahl. Sie können den Anwalt Ihres Vertrauens beauftragen – wir übernehmen die Kosten.' },
      { question: 'Was ist mit Streitigkeiten vor dem Arbeitsgericht?', answer: 'Arbeitsrechtliche Streitigkeiten sind in der Berufsrechtsschutz-Komponente abgedeckt. Wichtig: Vor dem Arbeitsgericht in erster Instanz trägt jede Partei ihre eigenen Anwaltskosten – die Rechtsschutzversicherung übernimmt Ihre.' },
    ],
    urgency: {
      text: 'Rechtliche Sicherheit – jetzt absichern',
      subtext: 'Im Ernstfall zählt jeder Euro – lassen Sie sich nicht auf Kosten sitzen',
    },
  },
  berufsunfaehigkeit: {
    slug: 'berufsunfaehigkeit',
    insuranceType: 'berufsunfaehigkeit',
    source: 'lp_berufsunfaehigkeit',
    seo: {
      title: 'Berufsunfähigkeitsversicherung Ganderkesee – Einkommen absichern | ERGO',
      description: 'Berufsunfähigkeitsversicherung bei ERGO Agentur Stübe. Schützen Sie Ihr Einkommen – jeder 4. wird berufsunfähig. Jetzt persönlich beraten lassen!',
      keywords: 'Berufsunfähigkeitsversicherung, BU-Versicherung, Berufsunfähigkeit, Erwerbsminderung, ERGO BU, Einkommen absichern, BU Ganderkesee',
    },
    hero: {
      headline: 'Berufsunfähigkeitsversicherung – Ihr Einkommen schützen',
      subheadline: 'Jeder 4. Arbeitnehmer wird berufsunfähig. Sichern Sie Ihren Lebensstandard – bevor es zu spät ist.',
      ctaText: 'Jetzt BU-Angebot anfordern',
      gradient: 'from-amber-800 to-amber-600',
    },
    benefits: [
      { icon: ShieldAlert, title: 'Jeder 4. ist betroffen', description: 'Statistisch wird jeder vierte Arbeitnehmer vor dem Rentenalter berufsunfähig. Die häufigsten Ursachen: Psyche, Rücken und Krebs.' },
      { icon: DollarSign, title: 'Bis zu 3.000 €/Monat BU-Rente', description: 'Individuelle BU-Rente, die Ihren Lebensstandard absichert – auch bei langer Krankheit.' },
      { icon: BadgeCheck, title: 'Garantierte Rentenzahlung', description: 'Ab 50% Berufsunfähigkeit erhalten Sie die vereinbarte Rente – ohne Verweis auf andere Berufe.' },
      { icon: FileCheck, title: 'Nachversicherungsgarantie', description: 'Bei Heirat, Geburt oder Gehaltserhöhung können Sie Ihren Schutz ohne erneute Gesundheitsprüfung erhöhen.' },
    ],
    reviews: [
      { name: 'Stefan K.', text: 'Nach einem Bandscheibenvorfall konnte ich meinen Beruf nicht mehr ausüben. Die ERGO BU-Rente hat mir finanziell das Leben gerettet.', rating: 5 },
      { name: 'Nadine P.', text: 'Herr Stübe hat mir als junge Berufseinsteigerin eine bezahlbare BU empfohlen. Rückblickend die beste Entscheidung meines Lebens.', rating: 5 },
    ],
    faqs: [
      { question: 'Ab wann lohnt sich eine Berufsunfähigkeitsversicherung?', answer: 'Je früher, desto besser! Junge und gesunde Personen zahlen deutlich niedrigere Beiträge. Schon als Berufseinsteiger oder Student können Sie sich günstig absichern.' },
      { question: 'Was zahlt der Staat bei Berufsunfähigkeit?', answer: 'Die gesetzliche Erwerbsminderungsrente beträgt im Schnitt nur ca. 900€ brutto monatlich. Davon lässt sich kaum leben – eine private BU-Versicherung schließt diese Lücke.' },
      { question: 'Wird mein Beitrag im Alter teurer?', answer: 'Nein! Der Beitrag bleibt über die gesamte Laufzeit konstant, wenn Sie sich für einen Nettobeitrag oder einen garantierten Zahlbeitrag entscheiden. Deshalb ist ein früher Abschluss so vorteilhaft.' },
      { question: 'Was passiert bei psychischen Erkrankungen?', answer: 'Psychische Erkrankungen sind die häufigste Ursache für Berufsunfähigkeit. Bei ERGO sind auch psychische Leiden wie Burnout oder Depressionen vollständig abgesichert.' },
    ],
    urgency: {
      text: 'Schützen Sie Ihr Einkommen – bevor es zu spät ist',
      subtext: 'Je jünger Sie sind, desto günstiger der Beitrag',
    },
  },
  zahnzusatz: {
    slug: 'zahnzusatz',
    insuranceType: 'zahnzusatz',
    source: 'lp_zahnzusatz',
    seo: {
      title: 'Zahnzusatzversicherung Ganderkesee – Bis zu 100% Erstattung | ERGO',
      description: 'Zahnzusatzversicherung bei ERGO Agentur Stübe. Bis zu 100% für Zahnersatz, Implantate und Kieferorthopädie. Jetzt kostenlos beraten lassen!',
      keywords: 'Zahnzusatzversicherung, Zahnersatz, Implantate Versicherung, ERGO Zahnzusatz, Kieferorthopädie, Zahnzusatz Ganderkesee',
    },
    hero: {
      headline: 'Zahnzusatzversicherung – Lächeln ohne Sorgen',
      subheadline: 'Zahnersatz kann schnell tausende Euro kosten. Sichern Sie sich bis zu 100% Erstattung – für ein sorgenfreies Lächeln.',
      ctaText: 'Zahnschutz-Angebot anfordern',
      gradient: 'from-cyan-800 to-cyan-600',
    },
    benefits: [
      { icon: Smile, title: 'Bis zu 100% für Zahnersatz', description: 'Kronen, Brücken, Implantate und Prothesen – ERGO erstattet bis zu 100% der Kosten.' },
      { icon: Stethoscope, title: 'Professionelle Zahnreinigung', description: 'Regelmäßige PZR wird bezuschusst – für gesunde Zähne und Vorsorge.' },
      { icon: Baby, title: 'Kieferorthopädie für Kinder', description: 'Zahnspangen und kieferorthopädische Behandlungen für Kinder werden bis zu 100% erstattet.' },
      { icon: Glasses, title: 'Keine Wartezeit bei ERGO', description: 'ERGO Zahnzusatz-Tarife bieten Sofortschutz ohne Wartezeit – Sie sind ab Tag 1 versichert.' },
    ],
    reviews: [
      { name: 'Sabine T.', text: 'Ein Implantat hätte mich 3.500€ gekostet. Dank der ERGO Zahnzusatz habe ich nur den Eigenanteil von 150€ gezahlt. Wahnsinn!', rating: 5 },
      { name: 'Lars G.', text: 'Für meine Tochter brauchte ich eine Zahnspange. Die Zusatzversicherung hat fast alles übernommen. Sehr zufrieden!', rating: 5 },
    ],
    faqs: [
      { question: 'Wie viel übernimmt die Kasse beim Zahnersatz?', answer: 'Die gesetzliche Krankenkasse zahlt nur den sogenannten Regelzuschuss – das sind in der Regel nur 60–75% der Standardversorgung. Bei hochwertigem Zahnersatz wie Implantaten oder Keramikkronen bleibt ein Eigenanteil von oft 2.000–5.000€.' },
      { question: 'Lohnt sich eine Zahnzusatzversicherung?', answer: 'Ja! Statistisch benötigt fast jeder Mensch im Laufe seines Lebens Zahnersatz. Die monatlichen Beiträge sind vergleichsweise niedrig – im Schadenfall sparen Sie tausende Euro.' },
      { question: 'Gibt es eine Wartezeit?', answer: 'Bei den ERGO Zahnzusatz-Tarifen gibt es keine Wartezeit. Sie können Leistungen ab dem ersten Tag in Anspruch nehmen. In den ersten Jahren gibt es Summenbegrenzungen, die schrittweise steigen.' },
      { question: 'Werden auch Zahnspangen für Kinder bezahlt?', answer: 'Ja! Kieferorthopädische Behandlungen für Kinder werden je nach Tarif bis zu 100% erstattet – unabhängig von der KFO-Indikationsgruppe. Besonders sinnvoll für Behandlungen der Gruppen 1 und 2, die die Kasse gar nicht übernimmt.' },
    ],
    urgency: {
      text: 'Zahnschutz sichern – bevor es teuer wird',
      subtext: 'Ein Implantat kostet durchschnittlich 3.000€ – sind Sie abgesichert?',
    },
  },
};
