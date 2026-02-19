import SEO from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";
import { Calendar, Clock, MapPin, Phone, CheckCircle } from "lucide-react";

const BOOKING_URL = "https://outlook.office.com/bookwithme/user/6e73ed32cc5043c488ee4cbd522ec4b5%40ergo.de?anonymous&ismsaljsauthenabled=true";

export default function TerminPage() {
  return (
    <>
      <SEO
        title="Termin buchen | ERGO Agentur Stübe Ganderkesee"
        description="Buchen Sie jetzt Ihren persönlichen Beratungstermin bei ERGO Agentur Stübe in Ganderkesee. Kostenlos, unverbindlich und bequem online."
        locality="Ganderkesee"
      />

      <section className="bg-gradient-to-br from-ergo-red to-red-700 text-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: "Startseite", href: "/" },
              { label: "Termin buchen" },
            ]}
          />
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-4">
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-medium">Online-Terminbuchung</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Persönlichen Beratungstermin buchen
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
              Wählen Sie bequem Ihren Wunschtermin – kostenlos und unverbindlich.
            </p>
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Kostenlos</p>
                <p className="text-sm text-gray-600">Keine Kosten, keine Verpflichtungen</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Flexible Zeiten</p>
                <p className="text-sm text-gray-600">Mo–Fr 9–18 Uhr, Sa 9–12 Uhr</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-ergo-red" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Vor Ort oder Online</p>
                <p className="text-sm text-gray-600">Ganderkesee oder per Videocall</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-4 sm:py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-ergo-red" />
                Wählen Sie Ihren Wunschtermin
              </h2>
            </div>
            <div className="w-full" style={{ minHeight: '600px' }}>
              <iframe
                src={BOOKING_URL}
                title="Termin buchen bei ERGO Agentur Stübe"
                className="w-full border-0"
                style={{ height: '700px', minHeight: '600px' }}
                allow="geolocation; microphone; camera"
                loading="lazy"
              />
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Alternativ erreichen Sie uns auch direkt:
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="tel:015566771019"
                className="inline-flex items-center gap-2 bg-ergo-red text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Jetzt anrufen
              </a>
              <a
                href="https://wa.me/4915566771019?text=Hallo%20Herr%20St%C3%BCbe%2C%20ich%20m%C3%B6chte%20gerne%20einen%20Beratungstermin%20vereinbaren."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                💬 WhatsApp schreiben
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
