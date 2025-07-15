import { useParams } from "wouter";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InsuranceFunnel from "@/components/InsuranceFunnel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trackEvent } from "@/lib/analytics";
import { insuranceConfig } from "@/lib/insurance-config";

export default function Insurance() {
  const { type } = useParams();
  const [funnelOpen, setFunnelOpen] = useState(false);
  
  const insurance = insuranceConfig[type as keyof typeof insuranceConfig];

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
      <Header />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-ergo-red-light via-ergo-gray-light to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="mb-8">
              <insurance.icon className="w-16 h-16 text-ergo-red mx-auto mb-6" />
              <h1 className="text-4xl sm:text-5xl font-bold text-ergo-dark mb-6">
                {insurance.title}
              </h1>
              <p className="text-xl text-ergo-dark-light mb-8 max-w-2xl mx-auto">
                {insurance.description}
              </p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
              <Badge className="bg-ergo-red text-white px-4 py-2 text-base font-semibold">
                {insurance.price}
              </Badge>
              <Badge className="bg-ergo-blue-light text-ergo-dark px-4 py-2 text-base">
                Ohne Wartezeit
              </Badge>
              <Badge className="bg-green-100 text-green-800 px-4 py-2 text-base">
                Sofortige Deckung
              </Badge>
            </div>

            <Button 
              size="lg" 
              className="bg-ergo-red hover:bg-ergo-red-hover text-white px-8 py-4 text-lg"
              onClick={handleStartFunnel}
            >
              Kostenloses Angebot anfordern
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-ergo-dark mb-4">
                Ihre Vorteile auf einen Blick
              </h2>
              <p className="text-xl text-gray-600">
                Warum sich über 1000 Kunden für unsere {insurance.title} entschieden haben
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {insurance.features.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-ergo-red-light rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-6 h-6 bg-ergo-red rounded-full" />
                    </div>
                    <h3 className="text-lg font-semibold text-ergo-dark mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-ergo-gray">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-ergo-dark mb-4">
                Was ist in Ihrer {insurance.title} enthalten?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {insurance.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-ergo-dark mb-1">{benefit.title}</h4>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-ergo-red text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Bereit für Ihren persönlichen Schutz?
            </h2>
            <p className="text-xl text-red-100 mb-8">
              Fordern Sie jetzt Ihr kostenloses und unverbindliches Angebot an. 
              Wir melden uns innerhalb von 24 Stunden bei Ihnen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-ergo-red hover:bg-gray-100 px-8 py-4 text-lg"
                onClick={handleStartFunnel}
              >
                Jetzt Angebot anfordern
              </Button>
              <Button 
                size="lg" 
                className="border-2 border-white hover:bg-white hover:text-ergo-red px-8 py-4 text-lg bg-transparent backdrop-blur-sm"
                style={{ color: '#ff0000' }}
                onClick={() => window.location.href = 'tel:015566771019'}
              >
                Sofort anrufen: 015566771019
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
