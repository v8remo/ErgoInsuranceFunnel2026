import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";
import { Clock, MapPin, Phone, CheckCircle2, Star, MessageSquare } from "lucide-react";

export default function TerminPage() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "erstberatung" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
      cal("on", {
        action: "bookingSuccessful",
        callback: () => {
          if (typeof window.gtag === "function") {
            window.gtag("event", "conversion", {
              send_to: "AW-17132012984/AEwRCLKWlZgcELiLl-k_",
              value: 1.0,
              currency: "EUR",
            });
          }
        },
      });
    })();
  }, []);

  return (
    <>
      <SEO
        title="Termin buchen | ERGO Agentur Stübe Ganderkesee"
        description="Buchen Sie jetzt Ihren persönlichen Beratungstermin bei ERGO Agentur Stübe in Ganderkesee. Kostenlos, unverbindlich und bequem online."
        locality="Ganderkesee"
      />

      <Breadcrumb items={[{ label: "Termin buchen" }]} />
    <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 sm:pt-8 sm:pb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10">
            <div className="flex-1 min-w-0">
              <p className="ergo-eyebrow">Online-Terminbuchung</p>
              <h1 className="text-[30px] leading-[1.25] md:text-[40px] mb-2">
                Beratungstermin buchen
              </h1>
              <p className="text-ergo-stone text-base sm:text-lg max-w-xl">
                Wählen Sie bequem Ihren Wunschtermin – kostenlos und unverbindlich.
              </p>
            </div>
            <div className="flex flex-row lg:flex-col gap-3 lg:gap-2 flex-shrink-0">
              <div className="flex items-center gap-2 text-sm text-ergo-ink">
                <CheckCircle2 className="w-4 h-4 text-ergo-check flex-shrink-0" />
                <span>Kostenlos & unverbindlich</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-ergo-ink">
                <Clock className="w-4 h-4 text-ergo-red flex-shrink-0" />
                <span>Mo–Fr 9–18, Sa 9–12</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-ergo-ink">
                <MapPin className="w-4 h-4 text-ergo-red flex-shrink-0" />
                <span>Vor Ort oder Video</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-ergo-line" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="rounded-lg overflow-hidden border border-ergo-line">
            <Cal
              namespace="erstberatung"
              calLink="morino-stuebe-ergo/erstberatung"
              style={{ width: "100%", minHeight: 'clamp(480px, 72vh, 660px)' }}
              config={{ layout: "month_view", useSlotsViewOnSmallScreen: "true" }}
            />
          </div>

          {/* What to expect */}
          <div className="mt-6 bg-ergo-gray border border-ergo-line rounded-lg p-4 sm:p-5">
            <h3 className="font-sans font-bold text-ergo-ink text-sm mb-2">Was passiert nach der Buchung?</h3>
            <div className="flex flex-col sm:flex-row gap-3 text-xs text-ergo-stone">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-ergo-check shrink-0 mt-0.5" />
                <span>Sofortige Bestätigung per E-Mail</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-ergo-check shrink-0 mt-0.5" />
                <span>Morino bereitet Ihre Analyse vor</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-ergo-check shrink-0 mt-0.5" />
                <span>Persönliche Beratung zum Wunschtermin</span>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <span className="text-sm text-ergo-mute">Oder direkt Kontakt:</span>
            <a
              href="tel:015566771019"
              className="ergo-btn ergo-btn--secondary ergo-btn--sm"
            >
              <Phone className="w-4 h-4" />
              Anrufen
            </a>
            <a
              href="https://wa.me/4915566771019?text=Hallo%20Herr%20St%C3%BCbe%2C%20ich%20m%C3%B6chte%20gerne%20einen%20Beratungstermin%20vereinbaren."
              target="_blank"
              rel="noopener noreferrer"
              className="ergo-btn ergo-btn--whatsapp ergo-btn--sm"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp
            </a>
          </div>

          {/* Social Proof */}
          <div className="mt-8 mb-2">
            <div className="ergo-card p-4 max-w-lg mx-auto text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-ergo-yellow text-ergo-yellow" />
                ))}
                <span className="text-sm font-semibold text-ergo-ink ml-1">4,9/5</span>
              </div>
              <p className="text-sm text-ergo-stone italic mb-1">"Endlich ein Berater, der sich Zeit nimmt und alles verständlich erklärt."</p>
              <p className="text-xs text-ergo-mute">Thomas K. aus Bookholzberg · Über 3.500 zufriedene Kunden</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
