import { useState } from 'react';
import SEO from '@/components/SEO';
import FunnelOverlay from '@/components/FunnelOverlay';
import { trackEvent, trackConversion } from '@/lib/analytics';
import '@/styles/funnel.css';
import { Calculator, TrendingDown, Phone, MessageCircle, PiggyBank, ChevronDown, ChevronUp } from 'lucide-react';

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

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-2xl mx-auto px-4 py-8 md:py-14">

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <PiggyBank className="w-4 h-4" />
              ERGO Bündelnachlass
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Bündel-Sparrechner
            </h1>
            <p className="text-gray-500 text-sm md:text-base">
              Berechnen Sie, wie viel Sie mit dem ERGO Bündelnachlass sparen können
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Ihre Sachversicherungen</h2>
              <button onClick={() => setShowInfo(!showInfo)} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">
                Info {showInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {showInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-sm text-blue-800">
                <p className="font-semibold mb-1">So funktioniert der Bündelnachlass:</p>
                <ul className="space-y-1 text-xs">
                  <li>2 Verträge = <strong>5% Rabatt</strong></li>
                  <li>3 Verträge = <strong>8% Rabatt</strong></li>
                  <li>4 Verträge = <strong>12% Rabatt</strong></li>
                  <li>5+ Verträge = <strong>bis zu 15% Rabatt</strong></li>
                </ul>
                <p className="text-xs mt-2 text-blue-600">Gilt für Sachversicherungen (Kfz, Haftpflicht, Hausrat, Wohngebäude, Rechtsschutz, Unfall).</p>
              </div>
            )}

            <p className="text-sm text-gray-500 mb-4">
              Wählen Sie Ihre Versicherungen und geben Sie den aktuellen Jahresbeitrag ein:
            </p>

            <div className="space-y-3">
              {entries.map((entry, i) => (
                <div key={entry.name} className={`flex flex-wrap items-center gap-2 sm:gap-3 p-3 rounded-xl border-2 transition-all ${
                  entry.active ? 'border-green-300 bg-green-50' : 'border-gray-200'
                }`}>
                  <button
                    onClick={() => toggleEntry(i)}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${
                      entry.active ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'
                    }`}
                  >
                    {entry.active && '✓'}
                  </button>
                  <span className={`flex-1 min-w-0 font-medium text-sm ${entry.active ? 'text-gray-900' : 'text-gray-500'}`}>
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
                        className="w-[72px] text-right p-2 border border-gray-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-green-500"
                      />
                      <span className="text-xs sm:text-sm text-gray-500">€/J.</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-500">{anzahlVertraege} Versicherung{anzahlVertraege !== 1 ? 'en' : ''} ausgewählt</span>
              {anzahlVertraege >= 2 && (
                <span className="text-green-600 font-bold">{rabattProzent}% Bündelnachlass</span>
              )}
            </div>

            <button
              onClick={handleCalculate}
              disabled={anzahlVertraege < 2}
              className={`w-full mt-4 min-h-[52px] rounded-xl font-bold text-base transition-colors ${
                anzahlVertraege >= 2
                  ? 'bg-ergo-red text-white hover:bg-[#c5001a]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Calculator className="w-5 h-5 inline mr-2" />
              {anzahlVertraege < 2 ? 'Mindestens 2 Versicherungen auswählen' : 'Ersparnis berechnen'}
            </button>
          </div>

          {showResult && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Ihre Ersparnis</h3>

                <div className="flex flex-col gap-3 sm:grid sm:grid-cols-3 sm:gap-4 text-center mb-6">
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between sm:flex-col sm:justify-center">
                    <p className="text-xs text-gray-500 sm:mb-1">Aktuell</p>
                    <div className="flex items-baseline gap-1 sm:flex-col sm:items-center">
                      <p className="text-xl sm:text-lg font-bold text-gray-900">{totalBeitrag.toFixed(0)} €</p>
                      <p className="text-xs text-gray-400">pro Jahr</p>
                    </div>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 flex items-center justify-between sm:flex-col sm:justify-center">
                    <div className="flex items-center gap-1 sm:mb-1">
                      <TrendingDown className="w-3 h-3 text-red-500" />
                      <p className="text-xs text-red-500 font-semibold">-{rabattProzent}%</p>
                    </div>
                    <div className="flex items-baseline gap-1 sm:flex-col sm:items-center">
                      <p className="text-xl sm:text-lg font-bold text-red-600">-{ersparnis.toFixed(0)} €</p>
                      <p className="text-xs text-gray-400">Ersparnis</p>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 flex items-center justify-between sm:flex-col sm:justify-center">
                    <p className="text-xs text-green-600 font-semibold sm:mb-1">Mit ERGO</p>
                    <div className="flex items-baseline gap-1 sm:flex-col sm:items-center">
                      <p className="text-xl sm:text-lg font-bold text-green-700">{neuerBeitrag.toFixed(0)} €</p>
                      <p className="text-xs text-gray-400">pro Jahr</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-100 border border-green-300 rounded-xl p-4 text-center">
                  <p className="text-green-800 font-bold text-lg">
                    Sie sparen bis zu {ersparnis.toFixed(0)} € pro Jahr!
                  </p>
                  <p className="text-green-600 text-sm mt-1">
                    Das sind {(ersparnis / 12).toFixed(0)} € pro Monat mit dem Bündelnachlass.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#003781] to-[#005ab4] rounded-2xl p-6 text-white text-center">
                <h3 className="text-lg font-bold mb-2">Jetzt persönliches Angebot erhalten</h3>
                <p className="text-sm text-blue-100 mb-4">
                  Ich berechne Ihren individuellen Bündelnachlass und zeige Ihnen die besten Tarife.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => { setShowFunnel(true); trackEvent('sparrechner_to_funnel'); }}
                    className="inline-flex items-center justify-center gap-2 bg-white text-[#003781] font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors min-h-[48px]"
                  >
                    <Phone className="w-4 h-4" /> Kostenlos beraten lassen
                  </button>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hallo Herr Stübe, ich habe den Sparrechner genutzt und möchte gerne ein persönliches Angebot für ${anzahlVertraege} Sachversicherungen mit Bündelnachlass.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#25d366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#1da851] transition-colors min-h-[48px]"
                  >
                    <MessageCircle className="w-4 h-4" /> Per WhatsApp
                  </a>
                </div>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-gray-400 mt-8">
            Die Berechnung ist unverbindlich und dient zur Orientierung. Der tatsächliche Bündelnachlass wird individuell berechnet.
          </p>
        </div>
      </div>

      {showFunnel && <FunnelOverlay isOpen={showFunnel} onClose={() => setShowFunnel(false)} />}
    </>
  );
}
