import SEO from "@/components/SEO";
import { Calendar, Clock, MapPin, Phone, CheckCircle, Star } from "lucide-react";

const BOOKING_URL = "https://ergo-frontend.onlinetermine.com/000211325/start?intcid=1001183&childId=bookingtimeSatelliteIframe_000211325&initialWidth=918&childId=bookingtimeSatelliteIframe_000211325&parentTitle=ERGO%20Versicherung%20Morino%20St%C3%BCbe%20in%20Ganderkesee%20%7C%20Versicherung&parentUrl=https%3A%2F%2Fmorino-stuebe.ergo.de%2F";

export default function TerminPage() {
  return (
    <>
      <SEO
        title="Termin buchen | ERGO Agentur Stübe Ganderkesee"
        description="Buchen Sie jetzt Ihren persönlichen Beratungstermin bei ERGO Agentur Stübe in Ganderkesee. Kostenlos, unverbindlich und bequem online."
        locality="Ganderkesee"
      />

      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 sm:pt-8 sm:pb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 bg-ergo-red/10 text-ergo-red text-xs font-semibold px-3 py-1 rounded-full">
                  <Calendar className="w-3.5 h-3.5" />
                  Online-Terminbuchung
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Beratungstermin buchen
              </h1>
              <p className="text-gray-600 text-base sm:text-lg max-w-xl">
                Wählen Sie bequem Ihren Wunschtermin – kostenlos und unverbindlich.
              </p>
            </div>
            <div className="flex flex-row lg:flex-col gap-3 lg:gap-2 flex-shrink-0">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Kostenlos & unverbindlich</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Mo–Fr 9–18, Sa 9–12</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <MapPin className="w-4 h-4 text-ergo-red flex-shrink-0" />
                <span>Vor Ort oder Video</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <iframe
              src={BOOKING_URL}
              title="Termin buchen bei ERGO Agentur Stübe"
              className="w-full border-0"
              style={{ height: '680px' }}
              allow="geolocation; microphone; camera"
              loading="lazy"
            />
          </div>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <span className="text-sm text-gray-500">Oder direkt Kontakt:</span>
            <a
              href="tel:015566771019"
              className="inline-flex items-center gap-2 border-2 border-ergo-red text-ergo-red px-5 py-2.5 rounded-lg font-medium hover:bg-ergo-red hover:text-white transition-colors text-sm"
            >
              <Phone className="w-4 h-4" />
              Anrufen
            </a>
            <a
              href="https://wa.me/4915566771019?text=Hallo%20Herr%20St%C3%BCbe%2C%20ich%20m%C3%B6chte%20gerne%20einen%20Beratungstermin%20vereinbaren."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-green-600 text-green-700 px-5 py-2.5 rounded-lg font-medium hover:bg-green-600 hover:text-white transition-colors text-sm"
            >
              💬 WhatsApp
            </a>
          </div>

          <div className="mt-8 mb-2 flex items-center justify-center gap-1.5 text-sm text-gray-400">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="ml-1">4,9 / 5 – Kundenbewertung</span>
          </div>
        </div>
      </div>
    </>
  );
}
