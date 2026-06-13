import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import SEO from "@/components/SEO";

interface VersicherungEntry {
  art: string;
  gesellschaft: string;
  nummer: string;
  beitrag: string;
  kuendigungstermin: string;
}

const emptyVersicherung = (): VersicherungEntry => ({
  art: '',
  gesellschaft: '',
  nummer: '',
  beitrag: '',
  kuendigungstermin: '',
});

const VERSICHERUNGSARTEN = [
  'Kfz-Haftpflicht / Vollkasko',
  'Hausratversicherung',
  'Privathaftpflicht',
  'Rechtsschutzversicherung',
  'Berufsunfähigkeitsversicherung',
  'Unfallversicherung',
  'Zahnzusatzversicherung',
  'Krankenversicherung (privat)',
  'Krankentagegeld',
  'Krankenzusatzversicherung',
  'Risikolebensversicherung',
  'Lebensversicherung / Rentenversicherung',
  'Wohngebäudeversicherung',
  'Elementarschadenversicherung',
  'Tierhalterhaftpflicht',
  'Reiseversicherung',
  'Cyberversicherung',
  'Gewerbeversicherung',
  'Sonstige',
];

interface FormData {
  anrede: string;
  titel: string;
  adelspraedikat: string;
  berufstitel: string;
  nachname: string;
  vorname: string;
  geburtsdatum: string;
  staatsangehoerigkeit: string;
  geburtsname: string;
  geburtsort: string;
  geburtsland: string;
  mobilPrivat: string;
  mobilDienstlich: string;
  telefonPrivat: string;
  telefonDienstlich: string;
  emailPrivat: string;
  emailDienstlich: string;
  beruf: string;
  stellung: string;
  sozialversicherungsnummer: string;
  strasseHausnr: string;
  adressergaenzung: string;
  plz: string;
  ort: string;
  land: string;
  besuchszeit: string;
  notiz: string;
}

const initial: FormData = {
  anrede: '',
  titel: '',
  adelspraedikat: '',
  berufstitel: '',
  nachname: '',
  vorname: '',
  geburtsdatum: '',
  staatsangehoerigkeit: 'Deutschland',
  geburtsname: '',
  geburtsort: '',
  geburtsland: 'Deutschland',
  mobilPrivat: '',
  mobilDienstlich: '',
  telefonPrivat: '',
  telefonDienstlich: '',
  emailPrivat: '',
  emailDienstlich: '',
  beruf: '',
  stellung: '',
  sozialversicherungsnummer: '',
  strasseHausnr: '',
  adressergaenzung: '',
  plz: '',
  ort: '',
  land: 'Deutschland',
  besuchszeit: '',
  notiz: '',
};

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 pt-6 pb-2 border-b border-gray-200">
      <div className="w-1 h-6 bg-[#E2001A] rounded-full" />
      <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide">{title}</h2>
    </div>
  );
}

function Field({
  label, required, hint, children,
}: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#003781] focus:ring-1 focus:ring-[#003781]/20 transition-colors bg-white";
const selectCls = `${inputCls} cursor-pointer`;

export default function NeukundenFormularPage() {
  const [form, setForm] = useState<FormData>({ ...initial });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [versicherungen, setVersicherungen] = useState<VersicherungEntry[]>([emptyVersicherung()]);

  const set = <K extends keyof FormData>(field: K, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const setVersicherung = (i: number, field: keyof VersicherungEntry, value: string) => {
    setVersicherungen(prev => prev.map((v, idx) => idx === i ? { ...v, [field]: value } : v));
  };
  const addVersicherung = () => setVersicherungen(prev => [...prev, emptyVersicherung()]);
  const removeVersicherung = (i: number) => setVersicherungen(prev => prev.filter((_, idx) => idx !== i));

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.anrede) e.anrede = 'Pflichtfeld';
    if (!form.nachname.trim()) e.nachname = 'Pflichtfeld';
    if (!form.vorname.trim()) e.vorname = 'Pflichtfeld';
    if (!form.emailPrivat.trim() && !form.mobilPrivat.trim() && !form.telefonPrivat.trim()) {
      e.emailPrivat = 'Bitte mind. eine Kontaktmöglichkeit angeben';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await apiRequest('POST', '/api/neukunden/submit', {
        ...form,
        versicherungen: versicherungen.filter(v => v.art || v.gesellschaft || v.nummer),
      });
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <SEO title="Danke – Daten übermittelt | ERGO Agentur Stübe" noIndex />
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vielen Dank!</h1>
          <p className="text-gray-600 mb-6">
            Ihre Daten wurden erfolgreich an die ERGO Agentur Stübe übermittelt. Wir melden uns schnellstmöglich bei Ihnen.
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
            <strong>Ihre Agentur:</strong><br />
            Morino Stübe · ERGO Versicherung<br />
            📞 015566 771019<br />
            📧 morino.stuebe@ergo.de
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Kundendaten mitteilen – ERGO Agentur Stübe Ganderkesee"
        description="Bitte füllen Sie das Formular aus, damit wir Ihre Daten für eine persönliche Beratung erfassen können."
        noIndex
      />
      <div className="min-h-screen bg-gray-50">
        {/* Mini-Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <div>
            <div className="text-lg font-bold text-[#E2001A] leading-tight">ERGO</div>
            <div className="text-[10px] text-gray-500">Agentur Stübe · Ganderkesee</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-xs text-gray-500">Fragen? Rufen Sie uns an:</div>
            <a href="tel:015566771019" className="text-sm font-semibold text-[#003781]">015566 771019</a>
            <div className="text-xs text-gray-400 mt-0.5">
              Büro: <a href="tel:042212959999" className="hover:text-[#003781] transition-colors">04221 2959999</a>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 pb-16">

          {/* Intro */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4 text-center">
            <div className="inline-block bg-[#E2001A] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">ERGO</div>
            <h1 className="text-xl font-extrabold text-gray-900 mb-2">Ihre Kontaktdaten</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Bitte füllen Sie das Formular so vollständig wie möglich aus. Ihre Daten werden sicher übermittelt und ausschließlich für Ihre persönliche Beratung genutzt.
            </p>
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-400">
              <span>🔒 SSL-verschlüsselt</span>
              <span>·</span>
              <span>🇩🇪 DSGVO-konform</span>
              <span>·</span>
              <span>✅ Kostenlos</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4">

            {/* ── Allgemeine Daten ── */}
            <SectionHeader title="Allgemeine Daten" />

            <Field label="Anrede" required>
              <select value={form.anrede} onChange={e => set('anrede', e.target.value)} className={`${selectCls} ${errors.anrede ? 'border-red-400' : ''}`}>
                <option value="">– Bitte auswählen –</option>
                <option value="Herr">Herr</option>
                <option value="Frau">Frau</option>
                <option value="Divers">Divers</option>
              </select>
              {errors.anrede && <span className="text-xs text-red-500">{errors.anrede}</span>}
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Akademischer Titel">
                <select value={form.titel} onChange={e => set('titel', e.target.value)} className={selectCls}>
                  <option value="">– Bitte auswählen –</option>
                  <option value="Dr.">Dr.</option>
                  <option value="Dr. med.">Dr. med.</option>
                  <option value="Prof.">Prof.</option>
                  <option value="Prof. Dr.">Prof. Dr.</option>
                  <option value="Dipl.-Ing.">Dipl.-Ing.</option>
                </select>
              </Field>
              <Field label="Adelsprädikat">
                <select value={form.adelspraedikat} onChange={e => set('adelspraedikat', e.target.value)} className={selectCls}>
                  <option value="">– Bitte auswählen –</option>
                  <option value="von">von</option>
                  <option value="van">van</option>
                  <option value="de">de</option>
                  <option value="zu">zu</option>
                </select>
              </Field>
            </div>

            <Field label="Berufstitel">
              <input type="text" value={form.berufstitel} onChange={e => set('berufstitel', e.target.value)} className={inputCls} placeholder="z.B. Direktor, Leiterin" />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nachname" required>
                <input type="text" value={form.nachname} onChange={e => set('nachname', e.target.value)} className={`${inputCls} ${errors.nachname ? 'border-red-400' : ''}`} autoComplete="family-name" />
                {errors.nachname && <span className="text-xs text-red-500">{errors.nachname}</span>}
              </Field>
              <Field label="Vorname" required>
                <input type="text" value={form.vorname} onChange={e => set('vorname', e.target.value)} className={`${inputCls} ${errors.vorname ? 'border-red-400' : ''}`} autoComplete="given-name" />
                {errors.vorname && <span className="text-xs text-red-500">{errors.vorname}</span>}
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Geburtsdatum">
                <input type="date" value={form.geburtsdatum} onChange={e => set('geburtsdatum', e.target.value)} max={new Date().toISOString().split('T')[0]} className={inputCls} />
              </Field>
              <Field label="Staatsangehörigkeit">
                <input type="text" value={form.staatsangehoerigkeit} onChange={e => set('staatsangehoerigkeit', e.target.value)} className={inputCls} />
              </Field>
            </div>

            {/* ── Zusätzliche Personendaten ── */}
            <SectionHeader title="Zusätzliche Personendaten" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Geburtsname">
                <input type="text" value={form.geburtsname} onChange={e => set('geburtsname', e.target.value)} className={inputCls} placeholder="Falls abweichend" />
              </Field>
              <Field label="Geburtsort">
                <input type="text" value={form.geburtsort} onChange={e => set('geburtsort', e.target.value)} className={inputCls} />
              </Field>
            </div>
            <Field label="Geburtsland">
              <input type="text" value={form.geburtsland} onChange={e => set('geburtsland', e.target.value)} className={inputCls} />
            </Field>

            {/* ── Kommunikation ── */}
            <SectionHeader title="Kommunikation" />
            <p className="text-xs text-gray-400 -mt-2">Bitte mindestens eine Kontaktmöglichkeit angeben.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Mobilfunk privat">
                <input type="tel" value={form.mobilPrivat} onChange={e => set('mobilPrivat', e.target.value)} className={`${inputCls} ${errors.emailPrivat ? 'border-red-400' : ''}`} placeholder="z.B. 0151 12345678" autoComplete="tel" />
              </Field>
              <Field label="Mobilfunk dienstlich">
                <input type="tel" value={form.mobilDienstlich} onChange={e => set('mobilDienstlich', e.target.value)} className={inputCls} />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Telefon privat">
                <input type="tel" value={form.telefonPrivat} onChange={e => set('telefonPrivat', e.target.value)} className={`${inputCls} ${errors.emailPrivat ? 'border-red-400' : ''}`} />
              </Field>
              <Field label="Telefon dienstlich">
                <input type="tel" value={form.telefonDienstlich} onChange={e => set('telefonDienstlich', e.target.value)} className={inputCls} />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="E-Mail privat">
                <input type="email" value={form.emailPrivat} onChange={e => set('emailPrivat', e.target.value)} className={`${inputCls} ${errors.emailPrivat ? 'border-red-400' : ''}`} autoComplete="email" />
                {errors.emailPrivat && <span className="text-xs text-red-500">{errors.emailPrivat}</span>}
              </Field>
              <Field label="E-Mail dienstlich">
                <input type="email" value={form.emailDienstlich} onChange={e => set('emailDienstlich', e.target.value)} className={inputCls} />
              </Field>
            </div>

            {/* ── Beruf ── */}
            <SectionHeader title="Beruf" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Beruf">
                <input type="text" value={form.beruf} onChange={e => set('beruf', e.target.value)} className={inputCls} placeholder="z.B. Ingenieurin, Lehrer" />
              </Field>
              <Field label="Stellung">
                <select value={form.stellung} onChange={e => set('stellung', e.target.value)} className={selectCls}>
                  <option value="">– Bitte auswählen –</option>
                  <option value="Angestellte/r">Angestellte/r</option>
                  <option value="Beamte/r">Beamte/r</option>
                  <option value="Selbstständig">Selbstständig</option>
                  <option value="Freiberuflich">Freiberuflich</option>
                  <option value="Rentner/in">Rentner/in</option>
                  <option value="Student/in">Student/in</option>
                  <option value="Schüler/in">Schüler/in</option>
                  <option value="Nicht erwerbstätig">Nicht erwerbstätig</option>
                  <option value="Hausfrau/-mann">Hausfrau/-mann</option>
                  <option value="Auszubildende/r">Auszubildende/r</option>
                  <option value="Geschäftsführer/in">Geschäftsführer/in</option>
                </select>
              </Field>
            </div>

            <Field label="Sozialversicherungsnummer" hint="Für bestimmte Produkte erforderlich (optional)">
              <input type="text" value={form.sozialversicherungsnummer} onChange={e => set('sozialversicherungsnummer', e.target.value)} className={inputCls} placeholder="z.B. 65 170890 B 233" />
            </Field>

            {/* ── Adresse ── */}
            <SectionHeader title="Hauptadresse" />

            <Field label="Straße und Hausnummer">
              <input type="text" value={form.strasseHausnr} onChange={e => set('strasseHausnr', e.target.value)} className={inputCls} autoComplete="street-address" placeholder="z.B. Musterstraße 12" />
            </Field>

            <Field label="Adressergänzung" hint="z.B. Wohnung, Etage, c/o">
              <input type="text" value={form.adressergaenzung} onChange={e => set('adressergaenzung', e.target.value)} className={inputCls} />
            </Field>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="PLZ">
                <input type="text" inputMode="numeric" value={form.plz} onChange={e => set('plz', e.target.value)} className={inputCls} maxLength={5} autoComplete="postal-code" placeholder="27777" />
              </Field>
              <div className="col-span-1 sm:col-span-2">
                <Field label="Ort">
                  <input type="text" value={form.ort} onChange={e => set('ort', e.target.value)} className={inputCls} autoComplete="address-level2" placeholder="Ganderkesee" />
                </Field>
              </div>
            </div>

            <Field label="Land">
              <input type="text" value={form.land} onChange={e => set('land', e.target.value)} className={inputCls} />
            </Field>

            <Field label="Besuchszeit" hint="Wann sind Sie am besten erreichbar / zuhause?">
              <input type="text" value={form.besuchszeit} onChange={e => set('besuchszeit', e.target.value)} className={inputCls} placeholder="z.B. Montag–Freitag 17–20 Uhr" />
            </Field>

            {/* ── Bestehende Versicherungen ── */}
            <SectionHeader title="Bestehende Versicherungen" />
            <p className="text-xs text-gray-400 -mt-2">
              Tragen Sie Ihre vorhandenen Versicherungsverträge ein – auch bei anderen Gesellschaften. Das hilft uns, Lücken zu erkennen und Doppelversicherungen zu vermeiden.
            </p>

            <div className="flex flex-col gap-4">
              {versicherungen.map((v, i) => (
                <div key={i} className="relative bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Vertrag {i + 1}
                    </span>
                    {versicherungen.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVersicherung(i)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                      >
                        ✕ Entfernen
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-600">Versicherungsart</label>
                      <select
                        value={v.art}
                        onChange={e => setVersicherung(i, 'art', e.target.value)}
                        className={selectCls}
                      >
                        <option value="">– Bitte auswählen –</option>
                        {VERSICHERUNGSARTEN.map(art => (
                          <option key={art} value={art}>{art}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-600">Versicherungsgesellschaft</label>
                      <input
                        type="text"
                        value={v.gesellschaft}
                        onChange={e => setVersicherung(i, 'gesellschaft', e.target.value)}
                        className={inputCls}
                        placeholder="z.B. Allianz, HUK, AXA …"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-600">Versicherungsnummer</label>
                      <input
                        type="text"
                        value={v.nummer}
                        onChange={e => setVersicherung(i, 'nummer', e.target.value)}
                        className={inputCls}
                        placeholder="z.B. 123456789"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-600">Jahresbeitrag (€)</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={v.beitrag}
                        onChange={e => setVersicherung(i, 'beitrag', e.target.value)}
                        className={inputCls}
                        placeholder="z.B. 240,00"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-600">Kündigungstermin</label>
                      <input
                        type="text"
                        value={v.kuendigungstermin}
                        onChange={e => setVersicherung(i, 'kuendigungstermin', e.target.value)}
                        className={inputCls}
                        placeholder="z.B. 31.12.2025"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addVersicherung}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-dashed border-gray-300 text-sm font-semibold text-gray-500 hover:border-[#003781] hover:text-[#003781] transition-colors"
              >
                + Weiteren Vertrag hinzufügen
              </button>
            </div>

            <Field label="Notiz / Anmerkungen">
              <textarea value={form.notiz} onChange={e => set('notiz', e.target.value)} rows={3} className={inputCls} placeholder="Besonderheiten, Wünsche oder weitere Informationen …" />
            </Field>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                ⚠️ {submitError}
              </div>
            )}

            <div className="text-xs text-gray-400 leading-relaxed pt-2">
              Mit dem Absenden stimmen Sie zu, dass Ihre Daten zum Zweck der Beratung durch die ERGO Agentur Stübe verarbeitet werden. Weitere Informationen in der{' '}
              <a href="/datenschutz" target="_blank" className="text-[#003781] underline">Datenschutzerklärung</a>.
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#E2001A] to-[#c5001a] text-white font-bold text-base hover:shadow-lg hover:shadow-red-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? '⏳ Wird übermittelt …' : '✅ Daten jetzt übermitteln'}
            </button>

          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            🔒 Ihre Daten werden SSL-verschlüsselt übertragen und nicht an Dritte weitergegeben.
          </p>
        </div>
      </div>
    </>
  );
}
