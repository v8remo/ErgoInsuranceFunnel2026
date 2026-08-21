import { useState } from 'react';
import { Link } from 'wouter';
import SEO from '@/components/SEO';
import { trackEvent } from '@/lib/analytics';
import {
  Clock, Camera, MessageSquare, Tag, Shield,
  Phone, ArrowRight, Zap, Star, MessageCircle, Check, ClipboardList
} from 'lucide-react';

const WA_NUMBER = "4915566771019";
const WA_NUMBER_DISPLAY = "015566 771019";
const HAUS_NUMBER = "042212959999";
const HAUS_NUMBER_DISPLAY = "04221 2959999";

const features = [
  {
    icon: Clock,
    title: "24/7 Support-Chat",
    description: "Schreiben Sie uns rund um die Uhr – wir antworten meist innerhalb einer Stunde. Keine Warteschleife, kein Durchstellen.",
  },
  {
    icon: Camera,
    title: "Rechnungen als Foto senden",
    description: "Einfach ein Foto Ihrer Rechnung oder Ihres Dokuments im Chat – wir kümmern uns um den Rest. Kein Scannen nötig.",
  },
  {
    icon: MessageSquare,
    title: "Fragen direkt klären",
    description: "Haben Sie Fragen zu Ihrem Vertrag, einem Schaden oder einem Beitrag? Stellen Sie sie einfach per WhatsApp – schnell und unkompliziert.",
  },
  {
    icon: Tag,
    title: "Angebote auf kurzem Weg",
    description: "Fordern Sie kostenlose Versicherungsangebote direkt per Chat an. Wir bereiten Ihnen ein individuelles Angebot vor.",
  },
  {
    icon: Shield,
    title: "Versicherungen abschließen",
    description: "Neue Versicherungen bequem per WhatsApp abschließen – wir begleiten Sie durch den gesamten Prozess im Chat.",
  },
];

const testimonials = [
  { name: "Sabine K.", text: "Innerhalb von 20 Minuten hatte ich mein Angebot. Super schnell und unkompliziert!", stars: 5 },
  { name: "Thomas M.", text: "Schaden gemeldet, Foto geschickt, fertig. Nie war das so einfach.", stars: 5 },
  { name: "Maria L.", text: "Ich finde es toll, dass man einfach schreiben kann ohne in der Warteschleife zu hängen.", stars: 5 },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-ergo-yellow text-ergo-yellow" />
      ))}
    </div>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export default function WhatsAppServicePage() {
  const [copied, setCopied] = useState(false);

  const waUrl = (msg: string) =>
    `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

  const handleWaClick = (label: string) => {
    trackEvent('whatsapp_service_page_click', {
      event_category: 'WhatsApp',
      event_label: label,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(WA_NUMBER_DISPLAY.replace(/\s/g, '')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "WhatsApp Kundenservice – ERGO Agentur Stübe Ganderkesee",
    "description": "Direkter WhatsApp-Service der ERGO Agentur Stübe in Ganderkesee. 24/7 erreichbar für Fragen, Schadenmeldungen und Angebote.",
    "url": "https://ergo-ganderkesee.de/whatsapp",
    "mainEntity": {
      "@type": "InsuranceAgency",
      "name": "ERGO Agentur Stübe",
      "telephone": `+49${HAUS_NUMBER}`,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Friedensstraße 91 A",
        "addressLocality": "Ganderkesee",
        "postalCode": "27777",
        "addressCountry": "DE"
      }
    }
  };

  return (
    <>
      <SEO
        title="WhatsApp Service – ERGO Agentur Stübe Ganderkesee | Direkt schreiben"
        description="Chatte direkt mit ERGO Agentur Stübe in Ganderkesee über WhatsApp. 24/7 Support, Rechnungen als Foto, Angebote & mehr. Antwort meist in unter 1 Stunde."
        keywords="WhatsApp Versicherung, ERGO WhatsApp, Versicherung Chat, ERGO Ganderkesee Kontakt, WhatsApp Service"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-white">

        {/* Hero */}
        <section className="bg-white border-b border-ergo-line py-12 md:py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="ergo-eyebrow">WhatsApp-Service · ERGO Agentur Stübe</p>

            <h1 className="text-[30px] leading-[1.25] md:text-[40px] mb-4">
              Chatte doch einfach mit uns<br className="hidden sm:block" /> über WhatsApp!
            </h1>
            <p className="text-base sm:text-lg text-ergo-stone mb-4 max-w-xl mx-auto leading-relaxed">
              Ihr persönlicher Versicherungsberater Morino Stübe ist direkt auf WhatsApp erreichbar – schnell, einfach und kostenlos.
            </p>

            <p className="text-sm text-ergo-stone mb-6">
              Jetzt online · Antwort meist in &lt; 1 Std.
            </p>

            <a
              href={waUrl("Hallo Herr Stübe, ich möchte eine kostenlose Versicherungsberatung per WhatsApp.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleWaClick('hero_cta')}
              className="ergo-btn ergo-btn--whatsapp"
            >
              <WhatsAppIcon className="w-5 h-5 fill-white" />
              Jetzt auf WhatsApp schreiben
            </a>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-ergo-stone">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-ergo-check" />
                Kostenlos
              </span>
              <span className="hidden sm:block">·</span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-ergo-check" />
                Kein Account nötig
              </span>
              <span className="hidden sm:block">·</span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-ergo-check" />
                DSGVO-konform
              </span>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <div className="bg-ergo-gray border-b border-ergo-line py-6 px-4">
          <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="font-serif text-2xl md:text-3xl font-bold text-ergo-red">24/7</div>
              <div className="text-xs text-ergo-stone mt-1">Erreichbar</div>
            </div>
            <div>
              <div className="font-serif text-2xl md:text-3xl font-bold text-ergo-red">&lt; 1 Std.</div>
              <div className="text-xs text-ergo-stone mt-1">Antwortzeit</div>
            </div>
            <div>
              <div className="font-serif text-2xl md:text-3xl font-bold text-ergo-red">100%</div>
              <div className="text-xs text-ergo-stone mt-1">Kostenlos</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <section className="py-14 md:py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-[28px] mb-3">
                Was Sie über WhatsApp erledigen können
              </h2>
              <p className="text-ergo-stone text-sm sm:text-base max-w-xl mx-auto">
                Ihr persönlicher Versicherungsservice – direkt im Chat, ohne Warteschleife.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="ergo-card p-5">
                    <span className="ergo-icon-disc w-10 h-10 mb-4">
                      <Icon className="w-4 h-4" />
                    </span>
                    <h3 className="font-sans font-bold text-ergo-ink text-sm sm:text-base mb-2">{f.title}</h3>
                    <p className="text-xs sm:text-sm text-ergo-stone leading-relaxed">{f.description}</p>
                  </div>
                );
              })}

              {/* CTA card */}
              <div className="ergo-section--red rounded-lg p-5 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
                <div>
                  <MessageCircle className="w-7 h-7 mb-3" />
                  <h3 className="font-sans font-bold text-base mb-2">Jetzt starten</h3>
                  <p className="text-sm text-white/90 leading-relaxed mb-4">
                    Tippen Sie einfach auf den Button und schreiben Sie uns Ihr Anliegen.
                  </p>
                </div>
                <a
                  href={waUrl("Hallo, ich habe eine Frage zu meiner Versicherung.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleWaClick('features_cta')}
                  className="ergo-btn ergo-btn--whatsapp ergo-btn--sm"
                >
                  WhatsApp öffnen
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-14 md:py-20 px-4 bg-ergo-gray border-y border-ergo-line">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-[28px] mb-3">So einfach funktioniert es</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { num: "1", icon: MessageSquare, title: "Nachricht schreiben", desc: "Klicken Sie auf den WhatsApp-Button und schreiben Sie uns Ihr Anliegen – ganz formlos." },
                { num: "2", icon: Zap, title: "Schnelle Antwort", desc: "Wir antworten persönlich – meist innerhalb einer Stunde. Kein Bot, kein Callcenter." },
                { num: "3", icon: Check, title: "Fertig!", desc: "Ihr Anliegen ist erledigt. So einfach wie WhatsApp mit Freunden." },
              ].map((s) => {
                const StepIcon = s.icon;
                return (
                  <div key={s.num} className="text-center">
                    <span className="ergo-icon-disc mb-4">
                      <StepIcon className="w-5 h-5" />
                    </span>
                    <div className="font-sans font-bold text-ergo-ink mb-2 text-sm sm:text-base">{s.title}</div>
                    <p className="text-xs sm:text-sm text-ergo-stone leading-relaxed">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-14 md:py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-[28px] mb-2">Das sagen unsere Kunden</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {testimonials.map((t) => (
                <div key={t.name} className="ergo-card p-5">
                  <StarRating count={t.stars} />
                  <p className="text-sm text-ergo-ink mt-3 mb-4 leading-relaxed italic">"{t.text}"</p>
                  <p className="text-xs font-semibold text-ergo-mute">— {t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact block */}
        <section className="py-14 md:py-20 px-4 bg-ergo-gray border-y border-ergo-line">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl md:text-[28px] mb-2">Alle Kontaktwege auf einen Blick</h2>
            <p className="text-ergo-stone text-sm mb-8">Wählen Sie den Weg, der Ihnen am liebsten ist.</p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              {/* WhatsApp */}
              <a
                href={waUrl("Hallo, ich habe eine Frage.")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleWaClick('contact_block_wa')}
                className="ergo-btn ergo-btn--whatsapp"
              >
                <WhatsAppIcon className="w-5 h-5 fill-white" />
                WhatsApp schreiben · {WA_NUMBER_DISPLAY}
              </a>

              {/* Telefon */}
              <a
                href={`tel:${HAUS_NUMBER}`}
                onClick={() => handleWaClick('contact_block_phone')}
                className="ergo-btn ergo-btn--secondary"
              >
                <Phone className="w-5 h-5" />
                Anrufen · {HAUS_NUMBER_DISPLAY}
              </a>
            </div>

            <div className="ergo-card p-5 text-sm text-ergo-stone">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-ergo-red" />
                <span className="font-semibold text-ergo-ink">Tipp: Nummer speichern</span>
              </div>
              <p className="text-xs text-ergo-mute mb-3">Speichern Sie unsere WhatsApp-Nummer direkt in Ihrem Handy.</p>
              <button
                onClick={handleCopy}
                className="ergo-btn ergo-btn--secondary ergo-btn--sm"
              >
                {copied ? (
                  <><Check className="w-4 h-4 text-ergo-check" /> Kopiert!</>
                ) : (
                  <><ClipboardList className="w-4 h-4" /> {WA_NUMBER_DISPLAY} kopieren</>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="ergo-section--red py-14 md:py-20 px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl md:text-[28px] mb-3">Bereit? Schreiben Sie uns jetzt!</h2>
            <p className="text-white/90 text-sm mb-8 max-w-md mx-auto">
              Morino Stübe und sein Team sind für Sie da – persönlich, schnell und unkompliziert.
            </p>
            <a
              href={waUrl("Hallo Herr Stübe, ich möchte gerne etwas besprechen.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleWaClick('final_cta')}
              className="ergo-btn ergo-btn--whatsapp"
            >
              <WhatsAppIcon className="w-5 h-5 fill-white" />
              WhatsApp öffnen
            </a>
            <div className="mt-6">
              <Link href="/termin" className="text-white/90 text-sm underline hover:text-white transition-colors">
                Lieber einen Termin buchen? →
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
