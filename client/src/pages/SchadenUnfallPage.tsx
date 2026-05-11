import { useState, useRef, useCallback } from 'react';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";

function Field({
  label, field, required, hint, children, errors
}: {
  label: string;
  field?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  errors?: Record<string, string>;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-400 -mt-0.5">{hint}</p>}
      {children}
      {field && errors?.[field] && <span className="text-xs text-red-500">{errors[field]}</span>}
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

  const inputCls = (field: string) =>
    `w-full p-3 border-2 rounded-xl text-base outline-none transition-colors ${errors[field] ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-[#003781]'}`;

  type StringFormKey = { [K in keyof FormData]: FormData[K] extends string ? K : never }[keyof FormData];

  const renderRadio = (
    field: StringFormKey,
    options: { value: string; label: string }[],
    inline = true
  ) => (
    <div className={`flex ${inline ? 'flex-wrap' : 'flex-col'} gap-2`}>
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => updateField(field, opt.value)}
          className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-colors min-h-[44px] ${
            formData[field] === opt.value
              ? 'bg-[#003781] text-white border-[#003781]'
              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );

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

      await apiRequest('POST', '/api/schaden/submit', {
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

      goToStep(6);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Fehler beim Senden. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercent = Math.round(((step - 1) / (TOTAL_STEPS - 1)) * 100);
  const stepLabels = ['Persönliche Angaben', 'Unfalldaten', 'Gesundheit', 'Weitere Angaben', 'Dokumente & Absenden'];

  return (
    <div className="min-h-screen bg-gray-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <SEO
        title="Unfallschaden melden – ERGO Agentur Stübe Ganderkesee"
        description="Unfallversicherungsschaden bequem online melden. Strukturiertes Formular für Ihre ERGO Unfallversicherung – Agentur Morino Stübe, Ganderkesee."
        keywords="Unfallversicherung Schaden melden, ERGO Unfall, Schadensmeldung Unfallversicherung, Ganderkesee"
        noIndex
      />
      <Breadcrumb items={[{ label: 'Service', href: '/bestandskunden' }, { label: 'Unfall melden' }]} />

      <div className="max-w-[640px] mx-auto px-4 py-6">
        {step <= TOTAL_STEPS && (
          <>
            <div className="flex items-center justify-between mb-3">
              {step > 1 ? (
                <button
                  onClick={() => goToStep(step - 1)}
                  className="text-[#003781] font-semibold text-sm flex items-center gap-1 min-h-[44px]"
                >
                  ← Zurück
                </button>
              ) : (
                <div />
              )}
              <span className="text-xs text-gray-500 font-medium">Schritt {step} von {TOTAL_STEPS} – {stepLabels[step - 1]}</span>
            </div>

            <div className="h-1.5 bg-gray-200 rounded-full mb-1 overflow-hidden">
              <div
                className="h-full bg-[#E2001A] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between mb-5">
              {stepLabels.map((label, i) => (
                <div
                  key={label}
                  className={`text-[9px] font-medium ${i + 1 === step ? 'text-[#E2001A]' : i + 1 < step ? 'text-green-600' : 'text-gray-300'}`}
                  style={{ width: '18%', textAlign: 'center' }}
                >
                  {i + 1 < step ? '✓' : i + 1 === step ? '●' : '○'}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 text-[11px] text-gray-400 mb-5">
              <span>🔒 DSGVO-konform</span>
              <span>·</span>
              <span>⚡ Antwort in 24h</span>
              <span>·</span>
              <span>✅ Kostenlos</span>
            </div>
          </>
        )}

        <div className={fadeClass}>

          {/* ======= STEP 1 ======= */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div className="text-center mb-2">
                <div className="text-4xl mb-2">🚑</div>
                <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Unfall melden</h1>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  Füllen Sie das Formular vollständig aus – Ihr Berater Morino Stübe kümmert sich dann um alles Weitere.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800">
                <strong>Wichtig:</strong> Bei schweren Verletzungen oder Notfällen rufen Sie bitte zuerst <strong>112</strong> an.
                Die ERGO-Schaden-Hotline erreichen Sie kostenlos unter <strong>0800 3746-000</strong>.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field errors={errors} label="Vorname" field="vorname" required>
                  <input type="text" value={formData.vorname} onChange={e => updateField('vorname', e.target.value)} className={inputCls('vorname')} autoComplete="given-name" />
                </Field>
                <Field errors={errors} label="Nachname" field="nachname" required>
                  <input type="text" value={formData.nachname} onChange={e => updateField('nachname', e.target.value)} className={inputCls('nachname')} autoComplete="family-name" />
                </Field>
              </div>

              <Field errors={errors} label="Telefonnummer" field="telefon" required>
                <input type="tel" inputMode="tel" value={formData.telefon} onChange={e => updateField('telefon', e.target.value)} className={inputCls('telefon')} autoComplete="tel" placeholder="z.B. 01234 567890" />
              </Field>

              <Field errors={errors} label="E-Mail-Adresse" field="email" required>
                <input type="email" inputMode="email" value={formData.email} onChange={e => updateField('email', e.target.value)} className={inputCls('email')} autoComplete="email" />
              </Field>

              <Field errors={errors} label="ERGO Versicherungsnummer" field="versicherungsnummer" hint="Falls bekannt – steht auf Ihrem Versicherungsschein">
                <input type="text" value={formData.versicherungsnummer} onChange={e => updateField('versicherungsnummer', e.target.value)} className={inputCls('versicherungsnummer')} placeholder="z.B. 12345678" />
              </Field>

              <Field errors={errors} label="Wer wurde verletzt?" field="verletzterPersonenkreis" required>
                <div className="flex flex-col gap-2">
                  {[
                    { value: 'selbst', label: 'Ich selbst (Versicherungsnehmer)' },
                    { value: 'mitversichert', label: 'Eine mitversicherte Person' },
                    { value: 'andere', label: 'Eine andere Person' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateField('verletzterPersonenkreis', opt.value)}
                      className={`px-4 py-3 rounded-xl border-2 text-sm font-semibold text-left transition-colors min-h-[44px] ${
                        formData.verletzterPersonenkreis === opt.value
                          ? 'bg-[#003781] text-white border-[#003781]'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {errors.verletzterPersonenkreis && <span className="text-xs text-red-500">{errors.verletzterPersonenkreis}</span>}
              </Field>

              {formData.verletzterPersonenkreis === 'andere' && (
                <Field errors={errors} label="Name der verletzten Person" field="verletzterName" required>
                  <input type="text" value={formData.verletzterName} onChange={e => updateField('verletzterName', e.target.value)} className={inputCls('verletzterName')} placeholder="Vor- und Nachname" />
                  {errors.verletzterName && <span className="text-xs text-red-500">{errors.verletzterName}</span>}
                </Field>
              )}

              <Field errors={errors} label="Ansprechpartner für Rückfragen">
                {renderRadio('ansprechpartner', [
                  { value: 'versicherungsnehmer', label: 'Versicherungsnehmer' },
                  { value: 'bevollmaechtigter', label: 'Bevollmächtigte Person' },
                  { value: 'andere', label: 'Andere Person' },
                ], false)}
              </Field>

              <button
                onClick={() => handleNext(1)}
                className="w-full bg-[#E2001A] text-white font-bold py-4 rounded-xl text-base hover:bg-[#c00017] transition-colors min-h-[52px]"
              >
                Weiter zu Schritt 2 →
              </button>
            </div>
          )}

          {/* ======= STEP 2 ======= */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div className="mb-1">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Unfalldaten</h2>
                <p className="text-sm text-gray-500">Bitte schildern Sie den Unfall so genau wie möglich.</p>
              </div>

              <Field errors={errors} label="Wann ist der Unfall passiert?" field="unfalldatum">
                {renderRadio('datumBekannt', [
                  { value: 'ja', label: 'Genaues Datum bekannt' },
                  { value: 'nein', label: 'Datum nicht genau bekannt' },
                ])}
                <div className="mt-2">
                  {formData.datumBekannt === 'ja' ? (
                    <>
                      <input type="date" value={formData.unfalldatum} onChange={e => updateField('unfalldatum', e.target.value)} max={new Date().toISOString().split('T')[0]} className={inputCls('unfalldatum')} />
                      {errors.unfalldatum && <span className="text-xs text-red-500">{errors.unfalldatum}</span>}
                    </>
                  ) : (
                    <>
                      <input type="text" value={formData.unfalldatumUngefaehr} onChange={e => updateField('unfalldatumUngefaehr', e.target.value)} className={inputCls('unfalldatumUngefaehr')} placeholder="z.B. Anfang März 2025, nachmittags" />
                      {errors.unfalldatumUngefaehr && <span className="text-xs text-red-500">{errors.unfalldatumUngefaehr}</span>}
                    </>
                  )}
                </div>
              </Field>

              <Field errors={errors} label="Wo ist der Unfall passiert?">
                {renderRadio('ortBekannt', [
                  { value: 'ja', label: 'Genaue Adresse bekannt' },
                  { value: 'nein', label: 'Ungefährer Ort' },
                ])}
                {formData.ortBekannt === 'ja' ? (
                  <div className="flex flex-col gap-2 mt-2">
                    <input type="text" value={formData.unfallStrasse} onChange={e => updateField('unfallStrasse', e.target.value)} className={inputCls('unfallStrasse')} placeholder="Straße und Hausnummer" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" inputMode="numeric" value={formData.unfallPlz} onChange={e => updateField('unfallPlz', e.target.value)} className={inputCls('unfallPlz')} placeholder="PLZ" maxLength={5} />
                      <input type="text" value={formData.unfallOrt} onChange={e => updateField('unfallOrt', e.target.value)} className={inputCls('unfallOrt')} placeholder="Ort" />
                    </div>
                    <input type="text" value={formData.unfallLand} onChange={e => updateField('unfallLand', e.target.value)} className={inputCls('unfallLand')} placeholder="Land" />
                  </div>
                ) : (
                  <input type="text" value={formData.unfallortBeschreibung} onChange={e => updateField('unfallortBeschreibung', e.target.value)} className={`${inputCls('unfallortBeschreibung')} mt-2`} placeholder="z.B. Fußgängerzone Oldenburg, Sportplatz Ganderkesee" />
                )}
              </Field>

              {formData.ortBekannt === 'ja' && (
                <Field errors={errors} label="Kurze Ortsbeschreibung" hint="z.B. Treppenhaus, Gartenweg, Sportplatz">
                  <input type="text" value={formData.unfallortBeschreibung} onChange={e => updateField('unfallortBeschreibung', e.target.value)} className={inputCls('unfallortBeschreibung')} placeholder="z.B. Treppe im Eigenheim" />
                </Field>
              )}

              <Field errors={errors} label="Art des Unfalls" field="unfallArt" required>
                <select value={formData.unfallArt} onChange={e => updateField('unfallArt', e.target.value)} className={inputCls('unfallArt')}>
                  <option value="">Bitte auswählen …</option>
                  <option value="Sturz">Sturz</option>
                  <option value="Verkehrsunfall">Verkehrsunfall</option>
                  <option value="Sport-/Freizeitunfall">Sport-/Freizeitunfall</option>
                  <option value="Arbeitsunfall">Arbeitsunfall</option>
                  <option value="Haushaltsunfall">Haushaltsunfall</option>
                  <option value="Sonstiges">Sonstiges</option>
                </select>
                {errors.unfallArt && <span className="text-xs text-red-500">{errors.unfallArt}</span>}
              </Field>

              <Field errors={errors} label="Hauptursache des Unfalls" field="unfallUrsache" required>
                <select value={formData.unfallUrsache} onChange={e => updateField('unfallUrsache', e.target.value)} className={inputCls('unfallUrsache')}>
                  <option value="">Bitte auswählen …</option>
                  <option value="Ausrutschen/Stolpern">Ausrutschen / Stolpern</option>
                  <option value="Zusammenstoß">Zusammenstoß</option>
                  <option value="Sturz aus Höhe">Sturz aus der Höhe</option>
                  <option value="Körperliche Überanstrengung">Körperliche Überanstrengung</option>
                  <option value="Fremdeinwirkung">Fremdeinwirkung</option>
                  <option value="Sonstiges">Sonstiges</option>
                </select>
                {errors.unfallUrsache && <span className="text-xs text-red-500">{errors.unfallUrsache}</span>}
              </Field>

              <Field errors={errors} label="Schilderung des Unfallhergangs" field="unfallhergang" required>
                <textarea
                  value={formData.unfallhergang}
                  onChange={e => updateField('unfallhergang', e.target.value)}
                  rows={4}
                  className={inputCls('unfallhergang')}
                  placeholder="Bitte beschreiben Sie genau, wie es zu dem Unfall kam und welche Verletzungen entstanden sind …"
                />
                <div className="text-xs text-gray-400 text-right">{formData.unfallhergang.length} Zeichen (mind. 30)</div>
              </Field>

              <Field errors={errors} label="Wurde der Unfall bei der Polizei gemeldet?">
                {renderRadio('polizeiGemeldet', [
                  { value: 'ja', label: 'Ja' },
                  { value: 'nein', label: 'Nein' },
                ])}
              </Field>

              <button
                onClick={() => handleNext(2)}
                className="w-full bg-[#E2001A] text-white font-bold py-4 rounded-xl text-base hover:bg-[#c00017] transition-colors min-h-[52px]"
              >
                Weiter zu Schritt 3 →
              </button>
            </div>
          )}

          {/* ======= STEP 3 ======= */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              <div className="mb-1">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Gesundheitsfragen</h2>
                <p className="text-sm text-gray-500">Diese Angaben werden für die Schadenbearbeitung benötigt. Alle Felder sind freiwillig, aber hilfreich.</p>
              </div>

              <Field errors={errors} label="Hat die verletzte Person einen anerkannten Pflegegrad?">
                {renderRadio('pflegegrad', [
                  { value: 'nein', label: 'Nein' },
                  { value: 'ja', label: 'Ja' },
                  { value: 'weiss-nicht', label: 'Weiß ich nicht' },
                ])}
              </Field>

              <Field errors={errors} label="Liegt ein ICD-Diagnoseschlüssel (ärztliche Diagnose) vor?" hint="z.B. S52.0 für Radiusfraktur">
                {renderRadio('icdDiagnose', [
                  { value: 'nein', label: 'Nein' },
                  { value: 'ja', label: 'Ja' },
                ])}
              </Field>

              <Field errors={errors} label="Datum der Erstbehandlung" hint="Wann wurde der Arzt / das Krankenhaus zuerst aufgesucht?">
                <input type="date" value={formData.erstbehandlungDatum} onChange={e => updateField('erstbehandlungDatum', e.target.value)} max={new Date().toISOString().split('T')[0]} className={inputCls('erstbehandlungDatum')} />
              </Field>

              <Field errors={errors} label="Hat eine stationäre Krankenhausbehandlung stattgefunden?">
                {renderRadio('stationaer', [
                  { value: 'nein', label: 'Nein' },
                  { value: 'ja', label: 'Ja' },
                  { value: 'weiss-nicht', label: 'Weiß ich nicht' },
                ])}
              </Field>

              <Field errors={errors} label="Hat eine ambulante Operation stattgefunden?">
                {renderRadio('ambulanteOp', [
                  { value: 'nein', label: 'Nein' },
                  { value: 'ja', label: 'Ja' },
                ])}
              </Field>

              <Field errors={errors} label="War oder ist die verletzte Person arbeitsunfähig krankgeschrieben?">
                {renderRadio('arbeitsunfaehig', [
                  { value: 'nein', label: 'Nein' },
                  { value: 'ja', label: 'Ja' },
                  { value: 'weiss-nicht', label: 'Weiß ich nicht' },
                ])}
                {formData.arbeitsunfaehig === 'ja' && (
                  <div className="mt-2 flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">AU von</label>
                        <input type="date" value={formData.auVon} onChange={e => updateField('auVon', e.target.value)} className={inputCls('auVon')} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">AU bis</label>
                        <input type="date" value={formData.auBis} onChange={e => updateField('auBis', e.target.value)} className={inputCls('auBis')} disabled={formData.auNochAktuell === 'ja'} />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={formData.auNochAktuell === 'ja'}
                        onChange={e => updateField('auNochAktuell', e.target.checked ? 'ja' : 'nein')}
                        className="w-4 h-4 accent-[#003781]"
                      />
                      AU dauert noch an (kein Enddatum)
                    </label>
                  </div>
                )}
              </Field>

              <Field errors={errors} label="Wurde eine Tagegeldbescheinigung ausgestellt und eingereicht?">
                {renderRadio('tagegeldbescheinigung', [
                  { value: 'nein', label: 'Nein' },
                  { value: 'ja', label: 'Ja' },
                ])}
              </Field>

              <Field errors={errors} label="Wer hat die Erstbehandlung durchgeführt?">
                {renderRadio('erstbehandler', [
                  { value: 'Hausarzt/Facharzt', label: 'Hausarzt / Facharzt' },
                  { value: 'Krankenhaus', label: 'Krankenhaus' },
                  { value: 'Weiß ich nicht', label: 'Weiß ich nicht' },
                ], false)}
                {(formData.erstbehandler === 'Hausarzt/Facharzt' || formData.erstbehandler === 'Krankenhaus') && (
                  <input type="text" value={formData.erstbehandlerName} onChange={e => updateField('erstbehandlerName', e.target.value)} className={`${inputCls('erstbehandlerName')} mt-2`} placeholder="Name des Arztes / Krankenhauses (optional)" />
                )}
              </Field>

              <Field errors={errors} label="Wird die Behandlung weiterhin durch diesen Erstbehandler fortgesetzt?">
                {renderRadio('weiterbehandlung', [
                  { value: 'ja', label: 'Ja' },
                  { value: 'nein', label: 'Nein' },
                  { value: 'weiss-nicht', label: 'Weiß ich nicht' },
                ])}
              </Field>

              <Field errors={errors} label="Befindet sich die verletzte Person noch in Behandlung?">
                {renderRadio('nochInBehandlung', [
                  { value: 'ja', label: 'Ja' },
                  { value: 'nein', label: 'Nein' },
                  { value: 'weiss-nicht', label: 'Weiß ich nicht' },
                ])}
              </Field>

              <button
                onClick={() => handleNext(3)}
                className="w-full bg-[#E2001A] text-white font-bold py-4 rounded-xl text-base hover:bg-[#c00017] transition-colors min-h-[52px]"
              >
                Weiter zu Schritt 4 →
              </button>
            </div>
          )}

          {/* ======= STEP 4 ======= */}
          {step === 4 && (
            <div className="flex flex-col gap-5">
              <div className="mb-1">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Weitere Angaben & Bankverbindung</h2>
                <p className="text-sm text-gray-500">Fast geschafft! Nur noch wenige Angaben.</p>
              </div>

              <Field errors={errors} label="Sind Ihnen Kosten für ärztliche Nachweise entstanden?" hint="z.B. für Atteste, Bescheinigungen oder Befundberichte">
                {renderRadio('kostenaerztlicheNachweise', [
                  { value: 'nein', label: 'Nein' },
                  { value: 'ja', label: 'Ja' },
                  { value: 'weiss-nicht', label: 'Weiß ich nicht' },
                ])}
              </Field>

              <Field errors={errors} label="Besteht eine weitere Unfallversicherung bei einem anderen Unternehmen?">
                {renderRadio('weitereUnfallversicherung', [
                  { value: 'nein', label: 'Nein' },
                  { value: 'ja', label: 'Ja' },
                  { value: 'weiss-nicht', label: 'Weiß ich nicht' },
                ])}
                {formData.weitereUnfallversicherung === 'ja' && (
                  <input type="text" value={formData.weitereGesellschaft} onChange={e => updateField('weitereGesellschaft', e.target.value)} className={`${inputCls('weitereGesellschaft')} mt-2`} placeholder="Name der Versicherungsgesellschaft (optional)" />
                )}
              </Field>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Wohin soll eine Versicherungsleistung überwiesen werden?
                </label>
                <div className="flex flex-col gap-2">
                  {[
                    { value: 'ergo-konto', label: 'Auf mein bei ERGO hinterlegtes Beitragskonto' },
                    { value: 'anderes-konto', label: 'Auf ein anderes Konto' },
                    { value: 'unbekannt', label: 'Noch nicht bekannt' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateField('bankverbindung', opt.value)}
                      className={`px-4 py-3 rounded-xl border-2 text-sm font-semibold text-left transition-colors min-h-[44px] ${
                        formData.bankverbindung === opt.value
                          ? 'bg-[#003781] text-white border-[#003781]'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {formData.bankverbindung === 'anderes-konto' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={formData.iban}
                      onChange={e => updateField('iban', e.target.value.toUpperCase())}
                      className={inputCls('iban')}
                      placeholder="DE00 0000 0000 0000 0000 00"
                      maxLength={27}
                    />
                    {errors.iban && <span className="text-xs text-red-500 block mt-1">{errors.iban}</span>}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleNext(4)}
                className="w-full bg-[#E2001A] text-white font-bold py-4 rounded-xl text-base hover:bg-[#c00017] transition-colors min-h-[52px]"
              >
                Weiter zu Schritt 5 →
              </button>
            </div>
          )}

          {/* ======= STEP 5 ======= */}
          {step === 5 && (
            <div className="flex flex-col gap-5">
              <div className="mb-1">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Dokumente hochladen & Absenden</h2>
                <p className="text-sm text-gray-500">Laden Sie relevante Dokumente hoch und senden Sie Ihre Schadensmeldung ab.</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Dokumente hochladen <span className="text-gray-400 font-normal">(optional, bis zu 5 Dateien)</span>
                </label>
                <p className="text-xs text-gray-400 mb-3">
                  Ärztliche Berichte, Atteste, Fotos der Verletzung, Tagegeldbescheinigungen, Schweigepflichtentbindung · Max. 10 MB je Datei · PDF, JPG, PNG
                </p>

                <div
                  onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={e => { e.preventDefault(); setIsDragOver(false); handleFiles(e.dataTransfer.files); }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${isDragOver ? 'border-[#003781] bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-white'}`}
                >
                  <div className="text-3xl mb-2">📎</div>
                  <p className="text-sm font-semibold text-gray-700">Dateien hier ablegen</p>
                  <p className="text-xs text-gray-400 mt-1">oder klicken zum Auswählen</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={e => { handleFiles(e.target.files); e.target.value = ''; }}
                  />
                </div>

                {files.length > 0 && (
                  <div className="mt-3 flex flex-col gap-2">
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-3 py-2.5">
                        <span className="text-lg">{f.type === 'application/pdf' ? '📄' : '🖼️'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{f.name}</p>
                          <p className="text-xs text-gray-400">{formatFileSize(f.size)}</p>
                        </div>
                        <button onClick={() => removeFile(i)} className="text-red-400 hover:text-red-600 text-sm font-bold px-2 py-1 min-h-[36px]">✕</button>
                      </div>
                    ))}
                    {files.length < 5 && (
                      <button onClick={() => fileInputRef.current?.click()} className="text-sm text-[#003781] font-medium underline text-left mt-1 min-h-[36px]">
                        + Weitere Datei hinzufügen
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
                <strong>Schweigepflichtentbindung:</strong> Für die Schadenbearbeitung benötigt ERGO ggf. ärztliche Auskünfte.{' '}
                <a
                  href="https://www.ergo.de/de/Service/Schaden/Unfallversicherung"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold"
                >
                  Das offizielle ERGO-Formular zur Schweigepflichtentbindung
                </a>{' '}
                können Sie vorab herunterladen oder Ihr Berater Morino Stübe schickt es Ihnen zu.
              </div>

              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.datenschutz}
                    onChange={e => { updateField('datenschutz', e.target.checked); if (errors.datenschutz) setErrors(prev => { const n = { ...prev }; delete n.datenschutz; return n; }); }}
                    className="w-5 h-5 mt-0.5 accent-[#003781] shrink-0"
                  />
                  <span className="text-sm text-gray-700 leading-snug">
                    Ich habe die{' '}
                    <Link href="/datenschutz" className="text-[#003781] underline" target="_blank">Datenschutzerklärung</Link>{' '}
                    gelesen und bin damit einverstanden, dass meine Daten zur Bearbeitung dieser Schadensmeldung gespeichert und verarbeitet werden. *
                  </span>
                </label>
                {errors.datenschutz && <p className="text-xs text-red-500 mt-1 ml-8">{errors.datenschutz}</p>}
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                  {submitError}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#E2001A] text-white font-bold py-4 rounded-xl text-base hover:bg-[#c00017] transition-colors disabled:opacity-60 min-h-[52px]"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Wird gesendet …
                  </span>
                ) : '🚑 Schaden jetzt melden'}
              </button>

              <p className="text-xs text-gray-400 text-center">
                Ihre Daten werden verschlüsselt übertragen. Nach dem Absenden meldet sich Ihr Berater Morino Stübe innerhalb von 24 Stunden.
              </p>
            </div>
          )}

          {/* ======= STEP 6 – BESTÄTIGUNG ======= */}
          {step === 6 && (
            <div className="text-center py-8 flex flex-col items-center gap-5">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl">✅</div>
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Schadensmeldung eingegangen!</h2>
                <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">
                  Vielen Dank, {formData.vorname}. Ihre Unfallschadensmeldung wurde erfolgreich übermittelt.
                  Ihr Berater Morino Stübe kümmert sich und meldet sich <strong>innerhalb von 24 Stunden</strong> bei Ihnen.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 w-full text-left">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Ihre nächsten Schritte</h3>
                <div className="flex flex-col gap-2.5">
                  {[
                    { icon: '📋', text: 'Bereiten Sie alle ärztlichen Dokumente vor (Atteste, Arztberichte, Befunde).' },
                    { icon: '📝', text: 'Füllen Sie ggf. die Schweigepflichtentbindung aus – Ihr Berater schickt Ihnen das Formular.' },
                    { icon: '💬', text: 'Bei dringenden Fragen: WhatsApp an Morino Stübe oder ERGO-Hotline 0800 3746-000.' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="text-lg shrink-0">{item.icon}</span>
                      <p className="text-sm text-gray-600">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <a
                  href={`https://wa.me/15566771019?text=${encodeURIComponent(`Hallo Herr Stübe, ich habe gerade meinen Unfallschaden über das Online-Formular gemeldet. Können Sie mir kurz bestätigen, dass Sie es erhalten haben? (Name: ${formData.vorname} ${formData.nachname})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#25d366] text-white font-bold px-5 py-3.5 rounded-xl hover:bg-[#1da851] transition-colors text-sm min-h-[48px]"
                >
                  💬 WhatsApp-Bestätigung
                </a>
                <Link href="/bestandskunden" className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-800 font-bold px-5 py-3.5 rounded-xl hover:bg-gray-200 transition-colors text-sm min-h-[48px]">
                  ← Zurück zum Service
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
