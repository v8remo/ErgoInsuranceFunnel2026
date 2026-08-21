import { useState } from 'react';
import { useParams } from 'wouter';
import SEO from '@/components/SEO';
import FunnelOverlay from '@/components/FunnelOverlay';
import { trackEvent, trackConversion } from '@/lib/analytics';
import '@/styles/funnel.css';
import { Phone, MessageCircle, CheckCircle, Clock, ClipboardList, Car, Home, GraduationCap, ChevronRight, type LucideIcon } from 'lucide-react';

interface AktionData {
  title: string;
  subtitle: string;
  seoTitle: string;
  seoDesc: string;
  seoKeywords: string;
  icon: LucideIcon;
  urgencyText: string;
  intro: string;
  benefits: { title: string; text: string }[];
  checklistTitle: string;
  checklist: string[];
  ctaText: string;
  ctaSubtext: string;
  faqTitle: string;
  faqs: { q: string; a: string }[];
}

const aktionen: Record<string, AktionData> = {
  'kfz-wechsel': {
    title: 'Kfz-Wechselsaison November',
    subtitle: 'Jetzt wechseln und bis zu 30% bei der Kfz-Versicherung sparen',
    seoTitle: `Kfz-Versicherung wechseln November ${new Date().getFullYear()} – Bis zu 30% sparen | ERGO`,
    seoDesc: 'Kfz-Versicherung wechseln zum 30.11. – Stichtag nicht verpassen! Kostenloser Vergleich und persönliche Beratung bei ERGO Agentur Stübe in Ganderkesee.',
    seoKeywords: 'Kfz Versicherung wechseln, Kfz Wechselsaison, November Stichtag, Auto Versicherung vergleichen, ERGO Kfz, Kfz Ganderkesee',
    icon: Car,
    urgencyText: 'Stichtag: 30. November – Jetzt handeln!',
    intro: 'Der November ist der wichtigste Monat für Ihre Kfz-Versicherung. Bis zum 30.11. können Sie Ihren bestehenden Vertrag kündigen und zu ERGO wechseln. Viele Autofahrer zahlen deutlich zu viel – oft lassen sich 20-30% sparen.',
    benefits: [
      { title: 'Kostenloser Tarifvergleich', text: 'Wir vergleichen Ihre aktuelle Versicherung mit den ERGO-Tarifen und zeigen Ihnen Ihr Sparpotenzial.' },
      { title: 'Kündigung übernehmen wir', text: 'Wir kümmern uns um die fristgerechte Kündigung bei Ihrem alten Versicherer.' },
      { title: 'Lückenloser Schutz', text: 'Nahtloser Übergang ohne Versicherungslücke – Ihr Fahrzeug ist durchgehend geschützt.' },
      { title: 'Bündelnachlass bis 15%', text: 'Kombinieren Sie Kfz mit weiteren ERGO-Versicherungen und sparen Sie zusätzlich.' },
    ],
    checklistTitle: 'Checkliste für den Kfz-Wechsel',
    checklist: [
      'Aktuelle Versicherungspolice bereitlegen',
      'Fahrzeugschein (Zulassungsbescheinigung Teil I) griffbereit haben',
      'Kilometerstand notieren',
      'Schadenfreiheitsklasse prüfen',
      'Bis 30.11. kündigen (wir helfen dabei!)',
    ],
    ctaText: 'Kostenlosen Kfz-Vergleich starten',
    ctaSubtext: 'Unverbindlich und in 5 Minuten erledigt',
    faqTitle: 'Häufige Fragen zum Kfz-Wechsel',
    faqs: [
      { q: 'Bis wann muss ich meine Kfz-Versicherung kündigen?', a: 'Die Kündigungsfrist endet am 30. November. Die Kündigung muss bis dahin beim Versicherer eingegangen sein. Wir helfen Ihnen dabei und erstellen das Kündigungsschreiben für Sie.' },
      { q: 'Verliere ich meine Schadenfreiheitsklasse beim Wechsel?', a: 'Nein! Ihre Schadenfreiheitsklasse wird 1:1 zum neuen Versicherer übertragen. Sie verlieren keine Rabatte.' },
      { q: 'Wie viel kann ich wirklich sparen?', a: 'Das hängt von Ihrem aktuellen Tarif ab. Durchschnittlich sparen unsere Kunden 20-30% beim Wechsel zu ERGO, plus bis zu 15% Bündelnachlass.' },
    ]
  },
  'fruehjahrscheck': {
    title: 'Frühjahrs-Check Wohngebäude',
    subtitle: 'Schützen Sie Ihr Zuhause vor Sturm, Starkregen und Elementarschäden',
    seoTitle: `Wohngebäudeversicherung prüfen – Frühjahrs-Check ${new Date().getFullYear()} | ERGO`,
    seoDesc: 'Frühjahrs-Check für Ihre Wohngebäudeversicherung. Elementarschutz, Sturmschäden, Starkregen – ist Ihr Haus ausreichend versichert? Kostenlose Analyse bei ERGO.',
    seoKeywords: 'Wohngebäudeversicherung prüfen, Elementarversicherung, Sturmschäden, Starkregen Versicherung, Haus versichern, ERGO Wohngebäude',
    icon: Home,
    urgencyText: 'Unwetter-Saison steht bevor – Jetzt absichern!',
    intro: 'Jedes Frühjahr steigt das Risiko für Sturm, Hagel und Starkregen. Viele Hausbesitzer unterschätzen die Gefahr – und stellen erst nach einem Schaden fest, dass wichtige Risiken nicht abgedeckt sind. Besonders die Elementarschadenversicherung fehlt bei vielen Policen.',
    benefits: [
      { title: 'Kostenloser Gebäude-Check', text: 'Wir prüfen Ihre bestehende Versicherung auf Lücken und veraltete Deckungssummen.' },
      { title: 'Elementarschutz nachrüsten', text: 'Schutz vor Starkregen, Überschwemmung, Erdrutsch und Rückstau – oft für wenige Euro mehr.' },
      { title: 'Unterversicherungsverzicht', text: 'Nie wieder Kürzungen bei der Auszahlung – wir sorgen für korrekte Versicherungssummen.' },
      { title: 'Photovoltaik mitversichern', text: 'Ihre Solaranlage, Wallbox und Wärmepumpe werden optimal in den Schutz eingebunden.' },
    ],
    checklistTitle: 'Checkliste Wohngebäude-Check',
    checklist: [
      'Aktuelle Police und Deckungssumme prüfen',
      'Elementarschutz vorhanden? (Starkregen, Überschwemmung)',
      'Wohnfläche und Ausstattung noch aktuell?',
      'Photovoltaik / Wärmepumpe mitversichert?',
      'Glasversicherung (Fenster, Wintergarten) geprüft?',
    ],
    ctaText: 'Kostenlosen Gebäude-Check anfordern',
    ctaSubtext: 'In 10 Minuten wissen Sie, ob Ihr Haus optimal versichert ist',
    faqTitle: 'Häufige Fragen zur Wohngebäudeversicherung',
    faqs: [
      { q: 'Was ist eine Elementarschadenversicherung?', a: 'Die Elementarversicherung schützt Ihr Gebäude vor Naturgefahren wie Überschwemmung, Starkregen, Erdrutsch, Erdsenkung, Schneedruck und Lawinen. Sie ist ein optionaler Baustein zur Wohngebäudeversicherung.' },
      { q: 'Brauche ich eine Elementarversicherung in Ganderkesee?', a: 'Ja! Auch in Ganderkesee und Umgebung gab es in den letzten Jahren vermehrt Starkregenereignisse. Eine Elementarversicherung ist dringend empfohlen und oft günstiger als gedacht.' },
      { q: 'Was kostet der Gebäude-Check?', a: 'Der Check ist komplett kostenlos und unverbindlich. Wir analysieren Ihre bestehende Police und zeigen Ihnen Optimierungsmöglichkeiten.' },
    ]
  },
  'schulanfang': {
    title: 'Schulanfang – Kinder richtig absichern',
    subtitle: 'Unfallversicherung für Kinder: Rundum-Schutz für die ganze Familie',
    seoTitle: `Unfallversicherung Kinder Schulanfang ${new Date().getFullYear()} – ERGO Agentur Stübe`,
    seoDesc: 'Schulanfang: Kinder richtig absichern mit der Unfallversicherung. Schutz auf dem Schulweg, beim Sport und in der Freizeit. Kostenlose Beratung bei ERGO.',
    seoKeywords: 'Unfallversicherung Kinder, Schulanfang Versicherung, Kinder absichern, Unfallschutz Schule, Schulweg Versicherung, ERGO Kinderversicherung',
    icon: GraduationCap,
    urgencyText: 'Schulanfang naht – Jetzt für optimalen Schutz sorgen!',
    intro: 'Mit dem Schulanfang beginnt für Kinder ein neuer Lebensabschnitt – und neue Risiken. Der gesetzliche Unfallschutz gilt nur auf dem direkten Schulweg und in der Schule. Über 60% aller Kinderunfälle passieren aber in der Freizeit, beim Sport oder zu Hause.',
    benefits: [
      { title: '24-Stunden-Schutz', text: 'Die private Unfallversicherung schützt Ihr Kind rund um die Uhr – in der Schule, beim Sport, zu Hause und in der Freizeit.' },
      { title: 'Leistung bei Invalidität', text: 'Im Falle einer dauerhaften Beeinträchtigung sichert die Unfallversicherung die finanzielle Zukunft Ihres Kindes.' },
      { title: 'Rooming-in & Genesungsgeld', text: 'Kosten für die Begleitung im Krankenhaus und Genesungsgeld für die Erholungszeit.' },
      { title: 'Günstige Kindertarife', text: 'Kinder sind besonders günstig zu versichern – oft schon ab wenigen Euro pro Monat.' },
    ],
    checklistTitle: 'Checkliste Kinder-Absicherung',
    checklist: [
      'Private Unfallversicherung abgeschlossen?',
      'Familien-Haftpflicht mit Kindern aktualisiert?',
      'Zahnzusatzversicherung für Kieferorthopädie?',
      'Schulunfähigkeitsversicherung prüfen?',
      'Krankenzusatzversicherung (Ein-/Zweibettzimmer)?',
    ],
    ctaText: 'Kostenlose Familien-Beratung starten',
    ctaSubtext: 'Individuelle Absicherung für Ihre Familie',
    faqTitle: 'Häufige Fragen zur Kinder-Absicherung',
    faqs: [
      { q: 'Sind Kinder nicht über die Schule versichert?', a: 'Nur teilweise! Die gesetzliche Unfallversicherung greift nur auf dem direkten Schulweg und während des Unterrichts. Alle Freizeitunfälle (über 60% aller Kinderunfälle) sind NICHT abgedeckt.' },
      { q: 'Ab welchem Alter braucht mein Kind eine Unfallversicherung?', a: 'Am besten ab Geburt. Sobald Kinder krabbeln und laufen, steigt das Unfallrisiko. Die meisten Tarife können ab dem 1. Lebenstag abgeschlossen werden.' },
      { q: 'Was kostet eine Kinderunfallversicherung?', a: 'Kinder sind besonders günstig zu versichern. Eine gute Unfallversicherung gibt es oft schon ab 5-10 € pro Monat.' },
    ]
  }
};

export default function AktionsSeiten() {
  const { slug } = useParams<{ slug: string }>();
  const [showFunnel, setShowFunnel] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const data = aktionen[slug || ''];
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Aktion nicht gefunden</h1>
          <a href="/" className="ergo-link">Zurück zur Startseite</a>
        </div>
      </div>
    );
  }

  const whatsappNumber = "15566771019";
  const HeroIcon = data.icon;

  return (
    <>
      <SEO title={data.seoTitle} description={data.seoDesc} keywords={data.seoKeywords} />

      <div className="min-h-screen bg-white">
        <section className="bg-white py-12 md:py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="ergo-icon-disc mx-auto mb-4">
              <HeroIcon className="w-6 h-6" />
            </span>
            <p className="ergo-eyebrow">Aktuelle Aktion</p>
            <h1 className="text-[30px] md:text-[40px] mb-3">{data.title}</h1>
            <p className="text-lg md:text-xl text-ergo-stone mb-6">{data.subtitle}</p>
            <div className="ergo-chip ergo-chip--yellow max-w-full">
              <Clock className="w-4 h-4 shrink-0" />
              <span className="break-words">{data.urgencyText}</span>
            </div>
          </div>
        </section>

        <section className="pb-10 md:pb-14 px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-ergo-stone text-base leading-relaxed mb-8">{data.intro}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {data.benefits.map((b, i) => (
                <div key={i} className="ergo-card p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-ergo-check shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-sans font-bold text-ergo-ink text-sm mb-1">{b.title}</h3>
                      <p className="text-ergo-stone text-sm leading-relaxed">{b.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="ergo-card p-6 mb-10">
              <h3 className="text-lg mb-3 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-ergo-red" />
                {data.checklistTitle}
              </h3>
              <ul className="space-y-2">
                {data.checklist.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ergo-ink">
                    <span className="w-5 h-5 rounded-full bg-ergo-red-light text-ergo-red flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">{i + 1}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="ergo-section--red rounded-lg p-6 md:p-8 text-center mb-10">
              <h3 className="text-xl mb-2">{data.ctaText}</h3>
              <p className="text-sm text-white/90 mb-5">{data.ctaSubtext}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => { setShowFunnel(true); trackEvent('aktion_funnel', { aktion: slug }); }}
                  className="ergo-btn ergo-btn--inverted"
                >
                  <Phone className="w-4 h-4" /> Jetzt beraten lassen
                </button>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hallo Herr Stübe, ich interessiere mich für: ${data.title}. Können wir einen Termin vereinbaren?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ergo-btn ergo-btn--whatsapp"
                >
                  <MessageCircle className="w-4 h-4" /> Per WhatsApp
                </a>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-xl mb-4">{data.faqTitle}</h3>
              <div className="space-y-3">
                {data.faqs.map((faq, i) => (
                  <div key={i} className="ergo-card overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left font-semibold text-ergo-ink text-sm hover:bg-ergo-gray"
                    >
                      {faq.q}
                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${expandedFaq === i ? 'rotate-90' : ''}`} />
                    </button>
                    {expandedFaq === i && (
                      <div className="px-4 pb-4 text-sm text-ergo-stone leading-relaxed">{faq.a}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {showFunnel && <FunnelOverlay isOpen={showFunnel} onClose={() => setShowFunnel(false)} />}
    </>
  );
}
