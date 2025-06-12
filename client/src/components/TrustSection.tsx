import { Card, CardContent } from "@/components/ui/card";
import { Star, Award, Shield, Handshake, Clock } from "lucide-react";

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
    <section className="py-16 bg-ergo-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-ergo-dark mb-4">
            Über 1000 zufriedene Kunden vertrauen uns
          </h2>
          <p className="text-xl text-gray-600">
            Erfahren Sie, warum sich unsere Kunden für ERGO entscheiden
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-ergo-red rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">{testimonial.initials}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {trustBadges.map((badge, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <badge.icon className="w-8 h-8 text-ergo-red" />
              </div>
              <h3 className="font-semibold text-ergo-dark mb-1">{badge.title}</h3>
              <p className="text-sm text-gray-600">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
