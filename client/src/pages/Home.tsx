import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InsuranceFunnel from "@/components/InsuranceFunnel";
import TrustSection from "@/components/TrustSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trackEvent } from "@/lib/analytics";
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
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop",
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
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-ergo-red-light via-ergo-gray-light to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              {/* Professional advisor image */}
              <img 
                src={_089_Ti9r4yWZjrM} 
                alt="ERGO Versicherungsexperte - Deutschlandweite Beratung" 
                className="w-32 h-32 rounded-full mx-auto mb-8 shadow-lg object-cover border-4 border-white"
              />
              
              <h1 className="text-4xl sm:text-5xl font-bold text-ergo-dark mb-6">
                Ihr <span className="text-ergo-red">ERGO Versicherungsexperte</span><br />
                deutschlandweit
              </h1>
              
              <p className="text-xl text-ergo-dark-light mb-8 max-w-3xl mx-auto">
                Persönliche Beratung für maßgeschneiderte Versicherungslösungen. 
                Profitieren Sie von über 10 Jahren Erfahrung und modernster digitaler Beratung.
              </p>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
                <div className="flex items-center text-ergo-dark">
                  <Shield className="w-5 h-5 text-ergo-red mr-2" />
                  <span className="font-medium">Über 1000 zufriedene Kunden</span>
                </div>
                <div className="flex items-center text-ergo-dark">
                  <Clock className="w-5 h-5 text-ergo-red mr-2" />
                  <span className="font-medium">24h Schadenservice</span>
                </div>
                <div className="flex items-center text-ergo-dark">
                  <Award className="w-5 h-5 text-ergo-red mr-2" />
                  <span className="font-medium">ERGO Qualitätspartner</span>
                </div>
              </div>
            </div>

            {/* Insurance Products Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {insuranceProducts.map((product) => (
                <Card 
                  key={product.id}
                  className="insurance-card cursor-pointer hover:shadow-xl transition-all duration-300"
                  onClick={() => handleInsuranceSelection(product.id)}
                >
                  <CardContent className="p-0">
                    <img 
                      src={product.image}
                      alt={product.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <product.icon className="w-6 h-6 text-ergo-red mr-3" />
                        <h3 className="text-xl font-bold text-ergo-dark">{product.title}</h3>
                      </div>
                      
                      <p className="text-gray-600 mb-6">
                        {product.description}
                      </p>
                      
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-2xl font-bold text-ergo-red">{product.price}</span>
                        <Badge className={product.badgeColor}>
                          {product.badge}
                        </Badge>
                      </div>
                      
                      <ul className="text-sm text-gray-600 mb-6 space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <Button className="w-full bg-ergo-red hover:bg-ergo-red-hover text-white">
                        Jetzt Angebot anfordern
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Combination Package */}
              <Card 
                className="insurance-card cursor-pointer bg-gradient-to-br from-ergo-red to-ergo-red-dark text-white hover:shadow-xl transition-all duration-300"
                onClick={() => handleInsuranceSelection("kombi")}
              >
                <CardContent className="p-0">
                  <img 
                    src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=250&fit=crop"
                    alt="Familie unter einem Regenschirm als Symbol für Schutz"
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  
                  <div className="p-6 bg-ergo-red">
                    <div className="flex items-center mb-4">
                      <Star className="w-6 h-6 text-yellow-300 mr-3" />
                      <h3 className="text-xl font-bold text-white">Rundumschutz-Paket</h3>
                    </div>
                    
                    <p className="text-white mb-6">
                      Sparen Sie mit unseren Kombipaketen. Bis zu 20% Rabatt bei mehreren Versicherungen.
                    </p>
                    
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-2xl font-bold text-white">Bis zu 20% sparen</span>
                      <Badge className="bg-yellow-300 text-ergo-red font-bold">
                        TOP DEAL
                      </Badge>
                    </div>
                    
                    <ul className="text-sm text-white mb-6 space-y-2">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-300 rounded-full mr-2" />
                        Individuelle Beratung
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-300 rounded-full mr-2" />
                        Ein Ansprechpartner
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-300 rounded-full mr-2" />
                        Mengenrabatt
                      </li>
                    </ul>
                    
                    <Button className="w-full bg-yellow-300 text-ergo-red hover:bg-yellow-400 font-bold">
                      Beratungstermin vereinbaren
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
