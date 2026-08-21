import { useState } from 'react';
import SEO from '@/components/SEO';
import FunnelOverlay from '@/components/FunnelOverlay';
import { trackEvent, trackConversion } from '@/lib/analytics';
import '@/styles/funnel.css';
import { Calculator, TrendingDown, Phone, MessageCircle, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface InsuranceEntry {
  name: string;
  beitrag: string;
  active: boolean;
}

const sachversicherungen = [
  'Kfz-Versicherung',
  'Privathaftpflicht',
  'Hausratversicherung',
  'Wohngebäudeversicherung',
  'Rechtsschutzversicherung',
  'Unfallversicherung',
];

export default function SparRechner() {
  const [entries, setEntries] = useState<InsuranceEntry[]>(
    sachversicherungen.map(name => ({ name, beitrag: '', active: false }))
  );
  const [showResult, setShowResult] = useState(false);
  const [showFunnel, setShowFunnel] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const activeEntries = entries.filter(e => e.active && parseFloat(e.beitrag) > 0);
  const totalBeitrag = activeEntries.reduce((sum, e) => sum + parseFloat(e.beitrag || '0'), 0);
  const anzahlVertraege = activeEntries.length;

  let rabattProzent = 0;
  if (anzahlVertraege >= 5) rabattProzent = 15;
  else if (anzahlVertraege >= 4) rabattProzent = 12;
  else if (anzahlVertraege >= 3) rabattProzent = 8;
  else if (anzahlVertraege >= 2) rabattProzent = 5;

  const ersparnis = totalBeitrag * (rabattProzent / 100);
  const neuerBeitrag = totalBeitrag - ersparnis;

  const toggleEntry = (index: number) => {
    const updated = [...entries];
    updated[index].active = !updated[index].active;
    if (!updated[index].active) updated[index].beitrag = '';
    setEntries(updated);
  };

  const updateBeitrag = (index: number, value: string) => {
    const cleaned = value.replace(/[^0-9.,]/g, '').replace(',', '.');
    const updated = [...entries];
    updated[index].beitrag = cleaned;
    setEntries(updated);
  };

  const handleCalculate = () => {
    if (anzahlVertraege < 2) return;
    setShowResult(true);
    trackEvent('sparrechner_calculated', { vertraege: anzahlVertraege, ersparnis: ersparnis.toFixed(2) });
    trackConversion();
  };

  const whatsappNumber = "15566771019";

  return (
    <>
      <SEO
        title="Bündel-Sparrechner – Bis zu 15% sparen | ERGO Agentur Stübe"
        description="Berechnen Sie jetzt Ihre Ersparnis mit dem ERGO Bündelnachlass. Bis zu 15% Rabatt bei 5+ Sachversicherungen. Kostenlos und unverbindlich."
        keywords="Bündelnachlass ERGO, Versicherung sparen, Bündelrabatt, Versicherung günstiger, ERGO Rabatt, Sachversicherung bündeln"
      />

      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-8 md:py-14">

          <div className="text-center mb-8">
            <p className="ergo-eyebrow">ERGO Bündelnachlass</p>
            <h1 className="text-[30px] md:text-[40px] mb-2">
              Bündel-Sparrechner
            </h1>
            <p className="text-ergo-stone text-sm md:text-base">
              Berechnen Sie, wie viel Sie mit dem ERGO Bündelnachlass sparen können
            </p>
          </div>

          <div className="ergo-card p-6 md:p-8 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg">Ihre Sachversicherungen</h2>
              <button onClick={() => setShowInfo(!showInfo)} className="text-sm text-ergo-mute hover:text-ergo-stone flex items-center gap-1">
                Info {showInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {showInfo && (
              <div className="bg-ergo-gray border border-ergo-line rounded-lg p-4 mb-4 text-sm text-ergo-ink">
                <p className="font-semibold mb-1">So funktioniert der Bündelnachlass:</p>
                <ul className="space-y-1 text-xs">
                  <li>2 Verträge = <strong>5% Rabatt</strong></li>
                  <li>3 Verträge = <strong>8% Rabatt</strong></li>
                  <li>4 Verträge = <strong>12% Rabatt</strong></li>
                  <li>5+ Verträge = <strong>bis zu 15% Rabatt</strong></li>
                </ul>
                <p className="text-xs mt-2 text-ergo-stone">Gilt für Sachversicherungen (Kfz, Haftpflicht, Hausrat, Wohngebäude, Rechtsschutz, Unfall).</p>
              </div>
            )}

            <p className="text-sm text-ergo-stone mb-4">
              Wählen Sie Ihre Versicherungen und geben Sie den aktuellen Jahresbeitrag ein:
            </p>

            <div className="space-y-3">
              {entries.map((entry, i) => (
                <div key={entry.name} className={`ergo-option flex flex-wrap items-center gap-2 sm:gap-3 p-3 ${
                  entry.active ? 'selected' : ''
                }`}>
                  <button
                    onClick={() => toggleEntry(i)}
                    aria-pressed={entry.active}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      entry.active ? 'bg-ergo-red border-ergo-red text-white' : 'border-ergo-line bg-white'
                    }`}
                  >
                    {entry.active && <Check className="w-4 h-4" />}
                  </button>
                  <span className={`flex-1 min-w-0 font-medium text-sm ${entry.active ? 'text-ergo-ink' : 'text-ergo-stone'}`}>
                    {entry.name}
                  </span>
                  {entry.active && (
                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={entry.beitrag}
                        onChange={(e) => updateBeitrag(i, e.target.value)}
                        placeholder="0"
                        className="w-[72px] text-right p-2 border border-ergo-line rounded text-sm font-semibold focus:outline-none focus:border-ergo-red"
                      />
                      <span className="text-xs sm:text-sm text-ergo-stone">€/J.</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-ergo-stone">{anzahlVertraege} Versicherung{anzahlVertraege !== 1 ? 'en' : ''} ausgewählt</span>
              {anzahlVertraege >= 2 && (
                <span className="text-ergo-check font-bold">{rabattProzent}% Bündelnachlass</span>
              )}
            </div>

            <button
              onClick={handleCalculate}
              disabled={anzahlVertraege < 2}
              className="ergo-btn ergo-btn--primary w-full mt-4"
            >
              <Calculator className="w-5 h-5" />
              {anzahlVertraege < 2 ? 'Mindestens 2 Versicherungen auswählen' : 'Ersparnis berechnen'}
            </button>
          </div>

          {showResult && (
            <div className="space-y-6">
              <div className="ergo-card p-6 md:p-8">
                <h3 className="text-lg mb-4 text-center">Ihre Ersparnis</h3>

                <div className="flex flex-col gap-3 sm:grid sm:grid-cols-3 sm:gap-4 text-center mb-6">
                  <div className="bg-ergo-gray rounded-lg p-4 flex items-center justify-between sm:flex-col sm:justify-center">
                    <p className="text-xs text-ergo-stone sm:mb-1">Aktuell</p>
                    <div className="flex items-baseline gap-1 sm:flex-col sm:items-center">
                      <p className="text-xl sm:text-lg font-bold text-ergo-ink">{totalBeitrag.toFixed(0)} €</p>
                      <p className="text-xs text-ergo-mute">pro Jahr</p>
                    </div>
                  </div>
                  <div className="bg-ergo-red-light rounded-lg p-4 flex items-center justify-between sm:flex-col sm:justify-center">
                    <div className="flex items-center gap-1 sm:mb-1">
                      <TrendingDown className="w-3 h-3 text-ergo-red" />
                      <p className="text-xs text-ergo-red font-semibold">-{rabattProzent}%</p>
                    </div>
                    <div className="flex items-baseline gap-1 sm:flex-col sm:items-center">
                      <p className="text-xl sm:text-lg font-bold text-ergo-red">-{ersparnis.toFixed(0)} €</p>
                      <p className="text-xs text-ergo-mute">Ersparnis</p>
                    </div>
                  </div>
                  <div className="bg-ergo-gray rounded-lg p-4 flex items-center justify-between sm:flex-col sm:justify-center">
                    <p className="text-xs text-ergo-check font-semibold sm:mb-1">Mit ERGO</p>
                    <div className="flex items-baseline gap-1 sm:flex-col sm:items-center">
                      <p className="text-xl sm:text-lg font-bold text-ergo-check">{neuerBeitrag.toFixed(0)} €</p>
                      <p className="text-xs text-ergo-mute">pro Jahr</p>
                    </div>
                  </div>
                </div>

                <div className="bg-ergo-red-light border border-ergo-red/30 rounded-lg p-4 text-center">
                  <p className="text-ergo-red font-bold text-lg">
                    Sie sparen bis zu {ersparnis.toFixed(0)} € pro Jahr!
                  </p>
                  <p className="text-ergo-stone text-sm mt-1">
                    Das sind {(ersparnis / 12).toFixed(0)} € pro Monat mit dem Bündelnachlass.
                  </p>
                </div>
              </div>

              <div className="ergo-section--red rounded-lg p-6 text-center">
                <h3 className="text-lg mb-2">Jetzt persönliches Angebot erhalten</h3>
                <p className="text-sm text-white/90 mb-4">
                  Ich berechne Ihren individuellen Bündelnachlass und zeige Ihnen die besten Tarife.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => { setShowFunnel(true); trackEvent('sparrechner_to_funnel'); }}
                    className="ergo-btn ergo-btn--inverted"
                  >
                    <Phone className="w-4 h-4" /> Kostenlos beraten lassen
                  </button>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hallo Herr Stübe, ich habe den Sparrechner genutzt und möchte gerne ein persönliches Angebot für ${anzahlVertraege} Sachversicherungen mit Bündelnachlass.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ergo-btn ergo-btn--whatsapp"
                  >
                    <MessageCircle className="w-4 h-4" /> Per WhatsApp
                  </a>
                </div>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-ergo-mute mt-8">
            Die Berechnung ist unverbindlich und dient zur Orientierung. Der tatsächliche Bündelnachlass wird individuell berechnet.
          </p>
        </div>
      </div>

      {showFunnel && <FunnelOverlay isOpen={showFunnel} onClose={() => setShowFunnel(false)} />}
    </>
  );
}
