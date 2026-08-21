import { useEffect } from 'react';
import { Link } from 'wouter';
import { Shield, Lock, ExternalLink } from 'lucide-react';
import Breadcrumb from "@/components/Breadcrumb";

export default function Datenschutz() {
  useEffect(() => {
    document.title = "Datenschutzerklärung - ERGO Agentur Stübe, Ganderkesee";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Breadcrumb items={[{ label: "Datenschutz" }]} />
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-[30px] md:text-[40px]">Datenschutzerklärung</h1>
        </div>

        <div className="space-y-10">

          <section>
            <h2 className="text-xl mb-4 flex items-center">
              <Shield className="w-6 h-6 text-ergo-red mr-3 shrink-0" />
              1. Datenschutz auf einen Blick
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-base mb-2">Allgemeine Hinweise</h3>
                <p className="text-ergo-stone leading-relaxed">
                  Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten
                  passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie
                  persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen
                  Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
                </p>
              </div>
              <div>
                <h3 className="text-base mb-2">Datenerfassung auf dieser Website</h3>
                <p className="text-ergo-stone leading-relaxed">
                  <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
                  Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber.
                  Dessen Kontaktdaten können Sie dem Abschnitt „Verantwortliche Stelle" in dieser
                  Datenschutzerklärung entnehmen.
                </p>
              </div>
              <div>
                <h3 className="text-base mb-2">Wie erfassen wir Ihre Daten?</h3>
                <p className="text-ergo-stone leading-relaxed">
                  Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich
                  z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben. Andere Daten werden automatisch
                  oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor
                  allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
                  Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.
                </p>
              </div>
              <div>
                <h3 className="text-base mb-2">Wofür nutzen wir Ihre Daten?</h3>
                <p className="text-ergo-stone leading-relaxed">
                  Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten.
                  Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden. Wenn Sie über unsere
                  Formulare eine Versicherungsanfrage stellen, werden Ihre Daten zur Bearbeitung dieser Anfrage und
                  zur Vertragsanbahnung genutzt.
                </p>
              </div>
              <div>
                <h3 className="text-base mb-2">Welche Rechte haben Sie bezüglich Ihrer Daten?</h3>
                <p className="text-ergo-stone leading-relaxed">
                  Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer
                  gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung
                  oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt
                  haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das
                  Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten
                  zu verlangen. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl mb-4">2. Verantwortliche Stelle</h2>
            <div className="ergo-card p-6">
              <p className="text-ergo-ink">
                <strong>ERGO Agentur Stübe</strong><br />
                Morino Stübe<br />
                Friedensstraße 91 A<br />
                27777 Ganderkesee<br /><br />
                Telefon: +49 15566 771019<br />
                E-Mail: morino.stuebe@ergo.de
              </p>
              <p className="text-ergo-stone mt-4">
                Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen
                über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl mb-4">3. Hosting</h2>
            <div className="space-y-3 text-ergo-stone leading-relaxed">
              <p>
                Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die personenbezogenen Daten,
                die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann
                es sich v. a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten,
                Kontaktdaten, Namen, Websitezugriffe und sonstige Daten, die über eine Website generiert werden, handeln.
              </p>
              <p>
                Der Einsatz des Hosters erfolgt zum Zwecke der Vertragserfüllung gegenüber unseren potenziellen und
                bestehenden Kunden (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse einer sicheren, schnellen und
                effizienten Bereitstellung unseres Online-Angebots durch einen professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO).
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl mb-4">4. Server-Logfiles</h2>
            <div className="space-y-3 text-ergo-stone leading-relaxed">
              <p>
                Der Provider der Seiten erhebt und speichert automatisch Informationen in sogenannten Server-Logfiles,
                die Ihr Browser automatisch an uns übermittelt. Dies sind:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Browsertyp und Browserversion</li>
                <li>Verwendetes Betriebssystem</li>
                <li>Referrer URL</li>
                <li>Hostname des zugreifenden Rechners</li>
                <li>Uhrzeit der Serveranfrage</li>
                <li>IP-Adresse</li>
              </ul>
              <p>
                Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
                Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
                Der Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien Darstellung
                und der Optimierung seiner Website – hierzu müssen die Server-Logfiles erfasst werden.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl mb-4 flex items-center">
              <Lock className="w-6 h-6 text-ergo-red mr-3 shrink-0" />
              5. Cookies und Tracking
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-base mb-3">Cookies</h3>
                <div className="ergo-card p-4">
                  <p className="text-ergo-stone mb-3">
                    Unsere Internetseiten verwenden sogenannte „Cookies". Cookies sind kleine Datenpakete und richten
                    auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung
                    (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert.
                  </p>
                  <p className="text-ergo-stone mb-3">
                    <strong>Notwendige Cookies:</strong> Diese Cookies sind für den technischen Betrieb der Website
                    erforderlich und können nicht deaktiviert werden. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO
                    (berechtigtes Interesse) bzw. § 25 Abs. 2 TDDDG.
                  </p>
                  <p className="text-ergo-stone">
                    <strong>Marketing- und Analyse-Cookies:</strong> Cookies, die nicht technisch notwendig sind
                    (z. B. für Google Analytics oder Google Ads), werden erst nach Ihrer ausdrücklichen Einwilligung
                    gesetzt. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG. Sie können Ihre
                    Einwilligung jederzeit über den Cookie-Banner widerrufen.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-base mb-3">Google Analytics</h3>
                <div className="ergo-card p-4">
                  <p className="text-ergo-stone mb-3">
                    Diese Website nutzt Funktionen des Webanalysedienstes Google Analytics (Google Ireland Limited,
                    Gordon House, Barrow Street, Dublin 4, Irland). Google Analytics ermöglicht es dem Websitebetreiber,
                    das Verhalten der Websitebesucher zu analysieren.
                  </p>
                  <p className="text-ergo-stone mb-3">
                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Ihre Einwilligung über den Cookie-Banner).
                    Google Analytics wird erst nach Ihrer Einwilligung aktiviert.
                  </p>
                  <p className="text-ergo-stone mb-3">
                    <strong>IP-Anonymisierung:</strong> Wir haben auf dieser Website die Funktion IP-Anonymisierung
                    aktiviert. Dadurch wird Ihre IP-Adresse von Google innerhalb von Mitgliedstaaten der EU gekürzt.
                  </p>
                  <p className="text-ergo-stone">
                    <strong>Widerspruch:</strong> Sie können Ihre Einwilligung jederzeit über den Cookie-Banner widerrufen.
                    Bereits gesetzte Cookies können Sie in Ihren Browser-Einstellungen löschen.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-base mb-3">Google Ads Conversion-Tracking</h3>
                <div className="ergo-card p-4">
                  <p className="text-ergo-stone mb-3">
                    Diese Website nutzt Google Ads Conversion-Tracking. Wenn Sie über eine Google-Anzeige auf unsere
                    Website gelangen, wird von Google Ads ein Cookie auf Ihrem Rechner gesetzt. So kann nachvollzogen
                    werden, ob bestimmte Aktionen (z. B. Kontaktanfragen) durchgeführt wurden.
                  </p>
                  <p className="text-ergo-stone">
                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Ihre Einwilligung).
                    Das Conversion-Tracking wird erst nach Ihrer Einwilligung über den Cookie-Banner aktiviert.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl mb-4">6. Kontaktformulare und Versicherungsanfragen</h2>
            <div className="space-y-6">
              <div className="ergo-card p-4">
                <p className="text-ergo-stone mb-3">
                  <strong>Zweck der Verarbeitung:</strong> Versicherungsberatung, Angebotserstellung, Vertragsabwicklung,
                  Schadensmeldungen, Dokumenteneinreichung und Kennzeichen-/eVB-Anfragen.
                </p>
                <p className="text-ergo-stone mb-3">
                  <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Durchführung vorvertraglicher Maßnahmen
                  bzw. Vertragserfüllung) sowie Art. 6 Abs. 1 lit. a DSGVO (Ihre Einwilligung bei freiwilligen Angaben).
                </p>
                <p className="text-ergo-stone mb-3">
                  <strong>Verarbeitete Daten:</strong> Name, E-Mail-Adresse, Telefonnummer, Anschrift, Geburtsdatum,
                  Versicherungswünsche, Fahrzeugdaten, bestehende Verträge, Schadensinformationen sowie
                  von Ihnen hochgeladene Dateien (Dokumente, Fotos, Belege).
                </p>
                <p className="text-ergo-stone mb-3">
                  <strong>Empfänger:</strong> ERGO Versicherung AG (bei Antragsstellung und Vertragsabwicklung).
                </p>
                <p className="text-ergo-stone">
                  <strong>Speicherdauer:</strong> Ihre Daten werden nach Erledigung Ihrer Anfrage gelöscht, sofern
                  keine gesetzlichen Aufbewahrungspflichten entgegenstehen. Handels- und steuerrechtliche
                  Aufbewahrungspflichten betragen bis zu 10 Jahre (§ 147 AO, § 257 HGB).
                </p>
              </div>

              <div>
                <h3 className="text-base mb-3">Datei-Uploads</h3>
                <div className="ergo-card p-4">
                  <p className="text-ergo-stone mb-3">
                    Auf den Seiten „Dokumente einreichen", „Schaden melden" und „Kennzeichen anfordern" können Sie
                    Dateien (Bilder, PDFs) hochladen. Diese werden ausschließlich zur Bearbeitung Ihrer Anfrage
                    verwendet und per E-Mail an uns weitergeleitet.
                  </p>
                  <p className="text-ergo-stone">
                    <strong>Hinweis:</strong> Hochgeladene Dateien werden nicht dauerhaft auf dem Server gespeichert,
                    sondern unmittelbar nach der E-Mail-Übermittlung verworfen.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl mb-4">7. E-Mail-Versand (Auftragsverarbeitung)</h2>
            <div className="space-y-3 text-ergo-stone leading-relaxed">
              <p>
                Für den Versand von E-Mail-Benachrichtigungen (z. B. Bestätigungen Ihrer Anfragen) nutzen wir den
                Dienst Resend (Resend, Inc.). Dieser Dienst verarbeitet Ihre E-Mail-Adresse und den Inhalt der
                E-Mail in unserem Auftrag.
              </p>
              <p>
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) und
                Art. 28 DSGVO (Auftragsverarbeitung).
              </p>
              <p>
                <strong>Datenübermittlung in Drittländer:</strong> Die Server von Resend befinden sich in den USA.
                Die Datenübermittlung erfolgt auf Grundlage von Art. 46 Abs. 2 lit. c DSGVO
                (Standardvertragsklauseln) bzw. des EU-US Data Privacy Framework.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl mb-4">8. WhatsApp-Kommunikation</h2>
            <div className="space-y-3 text-ergo-stone leading-relaxed">
              <p>
                Auf unserer Website bieten wir Ihnen die Möglichkeit, uns über WhatsApp (Meta Platforms Ireland Ltd.)
                zu kontaktieren. Wenn Sie uns über WhatsApp kontaktieren, werden Ihre Nachricht, Ihre Telefonnummer
                und ggf. Ihr Profilname verarbeitet.
              </p>
              <p>
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Ihre Einwilligung durch aktive
                Kontaktaufnahme) sowie Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen).
              </p>
              <p>
                <strong>Hinweis:</strong> WhatsApp überträgt Daten in die USA. Die Datenübermittlung erfolgt auf
                Grundlage des EU-US Data Privacy Framework. Bitte beachten Sie die Datenschutzrichtlinie von
                WhatsApp/Meta:{' '}
                <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="ergo-link inline-flex items-center gap-1">
                  WhatsApp Datenschutzrichtlinie <ExternalLink className="w-3 h-3" />
                </a>
              </p>
              <p>
                <strong>Speicherdauer:</strong> Ihre WhatsApp-Nachrichten werden von uns gespeichert, solange
                dies für die Bearbeitung Ihres Anliegens erforderlich ist, und anschließend gelöscht, sofern
                keine gesetzlichen Aufbewahrungspflichten bestehen.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl mb-4">9. Datenweitergabe an Dritte</h2>
            <div className="space-y-3 text-ergo-stone leading-relaxed">
              <p>
                Eine Übermittlung Ihrer persönlichen Daten an Dritte zu anderen als den im Folgenden
                aufgeführten Zwecken findet nicht statt. Wir geben Ihre persönlichen Daten nur an Dritte weiter, wenn:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Sie Ihre ausdrückliche Einwilligung dazu erteilt haben (Art. 6 Abs. 1 lit. a DSGVO)</li>
                <li>die Weitergabe zur Vertragsabwicklung erforderlich ist (Art. 6 Abs. 1 lit. b DSGVO)</li>
                <li>eine gesetzliche Verpflichtung besteht (Art. 6 Abs. 1 lit. c DSGVO)</li>
              </ul>
              <p className="mt-3"><strong>Empfänger Ihrer Daten können sein:</strong></p>
              <ul className="list-disc ml-6 space-y-1">
                <li>ERGO Versicherung AG (Versicherungsanträge und Vertragsabwicklung)</li>
                <li>Google Ireland Limited (Google Analytics, Google Ads – nur mit Ihrer Einwilligung)</li>
                <li>Resend, Inc. (E-Mail-Versand als Auftragsverarbeiter)</li>
                <li>Meta Platforms Ireland Ltd. (bei WhatsApp-Kontaktaufnahme durch Sie)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl mb-4">10. SSL- bzw. TLS-Verschlüsselung</h2>
            <p className="text-ergo-stone leading-relaxed">
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte,
              wie zum Beispiel Versicherungsanfragen, die Sie an uns als Seitenbetreiber senden, eine SSL- bzw.
              TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des
              Browsers von „http://" auf „https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
              Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns übermitteln,
              nicht von Dritten mitgelesen werden.
            </p>
          </section>

          <section>
            <h2 className="text-xl mb-4">11. Ihre Rechte als betroffene Person</h2>
            <div className="ergo-card p-6">
              <div className="space-y-3 text-ergo-ink">
                <div><strong>Auskunftsrecht (Art. 15 DSGVO):</strong> Sie haben das Recht auf Auskunft über Ihre bei uns gespeicherten personenbezogenen Daten.</div>
                <div><strong>Berichtigungsrecht (Art. 16 DSGVO):</strong> Sie haben das Recht auf Berichtigung unrichtiger oder Vervollständigung unvollständiger Daten.</div>
                <div><strong>Löschungsrecht (Art. 17 DSGVO):</strong> Sie haben das Recht auf Löschung Ihrer Daten, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</div>
                <div><strong>Einschränkungsrecht (Art. 18 DSGVO):</strong> Sie haben das Recht auf Einschränkung der Verarbeitung Ihrer Daten.</div>
                <div><strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Sie haben das Recht, der Verarbeitung Ihrer Daten jederzeit zu widersprechen.</div>
                <div><strong>Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie haben das Recht, Ihre Daten in einem gängigen, maschinenlesbaren Format zu erhalten.</div>
                <div><strong>Widerruf der Einwilligung (Art. 7 Abs. 3 DSGVO):</strong> Sie können eine einmal erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt davon unberührt.</div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl mb-4">12. Beschwerderecht bei der Aufsichtsbehörde</h2>
            <div className="space-y-3 text-ergo-stone leading-relaxed">
              <p>
                Wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen die DSGVO
                verstößt, haben Sie gemäß Art. 77 DSGVO das Recht, sich bei einer Datenschutz-Aufsichtsbehörde
                zu beschweren. Die für uns zuständige Aufsichtsbehörde ist:
              </p>
              <div className="ergo-card p-4 mt-2 text-ergo-ink">
                <p className="font-semibold">Die Landesbeauftragte für den Datenschutz Niedersachsen</p>
                <p>Prinzenstraße 5</p>
                <p>30159 Hannover</p>
                <p className="mt-2">Telefon: +49 511 120-4500</p>
                <p>E-Mail: poststelle@lfd.niedersachsen.de</p>
                <p className="mt-2">
                  <a href="https://www.lfd.niedersachsen.de" target="_blank" rel="noopener noreferrer" className="ergo-link inline-flex items-center gap-1">
                    www.lfd.niedersachsen.de <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl mb-4">13. Automatisierte Entscheidungsfindung</h2>
            <p className="text-ergo-stone leading-relaxed">
              Eine automatisierte Entscheidungsfindung einschließlich Profiling gemäß Art. 22 Abs. 1 und 4 DSGVO
              findet auf dieser Website nicht statt.
            </p>
          </section>

          <section>
            <h2 className="text-xl mb-4">14. Kontakt bei Datenschutzfragen</h2>
            <div className="ergo-card p-6">
              <p className="text-ergo-ink">
                Bei Fragen zum Datenschutz wenden Sie sich bitte an:<br />
                <strong>Morino Stübe</strong><br />
                E-Mail: morino.stuebe@ergo.de<br />
                Telefon: +49 15566 771019
              </p>
            </div>
          </section>

        </div>

        <div className="mt-10 pt-8 border-t border-ergo-line text-center">
          <div className="space-x-6">
            <Link href="/" className="ergo-link">
              Startseite
            </Link>
            <Link href="/impressum" className="ergo-link">
              Impressum
            </Link>
            <Link href="/erstinformation" className="ergo-link">
              Erstinformation
            </Link>
          </div>
          <div className="text-xs text-ergo-mute mt-4">
            Stand: Februar 2026
          </div>
        </div>
      </div>
    </div>
  );
}
