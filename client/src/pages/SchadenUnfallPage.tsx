import { useState, useRef, useCallback } from 'react';
import { Link } from 'wouter';
import { AlertTriangle, ArrowRight, Check, ChevronLeft, FileText, Image as ImageIcon, MessageCircle, Plus, Upload, X } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import SEO from "@/components/SEO";
import ServiceLayout, { WHATSAPP_URL } from "@/components/service/ServiceLayout";

function Field({
  label, id, optional, hint, error, children
}: {
  label: string;
  id: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="sv-field">
      <label className="sv-label" htmlFor={id}>{label}{optional && <span className="sv-hint"> (optional)</span>}</label>
      {hint && <span className="sv-hint" style={{ marginTop: -2 }}>{hint}</span>}
      {children}
      {error && <span className="sv-error">{error}</span>}
    </div>
  );
}

interface FormData {
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  versicherungsnummer: string;
  verletzterPersonenkreis: string;
  verletzterName: string;
  ansprechpartner: string;
  datumBekannt: string;
  unfalldatum: string;
  unfalldatumUngefaehr: string;
  ortBekannt: string;
  unfallStrasse: string;
  unfallPlz: string;
  unfallOrt: string;
  unfallLand: string;
  unfallortBeschreibung: string;
  unfallArt: string;
  unfallUrsache: string;
  unfallhergang: string;
  polizeiGemeldet: string;
  pflegegrad: string;
  icdDiagnose: string;
  erstbehandlungDatum: string;
  stationaer: string;
  ambulanteOp: string;
  arbeitsunfaehig: string;
  auVon: string;
  auBis: string;
  auNochAktuell: string;
  tagegeldbescheinigung: string;
  erstbehandler: string;
  erstbehandlerName: string;
  weiterbehandlung: string;
  nochInBehandlung: string;
  kostenaerztlicheNachweise: string;
  weitereUnfallversicherung: string;
  weitereGesellschaft: string;
  bankverbindung: string;
  iban: string;
  datenschutz: boolean;
}

const initialFormData: FormData = {
  vorname: '',
  nachname: '',
  email: '',
  telefon: '',
  versicherungsnummer: '',
  verletzterPersonenkreis: '',
  verletzterName: '',
  ansprechpartner: 'versicherungsnehmer',
  datumBekannt: 'ja',
  unfalldatum: '',
  unfalldatumUngefaehr: '',
  ortBekannt: 'ja',
  unfallStrasse: '',
  unfallPlz: '',
  unfallOrt: '',
  unfallLand: 'Deutschland',
  unfallortBeschreibung: '',
  unfallArt: '',
  unfallUrsache: '',
  unfallhergang: '',
  polizeiGemeldet: 'nein',
  pflegegrad: 'nein',
  icdDiagnose: 'nein',
  erstbehandlungDatum: '',
  stationaer: 'nein',
  ambulanteOp: 'nein',
  arbeitsunfaehig: 'nein',
  auVon: '',
  auBis: '',
  auNochAktuell: 'nein',
  tagegeldbescheinigung: 'nein',
  erstbehandler: '',
  erstbehandlerName: '',
  weiterbehandlung: 'weiss-nicht',
  nochInBehandlung: 'weiss-nicht',
  kostenaerztlicheNachweise: 'weiss-nicht',
  weitereUnfallversicherung: 'nein',
  weitereGesellschaft: '',
  bankverbindung: 'ergo-konto',
  iban: '',
  datenschutz: false,
};

const TOTAL_STEPS = 5;

export default function SchadenUnfallPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({ ...initialFormData });
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fadeClass, setFadeClass] = useState('opacity-100 transition-opacity duration-300');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const goToStep = useCallback((next: number) => {
    setFadeClass('opacity-0 transition-opacity duration-150');
    setTimeout(() => {
      setStep(next);
      setFadeClass('opacity-100 transition-opacity duration-300');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 150);
  }, []);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as string]) setErrors(prev => { const n = { ...prev }; delete n[field as string]; return n; });
  };


  const inputProps = (field: keyof FormData) => ({
    id: `f-${field}`,
    className: 'sv-input',
    'aria-invalid': !!errors[field],
  });

  const tileStyle = (selected: boolean): React.CSSProperties => ({
    minHeight: 48,
    padding: '10px 14px',
    borderRadius: 6,
    background: 'var(--sv-card)',
    border: `1.5px solid ${selected ? 'var(--sv-ink)' : 'var(--sv-line)'}`,
    color: 'var(--sv-ink)',
    font: 'inherit',
    fontSize: 15,
    fontWeight: selected ? 700 : 600,
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  });

  const renderChoice = (
    field: StringFormKey,
    legend: string,
    options: { value: string; label: string }[],
    inline = true,
    hint?: string
  ) => (
    <fieldset className="sv-field" style={{ border: 'none', margin: 0, padding: 0, minWidth: 0 }}>
      <legend className="sv-label" style={{ padding: 0, marginBottom: 6 }}>{legend}</legend>
      {hint && <span className="sv-hint" style={{ marginTop: -2 }}>{hint}</span>}
      <div style={{ display: 'grid', gridTemplateColumns: inline ? 'repeat(auto-fit, minmax(110px, 1fr))' : '1fr', gap: 8 }}>
        {options.map(opt => {
          const selected = formData[field] === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={selected}
              onClick={() => updateField(field, opt.value)}
              style={tileStyle(selected)}
            >
              <span>{opt.label}</span>
              {selected && <Check size={18} aria-hidden="true" style={{ flexShrink: 0 }} />}
            </button>
          );
        })}
      </div>
      {errors[field] && <span className="sv-error">{errors[field]}</span>}
    </fieldset>
  );

  type StringFormKey = { [K in keyof FormData]: FormData[K] extends string ? K : never }[keyof FormData];
  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const valid: File[] = [];
    for (let i = 0; i < newFiles.length; i++) {
      const f = newFiles[i];
      if (f.size > 10 * 1024 * 1024) continue;
      if (!['image/jpeg', 'image/png', 'application/pdf'].includes(f.type)) continue;
      if (files.length + valid.length >= 5) break;
      valid.push(f);
    }
    setFiles(prev => [...prev, ...valid].slice(0, 5));
  };

  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index));

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const validateStep1 = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.vorname.trim()) e.vorname = 'Pflichtfeld';
    if (!formData.nachname.trim()) e.nachname = 'Pflichtfeld';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Gültige E-Mail eingeben';
    if (!formData.telefon.trim()) e.telefon = 'Pflichtfeld';
    if (!formData.verletzterPersonenkreis) e.verletzterPersonenkreis = 'Bitte auswählen';
    if (formData.verletzterPersonenkreis === 'andere' && !formData.verletzterName.trim()) e.verletzterName = 'Pflichtfeld';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = (): boolean => {
    const e: Record<string, string> = {};
    if (formData.datumBekannt === 'ja' && !formData.unfalldatum) e.unfalldatum = 'Pflichtfeld';
    if (formData.datumBekannt === 'nein' && !formData.unfalldatumUngefaehr.trim()) e.unfalldatumUngefaehr = 'Pflichtfeld';
    if (!formData.unfallArt) e.unfallArt = 'Bitte auswählen';
    if (!formData.unfallUrsache) e.unfallUrsache = 'Bitte auswählen';
    if (!formData.unfallhergang.trim() || formData.unfallhergang.trim().length < 30) e.unfallhergang = 'Bitte beschreiben Sie den Unfallhergang (mind. 30 Zeichen)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep4 = (): boolean => {
    const e: Record<string, string> = {};
    if (formData.bankverbindung === 'anderes-konto') {
      if (!formData.iban.trim()) e.iban = 'Pflichtfeld';
      else if (!formData.iban.replace(/\s/g, '').match(/^DE\d{20}$/)) e.iban = 'Gültige deutsche IBAN eingeben (DE + 20 Ziffern)';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep5 = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.datenschutz) e.datenschutz = 'Bitte bestätigen Sie die Datenschutzerklärung';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = (currentStep: number) => {
    let valid = false;
    if (currentStep === 1) valid = validateStep1();
    else if (currentStep === 2) valid = validateStep2();
    else if (currentStep === 3) valid = true;
    else if (currentStep === 4) valid = validateStep4();
    if (valid) goToStep(currentStep + 1);
  };

  const buildSummary = () => {
    const lines: string[] = [];
    lines.push('=== UNFALLVERSICHERUNG – SCHADENMELDUNG ===');
    lines.push('');
    lines.push('--- Persönliche Angaben ---');
    lines.push(`Name: ${formData.vorname} ${formData.nachname}`);
    lines.push(`E-Mail: ${formData.email}`);
    lines.push(`Telefon: ${formData.telefon}`);
    if (formData.versicherungsnummer) lines.push(`Versicherungsnummer: ${formData.versicherungsnummer}`);
    lines.push(`Verletzt: ${formData.verletzterPersonenkreis === 'selbst' ? 'Versicherungsnehmer selbst' : formData.verletzterPersonenkreis === 'mitversichert' ? 'Mitversicherte Person' : `Andere Person: ${formData.verletzterName}`}`);
    lines.push(`Ansprechpartner: ${formData.ansprechpartner === 'versicherungsnehmer' ? 'Versicherungsnehmer' : formData.ansprechpartner === 'bevollmaechtigter' ? 'Bevollmächtigte Person' : 'Andere Person'}`);
    lines.push('');
    lines.push('--- Unfalldaten ---');
    if (formData.datumBekannt === 'ja') lines.push(`Unfalldatum: ${formData.unfalldatum}`);
    else lines.push(`Ungefährer Zeitraum: ${formData.unfalldatumUngefaehr}`);
    if (formData.ortBekannt === 'ja') lines.push(`Unfallort: ${formData.unfallStrasse ? formData.unfallStrasse + ', ' : ''}${formData.unfallPlz} ${formData.unfallOrt}, ${formData.unfallLand}`);
    if (formData.unfallortBeschreibung) lines.push(`Ortsbeschreibung: ${formData.unfallortBeschreibung}`);
    lines.push(`Art des Unfalls: ${formData.unfallArt}`);
    lines.push(`Hauptursache: ${formData.unfallUrsache}`);
    lines.push(`Hergang: ${formData.unfallhergang}`);
    lines.push(`Polizei gemeldet: ${formData.polizeiGemeldet}`);
    lines.push('');
    lines.push('--- Gesundheitsfragen ---');
    lines.push(`Pflegegrad: ${formData.pflegegrad}`);
    lines.push(`ICD-Diagnose: ${formData.icdDiagnose}`);
    if (formData.erstbehandlungDatum) lines.push(`Erstbehandlung am: ${formData.erstbehandlungDatum}`);
    lines.push(`Stationäre Behandlung: ${formData.stationaer}`);
    lines.push(`Ambulante Operation: ${formData.ambulanteOp}`);
    lines.push(`Arbeitsunfähig: ${formData.arbeitsunfaehig}`);
    if (formData.arbeitsunfaehig === 'ja') lines.push(`AU von: ${formData.auVon || '-'} bis: ${formData.auNochAktuell === 'ja' ? 'noch aktuell' : formData.auBis || '-'}`);
    lines.push(`Tagegeldbescheinigung: ${formData.tagegeldbescheinigung}`);
    lines.push(`Erstbehandler: ${formData.erstbehandler || 'k.A.'}`);
    if (formData.erstbehandlerName) lines.push(`Name Erstbehandler: ${formData.erstbehandlerName}`);
    lines.push(`Weiterbehandlung durch Erstbehandler: ${formData.weiterbehandlung}`);
    lines.push(`Noch in Behandlung: ${formData.nochInBehandlung}`);
    lines.push('');
    lines.push('--- Weitere Angaben ---');
    lines.push(`Kosten für ärztliche Nachweise: ${formData.kostenaerztlicheNachweise}`);
    lines.push(`Weitere Unfallversicherung: ${formData.weitereUnfallversicherung}`);
    if (formData.weitereUnfallversicherung === 'ja' && formData.weitereGesellschaft) lines.push(`Weitere Gesellschaft: ${formData.weitereGesellschaft}`);
    lines.push(`Bankverbindung: ${formData.bankverbindung === 'ergo-konto' ? 'ERGO-Beitragskonto' : formData.bankverbindung === 'anderes-konto' ? `Anderes Konto (IBAN: ${formData.iban})` : 'Noch nicht bekannt'}`);
    lines.push(`Anhänge: ${files.length} Datei(en)`);
    return lines.join('\n');
  };

  const handleSubmit = async () => {
    if (!validateStep5()) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const fileAttachments: { filename: string; content: string }[] = [];
      for (const file of files) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        fileAttachments.push({ filename: file.name, content: base64 });
      }

      const summary = buildSummary();

      const res = await apiRequest('POST', '/api/schaden/submit', {
        damageType: 'unfall',
        customerName: `${formData.vorname} ${formData.nachname}`,
        customerEmail: formData.email,
        customerPhone: formData.telefon,
        insuranceNumber: formData.versicherungsnummer || undefined,
        damageDate: formData.datumBekannt === 'ja' ? formData.unfalldatum : formData.unfalldatumUngefaehr,
        damageLocation: formData.ortBekannt === 'ja'
          ? `${formData.unfallStrasse ? formData.unfallStrasse + ', ' : ''}${formData.unfallPlz} ${formData.unfallOrt}, ${formData.unfallLand}`.trim()
          : formData.unfallortBeschreibung.trim() || 'Ungefährer Ort (keine Angabe)',
        damageDescription: formData.unfallhergang,
        policeReport: formData.polizeiGemeldet,
        extraFields: summary,
        attachmentsCount: files.length,
        summary,
        fileAttachments,
      });
      const result = await res.json().catch(() => null);
      setReference(result?.reference ?? null);

      goToStep(6);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Fehler beim Senden. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepNames = ['Person', 'Unfall', 'Gesundheit', 'Weiteres', 'Absenden'];
  const today = new Date().toISOString().split('T')[0];
  const cardStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 18 };
  const stackStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 18 };
  const hasErrors = Object.keys(errors).length > 0;
  const errorHint = hasErrors && (
    <p className="sv-error" role="alert" style={{ margin: 0, textAlign: 'center' }}>Bitte prüfen Sie die markierten Felder.</p>
  );
  const nextButton = (current: number, label: string) => (
    <button type="button" onClick={() => handleNext(current)} className="sv-btn">
      {label} <ArrowRight size={18} aria-hidden="true" />
    </button>
  );

  return (
    <ServiceLayout>
      <SEO
        title="Unfall melden – Service-Center Agentur Stübe"
        description="Unfall für Ihre Unfallversicherung online melden: strukturiertes Formular mit Upload für ärztliche Unterlagen und Eingangsbestätigung – Agentur Morino Stübe, Ganderkesee."
        keywords="Unfallversicherung Schaden melden, Schadensmeldung Unfallversicherung, Ganderkesee"
        noIndex
      />
      <div className="sv-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 4, paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {step <= TOTAL_STEPS && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {step > 1 ? (
              <button type="button" onClick={() => goToStep(step - 1)} className="sv-link-btn" style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>
                <ChevronLeft size={18} aria-hidden="true" /> Zurück
              </button>
            ) : (
              <Link href="/schaden" className="sv-link-btn" style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>
                <ChevronLeft size={18} aria-hidden="true" /> Alle Schadenarten
              </Link>
            )}
            <ol className="sv-steps" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {stepNames.map((name, i) => (
                <li key={name} aria-current={i + 1 === step ? 'step' : undefined} style={{ display: 'flex', gap: 8 }}>
                  {i > 0 && <span aria-hidden="true">·</span>}
                  {name}
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className={fadeClass}>

          {/* ======= STEP 1 ======= */}
          {step === 1 && (
            <div style={stackStyle}>
              <h1 className="sv-h1">Unfall <em>melden</em></h1>
              <p style={{ margin: 0, color: 'var(--sv-body)' }}>
                Bitte füllen Sie das Formular so vollständig wie möglich aus. Ihre Meldung geht direkt an Morino Stübe.
              </p>

              <div className="sv-card" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 15, color: 'var(--sv-body)' }}>
                <AlertTriangle size={20} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2, color: 'var(--sv-accent)' }} />
                <span>
                  Bei schweren Verletzungen oder in Notfällen rufen Sie bitte zuerst die <strong style={{ color: 'var(--sv-ink)' }}>112</strong> an.
                  Die Schaden-Hotline erreichen Sie kostenlos unter <a href="tel:08003746000" style={{ fontWeight: 600 }}>0800 3746-000</a>.
                </span>
              </div>

              <div className="sv-card" style={cardStyle}>
                <h2 className="sv-section-title" style={{ marginTop: 0 }}>Ihre Kontaktdaten</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field id="f-vorname" label="Vorname" error={errors.vorname}>
                    <input type="text" value={formData.vorname} onChange={e => updateField('vorname', e.target.value)} {...inputProps('vorname')} autoComplete="given-name" />
                  </Field>
                  <Field id="f-nachname" label="Nachname" error={errors.nachname}>
                    <input type="text" value={formData.nachname} onChange={e => updateField('nachname', e.target.value)} {...inputProps('nachname')} autoComplete="family-name" />
                  </Field>
                </div>
                <Field id="f-telefon" label="Telefon" error={errors.telefon}>
                  <input type="tel" inputMode="tel" value={formData.telefon} onChange={e => updateField('telefon', e.target.value)} {...inputProps('telefon')} autoComplete="tel" placeholder="0151 12345678" />
                </Field>
                <Field id="f-email" label="E-Mail" error={errors.email}>
                  <input type="email" inputMode="email" value={formData.email} onChange={e => updateField('email', e.target.value)} {...inputProps('email')} autoComplete="email" placeholder="name@beispiel.de" />
                </Field>
                <Field id="f-versicherungsnummer" label="Versicherungsnummer" optional hint="Steht auf Ihrem Versicherungsschein." error={errors.versicherungsnummer}>
                  <input type="text" value={formData.versicherungsnummer} onChange={e => updateField('versicherungsnummer', e.target.value)} {...inputProps('versicherungsnummer')} placeholder="z. B. 12345678" />
                </Field>
              </div>

              <div className="sv-card" style={cardStyle}>
                <h2 className="sv-section-title" style={{ marginTop: 0 }}>Verletzte Person</h2>
                {renderChoice('verletzterPersonenkreis', 'Wer wurde verletzt?', [
                  { value: 'selbst', label: 'Ich selbst (Versicherungsnehmer)' },
                  { value: 'mitversichert', label: 'Eine mitversicherte Person' },
                  { value: 'andere', label: 'Eine andere Person' },
                ], false)}
                {formData.verletzterPersonenkreis === 'andere' && (
                  <div className="sv-subbox">
                    <Field id="f-verletzterName" label="Name der verletzten Person" error={errors.verletzterName}>
                      <input type="text" value={formData.verletzterName} onChange={e => updateField('verletzterName', e.target.value)} {...inputProps('verletzterName')} placeholder="Vor- und Nachname" />
                    </Field>
                  </div>
                )}
                {renderChoice('ansprechpartner', 'Ansprechpartner für Rückfragen', [
                  { value: 'versicherungsnehmer', label: 'Versicherungsnehmer' },
                  { value: 'bevollmaechtigter', label: 'Bevollmächtigte Person' },
                  { value: 'andere', label: 'Andere Person' },
                ], false)}
              </div>

              {nextButton(1, 'Weiter zum Unfall')}
              {errorHint}
            </div>
          )}

          {/* ======= STEP 2 ======= */}
          {step === 2 && (
            <div style={stackStyle}>
              <h1 className="sv-h1">Wie ist es <em>passiert?</em></h1>
              <p style={{ margin: 0, color: 'var(--sv-body)' }}>Bitte schildern Sie den Unfall so genau wie möglich.</p>

              <div className="sv-card" style={cardStyle}>
                <h2 className="sv-section-title" style={{ marginTop: 0 }}>Zeitpunkt und Ort</h2>
                {renderChoice('datumBekannt', 'Wann ist der Unfall passiert?', [
                  { value: 'ja', label: 'Genaues Datum bekannt' },
                  { value: 'nein', label: 'Datum nicht genau bekannt' },
                ])}
                {formData.datumBekannt === 'ja' ? (
                  <Field id="f-unfalldatum" label="Unfalldatum" error={errors.unfalldatum}>
                    <input type="date" value={formData.unfalldatum} onChange={e => updateField('unfalldatum', e.target.value)} max={today} {...inputProps('unfalldatum')} />
                  </Field>
                ) : (
                  <Field id="f-unfalldatumUngefaehr" label="Ungefährer Zeitpunkt" error={errors.unfalldatumUngefaehr}>
                    <input type="text" value={formData.unfalldatumUngefaehr} onChange={e => updateField('unfalldatumUngefaehr', e.target.value)} {...inputProps('unfalldatumUngefaehr')} placeholder="z. B. Anfang März 2025, nachmittags" />
                  </Field>
                )}

                {renderChoice('ortBekannt', 'Wo ist der Unfall passiert?', [
                  { value: 'ja', label: 'Genaue Adresse bekannt' },
                  { value: 'nein', label: 'Ungefährer Ort' },
                ])}
                {formData.ortBekannt === 'ja' ? (
                  <div className="sv-subbox">
                    <span className="sv-label">Adresse des Unfallorts <span className="sv-hint">(optional)</span></span>
                    <Field id="f-unfallStrasse" label="Straße und Hausnummer">
                      <input type="text" value={formData.unfallStrasse} onChange={e => updateField('unfallStrasse', e.target.value)} {...inputProps('unfallStrasse')} />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field id="f-unfallPlz" label="PLZ">
                        <input type="text" inputMode="numeric" value={formData.unfallPlz} onChange={e => updateField('unfallPlz', e.target.value)} {...inputProps('unfallPlz')} maxLength={5} />
                      </Field>
                      <Field id="f-unfallOrt" label="Ort">
                        <input type="text" value={formData.unfallOrt} onChange={e => updateField('unfallOrt', e.target.value)} {...inputProps('unfallOrt')} />
                      </Field>
                    </div>
                    <Field id="f-unfallLand" label="Land">
                      <input type="text" value={formData.unfallLand} onChange={e => updateField('unfallLand', e.target.value)} {...inputProps('unfallLand')} />
                    </Field>
                    <Field id="f-unfallortBeschreibung" label="Kurze Ortsbeschreibung" optional hint="z. B. Treppenhaus, Gartenweg, Sportplatz">
                      <input type="text" value={formData.unfallortBeschreibung} onChange={e => updateField('unfallortBeschreibung', e.target.value)} {...inputProps('unfallortBeschreibung')} placeholder="z. B. Treppe im Eigenheim" />
                    </Field>
                  </div>
                ) : (
                  <Field id="f-unfallortBeschreibung" label="Ungefährer Ort" optional>
                    <input type="text" value={formData.unfallortBeschreibung} onChange={e => updateField('unfallortBeschreibung', e.target.value)} {...inputProps('unfallortBeschreibung')} placeholder="z. B. Fußgängerzone Oldenburg, Sportplatz Ganderkesee" />
                  </Field>
                )}
              </div>

              <div className="sv-card" style={cardStyle}>
                <h2 className="sv-section-title" style={{ marginTop: 0 }}>Hergang</h2>
                <Field id="f-unfallArt" label="Art des Unfalls" error={errors.unfallArt}>
                  <select value={formData.unfallArt} onChange={e => updateField('unfallArt', e.target.value)} {...inputProps('unfallArt')}>
                    <option value="">Bitte auswählen</option>
                    <option value="Sturz">Sturz</option>
                    <option value="Verkehrsunfall">Verkehrsunfall</option>
                    <option value="Sport-/Freizeitunfall">Sport-/Freizeitunfall</option>
                    <option value="Arbeitsunfall">Arbeitsunfall</option>
                    <option value="Haushaltsunfall">Haushaltsunfall</option>
                    <option value="Sonstiges">Sonstiges</option>
                  </select>
                </Field>
                <Field id="f-unfallUrsache" label="Hauptursache des Unfalls" error={errors.unfallUrsache}>
                  <select value={formData.unfallUrsache} onChange={e => updateField('unfallUrsache', e.target.value)} {...inputProps('unfallUrsache')}>
                    <option value="">Bitte auswählen</option>
                    <option value="Ausrutschen/Stolpern">Ausrutschen / Stolpern</option>
                    <option value="Zusammenstoß">Zusammenstoß</option>
                    <option value="Sturz aus Höhe">Sturz aus der Höhe</option>
                    <option value="Körperliche Überanstrengung">Körperliche Überanstrengung</option>
                    <option value="Fremdeinwirkung">Fremdeinwirkung</option>
                    <option value="Sonstiges">Sonstiges</option>
                  </select>
                </Field>
                <Field id="f-unfallhergang" label="Schilderung des Unfallhergangs" error={errors.unfallhergang}>
                  <textarea
                    value={formData.unfallhergang}
                    onChange={e => updateField('unfallhergang', e.target.value)}
                    rows={5}
                    {...inputProps('unfallhergang')}
                    placeholder="Wie kam es zu dem Unfall, und welche Verletzungen sind entstanden?"
                  />
                  <span className="sv-hint" style={{ textAlign: 'right' }}>{formData.unfallhergang.length} Zeichen (mind. 30)</span>
                </Field>
                {renderChoice('polizeiGemeldet', 'Wurde der Unfall bei der Polizei gemeldet?', [
                  { value: 'ja', label: 'Ja' },
                  { value: 'nein', label: 'Nein' },
                ])}
              </div>

              {nextButton(2, 'Weiter zur Gesundheit')}
              {errorHint}
            </div>
          )}

          {/* ======= STEP 3 ======= */}
          {step === 3 && (
            <div style={stackStyle}>
              <h1 className="sv-h1">Fragen zur <em>Gesundheit</em></h1>
              <p style={{ margin: 0, color: 'var(--sv-body)' }}>
                Diese Angaben werden für die Bearbeitung benötigt. Alle Fragen sind freiwillig, helfen aber weiter.
              </p>

              <div className="sv-card" style={cardStyle}>
                <h2 className="sv-section-title" style={{ marginTop: 0 }}>Diagnose und Behandlung</h2>
                {renderChoice('pflegegrad', 'Hat die verletzte Person einen anerkannten Pflegegrad?', [
                  { value: 'nein', label: 'Nein' },
                  { value: 'ja', label: 'Ja' },
                  { value: 'weiss-nicht', label: 'Weiß ich nicht' },
                ])}
                {renderChoice('icdDiagnose', 'Liegt ein ICD-Diagnoseschlüssel (ärztliche Diagnose) vor?', [
                  { value: 'nein', label: 'Nein' },
                  { value: 'ja', label: 'Ja' },
                ], true, 'z. B. S52.0 für Radiusfraktur')}
                <Field id="f-erstbehandlungDatum" label="Datum der Erstbehandlung" optional hint="Wann wurde der Arzt oder das Krankenhaus zuerst aufgesucht?">
                  <input type="date" value={formData.erstbehandlungDatum} onChange={e => updateField('erstbehandlungDatum', e.target.value)} max={today} {...inputProps('erstbehandlungDatum')} />
                </Field>
                {renderChoice('stationaer', 'Hat eine stationäre Krankenhausbehandlung stattgefunden?', [
                  { value: 'nein', label: 'Nein' },
                  { value: 'ja', label: 'Ja' },
                  { value: 'weiss-nicht', label: 'Weiß ich nicht' },
                ])}
                {renderChoice('ambulanteOp', 'Hat eine ambulante Operation stattgefunden?', [
                  { value: 'nein', label: 'Nein' },
                  { value: 'ja', label: 'Ja' },
                ])}
              </div>

              <div className="sv-card" style={cardStyle}>
                <h2 className="sv-section-title" style={{ marginTop: 0 }}>Arbeitsunfähigkeit</h2>
                {renderChoice('arbeitsunfaehig', 'War oder ist die verletzte Person arbeitsunfähig krankgeschrieben?', [
                  { value: 'nein', label: 'Nein' },
                  { value: 'ja', label: 'Ja' },
                  { value: 'weiss-nicht', label: 'Weiß ich nicht' },
                ])}
                {formData.arbeitsunfaehig === 'ja' && (
                  <div className="sv-subbox">
                    <div className="grid grid-cols-2 gap-3">
                      <Field id="f-auVon" label="Arbeitsunfähig von">
                        <input type="date" value={formData.auVon} onChange={e => updateField('auVon', e.target.value)} {...inputProps('auVon')} />
                      </Field>
                      <Field id="f-auBis" label="bis">
                        <input type="date" value={formData.auBis} onChange={e => updateField('auBis', e.target.value)} {...inputProps('auBis')} disabled={formData.auNochAktuell === 'ja'} />
                      </Field>
                    </div>
                    <label className="sv-check">
                      <input
                        type="checkbox"
                        checked={formData.auNochAktuell === 'ja'}
                        onChange={e => updateField('auNochAktuell', e.target.checked ? 'ja' : 'nein')}
                      />
                      <span>Die Arbeitsunfähigkeit dauert noch an (kein Enddatum)</span>
                    </label>
                  </div>
                )}
                {renderChoice('tagegeldbescheinigung', 'Wurde eine Tagegeldbescheinigung ausgestellt und eingereicht?', [
                  { value: 'nein', label: 'Nein' },
                  { value: 'ja', label: 'Ja' },
                ])}
              </div>

              <div className="sv-card" style={cardStyle}>
                <h2 className="sv-section-title" style={{ marginTop: 0 }}>Ärztliche Behandlung</h2>
                {renderChoice('erstbehandler', 'Wer hat die Erstbehandlung durchgeführt?', [
                  { value: 'Hausarzt/Facharzt', label: 'Hausarzt / Facharzt' },
                  { value: 'Krankenhaus', label: 'Krankenhaus' },
                  { value: 'Weiß ich nicht', label: 'Weiß ich nicht' },
                ], false)}
                {(formData.erstbehandler === 'Hausarzt/Facharzt' || formData.erstbehandler === 'Krankenhaus') && (
                  <Field id="f-erstbehandlerName" label="Name der Praxis oder des Krankenhauses" optional>
                    <input type="text" value={formData.erstbehandlerName} onChange={e => updateField('erstbehandlerName', e.target.value)} {...inputProps('erstbehandlerName')} />
                  </Field>
                )}
                {renderChoice('weiterbehandlung', 'Wird die Behandlung weiterhin durch diesen Erstbehandler fortgesetzt?', [
                  { value: 'ja', label: 'Ja' },
                  { value: 'nein', label: 'Nein' },
                  { value: 'weiss-nicht', label: 'Weiß ich nicht' },
                ])}
                {renderChoice('nochInBehandlung', 'Befindet sich die verletzte Person noch in Behandlung?', [
                  { value: 'ja', label: 'Ja' },
                  { value: 'nein', label: 'Nein' },
                  { value: 'weiss-nicht', label: 'Weiß ich nicht' },
                ])}
              </div>

              {nextButton(3, 'Weiter zu weiteren Angaben')}
            </div>
          )}

          {/* ======= STEP 4 ======= */}
          {step === 4 && (
            <div style={stackStyle}>
              <h1 className="sv-h1">Weitere Angaben &amp; <em>Bankverbindung</em></h1>

              <div className="sv-card" style={cardStyle}>
                <h2 className="sv-section-title" style={{ marginTop: 0 }}>Weitere Angaben</h2>
                {renderChoice('kostenaerztlicheNachweise', 'Sind Ihnen Kosten für ärztliche Nachweise entstanden?', [
                  { value: 'nein', label: 'Nein' },
                  { value: 'ja', label: 'Ja' },
                  { value: 'weiss-nicht', label: 'Weiß ich nicht' },
                ], true, 'z. B. für Atteste, Bescheinigungen oder Befundberichte')}
                {renderChoice('weitereUnfallversicherung', 'Besteht eine weitere Unfallversicherung bei einem anderen Unternehmen?', [
                  { value: 'nein', label: 'Nein' },
                  { value: 'ja', label: 'Ja' },
                  { value: 'weiss-nicht', label: 'Weiß ich nicht' },
                ])}
                {formData.weitereUnfallversicherung === 'ja' && (
                  <Field id="f-weitereGesellschaft" label="Name der Versicherungsgesellschaft" optional>
                    <input type="text" value={formData.weitereGesellschaft} onChange={e => updateField('weitereGesellschaft', e.target.value)} {...inputProps('weitereGesellschaft')} />
                  </Field>
                )}
              </div>

              <div className="sv-card" style={cardStyle}>
                <h2 className="sv-section-title" style={{ marginTop: 0 }}>Auszahlung</h2>
                {renderChoice('bankverbindung', 'Wohin soll eine Versicherungsleistung überwiesen werden?', [
                  { value: 'ergo-konto', label: 'Auf mein bei ERGO hinterlegtes Beitragskonto' },
                  { value: 'anderes-konto', label: 'Auf ein anderes Konto' },
                  { value: 'unbekannt', label: 'Noch nicht bekannt' },
                ], false)}
                {formData.bankverbindung === 'anderes-konto' && (
                  <div className="sv-subbox">
                    <Field id="f-iban" label="IBAN" error={errors.iban}>
                      <input
                        type="text"
                        value={formData.iban}
                        onChange={e => updateField('iban', e.target.value.toUpperCase())}
                        {...inputProps('iban')}
                        placeholder="DE00 0000 0000 0000 0000 00"
                        maxLength={27}
                        autoComplete="off"
                      />
                    </Field>
                  </div>
                )}
              </div>

              {nextButton(4, 'Weiter zum Absenden')}
              {errorHint}
            </div>
          )}

          {/* ======= STEP 5 ======= */}
          {step === 5 && (
            <div style={stackStyle}>
              <h1 className="sv-h1">Unterlagen &amp; <em>absenden</em></h1>

              <div className="sv-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <h2 className="sv-section-title" style={{ marginTop: 0 }}>Unterlagen <span className="sv-hint" style={{ fontFamily: 'inherit' }}>(optional)</span></h2>
                <p className="sv-hint" style={{ margin: 0 }}>
                  Ärztliche Berichte, Atteste, Fotos der Verletzung, Tagegeldbescheinigungen oder die Schweigepflichtentbindung.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={e => { handleFiles(e.target.files); e.target.value = ''; }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={e => { e.preventDefault(); setIsDragOver(false); handleFiles(e.dataTransfer.files); }}
                  disabled={files.length >= 5}
                  className="sv-dropzone"
                  style={isDragOver ? { borderColor: 'var(--sv-accent)', background: 'var(--sv-accent-soft)' } : undefined}
                >
                  <Upload size={26} strokeWidth={1.7} aria-hidden="true" />
                  <span style={{ fontWeight: 700 }}>Fotos oder PDFs auswählen</span>
                  <span className="sv-hint">Bis zu 5 Dateien, je max. 10 MB · PDF, JPG, PNG</span>
                </button>
                {files.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid var(--sv-line)', paddingTop: 10 }}>
                    <span style={{ width: 48, height: 48, borderRadius: 6, background: 'var(--sv-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {f.type === 'application/pdf' ? <FileText size={22} aria-hidden="true" /> : <ImageIcon size={22} aria-hidden="true" />}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                      <span className="sv-hint">{formatFileSize(f.size)}</span>
                    </span>
                    <button type="button" onClick={() => removeFile(i)} aria-label={`${f.name} entfernen`} style={{ width: 44, height: 44, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--sv-ink)' }}>
                      <X size={18} aria-hidden="true" />
                    </button>
                  </div>
                ))}
                {files.length > 0 && files.length < 5 && (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="sv-link-btn" style={{ alignSelf: 'flex-start', fontSize: 14 }}>
                    <Plus size={16} aria-hidden="true" /> Weitere Datei hinzufügen
                  </button>
                )}
              </div>

              <div className="sv-subbox" style={{ fontSize: 15, color: 'var(--sv-body)', border: '1.5px solid var(--sv-line)' }}>
                <span>
                  <strong style={{ color: 'var(--sv-ink)' }}>Schweigepflichtentbindung:</strong> Für die Bearbeitung werden gegebenenfalls ärztliche Auskünfte benötigt.{' '}
                  <a href="https://www.ergo.de/de/Service/Schaden/Unfallversicherung" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>
                    Das Formular zur Schweigepflichtentbindung
                  </a>{' '}
                  können Sie vorab herunterladen, oder Morino Stübe schickt es Ihnen zu.
                </span>
              </div>

              <div>
                <label className="sv-check">
                  <input
                    type="checkbox"
                    checked={formData.datenschutz}
                    onChange={e => { updateField('datenschutz', e.target.checked); if (errors.datenschutz) setErrors(prev => { const n = { ...prev }; delete n.datenschutz; return n; }); }}
                  />
                  <span>
                    Ich bin einverstanden, dass meine Angaben und Dokumente zur Bearbeitung dieser Unfallmeldung gespeichert und verarbeitet werden. Die{' '}
                    <Link href="/datenschutz" target="_blank" style={{ fontWeight: 600 }}>Datenschutzhinweise</Link> habe ich gelesen.
                  </span>
                </label>
                {errors.datenschutz && <p className="sv-error" style={{ margin: '6px 0 0 34px' }}>{errors.datenschutz}</p>}
              </div>

              {submitError && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="sv-notice sv-notice--error" role="alert">{submitError}</div>
                  <p style={{ margin: 0, color: 'var(--sv-body)', fontSize: 15 }}>
                    Bitte versuchen Sie es erneut oder schicken Sie uns die Angaben per{' '}
                    <a
                      href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Hallo Herr Stübe, ich möchte einen Unfall melden. Das Online-Formular hat leider nicht geklappt. (Name: ${formData.vorname} ${formData.nachname})`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontWeight: 600 }}
                    >
                      WhatsApp
                    </a>.
                  </p>
                </div>
              )}

              <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="sv-btn">
                {isSubmitting ? <><span className="sv-spin" aria-hidden="true" /> Wird gesendet …</> : <>Unfall melden <ArrowRight size={18} aria-hidden="true" /></>}
              </button>
              <p className="sv-hint" style={{ margin: 0, textAlign: 'center', fontSize: 14 }}>
                Nach dem Absenden erhalten Sie eine Eingangsbestätigung per E-Mail.
              </p>
            </div>
          )}

          {/* ======= STEP 6 – BESTÄTIGUNG ======= */}
          {step === 6 && (
            <div style={stackStyle}>
              <h1 className="sv-h1">Vielen Dank – <em>ist angekommen.</em></h1>
              <p style={{ margin: 0, color: 'var(--sv-body)' }}>
                Ihre Unfallmeldung liegt jetzt bei Morino Stübe. Wir melden uns, falls wir noch etwas brauchen.
                {formData.email && <> Eine Eingangsbestätigung geht an <strong>{formData.email}</strong>.</>}
              </p>
              {reference && (
                <div className="sv-card" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span className="sv-hint">Ihre Vorgangsnummer</span>
                  <span className="sv-ref">{reference}</span>
                </div>
              )}

              <div className="sv-card">
                <dl className="sv-dl">
                  <dt>Anliegen</dt><dd>Unfallmeldung</dd>
                  <dt>Name</dt><dd>{formData.vorname} {formData.nachname}</dd>
                  <dt>Unfall</dt><dd>{formData.datumBekannt === 'ja' ? formData.unfalldatum.split('-').reverse().join('.') : formData.unfalldatumUngefaehr}</dd>
                  <dt>Dateien</dt><dd>{files.length}</dd>
                </dl>
              </div>

              <div className="sv-card" style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 15, color: 'var(--sv-body)' }}>
                <h2 className="sv-section-title" style={{ marginTop: 0 }}>Was Sie jetzt tun können</h2>
                <span>Legen Sie ärztliche Unterlagen bereit (Atteste, Arztberichte, Befunde).</span>
                <span>Falls nötig, füllen Sie die Schweigepflichtentbindung aus.</span>
              </div>

              <a
                href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Hallo Herr Stübe, ich habe soeben einen Unfall über das Service-Center gemeldet${reference ? ` (Vorgang ${reference})` : ''}. Viele Grüße, ${formData.vorname} ${formData.nachname}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="sv-btn sv-btn--ghost"
              >
                <MessageCircle size={18} aria-hidden="true" /> Per WhatsApp nachfragen
              </a>
              <Link href="/service" className="sv-link-btn" style={{ alignSelf: 'center' }}>Weiteres Anliegen erledigen</Link>
            </div>
          )}

        </div>
      </div>
    </ServiceLayout>
  );
}
