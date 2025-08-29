import { useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Shield, Lock } from 'lucide-react';

export default function Datenschutz() {
  useEffect(() => {
    document.title = "Datenschutz - ERGO Agentur Stübe, Ganderkesee";
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
          <h1 className="text-2xl font-bold text-gray-800">Datenschutzerklärung</h1>
        </div>

        {/* Datenschutz Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="space-y-8">
            
            {/* Allgemeine Hinweise */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Shield className="w-6 h-6 text-ergo-red mr-3" />
                1. Datenschutz auf einen Blick
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold mb-2">Allgemeine Hinweise</h3>
                  <p className="text-gray-700">
                    Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten 
                    passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie 
                    persönlich identifiziert werden können.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Datenerfassung auf dieser Website</h3>
                  <p className="text-gray-700">
                    <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
                    Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. 
                    Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Wie erfassen wir Ihre Daten?</h3>
                  <p className="text-gray-700">
                    Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich 
                    z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
                  </p>
                </div>
              </div>
            </section>

            {/* Verantwortliche Stelle */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">2. Verantwortliche Stelle</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-700">
                  <strong>ERGO Agentur Stübe</strong><br />
                  Morino Stübe<br />
                  Friedensstraße 91 A<br />
                  27777 Ganderkesee<br />
                  Telefon: +49 15566 771019<br />
                  E-Mail: morino.stuebe@ergo.de
                </p>
              </div>
            </section>

            {/* Datenverarbeitung */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Lock className="w-6 h-6 text-ergo-red mr-3" />
                3. Datenverarbeitung
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold mb-3">Kontaktformular</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-3">
                      <strong>Zweck der Verarbeitung:</strong> Bearbeitung Ihrer Versicherungsanfrage
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
                    </p>
                    <p className="text-gray-700 mb-3">
                      <strong>Verarbeitete Daten:</strong> Name, E-Mail-Adresse, Telefonnummer, Wohnort, Versicherungsinteressen
                    </p>
                    <p className="text-gray-700">
                      <strong>Speicherdauer:</strong> Bis zur vollständigen Bearbeitung Ihrer Anfrage, 
                      danach Löschung nach gesetzlichen Aufbewahrungsfristen
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-3">SSL-Verschlüsselung</h3>
                  <p className="text-gray-700">
                    Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte 
                    eine SSL-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile 
                    des Browsers von "http://" auf "https://" wechselt.
                  </p>
                </div>
              </div>
            </section>

            {/* Ihre Rechte */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">4. Ihre Rechte</h2>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="space-y-3 text-gray-700">
                  <div><strong>Auskunftsrecht:</strong> Sie haben das Recht auf Auskunft über Ihre gespeicherten Daten</div>
                  <div><strong>Berichtigungsrecht:</strong> Sie haben das Recht auf Berichtigung unrichtiger Daten</div>
                  <div><strong>Löschungsrecht:</strong> Sie haben das Recht auf Löschung Ihrer Daten</div>
                  <div><strong>Einschränkungsrecht:</strong> Sie haben das Recht auf Einschränkung der Verarbeitung</div>
                  <div><strong>Widerspruchsrecht:</strong> Sie haben das Recht auf Widerspruch gegen die Verarbeitung</div>
                  <div><strong>Datenübertragbarkeit:</strong> Sie haben das Recht auf Datenübertragbarkeit</div>
                </div>
              </div>
            </section>

            {/* Widerruf */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">5. Widerruf Ihrer Einwilligung</h2>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <p className="text-gray-700">
                  Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. 
                  Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der 
                  bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
                </p>
              </div>
            </section>

            {/* Kontakt bei Datenschutzfragen */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">6. Kontakt bei Datenschutzfragen</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-700">
                  Bei Fragen zum Datenschutz wenden Sie sich bitte an:<br />
                  <strong>Morino Stübe</strong><br />
                  E-Mail: morino.stuebe@ergo.de<br />
                  Telefon: +49 15566 771019
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
            <Link href="/impressum" className="text-ergo-red hover:text-red-700 font-bold">
              Impressum
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