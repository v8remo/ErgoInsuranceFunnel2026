import { Card, CardContent } from "@/components/ui/card";
import { Star, Award, Shield, Handshake, Clock } from "lucide-react";
import morinoImage from "@assets/optimized/morino_small.webp";

const testimonials = [
  {
    name: "Michael K.",
    location: "Hamburg",
    rating: 5,
    text: "Hervorragende Beratung durch ERGO! Schnell, kompetent und immer erreichbar. Meine Hausratversicherung war in wenigen Tagen abgeschlossen.",
    initials: "MK"
  },
  {
    name: "Sarah M.",
    location: "München", 
    rating: 5,
    text: "Endlich eine Zahnzusatzversicherung ohne Wartezeit! Die Beratung war top und ich bin sehr zufrieden mit den Leistungen.",
    initials: "SM"
  },
  {
    name: "Thomas W.",
    location: "Berlin",
    rating: 5,
    text: "Perfekte Betreuung! Als Hausbesitzer brauchte ich eine umfassende Beratung. ERGO hat alle meine Fragen beantwortet.",
    initials: "TW"
  }
];

const trustBadges = [
  {
    icon: Award,
    title: "ERGO Partner",
    description: "Zertifizierter Versicherungsexperte"
  },
  {
    icon: Shield,
    title: "Sicher & Vertrauensvoll",
    description: "Über 10 Jahre Erfahrung"
  },
  {
    icon: Handshake,
    title: "Persönliche Beratung",
    description: "Individuelle Lösungen"
  },
  {
    icon: Clock,
    title: "Schnelle Abwicklung",
    description: "24h Schadenservice"
  }
];

export default function TrustSection() {
  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-ergo-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-ergo-dark mb-3 sm:mb-4 px-2">
            Über 1000 zufriedene Kunden vertrauen uns
          </h2>
          <p className="text-sm sm:text-base lg:text-xl text-gray-600 px-2">
            Erfahren Sie, warum sich unsere Kunden für ERGO entscheiden
          </p>
        </div>

        {/* Ihr Experte Section */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <Card className="bg-white shadow-lg max-w-4xl mx-auto">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src={morinoImage} 
                      alt="Morino Stübe - Ihr Versicherungsexperte" 
                      className="w-full h-full object-contain bg-white"
                    />
                  </div>
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-ergo-dark mb-2">
                    Morino Stübe
                  </h3>
                  <p className="text-base sm:text-lg font-semibold text-ergo-red mb-3">
                    Ihr Versicherungsexperte
                  </p>
                  <div className="text-gray-600 mb-4">
                    <p className="mb-2">
                      <span className="font-semibold">Versicherungsfachmann nach § 84 HGB</span><br />
                      ERGO Ganderkesee
                    </p>
                    <p className="text-sm">
                      Reg.-Nr.: D-5H7J-7DUI1-10
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm">
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
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-ergo-red rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                    <span className="text-white font-semibold text-xs sm:text-sm">{testimonial.initials}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{testimonial.name}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {trustBadges.map((badge, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 shadow-sm">
                <badge.icon className="w-6 h-6 sm:w-8 sm:h-8 text-ergo-red" />
              </div>
              <h3 className="font-semibold text-ergo-dark mb-1 text-sm sm:text-base">{badge.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
