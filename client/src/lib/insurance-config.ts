import { 
  Home, 
  Handshake, 
  Building, 
  Scale, 
  Smile 
} from "lucide-react";

export const insuranceConfig = {
  hausrat: {
    title: "Hausratversicherung",
    description: "Schutz für Ihr Hab und Gut. Absicherung gegen Einbruch, Feuer, Wasser und Sturm.",
    price: "ab 15€/Monat",
    icon: Home,
    features: [
      {
        title: "Rundumschutz",
        description: "Schutz vor Feuer, Einbruch, Wasser und Sturm"
      },
      {
        title: "Elementarschäden",
        description: "Absicherung gegen Naturkatastrophen inklusive"
      },
      {
        title: "Weltweiter Schutz", 
        description: "Ihr Hab und Gut ist auch im Urlaub versichert"
      }
    ],
    benefits: [
      {
        title: "Hausrat bis 50.000€",
        description: "Vollständige Absicherung Ihres Eigentums"
      },
      {
        title: "Fahrraddiebstahl",
        description: "Auch außerhalb der Wohnung versichert"
      },
      {
        title: "Glasbruchschäden",
        description: "Fenster, Türen und Mobiliar abgedeckt"
      }
    ],
    questions: [
      {
        type: "select" as const,
        question: "Wie groß ist Ihre Wohnung?",
        name: "apartment_size",
        options: ["Bis 50 m²", "51-100 m²", "101-150 m²", "Über 150 m²"]
      },
      {
        type: "radio" as const,
        question: "Haben Sie wertvolle Gegenstände?",
        name: "valuable_items",
        options: ["Ja, Schmuck/Kunst", "Ja, Elektronik", "Nein"]
      }
    ]
  },
  haftpflicht: {
    title: "Haftpflichtversicherung",
    description: "Schutz vor existenzbedrohenden Schadenersatzforderungen. Ein Muss für jeden.",
    price: "ab 8€/Monat",
    icon: Handshake,
    features: [
      {
        title: "Millionenschutz",
        description: "Bis zu 50 Millionen Euro Deckungssumme"
      },
      {
        title: "Rechtsbeistand",
        description: "Abwehr unberechtigter Ansprüche inklusive"
      },
      {
        title: "Weltweiter Schutz",
        description: "Versicherungsschutz auf allen Kontinenten"
      }
    ],
    benefits: [
      {
        title: "50 Mio € Deckung",
        description: "Maximaler finanzieller Schutz"
      },
      {
        title: "Mietsachschäden",
        description: "Schäden an der Mietwohnung abgedeckt"
      },
      {
        title: "Gefälligkeitsschäden",
        description: "Auch bei Hilfeleistungen versichert"
      }
    ],
    questions: [
      {
        type: "radio" as const,
        question: "Ihr Familienstand?",
        name: "family_status",
        options: ["Ledig", "Verheiratet", "Familie mit Kindern"]
      },
      {
        type: "radio" as const,
        question: "Besitzen Sie ein Haustier?",
        name: "pet",
        options: ["Ja, Hund", "Ja, Katze", "Nein"]
      }
    ]
  },
  wohngebaeude: {
    title: "Wohngebäudeversicherung",
    description: "Rundum-Schutz für Ihr Eigenheim gegen alle Gefahren. Ihre Investition ist sicher.",
    price: "ab 25€/Monat",
    icon: Building,
    features: [
      {
        title: "Komplettsanierung",
        description: "Vollständiger Wiederaufbau bei Totalschaden"
      },
      {
        title: "Modernste Technik",
        description: "Photovoltaik und Smart Home inklusive"
      },
      {
        title: "Elementarschutz",
        description: "Schutz vor Naturkatastrophen"
      }
    ],
    benefits: [
      {
        title: "Elementarschutz",
        description: "Überschwemmung, Erdrutsch, Rückstau"
      },
      {
        title: "Photovoltaik inklusive", 
        description: "Solaranlagen automatisch mitversichert"
      },
      {
        title: "Glasbruch",
        description: "Fenster und Türen vollständig abgedeckt"
      }
    ],
    questions: [
      {
        type: "select" as const,
        question: "Baujahr Ihres Hauses?",
        name: "construction_year",
        options: ["Vor 1980", "1980-2000", "2001-2010", "Nach 2010"]
      },
      {
        type: "radio" as const,
        question: "Haben Sie eine Photovoltaikanlage?",
        name: "solar_panel",
        options: ["Ja", "Geplant", "Nein"]
      }
    ]
  },
  rechtsschutz: {
    title: "Rechtsschutzversicherung",
    description: "Durchsetzen Ihres Rechts ohne finanzielle Sorgen. Anwalts- und Gerichtskosten abgedeckt.",
    price: "ab 18€/Monat",
    icon: Scale,
    features: [
      {
        title: "Vollumfänglicher Schutz",
        description: "Privat, Beruf und Verkehr abgedeckt"
      },
      {
        title: "Mediation inklusive",
        description: "Außergerichtliche Streitbeilegung"
      },
      {
        title: "24/7 Hotline",
        description: "Juristische Erstberatung rund um die Uhr"
      }
    ],
    benefits: [
      {
        title: "Privat-Rechtsschutz",
        description: "Für alle privaten Rechtsangelegenheiten"
      },
      {
        title: "Verkehrs-Rechtsschutz",
        description: "Schutz bei Verkehrsunfällen und -verstößen"
      },
      {
        title: "Berufs-Rechtsschutz",
        description: "Arbeitsrechtliche Streitigkeiten abgedeckt"
      }
    ],
    questions: [
      {
        type: "checkbox" as const,
        question: "Welche Bereiche interessieren Sie?",
        name: "legal_areas",
        options: [
          "Privat-Rechtsschutz",
          "Verkehrs-Rechtsschutz", 
          "Berufs-Rechtsschutz",
          "Miet-Rechtsschutz"
        ]
      }
    ]
  },
  zahnzusatz: {
    title: "Zahnzusatzversicherung",
    description: "Für schöne und gesunde Zähne. Ohne Wartezeit und mit Sofortleistung.",
    price: "ab 10€/Monat",
    icon: Smile,
    features: [
      {
        title: "Sofortleistung",
        description: "Ohne Wartezeit ab dem ersten Tag"
      },
      {
        title: "Premium Zahnersatz",
        description: "Bis zu 90% Erstattung für hochwertigen Zahnersatz"
      },
      {
        title: "Prophylaxe inklusive",
        description: "100% für professionelle Zahnreinigung"
      }
    ],
    benefits: [
      {
        title: "100% Zahnreinigung",
        description: "Professionelle Zahnreinigung vollständig erstattet"
      },
      {
        title: "90% Zahnersatz",
        description: "Hochwertige Implantate und Kronen"
      },
      {
        title: "Kieferorthopädie",
        description: "Auch für Erwachsene bis zu 75% Erstattung"
      }
    ],
    questions: [
      {
        type: "radio" as const,
        question: "Benötigen Sie aktuell eine Zahnbehandlung?",
        name: "current_treatment",
        options: ["Ja, bereits angeraten", "Ja, läuft bereits", "Nein"]
      },
      {
        type: "radio" as const,
        question: "Wie wichtig ist Ihnen Zahnersatz-Schutz?",
        name: "replacement_importance", 
        options: ["Sehr wichtig", "Wichtig", "Weniger wichtig"]
      }
    ]
  }
};
