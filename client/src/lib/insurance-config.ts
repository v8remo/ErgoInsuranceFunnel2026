import { 
  Home, 
  Handshake, 
  Building, 
  Scale, 
  Smile 
} from "lucide-react";

import hausratImage from '@assets/generated_images/Hausratversicherung_Bild_c3ff70bd.webp';
import haftpflichtImage from '@assets/generated_images/Haftpflichtversicherung_Bild_5ed28150.webp';
import wohngebaeudeImage from '@assets/generated_images/Wohngebäudeversicherung_Bild_f01c7305.webp';
import rechtsschutzImage from '@assets/generated_images/Rechtsschutzversicherung_Bild_50cb007d.webp';
import zahnzusatzImage from '@assets/generated_images/Zahnzusatzversicherung_Bild_0c576ecb.webp';

export const insuranceConfig = {
  hausrat: {
    title: "Hausratversicherung",
    description: "ERGO Hausratversicherung Ganderkesee - Rundum-Schutz für Ihr Hab und Gut. Absicherung gegen Einbruch, Feuer, Wasser und Sturm. Persönliche Beratung durch Morino Stübe.",
    price: "ab 15€/Monat",
    icon: Home,
    image: hausratImage,
    features: [
      {
        title: "Rundumschutz",
        description: "Schutz vor Feuer, Einbruch, Wasser und Sturm - auch bei grober Fahrlässigkeit"
      },
      {
        title: "Elementarschäden",
        description: "Absicherung gegen Naturkatastrophen wie Hochwasser, Erdbeben und Lawinen"
      },
      {
        title: "Weltweiter Schutz", 
        description: "Ihr Hab und Gut ist auch im Urlaub bis zu 6 Monate versichert"
      }
    ],
    benefits: [
      {
        title: "Hausrat bis zur Versicherungssumme",
        description: "Vollständige Absicherung Ihres Eigentums - auch bei Wertsteigerung"
      },
      {
        title: "Fahrraddiebstahl",
        description: "Auch außerhalb der Wohnung versichert - rund um die Uhr"
      },
      {
        title: "Glasbruchschäden",
        description: "Fenster, Türen und Mobiliar abgedeckt - ohne Selbstbeteiligung"
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
    description: "ERGO Haftpflichtversicherung Ganderkesee - Schutz vor existenzbedrohenden Schadenersatzforderungen. Ein Muss für jeden. Persönliche Beratung durch Morino Stübe.",
    price: "ab 8€/Monat",
    icon: Handshake,
    image: haftpflichtImage,
    features: [
      {
        title: "Millionenschutz",
        description: "Bis zu 50 Millionen Euro Deckungssumme - auch bei schweren Unfällen"
      },
      {
        title: "Rechtsbeistand",
        description: "Abwehr unberechtigter Ansprüche inklusive - kompetente Rechtsberatung"
      },
      {
        title: "Weltweiter Schutz",
        description: "Versicherungsschutz auf allen Kontinenten - auch im Urlaub"
      }
    ],
    benefits: [
      {
        title: "50 Mio € Deckung",
        description: "Maximaler finanzieller Schutz für Personen-, Sach- und Vermögensschäden"
      },
      {
        title: "Mietsachschäden",
        description: "Schäden an der Mietwohnung abgedeckt - bis 300.000 €"
      },
      {
        title: "Gefälligkeitsschäden",
        description: "Auch bei Hilfeleistungen versichert - ohne Selbstbeteiligung"
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
    description: "Für den wichtigsten Ort der Welt: Ihr Zuhause. Mit der \"Haus-zurück-Garantie\" bekommen Sie die Kosten für die Wiederherstellung in einen neuwertigen Zustand zu aktuellen Preisen erstattet.",
    price: "z.B. 28,99€/Monat",
    icon: Building,
    image: wohngebaeudeImage,
    features: [
      {
        title: "Finanziell gut abgesichert",
        description: "Rundum-Absicherung bei Schäden durch Feuer, Leitungswasser und Naturgefahren"
      },
      {
        title: "Naturgefahren ohne Selbstbeteiligung",
        description: "All-in-One-Lösung bei Naturkatastrophen - Sturm, Hagel, Überschwemmung, Erdrutsch, Erdbeben"
      },
      {
        title: "Diebstahlschutz von Grundstücksbestandteilen",
        description: "Schutz für Wärmepumpen, Photovoltaikanlagen und andere fest verbundene Anlagen"
      }
    ],
    benefits: [
      {
        title: "Haus-zurück-Garantie",
        description: "Wiederherstellung in neuwertigen Zustand zu aktuellen Preisen"
      },
      {
        title: "Beitragsersparnis bei Modernisierung", 
        description: "ERGO belohnt Ihre Modernisierungs- und Präventionsmaßnahmen"
      },
      {
        title: "Schnelle Hilfe im Schadenfall",
        description: "Direkte Unterstützung bei Schäden an Ihrem Haus"
      }
    ],
    questions: [
      {
        type: "select" as const,
        question: "Wie nutzen Sie aktuell Ihre Immobilie?",
        name: "property_usage",
        options: ["Eigenheim", "Kapitalanlage"]
      },
      {
        type: "select" as const,
        question: "Um welchen Gebäudetyp handelt es sich?",
        name: "building_type",
        options: ["Einfamilienhaus", "Reihenhaus", "Doppelhaushälfte", "Mehrfamilienhaus"]
      },
      {
        type: "select" as const,
        question: "Was möchten Sie absichern?",
        name: "insurance_scope",
        options: ["Hausrat", "Gebäude", "Beides"]
      },
      {
        type: "select" as const,
        question: "Vermieten Sie das Gebäude?",
        name: "rental_status",
        options: ["Nein (Eigennutzung)", "Teilweise (Einliegerwohnung)", "Ja"]
      }
    ]
  },
  rechtsschutz: {
    title: "Rechtsschutzversicherung",
    description: "ERGO Rechtsschutzversicherung Ganderkesee - Durchsetzen Ihres Rechts ohne finanzielle Sorgen. Anwalts- und Gerichtskosten abgedeckt. Persönliche Beratung durch Morino Stübe.",
    price: "ab 18€/Monat",
    icon: Scale,
    image: rechtsschutzImage,
    features: [
      {
        title: "Vollumfänglicher Schutz",
        description: "Privat, Beruf und Verkehr abgedeckt - ein Vertrag für alle Lebensbereiche"
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
    image: zahnzusatzImage,
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
  },
  "leben-vorsorge": {
    title: "Leben & Vorsorge",
    description: "Private Rentenversicherung, Berufsunfähigkeit, Risikoleben & betriebliche Altersvorsorge bei ERGO. Persönliche Beratung von Morino Stübe in Ganderkesee.",
    price: "ab 25€/Monat",
    icon: Home,
    image: hausratImage,
    features: [
      {
        title: "7 Produktlinien",
        description: "Von der privaten Altersvorsorge bis zur Sterbegeldversicherung – alles aus einer Hand"
      },
      {
        title: "Steuervorteile sichern",
        description: "Bis zu 100% steuerlich absetzbar bei Basis-Rente, Halbeinkünfteverfahren bei privater Rente"
      },
      {
        title: "FFF+ Bestnote",
        description: "Top-Bewertung von Franke & Bornberg für die ERGO Rentenversicherung"
      }
    ],
    benefits: [
      {
        title: "Private Rentenversicherung",
        description: "3 Produktfamilien: Chance, Balance und Index"
      },
      {
        title: "Basis-Rente (Rürup)",
        description: "100% steuerlich absetzbar – ideal für Selbstständige"
      },
      {
        title: "Berufsunfähigkeitsversicherung",
        description: "Absicherung Ihrer Arbeitskraft – kein Berufsverweis"
      }
    ],
    questions: [
      {
        type: "radio" as const,
        question: "Welches Thema interessiert Sie am meisten?",
        name: "leben_interest",
        options: [
          "Altersvorsorge (Private Rente / Rürup)",
          "Berufsunfähigkeit / Body Protect",
          "Risikolebensversicherung",
          "Betriebliche Altersvorsorge",
          "Sterbegeldversicherung",
          "Allgemeine Beratung"
        ]
      },
      {
        type: "radio" as const,
        question: "Wie ist Ihre berufliche Situation?",
        name: "employment_status",
        options: ["Angestellt", "Selbstständig/Freiberufler", "Beamter", "Student/Azubi", "Rentner"]
      }
    ]
  }
};
