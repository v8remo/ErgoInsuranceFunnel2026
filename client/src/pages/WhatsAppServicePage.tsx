import { useState } from 'react';
import { Link } from 'wouter';
import SEO from '@/components/SEO';
import { trackEvent } from '@/lib/analytics';
import {
  Clock, Camera, MessageSquare, Tag, Shield,
  Phone, CheckCircle, ArrowRight, Zap
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
    color: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: Camera,
    title: "Rechnungen als Foto senden",
    description: "Einfach ein Foto Ihrer Rechnung oder Ihres Dokuments im Chat – wir kümmern uns um den Rest. Kein Scannen nötig.",
    color: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: MessageSquare,
    title: "Fragen direkt klären",
    description: "Haben Sie Fragen zu Ihrem Vertrag, einem Schaden oder einem Beitrag? Stellen Sie sie einfach per WhatsApp – schnell und unkompliziert.",
    color: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    icon: Tag,
    title: "Angebote auf kurzem Weg",
    description: "Fordern Sie kostenlose Versicherungsangebote direkt per Chat an. Wir bereiten Ihnen ein individuelles Angebot vor.",
    color: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    icon: Shield,
    title: "Versicherungen abschließen",
    description: "Neue Versicherungen bequem per WhatsApp abschließen – wir begleiten Sie durch den gesamten Prozess im Chat.",
    color: "bg-red-50",
    iconColor: "text-red-600",
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
        <span key={i} className="text-yellow-400 text-sm">★</span>
      ))}
    </div>
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
        <section className="bg-gradient-to-br from-[#075e54] via-[#128c7e] to-[#25d366] text-white py-14 md:py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-8 left-8 w-32 h-32 rounded-full border-4 border-white" />
            <div className="absolute bottom-8 right-8 w-48 h-48 rounded-full border-4 border-white" />
            <div className="absolute top-1/2 left-1/4 w-20 h-20 rounded-full border-2 border-white" />
          </div>
          <div className="max-w-3xl mx-auto text-center relative">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              Jetzt online · Antwort meist in &lt; 1 Std.
            </div>

            <div className="text-6xl mb-4">💬</div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
              Chatte doch einfach mit uns<br className="hidden sm:block" /> über WhatsApp!
            </h1>
            <p className="text-base sm:text-lg text-green-100 mb-8 max-w-xl mx-auto leading-relaxed">
              Ihr persönlicher Versicherungsberater Morino Stübe ist direkt auf WhatsApp erreichbar – schnell, einfach und kostenlos.
            </p>

            <a
              href={waUrl("Hallo Herr Stübe, ich möchte eine kostenlose Versicherungsberatung per WhatsApp.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleWaClick('hero_cta')}
              className="inline-flex items-center gap-3 bg-white text-[#075e54] font-bold px-8 py-4 rounded-2xl text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#25d366]" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Jetzt auf WhatsApp schreiben
            </a>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-green-100">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-300" />
                Kostenlos
              </span>
              <span className="hidden sm:block">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-300" />
                Kein Account nötig
              </span>
              <span className="hidden sm:block">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-300" />
                DSGVO-konform
              </span>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <div className="bg-[#075e54] text-white py-4 px-4">
          <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-green-300">24/7</div>
              <div className="text-xs text-green-100">Erreichbar</div>
            </div>
            <div>
              <div className="text-xl font-bold text-green-300">&lt; 1 Std.</div>
              <div className="text-xs text-green-100">Antwortzeit</div>
            </div>
            <div>
              <div className="text-xl font-bold text-green-300">100%</div>
              <div className="text-xs text-green-100">Kostenlos</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <section className="py-14 md:py-20 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Was Sie über WhatsApp erledigen können
              </h2>
              <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
                Ihr persönlicher Versicherungsservice – direkt im Chat, ohne Warteschleife.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${f.iconColor}`} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2">{f.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{f.description}</p>
                  </div>
                );
              })}

              {/* CTA card */}
              <div className="bg-gradient-to-br from-[#075e54] to-[#128c7e] rounded-2xl p-5 text-white flex flex-col justify-between sm:col-span-2 lg:col-span-1">
                <div>
                  <div className="text-3xl mb-3">🚀</div>
                  <h3 className="font-bold text-base mb-2">Jetzt starten</h3>
                  <p className="text-sm text-green-100 leading-relaxed mb-4">
                    Tippen Sie einfach auf den Button und schreiben Sie uns Ihr Anliegen.
                  </p>
                </div>
                <a
                  href={waUrl("Hallo, ich habe eine Frage zu meiner Versicherung.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleWaClick('features_cta')}
                  className="inline-flex items-center gap-2 bg-white text-[#075e54] font-bold px-4 py-3 rounded-xl text-sm hover:bg-green-50 transition-colors"
                >
                  WhatsApp öffnen
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-14 md:py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">So einfach funktioniert es</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { num: "1", icon: "💬", title: "Nachricht schreiben", desc: "Klicken Sie auf den WhatsApp-Button und schreiben Sie uns Ihr Anliegen – ganz formlos." },
                { num: "2", icon: "⚡", title: "Schnelle Antwort", desc: "Wir antworten persönlich – meist innerhalb einer Stunde. Kein Bot, kein Callcenter." },
                { num: "3", icon: "✅", title: "Fertig!", desc: "Ihr Anliegen ist erledigt. So einfach wie WhatsApp mit Freunden." },
              ].map((s) => (
                <div key={s.num} className="text-center">
                  <div className="w-14 h-14 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                    {s.icon}
                  </div>
                  <div className="font-bold text-gray-900 mb-2 text-sm sm:text-base">{s.title}</div>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-14 md:py-20 px-4 bg-green-50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Das sagen unsere Kunden</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {testimonials.map((t) => (
                <div key={t.name} className="bg-white rounded-2xl border border-green-100 shadow-sm p-5">
                  <StarRating count={t.stars} />
                  <p className="text-sm text-gray-600 mt-3 mb-4 leading-relaxed italic">"{t.text}"</p>
                  <p className="text-xs font-semibold text-gray-500">— {t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact block */}
        <section className="py-14 md:py-20 px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Alle Kontaktwege auf einen Blick</h2>
            <p className="text-gray-500 text-sm mb-8">Wählen Sie den Weg, der Ihnen am liebsten ist.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {/* WhatsApp */}
              <a
                href={waUrl("Hallo, ich habe eine Frage.")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleWaClick('contact_block_wa')}
                className="flex items-center gap-4 bg-[#25d366] hover:bg-[#20b958] text-white rounded-2xl p-5 text-left transition-colors shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-sm">WhatsApp schreiben</div>
                  <div className="text-white/80 text-xs">{WA_NUMBER_DISPLAY}</div>
                </div>
              </a>

              {/* Telefon */}
              <a
                href={`tel:${HAUS_NUMBER}`}
                onClick={() => handleWaClick('contact_block_phone')}
                className="flex items-center gap-4 bg-[#003781] hover:bg-[#002a62] text-white rounded-2xl p-5 text-left transition-colors shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm">Anrufen</div>
                  <div className="text-blue-200 text-xs">{HAUS_NUMBER_DISPLAY}</div>
                </div>
              </a>
            </div>

            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 text-sm text-gray-600">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-green-500" />
                <span className="font-semibold text-gray-800">Tipp: Nummer speichern</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">Speichern Sie unsere WhatsApp-Nummer direkt in Ihrem Handy.</p>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 font-semibold px-4 py-2 rounded-xl text-xs transition-colors"
              >
                {copied ? '✅ Kopiert!' : `📋 ${WA_NUMBER_DISPLAY} kopieren`}
              </button>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-14 md:py-20 px-4 bg-gradient-to-br from-[#075e54] to-[#25d366]">
          <div className="max-w-xl mx-auto text-center text-white">
            <div className="text-4xl mb-4">💬</div>
            <h2 className="text-xl sm:text-2xl font-bold mb-3">Bereit? Schreiben Sie uns jetzt!</h2>
            <p className="text-green-100 text-sm mb-8 max-w-md mx-auto">
              Morino Stübe und sein Team sind für Sie da – persönlich, schnell und unkompliziert.
            </p>
            <a
              href={waUrl("Hallo Herr Stübe, ich möchte gerne etwas besprechen.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleWaClick('final_cta')}
              className="inline-flex items-center gap-3 bg-white text-[#075e54] font-bold px-8 py-4 rounded-2xl text-base hover:shadow-2xl hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#25d366]" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp öffnen
            </a>
            <div className="mt-6">
              <Link href="/termin" className="text-green-100 text-sm underline hover:text-white transition-colors">
                Lieber einen Termin buchen? →
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
