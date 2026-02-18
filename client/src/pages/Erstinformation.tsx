import { useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Shield, ExternalLink } from 'lucide-react';

export default function Erstinformation() {
  useEffect(() => {
    document.title = "Erstinformation nach § 15 VersVermV - ERGO Agentur Stübe";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/">
            <button className="inline-flex items-center text-ergo-red hover:text-red-700 font-bold mb-4 bg-white px-4 py-2 rounded-lg shadow">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Erstinformation</h1>
          <p className="text-sm text-gray-500 mt-1">gemäß § 15 Versicherungsvermittlungsverordnung (VersVermV)</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 border border-gray-200">
          <div className="space-y-8">

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Shield className="w-6 h-6 text-ergo-red mr-3" />
                1. Identität und Anschrift
              </h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="space-y-2 text-gray-700">
                  <div className="font-bold text-lg">ERGO Agentur Stübe</div>
                  <div>Morino Stübe</div>
                  <div>Friedensstraße 91 A</div>
                  <div>27777 Ganderkesee</div>
                  <div className="mt-3">Telefon: +49 15566 771019</div>
                  <div>E-Mail: morino.stuebe@ergo.de</div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">2. Status als Versicherungsvermittler</h2>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Morino Stübe</strong> ist als <strong>gebundener Versicherungsvertreter</strong> gemäß
                    § 34d Abs. 7 Gewerbeordnung (GewO) tätig.
                  </p>
                  <p>
                    Als gebundener Versicherungsvertreter vermittelt Morino Stübe ausschließlich Versicherungsprodukte
                    der folgenden Versicherungsunternehmen:
                  </p>
                  <div className="bg-white p-4 rounded-lg mt-2">
                    <p className="font-semibold">ERGO Versicherung AG</p>
                    <p>ERGO-Platz 1</p>
                    <p>40198 Düsseldorf</p>
                  </div>
                  <p className="text-sm">
                    Als gebundener Versicherungsvertreter ist Morino Stübe von der Erlaubnispflicht nach
                    § 34d Abs. 1 GewO befreit. Das vertretene Versicherungsunternehmen übernimmt die volle
                    Haftung für die Vermittlungstätigkeit (§ 34d Abs. 7 Satz 2 GewO).
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">3. Registrierung</h2>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="space-y-3 text-gray-700">
                  <div>
                    <span className="font-semibold">Registriert als:</span> Gebundener Versicherungsvertreter nach § 34d Abs. 7 GewO
                  </div>
                  <div>
                    <span className="font-semibold">Registrierungsnummer:</span> D-5H7J-7DUI1-10
                  </div>
                  <div>
                    <span className="font-semibold">Registerstelle:</span> Oldenburgische Industrie- und Handelskammer (IHK Oldenburg),
                    Moslestraße 6, 26122 Oldenburg
                  </div>
                  <div>
                    <span className="font-semibold">Überprüfung der Registrierung:</span>{' '}
                    <a href="https://www.vermittlerregister.info" target="_blank" rel="noopener noreferrer" className="text-ergo-red hover:text-red-700 underline inline-flex items-center gap-1">
                      Vermittlerregister des DIHK <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div>
                    Deutscher Industrie- und Handelskammertag (DIHK) e.V., Breite Straße 29, 10178 Berlin,
                    Telefon: 0180 600 585 0 (0,20 €/Anruf aus dem dt. Festnetz, max. 0,60 €/Anruf aus Mobilfunknetzen)
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">4. Art der Vergütung</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Morino Stübe</strong> erhält als gebundener Versicherungsvertreter für die erfolgreiche
                    Vermittlung von Versicherungsverträgen eine <strong>Provision</strong> (Courtage/Abschlussprovision)
                    von dem vertretenen Versicherungsunternehmen (ERGO Versicherung AG).
                  </p>
                  <p>
                    Diese Vergütung ist in der Versicherungsprämie bereits enthalten und wird nicht gesondert
                    in Rechnung gestellt. Es entstehen Ihnen durch die Vermittlung keine zusätzlichen Kosten.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">5. Beratungsgrundlage</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="space-y-3 text-gray-700">
                  <p>
                    Als gebundener Versicherungsvertreter bietet Morino Stübe eine Beratung auf Grundlage
                    der Versicherungsprodukte der ERGO Versicherung AG an.
                  </p>
                  <p>
                    <strong>Hinweis:</strong> Es handelt sich nicht um eine unabhängige Beratung im Sinne des
                    § 59 Abs. 4 VVG. Die Beratung erfolgt auf Basis der Produktpalette der ERGO Versicherung AG.
                    Eine Marktanalyse oder ein Vergleich mit Produkten anderer Versicherungsunternehmen findet nicht statt.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">6. Schlichtungsstellen</h2>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <div className="space-y-4 text-gray-700">
                  <p>
                    Im Falle von Beschwerden oder Streitigkeiten im Zusammenhang mit der Versicherungsvermittlung
                    können Sie sich an folgende Schlichtungsstellen wenden:
                  </p>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="font-semibold">Versicherungsombudsmann e.V.</p>
                    <p>Postfach 08 06 32</p>
                    <p>10006 Berlin</p>
                    <p className="mt-2">Telefon: 0800 369 6000 (kostenfrei aus dem dt. Festnetz)</p>
                    <p>Fax: 0800 369 9000</p>
                    <p className="mt-2">
                      <a href="https://www.versicherungsombudsmann.de" target="_blank" rel="noopener noreferrer" className="text-ergo-red hover:text-red-700 underline inline-flex items-center gap-1">
                        www.versicherungsombudsmann.de <ExternalLink className="w-3 h-3" />
                      </a>
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="font-semibold">Ombudsmann für die Private Kranken- und Pflegeversicherung</p>
                    <p>Postfach 06 02 22</p>
                    <p>10052 Berlin</p>
                    <p className="mt-2">Telefon: 0800 255 044 4 (kostenfrei aus dem dt. Festnetz)</p>
                    <p className="mt-2">
                      <a href="https://www.pkv-ombudsmann.de" target="_blank" rel="noopener noreferrer" className="text-ergo-red hover:text-red-700 underline inline-flex items-center gap-1">
                        www.pkv-ombudsmann.de <ExternalLink className="w-3 h-3" />
                      </a>
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <p className="font-semibold">Online-Streitbeilegung (OS-Plattform der EU)</p>
                    <p className="mt-2">
                      <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-ergo-red hover:text-red-700 underline inline-flex items-center gap-1">
                        https://ec.europa.eu/consumers/odr/ <ExternalLink className="w-3 h-3" />
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">7. Berufshaftpflichtversicherung</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-2 text-gray-700">
                  <p>
                    Für die Tätigkeit als gebundener Versicherungsvertreter besteht eine Berufshaftpflichtversicherung
                    über das vertretene Versicherungsunternehmen:
                  </p>
                  <div className="mt-2">
                    <div><span className="font-semibold">Versicherer:</span> ERGO Versicherung AG</div>
                    <div><span className="font-semibold">Anschrift:</span> ERGO-Platz 1, 40198 Düsseldorf</div>
                    <div><span className="font-semibold">Geltungsraum:</span> Deutschland / EU</div>
                    <div><span className="font-semibold">Deckungssumme:</span> 1.300.000 € je Versicherungsfall</div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="bg-blue-50 border-l-4 border-[#003781] p-4 rounded-r-lg">
                <p className="text-sm text-gray-700">
                  <strong>Hinweis:</strong> Diese Erstinformation wird Ihnen gemäß § 15 der Verordnung über die
                  Versicherungsvermittlung und -beratung (VersVermV) vor Beginn der Beratung zur Verfügung gestellt.
                  Sie dient der Information über die Identität und den Status des Versicherungsvermittlers.
                </p>
              </div>
            </section>

          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="space-x-6">
            <Link href="/" className="text-ergo-red hover:text-red-700 font-bold">
              Startseite
            </Link>
            <Link href="/impressum" className="text-ergo-red hover:text-red-700 font-bold">
              Impressum
            </Link>
            <Link href="/datenschutz" className="text-ergo-red hover:text-red-700 font-bold">
              Datenschutzerklärung
            </Link>
          </div>
          <div className="text-xs text-gray-500 mt-4">
            Stand: Februar 2026
          </div>
        </div>
      </div>
    </div>
  );
}
