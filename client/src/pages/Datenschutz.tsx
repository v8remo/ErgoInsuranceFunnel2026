
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Datenschutz() {
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <h1 className="text-4xl font-bold text-ergo-dark mb-8">Datenschutzerklärung</h1>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-ergo-dark mb-4">1. Datenschutz auf einen Blick</h2>
            
            <h3 className="text-xl font-semibold text-ergo-dark mb-3">Allgemeine Hinweise</h3>
            <p className="mb-6">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
            </p>

            <h3 className="text-xl font-semibold text-ergo-dark mb-3">Datenerfassung auf dieser Website</h3>
            <p className="mb-6">
              <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
            </p>

            <h2 className="text-2xl font-semibold text-ergo-dark mb-4">2. Hosting</h2>
            <p className="mb-6">
              Wir hosten die Inhalte unserer Website bei einem externen Dienstleister. Personenbezogene Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert.
            </p>

            <h2 className="text-2xl font-semibold text-ergo-dark mb-4">3. Allgemeine Hinweise und Pflichtinformationen</h2>
            
            <h3 className="text-xl font-semibold text-ergo-dark mb-3">Datenschutz</h3>
            <p className="mb-6">
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>

            <h3 className="text-xl font-semibold text-ergo-dark mb-3">Hinweis zur verantwortlichen Stelle</h3>
            <p className="mb-6">
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br />
              <strong>ERGO Ganderkesee</strong><br />
              Morino Stübe<br />
              Friedensstraße 91 A<br />
              27777 Ganderkesee<br />
              Telefon: 01556 6771019<br />
              E-Mail: morino.stuebe@ergo.de
            </p>

            <h2 className="text-2xl font-semibold text-ergo-dark mb-4">4. Datenerfassung auf dieser Website</h2>
            
            <h3 className="text-xl font-semibold text-ergo-dark mb-3">Cookies</h3>
            <p className="mb-6">
              Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine Textdateien und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert.
            </p>

            <h3 className="text-xl font-semibold text-ergo-dark mb-3">Anfrage per E-Mail, Telefon oder Telefax</h3>
            <p className="mb-6">
              Wenn Sie uns per E-Mail, Telefon oder Telefax kontaktieren, wird Ihre Anfrage inklusive aller daraus hervorgehenden personenbezogenen Daten (Name, Anfrage) zum Zwecke der Bearbeitung Ihres Anliegens bei uns gespeichert und verarbeitet.
            </p>

            <h2 className="text-2xl font-semibold text-ergo-dark mb-4">5. Ihre Rechte</h2>
            <p className="mb-6">
              Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung oder Löschung dieser Daten.
            </p>

            <h2 className="text-2xl font-semibold text-ergo-dark mb-4">6. Widerruf Ihrer Einwilligung zur Datenverarbeitung</h2>
            <p className="mb-6">
              Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
            </p>

            <p className="text-sm text-gray-600 mt-8">
              Stand: Januar 2025
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
