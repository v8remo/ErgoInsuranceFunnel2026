import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import SEO from '@/components/SEO';
import FunnelOverlay from '@/components/FunnelOverlay';
import { trackEvent } from '@/lib/analytics';
import {
  Phone, Shield, Star, Users, Clock, CheckCircle,
  MessageCircle, Award, ArrowRight, Handshake, Percent, Monitor
} from 'lucide-react';
import standingPhoto from "@assets/optimized/image.webp";

export default function LeadPage() {
  const [showFunnel, setShowFunnel] = useState(false);

  useEffect(() => {
    trackEvent('lead_page_view', { source: 'lp_beratung' });
  }, []);

  const openFunnel = () => {
    setShowFunnel(true);
    trackEvent('beratung_lp_cta_click', { source: 'lp_beratung' });
  };

  const whatsappNumber = "15566771019";

  const benefits = [
    {
      icon: Handshake,
      title: 'Persönliche Beratung',
      description: 'Kein Call-Center, keine Wartezeiten – ich berate Sie direkt und persönlich. Vor Ort in Ganderkesee, per Video oder WhatsApp.',
    },
    {
      icon: Percent,
      title: 'Bis zu 15% Bündelrabatt',
      description: 'Ab 5 Versicherungen bei ERGO sparen Sie automatisch bis zu 15% auf alle Sachversicherungen.',
    },
    {
      icon: Clock,
      title: '24h Reaktionszeit',
      description: 'Ihre Anfrage wird innerhalb von 24 Stunden beantwortet – garantiert. Im Schadenfall kümmere ich mich persönlich.',
    },
    {
      icon: Monitor,
      title: 'Vor Ort oder digital',
      description: 'Beratung wie Sie es möchten: persönlich in Ganderkesee, per Videocall oder bequem per WhatsApp.',
    },
  ];

  const reviews = [
    {
      name: 'Thomas M., Ganderkesee',
      text: 'Herr Stübe hat meine komplette Versicherungssituation analysiert und mir gezeigt, wo ich überversichert war und wo Lücken bestanden. Jetzt spare ich 40€ im Monat!',
      rating: 5,
    },
    {
      name: 'Sandra K., Delmenhorst',
      text: 'Endlich ein Berater, der sich wirklich Zeit nimmt. Die kostenlose Analyse war super ausführlich und ich fühle mich jetzt rundherum gut abgesichert.',
      rating: 5,
    },
    {
      name: 'Markus B., Oldenburg',
      text: 'Schnell, unkompliziert und ehrlich. Herr Stübe hat mir sogar von einer Versicherung abgeraten, die ich nicht brauche. So muss Beratung sein!',
      rating: 5,
    },
  ];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Kostenlose Versicherungsberatung",
    "provider": {
      "@type": "LocalBusiness",
      "name": "ERGO Versicherung Morino Stübe",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Bergedorfer Str. 11",
        "addressLocality": "Ganderkesee",
        "postalCode": "27777",
        "addressCountry": "DE"
      },
      "telephone": "+4915566771019"
    },
    "areaServed": [
      { "@type": "City", "name": "Ganderkesee" },
      { "@type": "City", "name": "Delmenhorst" },
      { "@type": "City", "name": "Oldenburg" }
    ]
  };

  return (
    <>
      <SEO
        title="Kostenlose Versicherungsberatung – ERGO Agentur Stübe Ganderkesee"
        description="Starten Sie jetzt Ihre kostenlose Versicherungsanalyse. In wenigen Schritten zum persönlichen Angebot von Ihrem ERGO Berater Morino Stübe in Ganderkesee."
        keywords="Versicherungsberatung kostenlos, Versicherungsvergleich, ERGO Beratung, Versicherung Ganderkesee, kostenlose Analyse, Versicherung Delmenhorst, Versicherung Oldenburg"
        structuredData={serviceSchema}
      />

      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <Shield className="w-7 h-7 text-ergo-red" />
                <div>
                  <span className="font-bold text-gray-900 text-sm">ERGO Agentur Stübe</span>
                  <span className="text-[10px] text-gray-400 block leading-tight">Ihr persönlicher Berater</span>
                </div>
              </div>
            </Link>
            <a
              href="tel:015566771019"
              className="inline-flex items-center gap-1.5 bg-ergo-red text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">01556 6771019</span>
              <span className="sm:hidden">Anrufen</span>
            </a>
          </div>
        </header>

        <section className="bg-gradient-to-br from-[#003781] to-[#005ab4] text-white py-14 md:py-24 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full text-xs font-medium mb-5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                    ))}
                  </div>
                  <span>4,9/5 · über 3.500 zufriedene Kunden</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  Kostenlose Versicherungs&shy;beratung in Ganderkesee
                </h1>
                <p className="text-base sm:text-lg text-white/90 max-w-xl mb-8 leading-relaxed">
                  Sind Sie richtig versichert? Ich analysiere Ihre bestehenden Verträge, finde Lücken und zeige Ihnen, wie Sie bis zu 15% sparen können – kostenlos und unverbindlich.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <button
                    onClick={openFunnel}
                    className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-bold px-7 py-4 rounded-xl text-base sm:text-lg hover:bg-gray-100 transition-colors shadow-lg min-h-[52px]"
                  >
                    Kostenlose Analyse starten <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-white/70 mt-3">100% kostenlos · Keine Verpflichtung · In 2 Minuten erledigt</p>
              </div>
              <div className="w-48 md:w-64 shrink-0">
                <div className="relative">
                  <img
                    src={standingPhoto}
                    alt="Morino Stübe – Ihr ERGO Versicherungsberater in Ganderkesee"
                    className="rounded-2xl shadow-2xl w-full"
                  />
                  <div className="absolute -bottom-3 -right-3 bg-white text-gray-900 rounded-xl px-3 py-2 shadow-lg text-xs font-semibold">
                    <span className="text-ergo-red">Morino Stübe</span>
                    <br />
                    Ihr ERGO-Berater
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-5 bg-gray-50 border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-ergo-red" />
                <span className="font-semibold">3.500+ Kunden</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-ergo-red" />
                <span className="font-semibold">15+ Jahre Erfahrung</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-ergo-red" />
                <span className="font-semibold">Kostenlos & unverbindlich</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 mb-3">
              Ihre Vorteile bei ERGO Agentur Stübe
            </h2>
            <p className="text-center text-gray-500 text-sm mb-10 max-w-xl mx-auto">
              Persönliche Beratung statt anonymer Online-Vergleich – das macht den Unterschied.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-ergo-red/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-ergo-red" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1">{benefit.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-8">
              Das sagen unsere Kunden
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {reviews.map((review, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3 italic">"{review.text}"</p>
                  <p className="text-xs font-semibold text-gray-500">– {review.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 px-4 bg-gradient-to-br from-[#003781] to-[#005ab4] text-white">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-1.5 rounded-full text-xs font-medium mb-5">
              <Clock className="w-4 h-4" />
              Über 3.500 zufriedene Kunden vertrauen bereits auf unsere Beratung
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
              Jetzt kostenlose Versicherungsanalyse starten
            </h2>
            <p className="text-blue-100 text-sm sm:text-base mb-8 max-w-xl mx-auto">
              In nur 2 Minuten erhalten Sie eine persönliche Empfehlung von Ihrem ERGO-Berater Morino Stübe.
              Kostenlos, unverbindlich und ohne versteckte Kosten.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={openFunnel}
                className="inline-flex items-center justify-center gap-2 bg-white text-[#003781] font-bold px-7 py-4 rounded-xl text-base hover:bg-gray-100 transition-colors min-h-[52px] shadow-lg"
              >
                <Phone className="w-5 h-5" /> Jetzt beraten lassen
              </button>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hallo Herr Stübe, ich komme von Ihrer Website und möchte gerne eine kostenlose Versicherungsberatung. Können Sie mich beraten?')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25d366] text-white font-bold px-6 py-4 rounded-xl text-base hover:bg-[#1da851] transition-colors min-h-[52px]"
              >
                <MessageCircle className="w-5 h-5" /> Per WhatsApp anfragen
              </a>
            </div>
          </div>
        </section>

        <footer className="bg-gray-900 text-gray-400 py-6 px-4 text-center text-xs">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/impressum" className="hover:text-white transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link>
          </div>
          <p className="mt-3">&copy; 2026 ERGO Versicherung - Morino Stübe</p>
        </footer>
      </div>

      {showFunnel && (
        <FunnelOverlay
          isOpen={showFunnel}
          onClose={() => setShowFunnel(false)}
          source="lp_beratung"
        />
      )}
    </>
  );
}
