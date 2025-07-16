import { useParams } from "wouter";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InsuranceFunnel from "@/components/InsuranceFunnel";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trackEvent } from "@/lib/analytics";
import { insuranceConfig } from "@/lib/insurance-config";
import { useQuery } from "@tanstack/react-query";
import morinoImage from "@assets/089-Ti9r4yWZjrM.jpeg";
import { Award, Shield, Handshake, Clock } from "lucide-react";
import type { Content } from "@shared/schema";

export default function Insurance() {
  const { type } = useParams();
  const [funnelOpen, setFunnelOpen] = useState(false);
  
  const insurance = insuranceConfig[type as keyof typeof insuranceConfig];

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

  if (!insurance) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Versicherung nicht gefunden</h1>
          <p className="text-gray-600">Die angeforderte Versicherung existiert nicht.</p>
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
  };

  return (
    <>
      <SEO
        title={`${insurance.title} - ERGO Versicherung Ganderkesee | Morino Stübe`}
        description={`${insurance.description} Jetzt kostenlos beraten lassen und sparen! ☎ 01556 6771019`}
        keywords={`${insurance.title}, ERGO ${insurance.title}, ${insurance.title} Ganderkesee, Morino Stübe, ERGO Versicherung, Versicherung abschließen`}
      />
      <Header />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-ergo-red-light via-ergo-gray-light to-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="text-center lg:text-left">
                <div className="mb-6 sm:mb-8">
                  <insurance.icon className="w-12 h-12 sm:w-16 sm:h-16 text-ergo-red mx-auto lg:mx-0 mb-4 sm:mb-6" />
                  <Badge className="bg-ergo-red text-white mb-4">✓ Sofortiger Schutz</Badge>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-ergo-dark mb-4 sm:mb-6 leading-tight">
                    {insurance.title}
                    <span className="block text-lg sm:text-xl text-ergo-red font-normal mt-2">
                      {insurance.price}
                    </span>
                  </h1>
                  <p className="text-base sm:text-xl text-ergo-dark-light mb-6 sm:mb-8">
                    {content?.description || insurance.description}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
                  <Badge className="bg-ergo-blue-light text-ergo-dark px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base">
                    Ohne Wartezeit
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base">
                    Sofortige Deckung
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base">
                    Kostenlos beraten
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <Button 
                    size="lg" 
                    className="bg-ergo-red hover:bg-ergo-red-hover text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
                    onClick={handleStartFunnel}
                  >
                    Jetzt kostenlos beraten lassen
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
                    onClick={() => window.open('https://wa.me/4915566771019?text=Hallo, ich interessiere mich für die ' + insurance.title + ' und hätte gerne eine Beratung.', '_blank')}
                  >
                    💬 WhatsApp Chat
                  </Button>
                </div>
              </div>

              {/* Hero Image */}
              <div className="flex justify-center lg:justify-end mt-8 lg:mt-0">
                <div className="w-full max-w-md">
                  <img 
                    src={content?.imageUrl || "https://images.unsplash.com/photo-1556909045-f7de0ad5eab5?w=500&h=400&fit=crop&q=80"}
                    alt={insurance.title}
                    className="w-full h-60 sm:h-80 object-cover rounded-lg shadow-xl"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-ergo-dark mb-3 sm:mb-4 px-2 leading-tight text-center">
                Ihre 3 wichtigsten Vorteile
              </h2>
              <p className="text-sm sm:text-base lg:text-xl text-gray-600 px-2">
                Warum sich über 1000 Kunden für unsere {insurance.title} entschieden haben
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {insurance.features.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-4 sm:pt-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-ergo-red-light rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-ergo-red rounded-full" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-ergo-dark mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 sm:py-16 bg-ergo-gray">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-ergo-dark mb-3 sm:mb-4 px-2 leading-tight text-center">
                Das ist enthalten
              </h2>
              <p className="text-sm sm:text-base lg:text-xl text-gray-600 px-2">
                Ihre konkreten Leistungen bei der {insurance.title}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {insurance.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 sm:mr-4 mt-0.5 sm:mt-1 flex-shrink-0">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-ergo-dark mb-1 text-sm sm:text-base">{benefit.title}</h4>
                    <p className="text-gray-600 text-sm sm:text-base">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Expert Section */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-ergo-dark mb-3 sm:mb-4 px-2 leading-tight text-center">
                Ihr Versicherungsexperte
              </h2>
              <p className="text-sm sm:text-base lg:text-xl text-gray-600 px-2">
                Persönliche Beratung mit über 10 Jahren Erfahrung
              </p>
            </div>

            <Card className="bg-ergo-gray shadow-lg">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-lg">
                      <img 
                        src={morinoImage} 
                        alt="Morino Stübe - Ihr Versicherungsexperte" 
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-xl sm:text-2xl font-bold text-ergo-dark mb-2">
                      Morino Stübe
                    </h3>
                    <p className="text-base sm:text-lg font-semibold text-ergo-red mb-3 sm:mb-4">
                      Versicherungsfachmann nach § 84 HGB
                    </p>
                    <div className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                      <p className="mb-2">
                        <span className="font-semibold">ERGO Ganderkesee</span><br />
                        Friedensstraße 91 A, 27777 Ganderkesee
                      </p>
                      <p className="text-xs sm:text-sm">
                        Tel: 01556 6771019 | E-Mail: morino.stuebe@ergo.de
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
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
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 bg-ergo-red text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 px-2 leading-tight text-center">
              Bereit für Ihren persönlichen Schutz?
            </h2>
            <p className="text-sm sm:text-base lg:text-xl text-red-100 mb-6 sm:mb-8 px-2">
              Fordern Sie jetzt Ihr kostenloses und unverbindliches Angebot an. 
              Wir melden uns innerhalb von 24 Stunden bei Ihnen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-[#ff0000] hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
                onClick={handleStartFunnel}
              >
                Jetzt Angebot anfordern
              </Button>
              <Button 
                size="lg" 
                className="border-2 border-white hover:bg-white hover:text-green-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-transparent backdrop-blur-sm text-white"
                onClick={() => window.open('https://wa.me/4915566771019?text=Hallo, ich interessiere mich für die ' + insurance.title + ' und hätte gerne eine Beratung.', '_blank')}
              >
                <span className="hidden sm:inline">💬 WhatsApp Chat starten</span>
                <span className="sm:hidden">💬 WhatsApp</span>
              </Button>
            </div>
          </div>
        </section>

        {/* Insurance Funnel Modal */}
        {funnelOpen && (
          <InsuranceFunnel 
            insuranceType={type!}
            onClose={closeFunnel}
          />
        )}
      </main>

      <Footer />
    </>
  );
}
