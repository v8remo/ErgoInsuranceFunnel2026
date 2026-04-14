import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Phone, MessageSquare, MapPin, Shield, CheckCircle, ArrowRight, Award, Star, Users, Home, Car, Heart, Scale, Umbrella, Instagram, Clock, FileCheck, TrendingUp, Building2, UserCheck, Mail, ChevronRight } from "lucide-react";
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";
import TrustBar from "@/components/TrustBar";
import FAQSection from "@/components/FAQSection";
import { trackEvent, trackConversion } from "@/lib/analytics";
import FunnelOverlay from "@/components/FunnelOverlay";
import '@/styles/funnel.css';
import beraterPhoto from "@assets/optimized/ich_bin_da.webp";

const cityData: Record<string, {
  name: string;
  region: string;
  distance: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  intro: string;
  serviceText: string;
  einwohner: string;
  ortsteile: string[];
  typisch: string;
  risiken: string[];
  beraterIntro: string;
  detailedServiceText: string;
  localSeoText: string;
  localSeoText2: string;
  testimonials: { name: string; text: string; stars: number }[];
  faqs: { question: string; answer: string }[];
}> = {
  ganderkesee: {
    name: "Ganderkesee",
    region: "Landkreis Oldenburg",
    distance: "Direkt vor Ort",
    metaTitle: "ERGO Versicherung Ganderkesee – Agentur Stübe | Persönliche Beratung",
    metaDescription: "Ihre ERGO Versicherungsagentur in Ganderkesee. Morino Stübe berät Sie persönlich zu Hausrat, Haftpflicht, Kfz & mehr. Kostenlose Analyse Ihrer Verträge.",
    keywords: "ERGO Ganderkesee, Versicherung Ganderkesee, Versicherungsberater Ganderkesee, Morino Stübe, Hausratversicherung Ganderkesee, Haftpflicht Ganderkesee, Kfz-Versicherung Ganderkesee, Berufsunfähigkeit Ganderkesee, Unfallversicherung Ganderkesee, Zahnzusatz Ganderkesee",
    description: "Ihre ERGO Versicherungsagentur direkt in Ganderkesee",
    intro: "Als Ihr ERGO Versicherungsberater in Ganderkesee bin ich direkt vor Ort für Sie da. In meiner Agentur in der Friedensstraße 91 A berate ich Sie persönlich und individuell zu allen Versicherungsfragen.",
    serviceText: "Von Ganderkesee aus betreue ich Kunden in der gesamten Region. Ob Hausrat, Haftpflicht, Kfz oder Zahnzusatz – ich finde die passende Absicherung für Ihre Lebenssituation.",
    einwohner: "ca. 32.000",
    ortsteile: ["Ganderkesee-Mitte", "Bookholzberg", "Hoykenkamp", "Schierbrok", "Stenum", "Bergedorf", "Elmeloh"],
    typisch: "Familien, Eigenheimbesitzer, ländlich-vorstädtisch",
    risiken: ["Elementarschäden (Starkregen)", "Einbruch", "Sturmschäden"],
    beraterIntro: "Ich bin Morino Stübe, Ihr ERGO Versicherungsberater direkt hier in Ganderkesee. In meiner Agentur in der Friedensstraße 91 A stehe ich Ihnen persönlich zur Verfügung – ob für eine schnelle Frage oder eine umfassende Vertragsanalyse. Als Ganderkeseer kenne ich die Bedürfnisse der Menschen vor Ort: Familien, die ihr Eigenheim absichern möchten, Pendler, die eine gute Kfz-Versicherung brauchen, und junge Leute, die ihre erste Haftpflicht abschließen.",
    detailedServiceText: "Ganderkesee mit seinen rund 32.000 Einwohnern ist geprägt von Eigenheimbesitzern und Familien. Von Ganderkesee-Mitte über Bookholzberg bis Stenum – in allen Ortsteilen sind individuelle Versicherungslösungen gefragt. Besonders wichtig für Ganderkeseer Hausbesitzer: Eine solide Wohngebäudeversicherung mit Elementarschutz, denn Starkregen und Sturmschäden können auch im Landkreis Oldenburg erhebliche Schäden verursachen. Ich analysiere Ihre bestehenden Verträge kostenlos und zeige Ihnen, wo Sie besser abgesichert sein können – oder sogar Geld sparen.",
    localSeoText: "Als ERGO Versicherungsagentur in Ganderkesee bieten wir umfassende Versicherungslösungen für die Gemeinde im Landkreis Oldenburg. Ganderkesee, gelegen zwischen Delmenhorst und Oldenburg, ist eine beliebte Wohngegend für Familien und Eigenheimbesitzer. Die ländlich-vorstädtische Struktur der Gemeinde mit Ortsteilen wie Bookholzberg, Hoykenkamp, Schierbrok, Stenum, Bergedorf und Elmeloh erfordert maßgeschneiderte Versicherungskonzepte. Besonders die Wohngebäudeversicherung mit Elementarschadenabsicherung ist für Immobilienbesitzer in Ganderkesee unverzichtbar, da die Region in den letzten Jahren vermehrt von Starkregen-Ereignissen betroffen war.",
    localSeoText2: "Die Gemeinde Ganderkesee bietet eine hohe Lebensqualität mit guter Infrastruktur und Anbindung an die Autobahnen A28 und A1. Viele Ganderkeseer pendeln nach Bremen, Oldenburg oder Delmenhorst zur Arbeit und benötigen eine zuverlässige Kfz-Versicherung. Junge Familien, die sich in Neubaugebieten von Ganderkesee niederlassen, profitieren von unserer umfassenden Beratung zu Risikolebensversicherung, Berufsunfähigkeitsversicherung und der richtigen Absicherung für Kinder. Mit dem ERGO Bündelnachlass von bis zu 15% bei mindestens fünf Verträgen bieten wir Ganderkeseer Familien ein attraktives Gesamtpaket.",
    testimonials: [
      { name: "Familie M. aus Ganderkesee-Mitte", text: "Herr Stübe hat unsere kompletten Versicherungen geprüft und optimiert. Wir sparen jetzt über 400€ im Jahr – bei besserem Schutz!", stars: 5 },
      { name: "Thomas K. aus Bookholzberg", text: "Endlich ein Berater, der sich Zeit nimmt und alles verständlich erklärt. Die Elementarversicherung für unser Haus war Gold wert nach dem Starkregen.", stars: 5 },
      { name: "Sandra L. aus Stenum", text: "Schnelle und unkomplizierte Beratung per WhatsApp. Die Zahnzusatzversicherung war innerhalb eines Tages abgeschlossen.", stars: 5 },
    ],
    faqs: [
      {
        question: "Wo befindet sich die ERGO Agentur Stübe in Ganderkesee?",
        answer: "Die ERGO Agentur Stübe befindet sich in der Friedensstraße 91 A, 27777 Ganderkesee. Sie erreichen uns bequem aus allen Ortsteilen – ob Ganderkesee-Mitte, Bookholzberg, Hoykenkamp oder Stenum. Parkplätze sind direkt vor der Tür vorhanden."
      },
      {
        question: "Welche Versicherungen sind für Eigenheimbesitzer in Ganderkesee besonders wichtig?",
        answer: "Für Eigenheimbesitzer in Ganderkesee empfehle ich eine Wohngebäudeversicherung mit Elementarschadenabsicherung (Starkregen, Überschwemmung), eine Hausratversicherung, eine Privathaftpflicht und bei Finanzierung eine Risikolebensversicherung. Die Region ist besonders durch Starkregen und Sturm gefährdet, daher ist der Elementarschutz unverzichtbar."
      },
      {
        question: "Bietet die ERGO Agentur Stübe auch Hausbesuche in Ganderkesee an?",
        answer: "Ja, selbstverständlich! Ich biete Hausbesuche in ganz Ganderkesee und den umliegenden Ortsteilen an. Ob Bookholzberg, Schierbrok, Elmeloh oder Bergedorf – ich komme gerne zu Ihnen. Alternativ beraten wir auch per Telefon, WhatsApp oder Videocall."
      },
      {
        question: "Wie kann ich bestehende Versicherungen bei der ERGO Agentur Stübe prüfen lassen?",
        answer: "Bringen Sie einfach Ihre bestehenden Versicherungsunterlagen mit oder senden Sie mir Fotos per WhatsApp. Ich prüfe kostenlos und unverbindlich Ihre aktuellen Verträge, decke Versorgungslücken auf und zeige Ihnen Einsparmöglichkeiten – zum Beispiel durch den ERGO Bündelnachlass von bis zu 15%."
      },
      {
        question: "Welche Vorteile hat der ERGO Bündelnachlass für Ganderkeseer Familien?",
        answer: "Ab fünf ERGO-Verträgen erhalten Sie einen attraktiven Bündelnachlass von bis zu 15%. Bei einer typischen Ganderkeseer Familie mit Hausrat, Haftpflicht, Wohngebäude, Kfz und Zahnzusatz können Sie so mehrere hundert Euro im Jahr sparen – bei gleichzeitig besserem Versicherungsschutz."
      },
      {
        question: "Ist eine Elementarversicherung in Ganderkesee sinnvoll?",
        answer: "Ja, unbedingt! Ganderkesee im Landkreis Oldenburg war in den letzten Jahren mehrfach von Starkregenereignissen betroffen. Eine Elementarversicherung schützt Ihr Eigenheim vor Schäden durch Überschwemmung, Starkregen, Rückstau und weitere Naturgefahren. Ohne diesen Zusatzschutz bleiben Sie im Schadensfall auf den Kosten sitzen."
      }
    ]
  },
  delmenhorst: {
    name: "Delmenhorst",
    region: "Kreisfreie Stadt",
    distance: "Nur 10 Minuten entfernt",
    metaTitle: "ERGO Versicherung Delmenhorst – Agentur Stübe | Beratung in Ihrer Nähe",
    metaDescription: "ERGO Versicherungsberatung für Delmenhorst. Persönliche Betreuung durch Morino Stübe, nur 10 Min. entfernt. Kostenlose Versicherungsanalyse & Bündelnachlass.",
    keywords: "ERGO Delmenhorst, Versicherung Delmenhorst, Versicherungsberater Delmenhorst, Versicherung wechseln Delmenhorst, Hausratversicherung Delmenhorst, Haftpflicht Delmenhorst, Kfz Delmenhorst, Berufsunfähigkeit Delmenhorst, Unfallversicherung Delmenhorst",
    description: "ERGO Versicherungsberatung für Delmenhorst und Umgebung",
    intro: "Für Kunden aus Delmenhorst bin ich nur eine kurze Fahrt entfernt. Meine ERGO Agentur in Ganderkesee liegt verkehrsgünstig und ist von Delmenhorst aus schnell erreichbar – persönliche Beratung, die sich lohnt.",
    serviceText: "Viele meiner zufriedenen Kunden kommen aus Delmenhorst und Umgebung. Ich biete Ihnen die gleiche persönliche Betreuung wie meinen Ganderkeseer Kunden – mit kostenloser Vertragsanalyse und individuellen Empfehlungen.",
    einwohner: "ca. 80.000",
    ortsteile: ["Mitte", "Düsternort", "Hasbergen", "Stickgras", "Brendel", "Deichhorst", "Schafkoven"],
    typisch: "Mix aus Stadt und Vorort, Gewerbe, Familien",
    risiken: ["Einbruchdiebstahl", "Leitungswasserschäden", "Haftpflichtrisiken im Stadtgebiet"],
    beraterIntro: "Ich bin Morino Stübe, und auch für Delmenhorster bin ich Ihr persönlicher ERGO Ansprechpartner. Von meiner Agentur in Ganderkesee aus sind es nur rund 10 Minuten bis nach Delmenhorst – oder ich komme direkt zu Ihnen. Viele meiner langjährigen Kunden leben in Delmenhorst und schätzen die persönliche Betreuung, die Sie bei mir erhalten. Ob Versicherungscheck, Schadenfall oder Neuabschluss – ich bin für Sie da.",
    detailedServiceText: "Delmenhorst als kreisfreie Stadt mit rund 80.000 Einwohnern bietet einen abwechslungsreichen Mix aus urbanem Leben und Vorort-Atmosphäre. In Stadtteilen wie Düsternort, Hasbergen und Deichhorst leben viele Familien, die Wert auf eine solide Absicherung legen. Gewerbetreibende in Delmenhorst profitieren von maßgeschneiderten Geschäftsversicherungen. Ich analysiere Ihre individuelle Situation und stelle ein optimales Versicherungspaket zusammen – persönlich, transparent und mit dem ERGO Bündelvorteil.",
    localSeoText: "Die ERGO Agentur Stübe betreut zahlreiche Kunden in Delmenhorst und allen Stadtteilen – von Mitte über Düsternort und Hasbergen bis Stickgras, Brendel, Deichhorst und Schafkoven. Als kreisfreie Stadt mit rund 80.000 Einwohnern hat Delmenhorst spezifische Versicherungsbedürfnisse: Die höhere Bevölkerungsdichte im Vergleich zum Umland bedeutet ein erhöhtes Einbruchrisiko, besonders in bestimmten Stadtvierteln. Eine Hausratversicherung mit guter Einbruchdiebstahl-Absicherung und eine solide Privathaftpflicht sind für Delmenhorster unverzichtbar.",
    localSeoText2: "Delmenhorst bietet gute Einkaufsmöglichkeiten, Schulen und eine direkte Anbindung an Bremen. Viele Berufstätige in Delmenhorst pendeln täglich und sind auf eine zuverlässige Kfz-Versicherung angewiesen. Für Gewerbetreibende und Selbstständige in Delmenhorst bieten wir spezielle Gewerbeversicherungen, Betriebshaftpflicht und Rechtsschutz an. Die ERGO Agentur Stübe in der Friedensstraße 91 A in Ganderkesee ist von Delmenhorst aus in nur 10 Minuten über die B212 erreichbar. Vereinbaren Sie noch heute einen Termin für Ihre kostenlose Versicherungsanalyse.",
    testimonials: [
      { name: "Michael B. aus Delmenhorst-Mitte", text: "Trotz der kurzen Entfernung nach Ganderkesee kam Herr Stübe sogar zu mir nach Hause. Super Service und faire Beratung – keine Versicherung aufgeschwatzt, die ich nicht brauche.", stars: 5 },
      { name: "Petra S. aus Düsternort", text: "Nach einem Einbruch hat mir Herr Stübe bei der Schadenabwicklung enorm geholfen. Alles lief schnell und unkompliziert. Die Hausratversicherung hat sich mehr als bezahlt gemacht.", stars: 5 },
      { name: "Carsten H. aus Hasbergen", text: "Wir haben alle Verträge bei Herrn Stübe gebündelt und sparen jetzt richtig. Dazu die persönliche Beratung – das gibt's bei Online-Versicherern nicht.", stars: 5 },
    ],
    faqs: [
      {
        question: "Wie weit ist die ERGO Agentur Stübe von Delmenhorst entfernt?",
        answer: "Die ERGO Agentur Stübe in der Friedensstraße 91 A in Ganderkesee ist von Delmenhorst aus in nur etwa 10 Minuten über die B212 erreichbar. Alternativ biete ich auch Hausbesuche in allen Delmenhorster Stadtteilen an oder berate Sie bequem per Telefon, WhatsApp oder Videocall."
      },
      {
        question: "Bietet Morino Stübe auch Versicherungsberatung in Delmenhorst vor Ort an?",
        answer: "Ja! Ich biete regelmäßig Hausbesuche in Delmenhorst an – ob in Mitte, Düsternort, Hasbergen, Stickgras oder anderen Stadtteilen. Vereinbaren Sie einfach einen Termin per Telefon oder WhatsApp, und ich komme zu Ihnen."
      },
      {
        question: "Welche Versicherungen empfehlen Sie für Mieter in Delmenhorst?",
        answer: "Für Mieter in Delmenhorst empfehle ich eine Privathaftpflichtversicherung (Pflicht!), eine Hausratversicherung mit Einbruchschutz (besonders in städtischen Lagen), eine Zahnzusatzversicherung und eine Berufsunfähigkeitsversicherung. Mit dem ERGO Bündelnachlass ab fünf Verträgen sparen Sie bis zu 15%."
      },
      {
        question: "Kann ich meine bestehenden Versicherungen zu ERGO wechseln?",
        answer: "Ja, ein Wechsel ist in der Regel zum Ende der Vertragslaufzeit möglich. Ich prüfe kostenlos Ihre bestehenden Verträge, vergleiche den Leistungsumfang und zeige Ihnen, ob sich ein Wechsel zu ERGO für Sie lohnt. Oft ergibt sich durch bessere Konditionen und den Bündelnachlass eine deutliche Ersparnis."
      },
      {
        question: "Gibt es eine ERGO Agentur direkt in Delmenhorst?",
        answer: "Die nächste ERGO Agentur für Delmenhorst ist die Agentur Stübe in Ganderkesee – nur 10 Minuten entfernt. Ich betreue bereits viele zufriedene Kunden aus allen Delmenhorster Stadtteilen und biete Ihnen persönliche Beratung, Hausbesuche und digitale Beratung per WhatsApp oder Video."
      },
      {
        question: "Welche Vorteile hat ERGO gegenüber Online-Versicherungen für Delmenhorster?",
        answer: "Mit der ERGO Agentur Stübe haben Sie einen persönlichen Ansprechpartner vor Ort, der Sie kennt und Ihre Situation versteht. Im Schadenfall bin ich direkt für Sie da und unterstütze bei der Abwicklung. Online-Versicherer bieten zwar günstige Tarife, aber im Ernstfall fehlt der persönliche Kontakt. Zudem profitieren Sie bei ERGO von Testsieger-Produkten und dem Bündelnachlass."
      }
    ]
  },
  oldenburg: {
    name: "Oldenburg",
    region: "Kreisfreie Stadt",
    distance: "Nur 20 Minuten entfernt",
    metaTitle: "ERGO Versicherung Oldenburg – Agentur Stübe | Persönliche Beratung",
    metaDescription: "ERGO Versicherungsberatung für Oldenburg. Morino Stübe berät Sie persönlich – nur 20 Min. entfernt. Kostenlose Analyse & 15% Bündelnachlass ab 5 Verträgen.",
    keywords: "ERGO Oldenburg, Versicherung Oldenburg, Versicherungsberater Oldenburg, Versicherung wechseln Oldenburg, Versicherungsvergleich Oldenburg, Hausrat Oldenburg, Berufsunfähigkeit Oldenburg, Kfz Oldenburg, Zahnzusatz Oldenburg",
    description: "ERGO Versicherungsberatung für Oldenburg und Umgebung",
    intro: "Auch für Kunden aus Oldenburg biete ich persönliche ERGO Versicherungsberatung. Meine Agentur in Ganderkesee ist von Oldenburg aus bequem über die A28 in nur 20 Minuten erreichbar.",
    serviceText: "Als gebundener Versicherungsvertreter der ERGO biete ich Ihnen das komplette Produktportfolio – von der Kfz-Versicherung bis zur Altersvorsorge. Profitieren Sie von individueller Beratung statt anonymer Hotline.",
    einwohner: "ca. 172.000",
    ortsteile: ["Mitte", "Eversten", "Kreyenbrück", "Donnerschwee", "Osternburg", "Nadorst"],
    typisch: "Studenten, junge Berufstätige, Beamte, größere Unternehmen",
    risiken: ["Fahrraddiebstahl", "Haftpflichtrisiken in der Stadt", "Berufsunfähigkeit"],
    beraterIntro: "Mein Name ist Morino Stübe, und ich betreue zahlreiche Kunden aus Oldenburg und Umgebung. Die Universitätsstadt Oldenburg hat ganz eigene Anforderungen an Versicherungsschutz – ob Studenten, die ihre erste Haftpflicht brauchen, junge Berufstätige mit Bedarf an Berufsunfähigkeitsversicherung, oder Beamte mit speziellen Tarifen bei der DKV. In nur 20 Minuten über die A28 sind Sie bei mir – oder ich komme zu Ihnen nach Oldenburg.",
    detailedServiceText: "Oldenburg als Universitätsstadt mit rund 172.000 Einwohnern hat vielfältige Versicherungsbedürfnisse. Studenten benötigen oft ihre erste eigene Haftpflicht- und Hausratversicherung. Junge Berufstätige sollten frühzeitig an die Berufsunfähigkeitsversicherung und Altersvorsorge denken. Für Beamte in Oldenburg bieten wir über die DKV spezielle Beihilfe-konforme Krankenversicherungstarife an. Und für Unternehmen in Oldenburg gibt es maßgeschneiderte Gewerbeversicherungen. Ich berate Sie ganzheitlich und finde die optimale Lösung für Ihre individuelle Situation.",
    localSeoText: "Die ERGO Agentur Stübe bietet umfassende Versicherungsberatung für Oldenburg und alle Stadtteile – von Mitte über Eversten, Kreyenbrück und Donnerschwee bis Osternburg und Nadorst. Oldenburg als drittgrößte Stadt Niedersachsens mit rund 172.000 Einwohnern ist ein wichtiger Standort für Bildung, Wirtschaft und Kultur. Die Carl von Ossietzky Universität und die zahlreichen Fachhochschulen bringen viele junge Menschen in die Stadt, die erstmals eigene Versicherungen abschließen müssen.",
    localSeoText2: "Für Beamte und Angestellte im öffentlichen Dienst in Oldenburg bieten wir über ERGO und DKV spezialisierte Tarife an, die optimal auf die Beihilfe abgestimmt sind. Oldenburger Immobilienbesitzer profitieren von unserer Expertise in der Wohngebäudeversicherung mit Elementarschutz. Die Fahrradstadt Oldenburg hat zudem ein hohes Diebstahlrisiko – eine Hausratversicherung mit gutem Fahrradschutz ist hier besonders empfehlenswert. Von der Agentur in Ganderkesee sind Sie über die A28 in nur 20 Minuten bei uns. Vereinbaren Sie Ihren kostenlosen Beratungstermin noch heute.",
    testimonials: [
      { name: "Dr. Martina W. aus Eversten", text: "Als Beamtin war mir die richtige Krankenversicherung besonders wichtig. Herr Stübe hat mir die DKV Beihilfe-Tarife genau erklärt und das optimale Paket zusammengestellt.", stars: 5 },
      { name: "Jan-Philipp R., Student aus Oldenburg", text: "Als Student hatte ich keine Ahnung von Versicherungen. Herr Stübe hat mir geduldig alles erklärt und mir genau die Versicherungen empfohlen, die ich wirklich brauche – ohne unnötigen Kram.", stars: 5 },
      { name: "Unternehmer Frank D. aus Osternburg", text: "Für mein Unternehmen brauchte ich eine Betriebshaftpflicht und Rechtsschutz. Herr Stübe hat alles schnell und professionell arrangiert. Top Beratung!", stars: 5 },
    ],
    faqs: [
      {
        question: "Wie erreiche ich die ERGO Agentur Stübe von Oldenburg aus?",
        answer: "Von Oldenburg aus erreichen Sie die ERGO Agentur Stübe in der Friedensstraße 91 A, 27777 Ganderkesee in nur etwa 20 Minuten über die A28 (Ausfahrt Ganderkesee). Alternativ biete ich Ihnen Hausbesuche in Oldenburg, Beratung per Telefon, WhatsApp oder Videocall an."
      },
      {
        question: "Welche Versicherungen brauchen Studenten in Oldenburg?",
        answer: "Studenten in Oldenburg sollten mindestens eine Privathaftpflichtversicherung haben – die ist ab 8€ im Monat erhältlich und schützt vor existenzbedrohenden Schadensersatzforderungen. Zusätzlich empfehle ich eine Hausratversicherung (besonders wegen des hohen Fahrraddiebstahl-Risikos in Oldenburg) und eine Berufsunfähigkeitsversicherung, die im jungen Alter besonders günstig ist."
      },
      {
        question: "Bietet ERGO spezielle Tarife für Beamte in Oldenburg an?",
        answer: "Ja! Über die DKV (Teil der ERGO Gruppe) bieten wir spezielle Beihilfe-konforme Krankenversicherungstarife für Beamte und Beamtenanwärter an. Diese Tarife sind optimal auf die jeweilige Beihilfebemessungssätze abgestimmt. Ich berate Sie gerne zu den verschiedenen Optionen und finde den passenden Tarif für Ihre Besoldungsstufe."
      },
      {
        question: "Welche Versicherung schützt mein Fahrrad in Oldenburg vor Diebstahl?",
        answer: "In der Fahrradstadt Oldenburg ist ein guter Fahrradschutz besonders wichtig. Die ERGO Hausratversicherung bietet einen erweiterten Fahrradschutz, der Diebstahl auch außerhalb der Wohnung und rund um die Uhr absichert. Für besonders hochwertige Räder oder E-Bikes empfehle ich zusätzlich eine separate Fahrradversicherung."
      },
      {
        question: "Gibt es Versicherungsberatung für Unternehmen in Oldenburg?",
        answer: "Ja, ich berate auch Gewerbetreibende und Unternehmen in Oldenburg zu Betriebshaftpflicht, Inhaltsversicherung, Rechtsschutz für Firmen, D&O-Versicherung und weiteren Gewerbeversicherungen. Die ERGO bietet maßgeschneiderte Lösungen für Selbstständige, Freiberufler und mittelständische Unternehmen."
      },
      {
        question: "Lohnt sich eine Berufsunfähigkeitsversicherung für junge Berufstätige in Oldenburg?",
        answer: "Unbedingt! Gerade für junge Berufstätige in Oldenburg ist der frühe Abschluss einer BU-Versicherung besonders sinnvoll: Die Beiträge sind im jungen Alter deutlich günstiger, und der Gesundheitszustand ist in der Regel noch optimal. Die ERGO BU wurde von Finanztest mit SEHR GUT bewertet (2024). Ich berechne Ihnen gerne Ihr individuelles Angebot."
      }
    ]
  }
};

const insuranceProducts = [
  { name: "Hausratversicherung", href: "/versicherung/hausrat", price: "ab 15€/Monat", icon: Home },
  { name: "Haftpflichtversicherung", href: "/versicherung/haftpflicht", price: "ab 8€/Monat", icon: Shield },
  { name: "Wohngebäudeversicherung", href: "/versicherung/wohngebaeude", price: "ab 25€/Monat", icon: Building2 },
  { name: "Rechtsschutzversicherung", href: "/versicherung/rechtsschutz", price: "ab 22€/Monat", icon: Scale },
  { name: "Zahnzusatzversicherung", href: "/versicherung/zahnzusatz", price: "ab 12€/Monat", icon: Heart },
  { name: "Kfz-Versicherung", href: "/versicherung/leben-vorsorge", price: "individuell", icon: Car },
  { name: "Berufsunfähigkeitsversicherung", href: "/versicherung/leben-vorsorge", price: "ab 35€/Monat", icon: UserCheck },
  { name: "Unfallversicherung", href: "/versicherung/leben-vorsorge", price: "ab 10€/Monat", icon: Umbrella },
  { name: "Risikolebensversicherung", href: "/versicherung/leben-vorsorge", price: "ab 5€/Monat", icon: Heart },
  { name: "Private Krankenversicherung (DKV)", href: "/versicherung/leben-vorsorge", price: "individuell", icon: FileCheck },
];

const ergoAwards = [
  { title: "Zahnzusatz Testsieger", source: "Stiftung Warentest", rating: "SEHR GUT", year: "2024", icon: Award },
  { title: "Berufsunfähigkeit", source: "Finanztest", rating: "SEHR GUT", year: "2024", icon: Award },
  { title: "Service-Champion", source: "11x in Folge", rating: "Nr. 1", year: "2025", icon: Star },
  { title: "Kfz-Versicherung", source: "Franke & Bornberg", rating: "HERVORRAGEND", year: "2025", icon: Award },
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
  { label: 'Kfz-Versicherung', icon: '🚗', type: 'kfz' },
  { label: 'Hausrat & Haftpflicht', icon: '🏠', type: 'hausrat' },
  { label: 'Zahnzusatz', icon: '🦷', type: 'zahnzusatz' },
  { label: 'Berufsunfähigkeit', icon: '💼', type: 'bu' },
  { label: 'Gewerbe & Betrieb', icon: '🏢', type: 'gewerbe' },
  { label: 'Alle prüfen', icon: '✅', type: 'all' },
];

const QUIZ_TO_FUNNEL: Record<string, { type: string; label: string }> = {
  kfz: { type: 'kfz', label: 'Kfz-Versicherung' },
  hausrat: { type: 'hausrat', label: 'Hausrat & Haftpflicht' },
  zahnzusatz: { type: 'zahnzusatz', label: 'Zahnzusatz' },
  bu: { type: 'berufsunfaehigkeit', label: 'Berufsunfähigkeit' },
  gewerbe: { type: 'gewerbe', label: 'Gewerbe & Betrieb' },
};

export default function CityLanding({ cityKey }: { cityKey: string }) {
  const data = cityData[cityKey];
  const [showFunnel, setShowFunnel] = useState(false);
  const [funnelInsuranceType, setFunnelInsuranceType] = useState<string | undefined>(undefined);
  const [funnelInsuranceLabel, setFunnelInsuranceLabel] = useState<string | undefined>(undefined);

  const closeFunnel = useCallback(() => {
    setShowFunnel(false);
    setFunnelInsuranceType(undefined);
    setFunnelInsuranceLabel(undefined);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Seite nicht gefunden</h1>
          <Link href="/" className="text-ergo-red hover:underline">Zur Startseite</Link>
        </div>
      </div>
    );
  }

  const whatsappNumber = "15566771019";
  const whatsappMessage = encodeURIComponent(
    `Hallo Herr Stübe, ich komme aus ${data.name} und interessiere mich für eine persönliche Versicherungsberatung.`
  );

  return (
    <>
      <SEO
        title={data.metaTitle}
        description={data.metaDescription}
        keywords={data.keywords}
        locality={data.name}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "InsuranceAgency",
          "name": "ERGO Agentur Stübe",
          "description": data.description,
          "telephone": "+4915566771019",
          "email": "morino.stuebe@ergo.de",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Friedensstraße 91 A",
            "addressLocality": "Ganderkesee",
            "postalCode": "27777",
            "addressRegion": "Niedersachsen",
            "addressCountry": "DE"
          },
          "areaServed": {
            "@type": "City",
            "name": data.name
          },
          "sameAs": [
            "https://www.instagram.com/morino_stuebe/"
          ]
        }}
      />
      <Breadcrumb items={[{ label: data.name }]} />
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
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{data.region} · {data.distance} · {data.einwohner} Einwohner</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
                >
                  Ihre ERGO Agentur für{' '}
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    {data.name}
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  className="text-base sm:text-lg text-white/90 max-w-xl mx-auto lg:mx-0 mb-3 leading-relaxed"
                >
                  {data.intro}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                  className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 px-3 py-1.5 rounded-full text-xs text-green-200 font-semibold mb-2"
                >
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Heute noch {3 + (new Date().getDay() % 3)} freie Beratungstermine
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
                      const isAll = opt.type === 'all';
                      return (
                        <button
                          key={opt.type}
                          onClick={() => {
                            trackEvent('quiz_option_clicked', { option: opt.type, source: 'city_hero_quiz', city: data.name });
                            if (!isAll) {
                              const mapping = QUIZ_TO_FUNNEL[opt.type];
                              setFunnelInsuranceType(mapping?.type);
                              setFunnelInsuranceLabel(mapping?.label);
                            } else {
                              setFunnelInsuranceType(undefined);
                              setFunnelInsuranceLabel(undefined);
                            }
                            setShowFunnel(true);
                          }}
                          className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all active:scale-[0.98] group
                            ${isAll
                              ? 'border-[#E2001A] bg-gradient-to-r from-[#E2001A] to-[#c5001a] text-white hover:shadow-lg hover:shadow-red-500/25 sm:col-span-2'
                              : 'border-gray-200 bg-gray-50 hover:border-[#E2001A] hover:bg-red-50'
                            }`}
                        >
                          <span className="text-2xl leading-none shrink-0">{opt.icon}</span>
                          <span className={`font-semibold text-sm ${isAll ? 'text-white' : 'text-gray-800 group-hover:text-[#E2001A]'}`}>
                            {opt.label}
                          </span>
                          <ChevronRight className={`w-4 h-4 ml-auto shrink-0 ${isAll ? 'text-white/80' : 'text-gray-400 group-hover:text-[#E2001A]'}`} />
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                    <p className="text-[10px] sm:text-xs text-gray-400">🔒 100% kostenlos & unverbindlich · DSGVO-konform</p>
                    <a
                      href={`https://wa.me/49${whatsappNumber}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => { trackEvent("city_whatsapp", { city: data.name }); trackConversion(); }}
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

        {/* Berater-Vorstellung Section – Glassmorphism */}
        <motion.section {...fadeInUp} className="px-4 py-10 md:py-14 max-w-3xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">
            Ihr persönlicher Berater für {data.name}
          </h2>
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
                <p className="text-ergo-red font-semibold text-sm mb-3 md:text-base">ERGO Versicherungsfachmann · Ganderkesee & Region</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 md:text-base">{data.beraterIntro}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
                    <Clock className="w-3 h-3" /> Flexible Termine
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full">
                    <MessageSquare className="w-3 h-3" /> WhatsApp Erreichbar
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-700 px-3 py-1.5 rounded-full">
                    <MapPin className="w-3 h-3" /> Hausbesuche möglich
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ERGO Testsieger Badges */}
        <motion.section {...fadeInUp} className="py-10 md:py-14 bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
              ERGO – Ausgezeichnete Qualität
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Vielfach ausgezeichnet von unabhängigen Testinstituten
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ergoAwards.map((award) => (
                <div key={award.title} className="bg-white rounded-xl p-4 text-center border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
                  <award.icon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-xs font-bold text-ergo-red uppercase tracking-wide mb-1">{award.rating}</div>
                  <div className="text-sm font-semibold text-gray-900 mb-1">{award.title}</div>
                  <div className="text-xs text-gray-500">{award.source}</div>
                  <div className="text-xs text-gray-400 mt-1">{award.year}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Detailed Service Descriptions */}
        <motion.section {...fadeInUp} className="py-10 md:py-14 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
              Versicherungsberatung speziell für {data.name}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">{data.detailedServiceText}</p>

            {data.risiken.length > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-5 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-ergo-red" />
                  Typische Risiken in {data.name}
                </h3>
                <ul className="space-y-2">
                  {data.risiken.map((risiko) => (
                    <li key={risiko} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="w-4 h-4 text-ergo-red flex-shrink-0" />
                      {risiko}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.section>

        {/* Insurance Products */}
        <motion.section {...fadeInUp} className="py-10 md:py-14 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
              Versicherungen für {data.name} im Überblick
            </h2>
            <p className="text-gray-600 mb-8">{data.serviceText}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {insuranceProducts.map((product) => {
                const IconComponent = product.icon;
                return (
                  <Link
                    key={product.name}
                    href={product.href}
                    onClick={() => trackEvent("city_product_click", { city: data.name, product: product.name })}
                    className="flex items-center justify-between p-4 bg-white rounded-xl hover:bg-blue-50 hover:border-ergo-red border border-gray-200 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-5 h-5 text-ergo-red" />
                      <span className="font-medium text-gray-900 group-hover:text-ergo-red transition-colors">
                        {product.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{product.price}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Why ERGO Agentur Stübe */}
        <motion.section {...fadeInUp} className="py-10 md:py-14 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
              Warum ERGO Agentur Stübe für {data.name}?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Kostenlose Analyse", desc: "Wir prüfen Ihre bestehenden Verträge und finden Einsparpotenziale – komplett kostenlos und unverbindlich.", icon: FileCheck },
                { title: "15% Bündelnachlass", desc: "Ab 5 Versicherungen profitieren Sie von attraktiven Rabatten. Typische Familien sparen über 400€ pro Jahr.", icon: TrendingUp },
                { title: "Persönlich vor Ort", desc: `Keine Hotline – persönliche Beratung für Kunden aus ${data.name}. Auch Hausbesuche und WhatsApp-Beratung.`, icon: Users },
              ].map((item) => (
                <div key={item.title} className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-ergo-red/10 rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-ergo-red" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Local Testimonials / Trust Section */}
        <motion.section {...fadeInUp} className="py-10 md:py-14 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
              Das sagen Kunden aus {data.name}
            </h2>
            <p className="text-gray-500 text-center mb-8">Echte Erfahrungen unserer zufriedenen Kunden</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: testimonial.stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">„{testimonial.text}"</p>
                  <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <TrustBar />

        <FAQSection
          title={`Häufige Fragen zur Versicherungsberatung in ${data.name}`}
          subtitle="Hier finden Sie Antworten auf die wichtigsten Fragen"
          faqs={data.faqs}
          className="bg-white"
        />

        {/* Instagram Social Proof */}
        <motion.section {...fadeInUp} className="py-10 md:py-14 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              Folgen Sie uns auf Instagram
            </h2>
            <p className="text-gray-600 mb-6">
              Versicherungstipps, Einblicke & Neuigkeiten aus der ERGO Agentur Stübe
            </p>
            <a
              href="https://www.instagram.com/morino_stuebe/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("city_instagram_click", { city: data.name })}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold px-6 sm:px-8 py-4 min-h-[44px] rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105"
            >
              <Instagram className="w-6 h-6" />
              @morino_stuebe folgen
            </a>
            <p className="text-sm text-gray-500 mt-4">
              Regelmäßige Tipps zu Versicherungen, Vorsorge und Absicherung für {data.name} und Umgebung
            </p>
          </div>
        </motion.section>

        {/* Local SEO Text */}
        <motion.section {...fadeInUp} className="py-10 md:py-14 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
              Versicherungsschutz in {data.name} – Was Sie wissen sollten
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed mb-6">{data.localSeoText}</p>
              <p className="text-gray-600 leading-relaxed mb-6">{data.localSeoText2}</p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mt-8">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Wir betreuen alle Ortsteile in {data.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.ortsteile.map((ortsteil) => (
                  <span key={ortsteil} className="bg-white text-gray-700 text-sm px-3 py-1.5 rounded-full border border-blue-200">
                    {ortsteil}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Contact CTA */}
        <motion.section {...fadeInUp} className="py-10 md:py-14 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              Kontakt für {data.name}
            </h2>
            <p className="text-gray-600 mb-2">
              Morino Stübe · Friedensstraße 91 A · 27777 Ganderkesee
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {data.distance} · Montag bis Freitag, flexible Terminvereinbarung
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:015566771019"
                onClick={() => trackEvent("city_phone_click", { city: data.name })}
                className="flex items-center justify-center gap-2 bg-[#003781] text-white font-semibold px-6 py-3.5 min-h-[44px] rounded-xl hover:bg-blue-800 transition-colors"
              >
                <Phone className="w-5 h-5" />
                01556 6771019
              </a>
              <a
                href={`https://wa.me/49${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent("city_whatsapp_bottom", { city: data.name });
                  trackConversion();
                }}
                className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold px-6 py-3.5 min-h-[44px] rounded-xl hover:bg-green-600 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                WhatsApp schreiben
              </a>
              <Link
                href="/termin"
                onClick={() => trackEvent("city_termin_click", { city: data.name })}
                className="flex items-center justify-center gap-2 border-2 border-ergo-red text-ergo-red font-semibold px-6 py-3.5 min-h-[44px] rounded-xl hover:bg-red-50 transition-colors"
              >
                <Clock className="w-5 h-5" />
                Termin vereinbaren
              </Link>
            </div>
          </div>
        </motion.section>
        {/* Sticky Mobile CTA Bar */}
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-3 py-2 flex gap-2 sm:hidden safe-area-bottom">
          <button
            onClick={() => {
              setShowFunnel(true);
              trackEvent('city_sticky_cta', { city: data.name });
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#E2001A] to-[#c5001a] text-white font-semibold text-sm min-h-[44px] py-3 rounded-xl whitespace-nowrap shadow-lg shadow-red-500/20 animate-pulse-subtle"
          >
            <Mail className="w-4 h-4 shrink-0" />
            Kostenlose Analyse
          </button>
          <a
            href={`https://wa.me/49${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackEvent('city_sticky_whatsapp', { city: data.name });
              trackConversion();
            }}
            className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold text-sm px-4 min-h-[44px] py-3 rounded-xl active:scale-[0.97] transition-transform whitespace-nowrap"
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            WhatsApp
          </a>
        </div>

        <FunnelOverlay
          isOpen={showFunnel}
          onClose={closeFunnel}
          insuranceType={funnelInsuranceType}
          insuranceLabel={funnelInsuranceLabel}
        />
      </main>
    </>
  );
}
