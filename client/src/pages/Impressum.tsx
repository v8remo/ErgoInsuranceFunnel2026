import { useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Mail, Phone, MapPin, Shield, ExternalLink } from 'lucide-react';

export default function Impressum() {
  useEffect(() => {
    document.title = "Impressum - ERGO Agentur Stübe, Ganderkesee";
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
          <h1 className="text-2xl font-bold text-gray-800">Impressum</h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 border border-gray-200">
          <div className="space-y-8">

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Mail className="w-6 h-6 text-ergo-red mr-3" />
                Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)
              </h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="space-y-2 text-gray-700">
                  <div className="font-bold text-lg">ERGO Agentur Stübe</div>
                  <div>Gebundener Versicherungsvertreter nach § 34d Abs. 7 GewO</div>
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

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Berufsbezeichnung und berufsrechtliche Regelungen</h2>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <div className="space-y-3 text-gray-700">
                  <div>
                    <span className="font-semibold">Status:</span> Gebundener Versicherungsvertreter gemäß § 34d Abs. 7 GewO
                  </div>
                  <div>
                    <span className="font-semibold">Vertretenes Unternehmen:</span> ERGO Versicherung AG, ERGO-Platz 1, 40198 Düsseldorf
                  </div>
                  <div>
                    <span className="font-semibold">Zuständige Erlaubnisbehörde:</span> Oldenburgische Industrie- und Handelskammer (IHK), Moslestraße 6, 26122 Oldenburg
                  </div>
                  <div>
                    <span className="font-semibold">Zuständige Aufsichtsbehörde:</span> Bundesanstalt für Finanzdienstleistungsaufsicht (BaFin), Graurheindorfer Str. 108, 53117 Bonn
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Shield className="w-6 h-6 text-ergo-red mr-3" />
                Registrierung nach § 34d GewO
              </h2>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="space-y-3 text-gray-700">
                  <div>
                    <span className="font-semibold">Registrierungsnummer:</span> D-5H7J-7DUI1-10
                  </div>
                  <div>
                    <span className="font-semibold">Registerstelle:</span> Oldenburgische Industrie- und Handelskammer (IHK Oldenburg)
                  </div>
                  <div>
                    <span className="font-semibold">Vermittlerregister:</span>{' '}
                    <a href="https://www.vermittlerregister.info" target="_blank" rel="noopener noreferrer" className="text-ergo-red hover:text-red-700 underline inline-flex items-center gap-1">
                      www.vermittlerregister.info <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div>
                    <span className="font-semibold">Berufsrechtliche Regelungen:</span> § 34d Gewerbeordnung (GewO), Versicherungsvermittlungsverordnung (VersVermV)
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Berufshaftpflichtversicherung</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="space-y-2 text-gray-700">
                  <p className="text-sm">Angaben gemäß § 11 Abs. 1 Nr. 4 VersVermV:</p>
                  <div><span className="font-semibold">Versicherer:</span> ERGO Versicherung AG</div>
                  <div><span className="font-semibold">Anschrift:</span> ERGO-Platz 1, 40198 Düsseldorf</div>
                  <div><span className="font-semibold">Geltungsraum:</span> Deutschland / EU</div>
                  <div><span className="font-semibold">Deckungssumme:</span> 1.300.000 € je Versicherungsfall</div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-base sm:text-xl font-bold text-gray-800 mb-4">Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="space-y-3 text-gray-700">
                  <p>
                    Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
                    <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-ergo-red hover:text-red-700 underline inline-flex items-center gap-1">
                      https://ec.europa.eu/consumers/odr/ <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                  <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
                  <p>
                    Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                    Verbraucherschlichtungsstelle teilzunehmen.
                  </p>
                  <p>
                    <span className="font-semibold">Versicherungsombudsmann:</span> Für Beschwerden im Versicherungsbereich können Sie sich an den Versicherungsombudsmann e.V. wenden:{' '}
                    <a href="https://www.versicherungsombudsmann.de" target="_blank" rel="noopener noreferrer" className="text-ergo-red hover:text-red-700 underline inline-flex items-center gap-1">
                      www.versicherungsombudsmann.de <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Haftung für Inhalte</h2>
              <div className="bg-red-50 p-6 rounded-lg">
                <p className="text-gray-700">
                  Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den
                  allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht
                  verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach
                  Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                  Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen
                  Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt
                  der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden
                  Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Haftung für Links</h2>
              <div className="bg-red-50 p-6 rounded-lg">
                <p className="text-gray-700">
                  Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
                  Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
                  verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten
                  Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte
                  waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten
                  Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden
                  von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Urheberrecht</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700">
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
                  Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
                  Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                  Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
                  Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter
                  beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine
                  Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden
                  von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
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
            <Link href="/datenschutz" className="text-ergo-red hover:text-red-700 font-bold">
              Datenschutzerklärung
            </Link>
            <Link href="/erstinformation" className="text-ergo-red hover:text-red-700 font-bold">
              Erstinformation
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