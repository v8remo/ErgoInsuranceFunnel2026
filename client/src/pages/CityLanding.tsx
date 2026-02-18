import { useParams, Link } from "wouter";
import { Phone, MessageSquare, MapPin, Shield, CheckCircle, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { trackEvent, trackConversion } from "@/lib/analytics";

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
}> = {
  ganderkesee: {
    name: "Ganderkesee",
    region: "Landkreis Oldenburg",
    distance: "Direkt vor Ort",
    metaTitle: "ERGO Versicherung Ganderkesee – Agentur Stübe | Persönliche Beratung",
    metaDescription: "Ihre ERGO Versicherungsagentur in Ganderkesee. Morino Stübe berät Sie persönlich zu Hausrat, Haftpflicht, Kfz & mehr. Kostenlose Analyse Ihrer Verträge.",
    keywords: "ERGO Ganderkesee, Versicherung Ganderkesee, Versicherungsberater Ganderkesee, Morino Stübe, Hausratversicherung Ganderkesee, Haftpflicht Ganderkesee, Kfz-Versicherung Ganderkesee",
    description: "Ihre ERGO Versicherungsagentur direkt in Ganderkesee",
    intro: "Als Ihr ERGO Versicherungsberater in Ganderkesee bin ich direkt vor Ort für Sie da. In meiner Agentur in der Friedensstraße 91 A berate ich Sie persönlich und individuell zu allen Versicherungsfragen.",
    serviceText: "Von Ganderkesee aus betreue ich Kunden in der gesamten Region. Ob Hausrat, Haftpflicht, Kfz oder Zahnzusatz – ich finde die passende Absicherung für Ihre Lebenssituation."
  },
  delmenhorst: {
    name: "Delmenhorst",
    region: "Kreisfreie Stadt",
    distance: "Nur 10 Minuten entfernt",
    metaTitle: "ERGO Versicherung Delmenhorst – Agentur Stübe | Beratung in Ihrer Nähe",
    metaDescription: "ERGO Versicherungsberatung für Delmenhorst. Persönliche Betreuung durch Morino Stübe, nur 10 Min. entfernt. Kostenlose Versicherungsanalyse & Bündelnachlass.",
    keywords: "ERGO Delmenhorst, Versicherung Delmenhorst, Versicherungsberater Delmenhorst, Versicherung wechseln Delmenhorst, Hausratversicherung Delmenhorst, Haftpflicht Delmenhorst",
    description: "ERGO Versicherungsberatung für Delmenhorst und Umgebung",
    intro: "Für Kunden aus Delmenhorst bin ich nur eine kurze Fahrt entfernt. Meine ERGO Agentur in Ganderkesee liegt verkehrsgünstig und ist von Delmenhorst aus schnell erreichbar – persönliche Beratung, die sich lohnt.",
    serviceText: "Viele meiner zufriedenen Kunden kommen aus Delmenhorst und Umgebung. Ich biete Ihnen die gleiche persönliche Betreuung wie meinen Ganderkeseer Kunden – mit kostenloser Vertragsanalyse und individuellen Empfehlungen."
  },
  oldenburg: {
    name: "Oldenburg",
    region: "Kreisfreie Stadt",
    distance: "Nur 20 Minuten entfernt",
    metaTitle: "ERGO Versicherung Oldenburg – Agentur Stübe | Persönliche Beratung",
    metaDescription: "ERGO Versicherungsberatung für Oldenburg. Morino Stübe berät Sie persönlich – nur 20 Min. entfernt. Kostenlose Analyse & 15% Bündelnachlass ab 5 Verträgen.",
    keywords: "ERGO Oldenburg, Versicherung Oldenburg, Versicherungsberater Oldenburg, Versicherung wechseln Oldenburg, Versicherungsvergleich Oldenburg, Hausrat Oldenburg",
    description: "ERGO Versicherungsberatung für Oldenburg und Umgebung",
    intro: "Auch für Kunden aus Oldenburg biete ich persönliche ERGO Versicherungsberatung. Meine Agentur in Ganderkesee ist von Oldenburg aus bequem über die A28 in nur 20 Minuten erreichbar.",
    serviceText: "Als gebundener Versicherungsvertreter der ERGO biete ich Ihnen das komplette Produktportfolio – von der Kfz-Versicherung bis zur Altersvorsorge. Profitieren Sie von individueller Beratung statt anonymer Hotline."
  }
};

const insuranceProducts = [
  { name: "Hausratversicherung", href: "/versicherung/hausrat", price: "ab 15€/Monat" },
  { name: "Haftpflichtversicherung", href: "/versicherung/haftpflicht", price: "ab 8€/Monat" },
  { name: "Wohngebäudeversicherung", href: "/versicherung/wohngebaeude", price: "ab 25€/Monat" },
  { name: "Rechtsschutzversicherung", href: "/versicherung/rechtsschutz", price: "ab 22€/Monat" },
  { name: "Zahnzusatzversicherung", href: "/versicherung/zahnzusatz", price: "ab 12€/Monat" },
];

export default function CityLanding() {
  const { city } = useParams();
  const data = cityData[city as string];

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
          }
        }}
      />
      <Header />

      <main className="min-h-screen">
        <section className="py-10 md:py-16 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <MapPin className="w-4 h-4" />
              <span>{data.region}</span>
              <span className="mx-1">·</span>
              <span className="text-ergo-red font-medium">{data.distance}</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Ihre ERGO Versicherungsagentur für{" "}
              <span className="text-ergo-red">{data.name}</span>
            </h1>

            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6">
              {data.intro}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                href="/"
                onClick={() => trackEvent("city_cta_beratung", { city: data.name })}
                className="flex items-center justify-center gap-2 bg-ergo-red text-white font-semibold px-6 py-3.5 rounded-xl shadow-md hover:bg-red-700 transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
                Jetzt Beratung anfragen
              </Link>
              <a
                href={`https://wa.me/49${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent("city_whatsapp", { city: data.name });
                  trackConversion();
                }}
                className="flex items-center justify-center gap-2 border-2 border-green-500 text-green-600 font-semibold px-6 py-3.5 rounded-xl hover:bg-green-50 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                WhatsApp Beratung
              </a>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
              Versicherungen für {data.name} im Überblick
            </h2>
            <p className="text-gray-600 mb-8">{data.serviceText}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {insuranceProducts.map((product) => (
                <Link
                  key={product.name}
                  href={product.href}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:border-ergo-red border border-gray-200 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-ergo-red" />
                    <span className="font-medium text-gray-900 group-hover:text-ergo-red transition-colors">
                      {product.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{product.price}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
              Warum ERGO Agentur Stübe?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Kostenlose Analyse", desc: "Wir prüfen Ihre bestehenden Verträge und finden Einsparpotenziale." },
                { title: "15% Bündelnachlass", desc: "Ab 5 Versicherungen profitieren Sie von attraktiven Rabatten." },
                { title: "Persönlich vor Ort", desc: `Keine Hotline – persönliche Beratung für Kunden aus ${data.name}.` },
              ].map((item) => (
                <div key={item.title} className="bg-white p-5 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              Kontakt für {data.name}
            </h2>
            <p className="text-gray-600 mb-6">
              Morino Stübe · Friedensstraße 91 A · 27777 Ganderkesee
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:015566771019"
                className="flex items-center justify-center gap-2 bg-[#003781] text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-blue-800 transition-colors"
              >
                <Phone className="w-5 h-5" />
                01556 6771019
              </a>
              <a
                href={`https://wa.me/49${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-green-600 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                WhatsApp schreiben
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
