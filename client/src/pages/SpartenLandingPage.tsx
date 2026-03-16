import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import SEO from '@/components/SEO';
import FunnelOverlay from '@/components/FunnelOverlay';
import { trackEvent, trackConversion } from '@/lib/analytics';
import { type SpartenConfig } from '@/data/spartenConfig';
import {
  Phone, Shield, Star, Users, Clock, CheckCircle,
  ChevronDown, MessageCircle, Award, ArrowRight
} from 'lucide-react';

interface SpartenLandingPageProps {
  config: SpartenConfig;
}

export default function SpartenLandingPage({ config }: SpartenLandingPageProps) {
  const [showFunnel, setShowFunnel] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    trackEvent('sparten_lp_view', { sparte: config.slug, source: config.source });
  }, [config.slug]);

  const openFunnel = () => {
    setShowFunnel(true);
    trackEvent('sparten_lp_cta_click', { sparte: config.slug, source: config.source });
  };

  const whatsappNumber = "15566771019";

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": config.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      }
    }))
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": config.seo.title.split(' – ')[0],
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
    "areaServed": {
      "@type": "City",
      "name": "Ganderkesee"
    }
  };

  return (
    <>
      <SEO
        title={config.seo.title}
        description={config.seo.description}
        keywords={config.seo.keywords}
        structuredData={faqSchema}
        additionalStructuredData={[serviceSchema]}
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

        <section className={`bg-gradient-to-br ${config.hero.gradient} text-white py-14 md:py-24 px-4`}>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full text-xs font-medium mb-5">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                ))}
              </div>
              <span>4,9/5 · über 3.500 zufriedene Kunden</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {config.hero.headline}
            </h1>
            <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
              {config.hero.subheadline}
            </p>
            <button
              onClick={openFunnel}
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-bold px-7 py-4 rounded-xl text-base sm:text-lg hover:bg-gray-100 transition-colors shadow-lg min-h-[52px]"
            >
              {config.hero.ctaText} <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-xs text-white/70 mt-3">Kostenlos & unverbindlich · Keine Verpflichtung</p>
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
              Ihre Vorteile bei ERGO
            </h2>
            <p className="text-center text-gray-500 text-sm mb-10 max-w-xl mx-auto">
              Persönliche Beratung statt anonymer Online-Vergleich – das macht den Unterschied.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {config.benefits.map((benefit, i) => {
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {config.reviews.map((review, i) => (
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

        <section className="py-12 md:py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-8">
              Häufige Fragen
            </h2>
            <div className="space-y-3">
              {config.faqs.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-gray-900 text-sm sm:text-base hover:bg-gray-50 transition-colors"
                  >
                    <span className="pr-4">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 shrink-0 text-gray-400 transition-transform duration-200 ${expandedFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFaq === i && (
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 px-4 bg-gradient-to-br from-[#003781] to-[#005ab4] text-white">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-1.5 rounded-full text-xs font-medium mb-5">
              <Clock className="w-4 h-4" />
              {config.urgency.subtext}
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
              {config.urgency.text}
            </h2>
            <p className="text-blue-100 text-sm sm:text-base mb-8 max-w-xl mx-auto">
              Kostenlose, unverbindliche Beratung von Ihrem persönlichen ERGO-Berater Morino Stübe in Ganderkesee.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={openFunnel}
                className="inline-flex items-center justify-center gap-2 bg-white text-[#003781] font-bold px-7 py-4 rounded-xl text-base hover:bg-gray-100 transition-colors min-h-[52px] shadow-lg"
              >
                <Phone className="w-5 h-5" /> Jetzt beraten lassen
              </button>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hallo Herr Stübe, ich interessiere mich für die ${config.seo.title.split(' – ')[0]}. Können Sie mich beraten?`)}`}
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
          insuranceType={config.insuranceType}
          insuranceLabel={config.seo.title.split(' – ')[0]}
          source={config.source}
        />
      )}
    </>
  );
}
