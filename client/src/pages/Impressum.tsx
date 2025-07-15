
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Impressum() {
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <h1 className="text-4xl font-bold text-ergo-dark mb-8">Impressum</h1>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-ergo-dark mb-4">Angaben gemäß § 5 TMG</h2>
            <p className="mb-6">
              <strong>ERGO Versicherungsgruppe</strong><br />
              Morino Stübe<br />
              Deutschlandweite Beratung<br />
              Deutschland
            </p>

            <h2 className="text-2xl font-semibold text-ergo-dark mb-4">Kontakt</h2>
            <p className="mb-6">
              Telefon: 015566771019<br />
              E-Mail: info@ergo-deutschland.de
            </p>

            <h2 className="text-2xl font-semibold text-ergo-dark mb-4">Berufsbezeichnung und berufsrechtliche Regelungen</h2>
            <p className="mb-6">
              Berufsbezeichnung: Versicherungsvermittler<br />
              Zuständige Kammer: IHK<br />
              Verliehen durch: Deutschland
            </p>

            <h2 className="text-2xl font-semibold text-ergo-dark mb-4">Registrierung</h2>
            <p className="mb-6">
              Vermittlerregister: <a href="https://www.vermittlerregister.info" target="_blank" rel="noopener noreferrer" className="text-ergo-red hover:underline">www.vermittlerregister.info</a>
            </p>

            <h2 className="text-2xl font-semibold text-ergo-dark mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p className="mb-6">
              Morino Stübe<br />
              ERGO Versicherungsgruppe<br />
              Deutschland
            </p>

            <h2 className="text-2xl font-semibold text-ergo-dark mb-4">Haftung für Inhalte</h2>
            <p className="mb-6">
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>

            <h2 className="text-2xl font-semibold text-ergo-dark mb-4">Haftung für Links</h2>
            <p className="mb-6">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>

            <h2 className="text-2xl font-semibold text-ergo-dark mb-4">Urheberrecht</h2>
            <p className="mb-6">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
