import { useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';

export default function Impressum() {
  useEffect(() => {
    document.title = "Impressum - ERGO Agentur Stübe, Ganderkesee";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <button className="inline-flex items-center text-ergo-red hover:text-red-700 font-bold mb-4">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Zurück zur Startseite
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Impressum</h1>
        </div>

        {/* Impressum Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="space-y-8">
            {/* Angaben gemäß § 5 TMG */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Angaben gemäß § 5 TMG</h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-ergo-red mr-3 mt-1" />
                  <div>
                    <div className="font-bold">ERGO Agentur Stübe</div>
                    <div>Morino Stübe</div>
                    <div>Friedensstraße 91 A</div>
                    <div>27777 Ganderkesee</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-ergo-red mr-3" />
                  <div>
                    <span className="font-bold">Telefon:</span> +49 15566 771019
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-ergo-red mr-3" />
                  <div>
                    <span className="font-bold">E-Mail:</span> morino.stuebe@ergo.de
                  </div>
                </div>
              </div>
            </section>

            {/* Berufliche Angaben */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Berufliche Angaben</h2>
              <div className="space-y-2">
                <div><span className="font-bold">Tätigkeit:</span> Gebundener Versicherungsvertreter gemäß § 34d Abs. 7 Nr. 1 GewO</div>
                <div><span className="font-bold">Versicherungsunternehmen:</span> ERGO Versicherungsgruppe AG</div>
                <div><span className="font-bold">Registrierung:</span> Deutscher Industrie- und Handelskammertag (DIHK)</div>
                <div><span className="font-bold">Vermittlerregister:</span> www.vermittlerregister.info</div>
                <div><span className="font-bold">Registrierungsnummer:</span> D-5H7J-7DUI1-10</div>
                <div><span className="font-bold">Zuständige Kammer:</span> IHK Oldenburg</div>
              </div>
            </section>

            {/* Aufsichtsbehörde */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Aufsichtsbehörde</h2>
              <div className="space-y-2">
                <div>Bundesanstalt für Finanzdienstleistungsaufsicht (BaFin)</div>
                <div>Graurheindorfer Str. 108</div>
                <div>53117 Bonn</div>
                <div>Website: www.bafin.de</div>
              </div>
            </section>

            {/* VVG-konforme Hinweise */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Vermittlerstatus nach § 34d GewO</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  Als gebundener Versicherungsvertreter bin ich ausschließlich für die ERGO Versicherungsgruppe AG tätig 
                  und vermittle nur deren Versicherungsprodukte. Die Beratung erfolgt auf Grundlage einer 
                  eingeschränkten Auswahl von Versicherungsverträgen gemäß § 34d Abs. 4 GewO.
                </p>
              </div>
            </section>

            {/* Vergütungshinweis */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Vergütungshinweis</h2>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  Als gebundener Versicherungsvertreter erhalte ich für die Vermittlung von Versicherungsverträgen 
                  eine Provision von der ERGO Versicherungsgruppe AG. Diese ist bereits in der Versicherungsprämie 
                  kalkuliert und führt zu keinen zusätzlichen Kosten für Sie.
                </p>
              </div>
            </section>

            {/* Berufshaftpflichtversicherung */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Berufshaftpflichtversicherung</h2>
              <div className="space-y-2">
                <div><span className="font-bold">Name und Sitz des Versicherers:</span></div>
                <div>ERGO Versicherung AG</div>
                <div>ERGO-Platz 1</div>
                <div>40198 Düsseldorf</div>
                <div className="mt-3"><span className="font-bold">Geltungsraum der Versicherung:</span> Deutschland</div>
              </div>
            </section>

            {/* Streitschlichtung */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Verbraucherschlichtung</h2>
              <div className="space-y-2">
                <p className="text-gray-700">
                  Zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle sind wir bereit. Zuständig ist:
                </p>
                <div className="mt-3 p-4 bg-gray-50 rounded">
                  <div><span className="font-bold">Versicherungsombudsmann e.V.</span></div>
                  <div>Postfach 08 06 32</div>
                  <div>10006 Berlin</div>
                  <div>Website: <a href="https://www.versicherungsombudsmann.de" target="_blank" className="text-ergo-red hover:underline">www.versicherungsombudsmann.de</a></div>
                </div>
              </div>
            </section>

            {/* Haftungsausschluss */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Haftungsausschluss</h2>
              <div className="space-y-4 text-sm text-gray-700">
                <p>
                  <span className="font-bold">Inhalt des Onlineangebotes:</span> Der Autor übernimmt keinerlei Gewähr für die Aktualität, 
                  Korrektheit, Vollständigkeit oder Qualität der bereitgestellten Informationen. 
                  Haftungsansprüche gegen den Autor sind grundsätzlich ausgeschlossen.
                </p>
                <p>
                  <span className="font-bold">Verweise und Links:</span> Bei direkten oder indirekten Verweisen auf fremde Webseiten 
                  ("Hyperlinks") würde eine Haftungsverpflichtung nur dann in Kraft treten, wenn der Autor von den 
                  Inhalten Kenntnis hat und es technisch möglich wäre, die Nutzung rechtswidriger Inhalte zu verhindern.
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <div className="space-x-6">
            <Link href="/" className="text-ergo-red hover:text-red-700 font-bold">
              Startseite
            </Link>
            <Link href="/datenschutz" className="text-ergo-red hover:text-red-700 font-bold">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}