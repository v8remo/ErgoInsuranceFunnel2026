import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InsuranceFunnel from "@/components/InsuranceFunnel";
import TrustSection from "@/components/TrustSection";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trackEvent, trackConversion, trackAppointmentConversion } from "@/lib/analytics";
import { useQuery } from "@tanstack/react-query";
import { 
  Home as HomeIcon, 
  Handshake, 
  Building, 
  Scale, 
  Smile,
  Star,
  Shield,
  Clock,
  Award
} from "lucide-react";

import _089_Ti9r4yWZjrM from "@assets/089-Ti9r4yWZjrM.jpeg";
import type { Content } from "@shared/schema";

const insuranceProducts = [
  {
    id: "hausrat",
    title: "Hausratversicherung",
    description: "Schutz für Ihr Hab und Gut. Absicherung gegen Einbruch, Feuer, Wasser und Sturm.",
    price: "ab 15€/Monat",
    badge: "Bestseller",
    badgeColor: "bg-green-100 text-green-800",
    icon: HomeIcon,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop",
    features: [
      "Hausrat bis 50.000€",
      "Elementarschäden inklusive", 
      "Fahrraddiebstahl"
    ]
  },
  {
    id: "haftpflicht",
    title: "Haftpflichtversicherung", 
    description: "Schutz vor existenzbedrohenden Schadenersatzforderungen. Ein Muss für jeden.",
    price: "ab 8€/Monat",
    badge: "Pflicht",
    badgeColor: "bg-red-100 text-red-800",
    icon: Handshake,
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=250&fit=crop",
    features: [
      "50 Mio € Deckung",
      "Mietsachschäden",
      "Weltweiter Schutz"
    ]
  },
  {
    id: "wohngebaeude",
    title: "Wohngebäudeversicherung",
    description: "Rundum-Schutz für Ihr Eigenheim gegen alle Gefahren. Ihre Investition ist sicher.",
    price: "ab 25€/Monat", 
    badge: "Premium",
    badgeColor: "bg-blue-100 text-blue-800",
    icon: Building,
    image: "@assets/wohngebaeudeversicherung.dam_1749718195826.jpg",
    features: [
      "Elementarschutz",
      "Photovoltaik inklusive",
      "Glasbruch"
    ]
  },
  {
    id: "rechtsschutz",
    title: "Rechtsschutzversicherung",
    description: "Durchsetzen Ihres Rechts ohne finanzielle Sorgen. Anwalts- und Gerichtskosten abgedeckt.",
    price: "ab 18€/Monat",
    badge: "Empfohlen", 
    badgeColor: "bg-purple-100 text-purple-800",
    icon: Scale,
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=250&fit=crop",
    features: [
      "Privat & Beruf",
      "Verkehrsrechtsschutz", 
      "Mediation inklusive"
    ]
  },
  {
    id: "zahnzusatz", 
    title: "Zahnzusatzversicherung",
    description: "Für schöne und gesunde Zähne. Ohne Wartezeit und mit Sofortleistung.",
    price: "ab 10€/Monat",
    badge: "Beliebt",
    badgeColor: "bg-yellow-100 text-yellow-800", 
    icon: Smile,
    image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&h=250&fit=crop",
    features: [
      "100% Zahnreinigung",
      "90% Zahnersatz",
      "Kieferorthopädie"
    ]
  }
];

export default function Home() {
  const [selectedInsurance, setSelectedInsurance] = useState<string | null>(null);
  const [funnelOpen, setFunnelOpen] = useState(false);

  // Load content from database
  const { data: content = [] } = useQuery<Content[]>({
    queryKey: ['/api/content'],
    queryFn: async () => {
      const response = await fetch('/api/content');
      return response.json();
    }
  });

  // Helper function to get content for specific insurance
  const getInsuranceContent = (insuranceId: string) => {
    return content.find(c => c.type === 'insurance' && c.identifier === insuranceId);
  };

  const handleInsuranceSelection = (insuranceId: string) => {
    if (insuranceId === "kombi") {
      // Handle combination package - redirect to contact
      window.location.href = "tel:015566771019";
      trackEvent("combo_package_selected");
      return;
    }

    setSelectedInsurance(insuranceId);
    setFunnelOpen(true);
    trackEvent("insurance_selected", { insurance_type: insuranceId });
  };

  const closeFunnel = () => {
    setFunnelOpen(false);
    setSelectedInsurance(null);
  };

  return (
    <>
      <SEO 
        title="ERGO Versicherung Ganderkesee - Kostenlose Analyse & 15% Bündelnachlass"
        description="⭐ Kostenlose Versicherungsanalyse ⭐ 15% Bündelnachlass ab 3 Verträgen ⭐ Optimierung bestehender Policen ⭐ WhatsApp Beratung: 01556 6771019"
        keywords="ERGO Versicherung Ganderkesee, kostenlose Versicherungsanalyse, Bündelnachlass, Morino Stübe, Hausratversicherung, Haftpflichtversicherung, Wohngebäudeversicherung, Rechtsschutz, Zahnzusatz"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Kostenlose Versicherungsanalyse",
          "description": "Professionelle Analyse bestehender Versicherungen mit Optimierungsvorschlägen und 15% Bündelnachlass",
          "provider": {
            "@type": "InsuranceAgency",
            "name": "ERGO Versicherung Ganderkesee",
            "telephone": "+4915566771019",
            "email": "morino.stuebe@ergo.de"
          },
          "offers": {
            "@type": "Offer",
            "description": "15% Bündelnachlass ab 3 Versicherungen",
            "price": "0",
            "priceCurrency": "EUR"
          },
          "areaServed": {
            "@type": "Country",
            "name": "Deutschland"
          }
        }}
      />
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="py-6 sm:py-8 lg:py-12 bg-gradient-to-br from-ergo-red-light via-ergo-gray-light to-white overflow-hidden">
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              {/* Professional advisor image */}
              <img 
                src={_089_Ti9r4yWZjrM} 
                alt="ERGO Versicherungsexperte - Deutschlandweite Beratung" 
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-6 sm:mb-8 shadow-lg object-cover border-4 border-white"
                loading="eager"
                decoding="async"
              />
              
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-ergo-dark mb-3 sm:mb-4 px-2 break-words">
                <span className="text-ergo-red">Sofortige Versicherungsberatung</span>
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>in nur 3 Minuten
              </h1>
              
              <p className="text-sm sm:text-base lg:text-lg text-high-contrast text-readable mb-4 sm:mb-6 max-w-3xl mx-auto px-2">
                <strong>Kostenlose Analyse Ihrer bestehenden Versicherungen!</strong> Wir optimieren Ihre Verträge und bieten günstigere Alternativen. 
                <span className="text-ergo-red font-bold">15% Bündelnachlass ab 3 Versicherungen!</span> Über 1000 Kunden vertrauen bereits auf unsere Expertise.
              </p>
              
              {/* Primary CTA Button */}
              <div className="mb-6 sm:mb-8">
                <Button 
                  className="bg-ergo-red hover:bg-ergo-red-hover text-white px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 w-auto"
                  onClick={() => {
                    trackEvent('primary_cta_clicked', { source: 'hero_section', action: 'whatsapp_consultation' });
                    trackAppointmentConversion('https://wa.me/4915566771019?text=Hallo, ich möchte eine kostenlose Versicherungsberatung!');
                  }}
                >
                  🚀 JETZT KOSTENLOS BERATEN LASSEN
                </Button>
                <p className="text-sm text-medium-contrast mt-3">Antwort binnen 2 Minuten • Unverbindlich • Kostenlos</p>
              </div>
              
              {/* Enhanced Trust Indicators */}
              <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 px-2">
                <div className="flex items-center text-high-contrast text-sm sm:text-base bg-green-50 px-4 py-2 rounded-full">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-700 mr-2 flex-shrink-0" />
                  <span className="font-bold">1000+ zufriedene Kunden</span>
                </div>
                <div className="flex items-center text-high-contrast text-sm sm:text-base bg-blue-50 px-4 py-2 rounded-full">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700 mr-2 flex-shrink-0" />
                  <span className="font-bold">Antwort in 2 Min</span>
                </div>
                <div className="flex items-center text-high-contrast text-sm sm:text-base bg-yellow-50 px-4 py-2 rounded-full">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-700 mr-2 flex-shrink-0" />
                  <span className="font-bold">15% Bündelnachlass ab 3</span>
                </div>
              </div>
            </div>

            {/* Insurance Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16 auto-rows-fr">
              {insuranceProducts.map((product) => (
                <Card 
                  key={product.id}
                  className="insurance-card cursor-pointer hover:shadow-xl transition-all duration-300 w-full h-full flex flex-col"
                  onClick={() => handleInsuranceSelection(product.id)}
                >
                  <CardContent className="p-0 flex flex-col h-full">
                    <img 
                      src={getInsuranceContent(product.id)?.imageUrl || product.image}
                      alt={product.title}
                      className="w-full h-40 sm:h-48 object-cover rounded-t-lg flex-shrink-0"
                      loading="lazy"
                      decoding="async"
                    />
                    
                    <div className="p-4 sm:p-6 flex flex-col flex-grow">
                      <div className="flex items-start mb-3 sm:mb-4">
                        <product.icon className="w-5 h-5 sm:w-6 sm:h-6 text-ergo-red mr-2 sm:mr-3 mt-1 flex-shrink-0" />
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-high-contrast leading-tight break-words hyphens-auto">{product.title}</h3>
                      </div>
                      
                      <p className="text-medium-contrast text-readable mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed flex-grow">
                        {product.description}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
                        <div className="flex flex-col">
                          <span className="text-xl sm:text-2xl font-bold text-ergo-red">{product.price}</span>
                          <span className="text-xs text-gray-500">statt 25€/Monat</span>
                        </div>
                        <Badge className={`${product.badgeColor} text-xs sm:text-sm w-fit animate-pulse`}>
                          {product.badge}
                        </Badge>
                      </div>
                      
                      <ul className="text-xs sm:text-sm text-medium-contrast text-readable mb-4 sm:mb-6 space-y-1 sm:space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-2 flex-shrink-0" />
                            <span className="leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button className="w-full bg-ergo-red hover:bg-ergo-red-hover text-white text-sm sm:text-base py-3 sm:py-4 mt-auto font-bold">
                        ⚡ SOFORT-ANGEBOT ERHALTEN
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Combination Package */}
              <Card 
                className="insurance-card cursor-pointer bg-gradient-to-br from-ergo-red to-ergo-red-dark text-white hover:shadow-xl transition-all duration-300 w-full h-full flex flex-col"
                onClick={() => handleInsuranceSelection("kombi")}
              >
                <CardContent className="p-0 flex flex-col h-full">
                  <img 
                    src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=250&fit=crop"
                    alt="Familie unter einem Regenschirm als Symbol für Schutz"
                    className="w-full h-40 sm:h-48 object-cover rounded-t-lg flex-shrink-0"
                    loading="lazy"
                    decoding="async"
                  />
                  
                  <div className="p-4 sm:p-6 bg-ergo-red flex flex-col flex-grow">
                    <div className="flex items-start mb-3 sm:mb-4">
                      <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 mr-2 sm:mr-3 mt-1 flex-shrink-0" />
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white leading-tight break-words hyphens-auto">Rundumschutz-Paket</h3>
                    </div>
                    
                    <p className="text-white mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed flex-grow">
                      Sparen Sie mit unseren Kombipaketen. 15% Bündelnachlass ab 3 Versicherungen plus Optimierung Ihrer bestehenden Verträge.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
                      <span className="text-xl sm:text-2xl font-bold text-white">15% Bündelnachlass</span>
                      <Badge className="bg-yellow-300 text-ergo-red font-bold text-xs sm:text-sm w-fit">
                        TOP DEAL
                      </Badge>
                    </div>
                    
                    <ul className="text-xs sm:text-sm text-white mb-4 sm:mb-6 space-y-1 sm:space-y-2">
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-300 rounded-full mr-2 flex-shrink-0" />
                        <span>Kostenlose Analyse bestehender Verträge</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-300 rounded-full mr-2 flex-shrink-0" />
                        <span>15% Bündelnachlass ab 3 Versicherungen</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-300 rounded-full mr-2 flex-shrink-0" />
                        <span>Optimierung & günstigere Alternativen</span>
                      </li>
                    </ul>
                    
                    <Button className="w-full bg-yellow-300 text-ergo-red hover:bg-yellow-400 font-bold text-sm sm:text-base py-3 sm:py-4 mt-auto">
                      💰 15% BÜNDELNACHLASS SICHERN
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Urgency & Social Proof Section */}
            <div className="bg-gradient-to-r from-red-50 to-yellow-50 rounded-2xl p-6 sm:p-8 mb-8 sm:mb-12 border-2 border-red-100">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-ergo-red mb-4">
                  🔥 Kostenlose Analyse & Optimierung
                </h2>
                <p className="text-high-contrast text-readable mb-6 text-sm sm:text-base">
                  <strong>Immer kostenlos:</strong> Vollständige Analyse Ihrer bestehenden Versicherungen. 
                  Wir optimieren Ihre Verträge und finden günstigere Alternativen. 
                  <span className="text-ergo-red font-bold">15% Rabatt ab 3 Versicherungen!</span> 
                  Bereits <span className="text-ergo-red font-bold">47 Kunden</span> haben heute gespart!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    className="bg-ergo-red hover:bg-ergo-red-hover text-white px-6 py-3 font-bold rounded-lg"
                    onClick={() => {
                      trackEvent('urgency_call_clicked', { source: 'urgency_section', value: 150 });
                      window.open('tel:015566771019');
                    }}
                  >
                    📞 JETZT ANRUFEN: 01556 6771019
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-ergo-red text-ergo-red hover:bg-ergo-red hover:text-white px-6 py-3 font-bold rounded-lg"
                    onClick={() => {
                      trackEvent('urgency_whatsapp_clicked', { source: 'urgency_section', value: 150 });
                      window.open('https://wa.me/4915566771019?text=Hallo, ich möchte die kostenlose Versicherungsanalyse per WhatsApp!', '_blank');
                    }}
                  >
                    💬 WhatsApp Beratung
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  ⏰ Angebot gültig bis heute 23:59 Uhr
                </p>
              </div>
            </div>
          </div>
        </section>

        <TrustSection />

        {/* Insurance Funnel Modal */}
        {funnelOpen && selectedInsurance && (
          <InsuranceFunnel 
            insuranceType={selectedInsurance}
            onClose={closeFunnel}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
