import ProfessionalErgoLanding from "@/components/ProfessionalErgoLanding";
import SEO from "@/components/SEO";

export default function Home() {
  return (
    <div>
      <SEO
        title="ERGO Versicherung Ganderkesee | Agentur Stübe – Kostenlose Beratung"
        description="Ihr ERGO Versicherungsberater in Ganderkesee, Delmenhorst und Oldenburg. Persönliche Beratung und kostenlose Versicherungsanalyse."
        keywords="ERGO Versicherung Ganderkesee, Versicherungsberater Ganderkesee, ERGO Delmenhorst, ERGO Oldenburg, Versicherung wechseln, kostenlose Versicherungsanalyse, Morino Stübe, Haftpflicht, Hausrat, Kfz-Versicherung"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "InsuranceAgency",
          "name": "ERGO Agentur Stübe",
          "alternateName": "ERGO Versicherung Ganderkesee – Morino Stübe",
          "url": "https://ergo-ganderkesee.replit.app",
          "telephone": "+4915566771019",
          "email": "morino.stuebe@ergo.de",
          "description": "Ihr ERGO Versicherungsberater in Ganderkesee, Delmenhorst und Oldenburg. Kostenlose Versicherungsanalyse und persönliche Beratung.",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Friedensstraße 91 A",
            "addressLocality": "Ganderkesee",
            "postalCode": "27777",
            "addressRegion": "Niedersachsen",
            "addressCountry": "DE"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 53.0373,
            "longitude": 8.5405
          },
          "openingHoursSpecification": [
            { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "09:00", "closes": "18:00" },
            { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "09:00", "closes": "12:00" }
          ],
          "areaServed": [
            { "@type": "City", "name": "Ganderkesee", "sameAs": "https://de.wikipedia.org/wiki/Ganderkesee" },
            { "@type": "City", "name": "Delmenhorst", "sameAs": "https://de.wikipedia.org/wiki/Delmenhorst" },
            { "@type": "City", "name": "Oldenburg", "sameAs": "https://de.wikipedia.org/wiki/Oldenburg_(Oldb)" }
          ],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Versicherungsprodukte",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Hausratversicherung" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Haftpflichtversicherung" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Wohngebäudeversicherung" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Rechtsschutzversicherung" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Zahnzusatzversicherung" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Kfz-Versicherung" } }
            ]
          },
          "sameAs": [
            "https://www.linkedin.com/in/morino-stuebe",
            "https://www.instagram.com/morino.stuebe.ergo"
          ]
        }}
      />
      <ProfessionalErgoLanding />
      
      {/* RECHTLICHER FOOTER */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-3">
            <div className="text-gray-700 font-bold text-sm">ERGO Agentur Stübe - Morino Stübe, Ganderkesee</div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
              <a href="/versicherung-ganderkesee" className="text-gray-600 hover:text-ergo-red transition-colors">Versicherung Ganderkesee</a>
              <a href="/versicherung-delmenhorst" className="text-gray-600 hover:text-ergo-red transition-colors">Versicherung Delmenhorst</a>
              <a href="/versicherung-oldenburg" className="text-gray-600 hover:text-ergo-red transition-colors">Versicherung Oldenburg</a>
            </div>
            <div className="space-x-6 text-xs">
              <a href="/impressum" className="text-ergo-red hover:text-red-700 font-bold underline">Impressum</a>
              <a href="/datenschutz" className="text-ergo-red hover:text-red-700 font-bold underline">Datenschutz</a>
              <span className="text-gray-500">Tel: 015566771019</span>
            </div>
            <div className="text-xs text-gray-500">
              Gebundener Versicherungsvertreter der ERGO • Vermittlerregister-Nr.: D-5H7J-7DUI1-10
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}