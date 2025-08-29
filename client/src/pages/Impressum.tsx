import { useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';

export default function Impressum() {
  useEffect(() => {
    document.title = "Impressum - ERGO Agentur Stübe, Ganderkesee";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Einfacher Header */}
        <div className="mb-8">
          <Link href="/">
            <button className="inline-flex items-center text-ergo-red hover:text-red-700 font-bold mb-4 bg-white px-4 py-2 rounded-lg shadow">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Impressum</h1>
        </div>

        {/* Impressum Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="space-y-8">
            {/* Angaben gemäß § 5 TMG */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Mail className="w-6 h-6 text-ergo-red mr-3" />
                Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)
              </h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="space-y-2 text-gray-700">
                  <div className="font-bold text-lg">ERGO Agentur Stübe</div>
                  <div>Selbständiger Handelsvertreter der ERGO Versicherung</div>
                  <div className="mt-4">
                    <div className="font-semibold">Inhaber:</div>
                    <div>Morino Stübe</div>
                  </div>
                  <div className="mt-4 flex items-start">
                    <MapPin className="w-5 h-5 text-ergo-red mr-2 mt-0.5" />
                    <div>
                      <div>Friedensstraße 91 A</div>
                      <div>27777 Ganderkesee</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Kontakt */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Phone className="w-6 h-6 text-ergo-red mr-3" />
                Kontakt
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-ergo-red mr-3" />
                    <div>
                      <span className="font-semibold">Telefon:</span> +49 15566 771019
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-ergo-red mr-3" />
                    <div>
                      <span className="font-semibold">E-Mail:</span> morino.stuebe@ergo.de
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Berufsbezeichnung */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Berufsbezeichnung und berufsrechtliche Regelungen</h2>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <div className="space-y-3 text-gray-700">
                  <div>
                    <span className="font-semibold">Berufsbezeichnung:</span> Selbständiger Handelsvertreter (verliehen in Deutschland)
                  </div>
                  <div>
                    <span className="font-semibold">Zuständige Aufsichtsbehörde:</span> Bundesanstalt für Finanzdienstleistungsaufsicht (BaFin)
                  </div>
                  <div>
                    <span className="font-semibold">Registrierung:</span> Deutsche Industrie- und Handelskammer (DIHK)
                  </div>
                </div>
              </div>
            </section>

            {/* IHK-Registrierung für Versicherungsberater */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Registrierung nach § 34d GewO</h2>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="space-y-3 text-gray-700">
                  <div>
                    <span className="font-semibold">Aufsichtsbehörde:</span> IHK Oldenburg (zuständig für Ganderkesee)
                  </div>
                  <div>
                    <span className="font-semibold">Vermittlerregister:</span> <a href="https://www.vermittlerregister.info" target="_blank" rel="noopener noreferrer" className="text-ergo-red hover:text-red-700 underline">www.vermittlerregister.info</a>
                  </div>
                  <div>
                    <span className="font-semibold">Berufsrechtliche Regelungen:</span> § 34d Gewerbeordnung (GewO)
                  </div>
                </div>
              </div>
            </section>

            {/* Verbraucherstreitbeilegung */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-700">
                  Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                  Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </div>
            </section>

            {/* Haftungsausschluss */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Haftung für Inhalte</h2>
              <div className="bg-red-50 p-6 rounded-lg">
                <p className="text-gray-700">
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 DDG für eigene Inhalte auf diesen Seiten nach den 
                  allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht 
                  unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach 
                  Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                </p>
              </div>
            </section>

            {/* Berufshaftpflicht */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Berufshaftpflichtversicherung</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="space-y-2 text-gray-700">
                  <div><span className="font-semibold">Versicherer:</span> ERGO Versicherung AG</div>
                  <div><span className="font-semibold">Geltungsraum:</span> Deutschland</div>
                  <div><span className="font-semibold">Deckungssumme:</span> 1.300.000 € je Versicherungsfall</div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 text-center">
          <div className="space-x-6">
            <Link href="/" className="text-ergo-red hover:text-red-700 font-bold">
              Startseite
            </Link>
            <Link href="/datenschutz" className="text-ergo-red hover:text-red-700 font-bold">
              Datenschutzerklärung
            </Link>
          </div>
          <div className="text-xs text-gray-500 mt-4">
            Stand: Januar 2025
          </div>
        </div>
      </div>
    </div>
  );
}