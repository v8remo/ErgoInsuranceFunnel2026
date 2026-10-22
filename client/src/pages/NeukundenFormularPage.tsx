import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, ChevronLeft, MessageCircle, Plus, X } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import SEO from "@/components/SEO";
import ServiceLayout, { WHATSAPP_URL } from "@/components/service/ServiceLayout";

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

const ANREDEN = ['Herr', 'Frau', 'Divers'];
const TITEL = ['Dr.', 'Dr. med.', 'Prof.', 'Prof. Dr.', 'Dipl.-Ing.'];
const ADELSPRAEDIKATE = ['von', 'van', 'de', 'zu'];
const STELLUNGEN = [
  'Angestellte/r', 'Beamte/r', 'Selbstständig', 'Freiberuflich', 'Rentner/in', 'Student/in',
  'Schüler/in', 'Nicht erwerbstätig', 'Hausfrau/-mann', 'Auszubildende/r', 'Geschäftsführer/in',
];

const cardStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 };

export default function NeukundenFormularPage() {
  const [form, setForm] = useState<FormData>({ ...initial });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
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
      const res = await apiRequest('POST', '/api/neukunden/submit', {
        ...form,
        versicherungen: versicherungen.filter(v => v.art || v.gesellschaft || v.nummer),
      });
      const data = await res.json().catch(() => ({}));
      setReference(typeof data?.reference === 'string' ? data.reference : null);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setSubmitting(false);
    }
  };

  // Ein Kontakt-Fehler markiert alle drei privaten Kontaktfelder.
  const contactInvalid = !!errors.emailPrivat;

  const renderField = (
    label: string,
    field: keyof FormData,
    opts: {
      type?: string; required?: boolean; placeholder?: string; hint?: string; invalid?: boolean;
      extra?: React.InputHTMLAttributes<HTMLInputElement>;
    } = {},
  ) => {
    const id = `f-${field}`;
    const invalid = opts.invalid ?? !!errors[field];
    return (
      <div className="sv-field">
        <label className="sv-label" htmlFor={id}>{label}{!opts.required && <span className="sv-hint"> (optional)</span>}</label>
        {opts.hint && <span className="sv-hint">{opts.hint}</span>}
        <input
          id={id}
          type={opts.type || 'text'}
          value={form[field]}
          onChange={e => set(field, e.target.value)}
          placeholder={opts.placeholder}
          className="sv-input"
          aria-invalid={invalid}
          {...opts.extra}
        />
        {errors[field] && <span className="sv-error">{errors[field]}</span>}
      </div>
    );
  };

  const renderSelect = (label: string, field: keyof FormData, options: string[], required = false) => {
    const id = `f-${field}`;
    return (
      <div className="sv-field">
        <label className="sv-label" htmlFor={id}>{label}{!required && <span className="sv-hint"> (optional)</span>}</label>
        <select id={id} value={form[field]} onChange={e => set(field, e.target.value)} className="sv-input" aria-invalid={!!errors[field]}>
          <option value="">Bitte auswählen</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        {errors[field] && <span className="sv-error">{errors[field]}</span>}
      </div>
    );
  };

  const renderVField = (i: number, label: string, field: keyof VersicherungEntry, opts: { placeholder?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'] } = {}) => {
    const id = `f-v${i}-${field}`;
    return (
      <div className="sv-field">
        <label className="sv-label" htmlFor={id}>{label}</label>
        {field === 'art' ? (
          <select id={id} value={versicherungen[i].art} onChange={e => setVersicherung(i, 'art', e.target.value)} className="sv-input">
            <option value="">Bitte auswählen</option>
            {VERSICHERUNGSARTEN.map(art => <option key={art} value={art}>{art}</option>)}
          </select>
        ) : (
          <input id={id} type="text" inputMode={opts.inputMode} value={versicherungen[i][field]} onChange={e => setVersicherung(i, field, e.target.value)} placeholder={opts.placeholder} className="sv-input" />
        )}
      </div>
    );
  };

  const stepNames = ['Angaben', 'Fertig'];
  const currentStepName = success ? 'Fertig' : 'Angaben';
  const whatsappText = `Hallo Herr Stübe, ich habe meine Stammdaten über das Service-Center eingereicht${reference ? ` (Vorgang ${reference})` : ''}. Viele Grüße, ${form.vorname} ${form.nachname}`;

  return (
    <ServiceLayout>
      {success ? (
        <SEO title="Danke – Daten übermittelt | Agentur Stübe" description="Ihre Angaben sind bei der Agentur Stübe angekommen." noIndex />
      ) : (
        <SEO
          title="Kundendaten mitteilen – Agentur Stübe Ganderkesee"
          description="Bitte füllen Sie das Formular aus, damit wir Ihre Daten für eine persönliche Beratung erfassen können."
          noIndex
        />
      )}
      <div className="sv-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 4 }}>
        {!success && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/service" className="sv-link-btn" style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>
              <ChevronLeft size={18} aria-hidden="true" /> Alle Anliegen
            </Link>
            <ol className="sv-steps" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {stepNames.map((name, i) => (
                <li key={name} aria-current={name === currentStepName ? 'step' : undefined} style={{ display: 'flex', gap: 8 }}>
                  {i > 0 && <span aria-hidden="true">·</span>}
                  {name}
                </li>
              ))}
            </ol>
          </div>
        )}

        {success ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h1 className="sv-h1">Vielen Dank – <em>ist angekommen.</em></h1>
            <p style={{ margin: 0, color: 'var(--sv-body)' }}>
              Ihre Daten liegen jetzt bei Morino Stübe. Wir melden uns, falls wir noch etwas brauchen.
              {(form.emailPrivat || form.emailDienstlich) && <> Eine Eingangsbestätigung geht an <strong>{form.emailPrivat || form.emailDienstlich}</strong>.</>}
            </p>
            {reference && (
              <div className="sv-card" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span className="sv-hint">Ihre Vorgangsnummer</span>
                <span className="sv-ref">{reference}</span>
              </div>
            )}
            <div className="sv-card">
              <dl className="sv-dl">
                <dt>Anliegen</dt><dd>Stammdaten</dd>
                <dt>Name</dt><dd>{form.vorname} {form.nachname}</dd>
                <dt>Verträge</dt><dd>{versicherungen.filter(v => v.art || v.gesellschaft || v.nummer).length}</dd>
              </dl>
            </div>
            <a href={`${WHATSAPP_URL}?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noopener noreferrer" className="sv-btn sv-btn--ghost">
              <MessageCircle size={18} aria-hidden="true" /> Per WhatsApp nachfragen
            </a>
            <Link href="/service" className="sv-link-btn" style={{ alignSelf: 'center' }}>Weiteres Anliegen erledigen</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h1 className="sv-h1">Ihre <em>Stammdaten</em></h1>
            <p style={{ margin: 0, color: 'var(--sv-body)' }}>
              Bitte füllen Sie das Formular so vollständig wie möglich aus. Wir nutzen Ihre Angaben ausschließlich für Ihre persönliche Beratung.
            </p>

            <div className="sv-card" style={cardStyle}>
              <h2 className="sv-section-title" style={{ marginTop: 0 }}>Allgemeine Daten</h2>
              {renderSelect('Anrede', 'anrede', ANREDEN, true)}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderSelect('Akademischer Titel', 'titel', TITEL)}
                {renderSelect('Adelsprädikat', 'adelspraedikat', ADELSPRAEDIKATE)}
              </div>
              {renderField('Berufstitel', 'berufstitel', { placeholder: 'z. B. Direktor, Leiterin' })}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderField('Vorname', 'vorname', { required: true, extra: { autoComplete: 'given-name' } })}
                {renderField('Nachname', 'nachname', { required: true, extra: { autoComplete: 'family-name' } })}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderField('Geburtsdatum', 'geburtsdatum', { type: 'date', extra: { max: new Date().toISOString().split('T')[0], autoComplete: 'bday' } })}
                {renderField('Staatsangehörigkeit', 'staatsangehoerigkeit')}
              </div>
            </div>

            <div className="sv-card" style={cardStyle}>
              <h2 className="sv-section-title" style={{ marginTop: 0 }}>Zusätzliche Personendaten</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderField('Geburtsname', 'geburtsname', { placeholder: 'Falls abweichend' })}
                {renderField('Geburtsort', 'geburtsort')}
              </div>
              {renderField('Geburtsland', 'geburtsland')}
            </div>

            <div className="sv-card" style={cardStyle}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <h2 className="sv-section-title" style={{ marginTop: 0 }}>Kommunikation</h2>
                <span className="sv-hint">Bitte geben Sie mindestens eine private Kontaktmöglichkeit an.</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderField('Mobilfunk privat', 'mobilPrivat', { type: 'tel', placeholder: 'z. B. 0151 12345678', invalid: contactInvalid, extra: { autoComplete: 'tel', inputMode: 'tel' } })}
                {renderField('Mobilfunk dienstlich', 'mobilDienstlich', { type: 'tel', extra: { inputMode: 'tel' } })}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderField('Telefon privat', 'telefonPrivat', { type: 'tel', invalid: contactInvalid, extra: { inputMode: 'tel' } })}
                {renderField('Telefon dienstlich', 'telefonDienstlich', { type: 'tel', extra: { inputMode: 'tel' } })}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderField('E-Mail privat', 'emailPrivat', { type: 'email', placeholder: 'name@beispiel.de', extra: { autoComplete: 'email', inputMode: 'email' } })}
                {renderField('E-Mail dienstlich', 'emailDienstlich', { type: 'email', extra: { inputMode: 'email' } })}
              </div>
            </div>

            <div className="sv-card" style={cardStyle}>
              <h2 className="sv-section-title" style={{ marginTop: 0 }}>Beruf</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderField('Beruf', 'beruf', { placeholder: 'z. B. Ingenieurin, Lehrer', extra: { autoComplete: 'organization-title' } })}
                {renderSelect('Stellung', 'stellung', STELLUNGEN)}
              </div>
              {renderField('Sozialversicherungsnummer', 'sozialversicherungsnummer', { hint: 'Nur für bestimmte Produkte erforderlich.', placeholder: 'z. B. 65 170890 B 233', extra: { autoComplete: 'off' } })}
            </div>

            <div className="sv-card" style={cardStyle}>
              <h2 className="sv-section-title" style={{ marginTop: 0 }}>Hauptadresse</h2>
              {renderField('Straße und Hausnummer', 'strasseHausnr', { placeholder: 'z. B. Musterstraße 12', extra: { autoComplete: 'street-address' } })}
              {renderField('Adressergänzung', 'adressergaenzung', { hint: 'z. B. Wohnung, Etage, c/o', extra: { autoComplete: 'address-line2' } })}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {renderField('PLZ', 'plz', { placeholder: '27777', extra: { inputMode: 'numeric', maxLength: 5, autoComplete: 'postal-code' } })}
                <div className="sm:col-span-2">
                  {renderField('Ort', 'ort', { placeholder: 'Ganderkesee', extra: { autoComplete: 'address-level2' } })}
                </div>
              </div>
              {renderField('Land', 'land', { extra: { autoComplete: 'country-name' } })}
              {renderField('Besuchszeit', 'besuchszeit', { hint: 'Wann sind Sie am besten erreichbar oder zu Hause?', placeholder: 'z. B. Montag–Freitag 17–20 Uhr' })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <h2 className="sv-section-title" style={{ marginTop: 0 }}>Bestehende Versicherungen <span className="sv-hint" style={{ fontFamily: 'inherit' }}>(optional)</span></h2>
              <p className="sv-hint" style={{ margin: 0, fontSize: 15 }}>
                Tragen Sie Ihre vorhandenen Verträge ein – auch bei anderen Gesellschaften. So erkennen wir Lücken und vermeiden Doppelversicherungen.
              </p>
            </div>

            {versicherungen.map((_, i) => (
              <div key={i} className="sv-card" style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className="sv-section-title" style={{ marginTop: 0, fontSize: 17 }}>Vertrag {i + 1}</h3>
                  {versicherungen.length > 1 && (
                    <button type="button" onClick={() => removeVersicherung(i)} className="sv-link-btn" style={{ fontSize: 14 }}>
                      <X size={16} aria-hidden="true" /> Entfernen
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderVField(i, 'Versicherungsart', 'art')}
                  {renderVField(i, 'Versicherungsgesellschaft', 'gesellschaft', { placeholder: 'z. B. Muster Versicherung AG' })}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {renderVField(i, 'Versicherungsnummer', 'nummer', { placeholder: 'z. B. 123456789' })}
                  {renderVField(i, 'Jahresbeitrag (€)', 'beitrag', { placeholder: 'z. B. 240,00', inputMode: 'decimal' })}
                  {renderVField(i, 'Kündigungstermin', 'kuendigungstermin', { placeholder: 'z. B. 31.12.2025' })}
                </div>
              </div>
            ))}
            <button type="button" onClick={addVersicherung} className="sv-btn sv-btn--ghost">
              <Plus size={18} aria-hidden="true" /> Weiteren Vertrag hinzufügen
            </button>

            <div className="sv-card" style={cardStyle}>
              <div className="sv-field">
                <label className="sv-label" htmlFor="f-notiz">Notiz / Anmerkungen <span className="sv-hint">(optional)</span></label>
                <textarea id="f-notiz" value={form.notiz} onChange={e => set('notiz', e.target.value)} rows={3} className="sv-input" placeholder="Besonderheiten, Wünsche oder weitere Informationen …" />
              </div>
            </div>

            {submitError && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="sv-notice sv-notice--error" role="alert">{submitError}</div>
                <p style={{ margin: 0, color: 'var(--sv-body)', fontSize: 15 }}>
                  Bitte versuchen Sie es erneut oder schreiben Sie uns per{' '}
                  <a href={`${WHATSAPP_URL}?text=${encodeURIComponent('Hallo Herr Stübe, ich möchte Ihnen meine Stammdaten zusenden.')}`} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>WhatsApp</a>.
                </p>
              </div>
            )}

            <p className="sv-hint" style={{ margin: 0, fontSize: 14 }}>
              Mit dem Absenden stimmen Sie zu, dass Ihre Daten zum Zweck der Beratung durch die Agentur Stübe verarbeitet werden. Mehr dazu in den{' '}
              <Link href="/datenschutz" style={{ fontWeight: 600 }}>Datenschutzhinweisen</Link>.
            </p>

            <button type="submit" disabled={submitting} className="sv-btn">
              {submitting ? <><span className="sv-spin" aria-hidden="true" /> Wird gesendet …</> : <>Daten übermitteln <ArrowRight size={18} aria-hidden="true" /></>}
            </button>
            {Object.keys(errors).length > 0 && (
              <p className="sv-error" role="alert" style={{ margin: 0, textAlign: 'center' }}>Bitte prüfen Sie die markierten Felder.</p>
            )}
          </form>
        )}
      </div>
    </ServiceLayout>
  );
}
