import HormoziDirectFunnel from "@/components/HormoziDirectFunnel";
import SEO from "@/components/SEO";


export default function Home() {

  return (
    <>
      <SEO 
        title="ERGO Versicherung Ganderkesee - Kostenlose Analyse & 15% Bündelnachlass"
        description="⭐ Kostenlose Versicherungsanalyse ⭐ 15% Bündelnachlass ab 5 Verträgen ⭐ Optimierung bestehender Policen ⭐ WhatsApp Beratung: 01556 6771019"
        keywords="ERGO Versicherung Ganderkesee, kostenlose Versicherungsanalyse, Bündelnachlass, Morino Stübe, Hausratversicherung, Haftpflichtversicherung, Wohngebäudeversicherung, Rechtsschutz, Zahnzusatz"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Kostenlose Versicherungsanalyse",
          "description": "Professionelle Analyse bestehender Versicherungen mit Optimierungsvorschlägen und 15% Bündelnachlass",
          "provider": {
            "@type": "InsuranceAgency",
            "name": "ERGO Versicherung Ganderkesee",
            "telephone": "+4915566771019",
            "email": "morino.stuebe@ergo.de"
          },
          "offers": {
            "@type": "Offer",
            "description": "15% Bündelnachlass ab 5 Versicherungen",
            "price": "0",
            "priceCurrency": "EUR"
          },
          "areaServed": {
            "@type": "Country",
            "name": "Deutschland"
          }
        }}
      />
      
      {/* Alex Hormozi Direct Funnel - No Homepage */}
      <HormoziDirectFunnel />
    </>
  );
}
