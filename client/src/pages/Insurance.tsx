import { useParams } from "wouter";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InsuranceFunnel from "@/components/InsuranceFunnel";
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trackEvent, trackConversion, trackAppointmentConversion } from "@/lib/analytics";
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
        title={`${insurance.title} sofort abschließen - ERGO Ganderkesee | 15% Bündelnachlass`}
        description={`⭐ ${insurance.title} ⭐ Kostenlose Analyse bestehender Verträge ⭐ 15% Rabatt ab 5 Versicherungen ⭐ WhatsApp: 01556 6771019`}
        keywords={`${insurance.title}, ERGO ${insurance.title}, ${insurance.title} Ganderkesee, Bündelnachlass, kostenlose Analyse, Morino Stübe, ERGO Versicherung online`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": insurance.title,
          "description": insurance.description,
          "provider": {
            "@type": "InsuranceAgency",
            "name": "ERGO Versicherung Ganderkesee",
            "telephone": "+4915566771019",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Friedensstraße 91 A",
              "addressLocality": "Ganderkesee",
              "postalCode": "27777",
              "addressCountry": "DE"
            }
          },
          "offers": {
            "@type": "Offer",
            "description": "15% Bündelnachlass ab 5 Versicherungen + kostenlose Analyse",
            "availability": "https://schema.org/InStock"
          },
          "areaServed": {
            "@type": "Country",
            "name": "Deutschland"
          }
        }}
      />
      <Header />
      <Breadcrumb />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="py-6 sm:py-8 lg:py-12 bg-gradient-to-br from-ergo-red-light via-ergo-gray-light to-white overflow-hidden">
          <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="text-center lg:text-left">
                <div className="mb-6 sm:mb-8">
                  <insurance.icon className="w-12 h-12 sm:w-16 sm:h-16 text-ergo-red mx-auto lg:mx-0 mb-4 sm:mb-6" />
                  <Badge className="bg-ergo-red text-white mb-4">✓ Sofortiger Schutz</Badge>
                  {/* Service Banner */}
                  <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold text-sm sm:text-base mb-4">
                    ✅ Ihr persönlicher ERGO-Berater - Kostenlose Analyse
                  </div>
                  
                  <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-ergo-dark mb-3 sm:mb-4 leading-tight break-words">
                    <span className="text-ergo-red">{insurance.title}</span>
                    <br /><span className="text-gray-700">Optimal versichert mit ERGO</span>
                    <span className="block text-lg sm:text-xl text-ergo-red font-bold mt-2">
                      Persönliche Beratung vom Experten
                    </span>
                  </h1>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-800 mb-4 sm:mb-6">
                    <strong>Kostenloser Service:</strong> Als Ihr ERGO-Berater analysiere ich Ihre bestehende {insurance.title} und zeige Ihnen Optimierungsmöglichkeiten.
                    <span className="block mt-2 text-ergo-red font-bold">Profitieren Sie vom 15% Bündelnachlass ab 5 ERGO-Versicherungen!</span>
                  </p>
                </div>

                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
                  <Badge className="bg-green-100 text-green-800 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base animate-pulse">
                    🚀 Ohne Wartezeit
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base animate-pulse">
                    ⚡ Sofortige Deckung
                  </Badge>
                  <Badge className="bg-yellow-100 text-yellow-800 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base animate-pulse">
                    💰 30% günstiger
                  </Badge>
                </div>

                {/* ERGO Service Benefits */}
                <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 border-2 border-blue-200 shadow-xl">
                  <h3 className="text-center text-base sm:text-lg font-bold text-ergo-red mb-3">Ihr kostenloser ERGO-Service umfasst:</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <span className="text-green-500 mr-2">✅</span>
                      <span>Vollständige Analyse Ihrer {insurance.title}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-green-500 mr-2">✅</span>
                      <span>Persönliche Beratung zu ERGO-Produkten</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-green-500 mr-2">✅</span>
                      <span>Optimierung Ihrer Versicherungsverträge</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-green-500 mr-2">✅</span>
                      <span>15% Bündelnachlass ab 5 ERGO-Versicherungen</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-green-500 mr-2">✅</span>
                      <span>Lebenslange Betreuung durch Ihre ERGO-Agentur</span>
                    </div>
                    <div className="border-t pt-2 text-center font-bold text-ergo-red">
                      <span>Unverbindlich & kostenlos - Ihr ERGO-Versprechen!</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button 
                      size="lg" 
                      className="bg-ergo-red hover:bg-ergo-red-hover text-white px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-bold w-full sm:flex-1 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                      onClick={() => {
                        trackEvent('insurance_cta_clicked', { insurance_type: type, source: 'hero_section', value: 15 });
                        handleStartFunnel();
                      }}
                    >
                      🚀 KOSTENLOSE BERATUNG STARTEN
                    </Button>
                    <Button 
                      size="lg" 
                      className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-lg font-bold w-full sm:w-auto"
                      onClick={() => {
                        trackEvent('insurance_whatsapp_clicked', { insurance_type: type, source: 'hero_section' });
                        const whatsappUrl = 'https://wa.me/4915566771019?text=Hallo, ich möchte eine kostenlose Analyse meiner ' + insurance.title + ' und Informationen zum 15% Bündelnachlass ab 5 Versicherungen!';
                        trackAppointmentConversion(whatsappUrl);
                      }}
                    >
                      💬 WhatsApp Beratung
                    </Button>
                  </div>
                  <p className="text-xs text-center text-gray-500 mt-3">
                    ✅ Immer kostenlos • Analyse bestehender Verträge • 15% Bündelnachlass ab 5 Versicherungen
                  </p>
                </div>
              </div>

              {/* Hero Image */}
              <div className="flex justify-center lg:justify-end mt-8 lg:mt-0">
                <div className="w-full max-w-md">
                  <img 
                    src={insurance.image}
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
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-high-contrast mb-3 sm:mb-4 px-2 leading-tight text-center">
                Ihre 3 wichtigsten Vorteile
              </h2>
              <p className="text-sm sm:text-base lg:text-xl text-medium-contrast text-readable px-2">
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
                    <h3 className="text-base sm:text-lg font-semibold text-high-contrast mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-medium-contrast text-readable">
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
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-2 leading-tight text-center">
                Das ist enthalten
              </h2>
              <p className="text-sm sm:text-base lg:text-xl text-gray-700 px-2">
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
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{benefit.title}</h4>
                    <p className="text-gray-700 text-sm sm:text-base">{benefit.description}</p>
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
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-2 leading-tight text-center">
                Ihr Versicherungsexperte
              </h2>
              <p className="text-sm sm:text-base lg:text-xl text-gray-700 px-2">
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

        {/* Social Proof Section */}
        <section className="py-8 sm:py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl sm:text-3xl font-bold text-ergo-red mb-1">1000+</div>
                <div className="text-xs sm:text-sm text-gray-600">Zufriedene Kunden</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">97%</div>
                <div className="text-xs sm:text-sm text-gray-600">Weiterempfehlung</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">24h</div>
                <div className="text-xs sm:text-sm text-gray-600">Schnelle Hilfe</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-1">30%</div>
                <div className="text-xs sm:text-sm text-gray-600">Durchschn. Ersparnis</div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section with Urgency */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-ergo-red to-red-700 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 px-2 leading-tight">
              🔥 Kostenlose Analyse & 15% Bündelnachlass!
            </h2>
            <p className="text-sm sm:text-base lg:text-xl text-white mb-6 sm:mb-8 px-2">
              <strong>Immer kostenlos:</strong> Vollständige Analyse Ihrer bestehenden {insurance.title} plus Optimierung und günstigere Alternativen.
              <strong>15% Bündelnachlass ab 5 Versicherungen!</strong> Bereits <span className="text-yellow-200 font-bold">23 Kunden</span> haben heute gespart!
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  onClick={() => {
                    trackEvent('final_cta_clicked', { insurance_type: type, source: 'bottom_section', value: 15 });
                    handleStartFunnel();
                  }}
                >
                  🚀 KOSTENLOSE ANALYSE + 15% NACHLASS
                </Button>
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-lg font-bold"
                  onClick={() => {
                    trackEvent('final_whatsapp_clicked', { insurance_type: type, source: 'bottom_section' });
                    const whatsappUrl = 'https://wa.me/4915566771019?text=Hallo, ich möchte eine kostenlose Analyse meiner ' + insurance.title + ' und Infos zum 15% Bündelnachlass ab 5 Versicherungen!';
                    trackAppointmentConversion(whatsappUrl);
                  }}
                >
                  💬 Sofortige WhatsApp Beratung
                </Button>
              </div>
              <p className="text-sm text-white font-medium mt-3">
                ✅ Kostenlose Analyse • Optimierung bestehender Verträge • 15% Bündelnachlass ab 5 Versicherungen
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white font-medium">
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
