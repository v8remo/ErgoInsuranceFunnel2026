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
            "https://www.instagram.com/morino_stuebe"
          ]
        }}
      />
      <ProfessionalErgoLanding />
    </div>
  );
}