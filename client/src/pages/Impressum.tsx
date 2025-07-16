
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

import SEO from "@/components/SEO";

export default function Impressum() {
  return (
    <>
      <SEO
        title="Impressum - ERGO Versicherung Ganderkesee"
        description="Impressum der ERGO Versicherung Ganderkesee. Verantwortlich: Morino Stübe, selbständige Agentur. Kontakt und rechtliche Informationen."
        keywords="Impressum, ERGO Ganderkesee, Morino Stübe, Kontakt, rechtliche Hinweise"
      />
      <Header />
      <main className="min-h-screen bg-ergo-gray py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6 sm:p-8 lg:p-12">
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-ergo-dark mb-6 sm:mb-8 break-words">Impressum</h1>
              
              <div className="space-y-4 sm:space-y-6 text-gray-700">
                <section>
                  <h2 className="text-lg sm:text-xl font-semibold text-ergo-dark mb-2 sm:mb-3 break-words">Angaben gemäß § 5 TMG</h2>
                  <p className="leading-relaxed text-sm sm:text-base">
                    ERGO Ganderkesee<br />
                    Morino Stübe<br />
                    Versicherungsfachmann nach § 84 HGB<br />
                    Friedensstraße 91 A<br />
                    27777 Ganderkesee
                  </p>
                </section>

                <section>
                  <h2 className="text-lg sm:text-xl font-semibold text-ergo-dark mb-2 sm:mb-3 break-words">Kontakt</h2>
                  <p className="leading-relaxed text-sm sm:text-base">
                    Telefon: 01556 6771019<br />
                    E-Mail: morino.stuebe@ergo.de
                  </p>
                </section>

                <section>
                  <h2 className="text-lg sm:text-xl font-semibold text-ergo-dark mb-2 sm:mb-3 break-words">Registereintrag</h2>
                  <p className="leading-relaxed text-sm sm:text-base">
                    Vermittlerregister-Nr.: D-5H7J-7DUI1-10<br />
                    Das Vermittlerregister wird geführt bei:<br />
                    Deutscher Industrie- und Handelskammertag (DIHK) e.V.<br />
                    Breite Straße 29, 10178 Berlin<br />
                    <a href="https://www.vermittlerregister.info" target="_blank" rel="noopener noreferrer" className="text-ergo-red hover:underline">
                      www.vermittlerregister.info
                    </a>
                  </p>
                </section>

                <section>
                  <h2 className="text-lg sm:text-xl font-semibold text-ergo-dark mb-2 sm:mb-3 break-words">Berufshaftpflichtversicherung</h2>
                  <p className="leading-relaxed text-sm sm:text-base">
                    Name und Sitz des Versicherers:<br />
                    ERGO Versicherung AG<br />
                    ERGO-Platz 1<br />
                    40477 Düsseldorf
                  </p>
                  <p className="mt-3 leading-relaxed text-sm sm:text-base">
                    Geltungsraum der Versicherung: Deutschland
                  </p>
                </section>

                <section>
                  <h2 className="text-lg sm:text-xl font-semibold text-ergo-dark mb-2 sm:mb-3 break-words">Zuständige Aufsichtsbehörde</h2>
                  <p className="leading-relaxed text-sm sm:text-base">
                    Bundesanstalt für Finanzdienstleistungsaufsicht (BaFin)<br />
                    Graurheindorfer Straße 108<br />
                    53117 Bonn<br />
                    <a href="https://www.bafin.de" target="_blank" rel="noopener noreferrer" className="text-ergo-red hover:underline">
                      www.bafin.de
                    </a>
                  </p>
                </section>

                <section>
                  <h2 className="text-lg sm:text-xl font-semibold text-ergo-dark mb-2 sm:mb-3 break-words">Streitschlichtung</h2>
                  <p className="leading-relaxed text-sm sm:text-base">
                    Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
                    <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-ergo-red hover:underline ml-1">
                      https://ec.europa.eu/consumers/odr/
                    </a>
                  </p>
                  <p className="mt-3 leading-relaxed text-sm sm:text-base">
                    Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                    Verbraucherschlichtungsstelle teilzunehmen.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg sm:text-xl font-semibold text-ergo-dark mb-2 sm:mb-3 break-words">Hinweis zur Vermittlertätigkeit</h2>
                  <p className="leading-relaxed text-sm sm:text-base">
                    Als gebundener Versicherungsvertreter bin ich ausschließlich für die ERGO Versicherung AG tätig 
                    und vermittle nur deren Versicherungsprodukte. Die Beratung erfolgt auf Grundlage einer 
                    eingeschränkten Auswahl von Versicherungsverträgen gemäß § 34d Abs. 4 GewO.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg sm:text-xl font-semibold text-ergo-dark mb-2 sm:mb-3 break-words">Haftung für Inhalte</h2>
                  <p className="leading-relaxed text-sm sm:text-base">
                    Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den 
                    allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht 
                    verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen 
                    zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg sm:text-xl font-semibold text-ergo-dark mb-2 sm:mb-3 break-words">Urheberrecht</h2>
                  <p className="leading-relaxed text-sm sm:text-base">
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen 
                    Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der 
                    Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
