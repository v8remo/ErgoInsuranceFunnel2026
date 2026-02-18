import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

type DamageType = 'kfz' | 'hausrat' | 'gebaeude' | 'rechtsschutz' | 'bu' | 'sonstiges';

interface FormData {
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  versicherungsnummer: string;
  schadendatum: string;
  schadenort: string;
  beschreibung: string;
  polizeiGemeldet: string;
  geschaetzterSchaden: string;
  kennzeichen: string;
  unfallgegner: string;
  gegnerName: string;
  gegnerKennzeichen: string;
  fahrbereit: string;
  betroffeneRaeume: string;
  ursache: string;
  notmassnahmen: string;
  gegenseite: string;
  rechtsstreitArt: string;
  anwaltBeauftragt: string;
  erkrankung: string;
  arbeitsunfaehigSeit: string;
  arztAufgesucht: string;
  weitereDetails: string;
}

const initialFormData: FormData = {
  vorname: '',
  nachname: '',
  email: '',
  telefon: '',
  versicherungsnummer: '',
  schadendatum: new Date().toISOString().split('T')[0],
  schadenort: '',
  beschreibung: '',
  polizeiGemeldet: 'nein',
  geschaetzterSchaden: '',
  kennzeichen: '',
  unfallgegner: 'nein',
  gegnerName: '',
  gegnerKennzeichen: '',
  fahrbereit: 'ja',
  betroffeneRaeume: '',
  ursache: '',
  notmassnahmen: 'nein',
  gegenseite: '',
  rechtsstreitArt: '',
  anwaltBeauftragt: 'nein',
  erkrankung: '',
  arbeitsunfaehigSeit: '',
  arztAufgesucht: 'nein',
  weitereDetails: '',
};

const damageTypes: { type: DamageType; icon: string; title: string }[] = [
  { type: 'kfz', icon: '🚗', title: 'Kfz-Schaden' },
  { type: 'hausrat', icon: '🏠', title: 'Hausrat-Schaden' },
  { type: 'gebaeude', icon: '🏚️', title: 'Gebäudeschaden' },
  { type: 'rechtsschutz', icon: '⚖️', title: 'Rechtsschutz-Fall' },
  { type: 'bu', icon: '💼', title: 'Berufsunfähigkeit' },
  { type: 'sonstiges', icon: '📋', title: 'Sonstiger Schaden' },
];

const damageTypeLabels: Record<DamageType, { icon: string; title: string }> = {
  kfz: { icon: '🚗', title: 'Kfz-Schaden' },
  hausrat: { icon: '🏠', title: 'Hausrat-Schaden' },
  gebaeude: { icon: '🏚️', title: 'Gebäudeschaden' },
  rechtsschutz: { icon: '⚖️', title: 'Rechtsschutz-Fall' },
  bu: { icon: '💼', title: 'Berufsunfähigkeit' },
  sonstiges: { icon: '📋', title: 'Sonstiger Schaden' },
};

export default function SchadenPage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<DamageType | null>(null);
  const [formData, setFormData] = useState<FormData>({ ...initialFormData });
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirm1, setConfirm1] = useState(false);
  const [confirm2, setConfirm2] = useState(false);
  const [fadeClass, setFadeClass] = useState('opacity-100 translate-y-0 transition-all duration-300');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get('type') as DamageType | null;
    if (typeParam && ['kfz', 'hausrat', 'gebaeude', 'rechtsschutz', 'bu', 'sonstiges'].includes(typeParam)) {
      setSelectedType(typeParam);
      setStep(2);
    }
  }, []);

  const goToStep = useCallback((next: number) => {
    setFadeClass('opacity-0 translate-y-2 transition-all duration-150');
    setTimeout(() => {
      setStep(next);
      setFadeClass('opacity-100 translate-y-0 transition-all duration-300');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 150);
  }, []);

  const handleSelectType = (type: DamageType) => {
    setSelectedType(type);
    setFormData({ ...initialFormData });
    setFiles([]);
    setErrors({});
    goToStep(2);
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const valid: File[] = [];
    for (let i = 0; i < newFiles.length; i++) {
      const f = newFiles[i];
      if (f.size > 5 * 1024 * 1024) continue;
      if (files.length + valid.length >= 5) break;
      valid.push(f);
    }
    setFiles(prev => [...prev, ...valid].slice(0, 5));
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep2 = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.vorname.trim()) e.vorname = 'Pflichtfeld';
    if (!formData.nachname.trim()) e.nachname = 'Pflichtfeld';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) e.email = 'Gültige E-Mail eingeben';
    if (!formData.telefon.trim()) e.telefon = 'Pflichtfeld';
    if (!formData.versicherungsnummer.trim()) e.versicherungsnummer = 'Pflichtfeld';
    if (!formData.schadendatum) e.schadendatum = 'Pflichtfeld';
    if (!formData.schadenort.trim()) e.schadenort = 'Pflichtfeld';
    if (!formData.beschreibung.trim() || formData.beschreibung.trim().length < 20) e.beschreibung = 'Mindestens 20 Zeichen erforderlich';

    if (selectedType === 'kfz') {
      if (!formData.kennzeichen.trim()) e.kennzeichen = 'Pflichtfeld';
      if (formData.unfallgegner === 'ja') {
        if (!formData.gegnerName.trim()) e.gegnerName = 'Pflichtfeld';
        if (!formData.gegnerKennzeichen.trim()) e.gegnerKennzeichen = 'Pflichtfeld';
      }
    }
    if (selectedType === 'hausrat' || selectedType === 'gebaeude') {
      if (!formData.betroffeneRaeume.trim()) e.betroffeneRaeume = 'Pflichtfeld';
      if (!formData.ursache) e.ursache = 'Pflichtfeld';
    }
    if (selectedType === 'rechtsschutz') {
      if (!formData.gegenseite.trim()) e.gegenseite = 'Pflichtfeld';
      if (!formData.rechtsstreitArt) e.rechtsstreitArt = 'Pflichtfeld';
    }
    if (selectedType === 'bu') {
      if (!formData.erkrankung.trim()) e.erkrankung = 'Pflichtfeld';
      if (!formData.arbeitsunfaehigSeit) e.arbeitsunfaehigSeit = 'Pflichtfeld';
    }
    if (selectedType === 'sonstiges') {
      if (!formData.weitereDetails.trim() || formData.weitereDetails.trim().length < 10) e.weitereDetails = 'Mindestens 10 Zeichen erforderlich';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleStep2Next = () => {
    if (validateStep2()) {
      goToStep(3);
    }
  };

  const buildExtraFields = (): string => {
    const lines: string[] = [];
    if (selectedType === 'kfz') {
      lines.push(`Kennzeichen: ${formData.kennzeichen}`);
      lines.push(`Unfallgegner: ${formData.unfallgegner}`);
      if (formData.unfallgegner === 'ja') {
        lines.push(`Name des Gegners: ${formData.gegnerName}`);
        lines.push(`Kennzeichen des Gegners: ${formData.gegnerKennzeichen}`);
      }
      lines.push(`Fahrzeug fahrbereit: ${formData.fahrbereit}`);
    }
    if (selectedType === 'hausrat' || selectedType === 'gebaeude') {
      lines.push(`Betroffene Räume: ${formData.betroffeneRaeume}`);
      lines.push(`Ursache: ${formData.ursache}`);
      lines.push(`Notmaßnahmen ergriffen: ${formData.notmassnahmen}`);
    }
    if (selectedType === 'rechtsschutz') {
      lines.push(`Gegenseite: ${formData.gegenseite}`);
      lines.push(`Art des Rechtsstreits: ${formData.rechtsstreitArt}`);
      lines.push(`Anwalt beauftragt: ${formData.anwaltBeauftragt}`);
    }
    if (selectedType === 'bu') {
      lines.push(`Erkrankung/Ursache: ${formData.erkrankung}`);
      lines.push(`Arbeitsunfähig seit: ${formData.arbeitsunfaehigSeit}`);
      lines.push(`Arzt aufgesucht: ${formData.arztAufgesucht}`);
    }
    if (selectedType === 'sonstiges') {
      lines.push(`Weitere Details: ${formData.weitereDetails}`);
    }
    return lines.join('\n');
  };

  const buildSummary = (): string => {
    const lines: string[] = [];
    lines.push(`Schadensart: ${damageTypeLabels[selectedType!].title}`);
    lines.push(`Name: ${formData.vorname} ${formData.nachname}`);
    lines.push(`E-Mail: ${formData.email}`);
    lines.push(`Telefon: ${formData.telefon}`);
    lines.push(`Versicherungsnummer: ${formData.versicherungsnummer}`);
    lines.push(`Schadendatum: ${formData.schadendatum}`);
    lines.push(`Schadenort: ${formData.schadenort}`);
    lines.push(`Beschreibung: ${formData.beschreibung}`);
    lines.push(`Polizeilich gemeldet: ${formData.polizeiGemeldet}`);
    if (formData.geschaetzterSchaden) lines.push(`Geschätzter Schaden: ${formData.geschaetzterSchaden} €`);
    const extra = buildExtraFields();
    if (extra) lines.push(extra);
    lines.push(`Anzahl Dateien: ${files.length}`);
    return lines.join('\n');
  };

  const handleSubmit = async () => {
    const errs: Record<string, string> = {};
    if (!confirm1) errs.confirm1 = 'Bitte bestätigen.';
    if (!confirm2) errs.confirm2 = 'Bitte bestätigen.';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const fileAttachments: { filename: string; content: string }[] = [];
      for (const file of files) {
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = '';
        const chunkSize = 8192;
        for (let i = 0; i < bytes.length; i += chunkSize) {
          binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
        }
        fileAttachments.push({ filename: file.name, content: btoa(binary) });
      }

      await apiRequest('POST', '/api/schaden/submit', {
        damageType: damageTypeLabels[selectedType!].title,
        customerName: `${formData.vorname} ${formData.nachname}`,
        customerEmail: formData.email,
        customerPhone: formData.telefon,
        insuranceNumber: formData.versicherungsnummer,
        damageDate: formData.schadendatum,
        damageLocation: formData.schadenort,
        damageDescription: formData.beschreibung,
        policeReport: formData.polizeiGemeldet,
        estimatedDamage: formData.geschaetzterSchaden || null,
        extraFields: buildExtraFields(),
        attachmentsCount: files.length,
        summary: buildSummary(),
        fileAttachments,
      });
      goToStep(4);
    } catch (err: any) {
      setSubmitError(err.message || 'Fehler beim Senden. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = (field: string) =>
    `w-full p-3 border-2 rounded-xl text-base outline-none transition-colors ${errors[field] ? 'border-red-500' : 'border-gray-200 focus:border-[#003781]'}`;

  const renderRadioGroup = (field: keyof FormData, options: { value: string; label: string }[]) => (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => updateField(field, opt.value)}
          className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-colors ${
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

  const progressPercent = step === 1 ? 33 : step === 2 ? 66 : 100;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="max-w-[600px] mx-auto px-5 py-6">
        {step < 4 && (
          <>
            <div className="flex items-center justify-between mb-4">
              {step > 1 ? (
                <button onClick={() => goToStep(step - 1)} className="text-[#003781] font-semibold text-sm flex items-center gap-1 min-h-[44px]">
                  ← Zurück
                </button>
              ) : (
                <div />
              )}
              <span className="text-xs text-gray-500 font-medium">
                Schritt {Math.min(step, 3)} von 3
              </span>
            </div>
            <div className="h-1 bg-gray-200 rounded-full mb-6 overflow-hidden">
              <div className="h-full bg-[#E2001A] rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
            </div>
          </>
        )}

        <div className={fadeClass}>

          {step === 1 && (
            <div>
              <div className="text-center mb-6">
                <div className="inline-block bg-[#E2001A] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">ERGO</div>
                <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Schaden melden</h1>
                <p className="text-sm text-gray-500">Wählen Sie die Art des Schadens aus</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {damageTypes.map(card => (
                  <button
                    key={card.type}
                    onClick={() => handleSelectType(card.type)}
                    className="bg-white border-2 border-gray-200 rounded-xl p-4 text-center flex flex-col items-center gap-2 transition-colors active:border-[#E2001A] hover:border-[#E2001A]"
                  >
                    <span className="text-3xl">{card.icon}</span>
                    <span className="font-bold text-gray-900 text-sm">{card.title}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link href="/" className="text-sm text-[#003781] font-medium">← Zurück zur Startseite</Link>
              </div>
            </div>
          )}

          {step === 2 && selectedType && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{damageTypeLabels[selectedType].icon} {damageTypeLabels[selectedType].title}</h2>
              <p className="text-sm text-gray-500 mb-5">Bitte füllen Sie alle Pflichtfelder (*) aus.</p>
              <div className="flex flex-col gap-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700">Vorname *</label>
                    <input type="text" value={formData.vorname} onChange={e => updateField('vorname', e.target.value)} className={inputCls('vorname')} />
                    {errors.vorname && <span className="text-xs text-red-500">{errors.vorname}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700">Nachname *</label>
                    <input type="text" value={formData.nachname} onChange={e => updateField('nachname', e.target.value)} className={inputCls('nachname')} />
                    {errors.nachname && <span className="text-xs text-red-500">{errors.nachname}</span>}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">E-Mail *</label>
                  <input type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} className={inputCls('email')} />
                  {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">Telefon *</label>
                  <input type="tel" value={formData.telefon} onChange={e => updateField('telefon', e.target.value)} className={inputCls('telefon')} />
                  {errors.telefon && <span className="text-xs text-red-500">{errors.telefon}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">Versicherungsnummer *</label>
                  <input type="text" value={formData.versicherungsnummer} onChange={e => updateField('versicherungsnummer', e.target.value)} className={inputCls('versicherungsnummer')} />
                  {errors.versicherungsnummer && <span className="text-xs text-red-500">{errors.versicherungsnummer}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">Schadendatum *</label>
                  <input type="date" value={formData.schadendatum} onChange={e => updateField('schadendatum', e.target.value)} className={inputCls('schadendatum')} />
                  {errors.schadendatum && <span className="text-xs text-red-500">{errors.schadendatum}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">Schadenort *</label>
                  <input type="text" value={formData.schadenort} onChange={e => updateField('schadenort', e.target.value)} placeholder="Straße, Ort wo der Schaden passiert ist" className={inputCls('schadenort')} />
                  {errors.schadenort && <span className="text-xs text-red-500">{errors.schadenort}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">Schadensbeschreibung *</label>
                  <textarea value={formData.beschreibung} onChange={e => updateField('beschreibung', e.target.value)} placeholder="Bitte beschreiben Sie den Schaden so genau wie möglich..." rows={4} className={inputCls('beschreibung')} />
                  {errors.beschreibung && <span className="text-xs text-red-500">{errors.beschreibung}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">Bereits polizeilich gemeldet?</label>
                  {renderRadioGroup('polizeiGemeldet', [
                    { value: 'ja', label: 'Ja' },
                    { value: 'nein', label: 'Nein' },
                    { value: 'nicht_zutreffend', label: 'Nicht zutreffend' },
                  ])}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">Geschätzter Schaden in €</label>
                  <input type="number" value={formData.geschaetzterSchaden} onChange={e => updateField('geschaetzterSchaden', e.target.value)} className={inputCls('geschaetzterSchaden')} />
                </div>

                {selectedType === 'kfz' && (
                  <>
                    <div className="border-t border-gray-200 pt-4 mt-2">
                      <h3 className="text-base font-bold text-gray-900 mb-3">🚗 Kfz-spezifische Angaben</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Kennzeichen *</label>
                      <input type="text" value={formData.kennzeichen} onChange={e => updateField('kennzeichen', e.target.value)} className={inputCls('kennzeichen')} />
                      {errors.kennzeichen && <span className="text-xs text-red-500">{errors.kennzeichen}</span>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Unfallgegner vorhanden?</label>
                      {renderRadioGroup('unfallgegner', [
                        { value: 'ja', label: 'Ja' },
                        { value: 'nein', label: 'Nein' },
                      ])}
                    </div>
                    {formData.unfallgegner === 'ja' && (
                      <>
                        <div className="flex flex-col gap-1">
                          <label className="text-sm font-semibold text-gray-700">Name des Gegners</label>
                          <input type="text" value={formData.gegnerName} onChange={e => updateField('gegnerName', e.target.value)} className={inputCls('gegnerName')} />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-sm font-semibold text-gray-700">Kennzeichen des Gegners</label>
                          <input type="text" value={formData.gegnerKennzeichen} onChange={e => updateField('gegnerKennzeichen', e.target.value)} className={inputCls('gegnerKennzeichen')} />
                        </div>
                      </>
                    )}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Fahrzeug fahrbereit?</label>
                      {renderRadioGroup('fahrbereit', [
                        { value: 'ja', label: 'Ja' },
                        { value: 'nein', label: 'Nein' },
                      ])}
                    </div>
                  </>
                )}

                {(selectedType === 'hausrat' || selectedType === 'gebaeude') && (
                  <>
                    <div className="border-t border-gray-200 pt-4 mt-2">
                      <h3 className="text-base font-bold text-gray-900 mb-3">{selectedType === 'hausrat' ? '🏠' : '🏚️'} Weitere Angaben</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Betroffene Räume/Bereiche</label>
                      <input type="text" value={formData.betroffeneRaeume} onChange={e => updateField('betroffeneRaeume', e.target.value)} className={inputCls('betroffeneRaeume')} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Ursache</label>
                      <select value={formData.ursache} onChange={e => updateField('ursache', e.target.value)} className={`${inputCls('ursache')} bg-white`}>
                        <option value="">Bitte auswählen</option>
                        <option value="Einbruch">Einbruch</option>
                        <option value="Wasserschaden">Wasserschaden</option>
                        <option value="Sturm/Hagel">Sturm/Hagel</option>
                        <option value="Brand">Brand</option>
                        <option value="Sonstiges">Sonstiges</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Wurden bereits Notmaßnahmen ergriffen?</label>
                      {renderRadioGroup('notmassnahmen', [
                        { value: 'ja', label: 'Ja' },
                        { value: 'nein', label: 'Nein' },
                      ])}
                    </div>
                  </>
                )}

                {selectedType === 'rechtsschutz' && (
                  <>
                    <div className="border-t border-gray-200 pt-4 mt-2">
                      <h3 className="text-base font-bold text-gray-900 mb-3">⚖️ Rechtsschutz-Angaben</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Gegenseite</label>
                      <input type="text" value={formData.gegenseite} onChange={e => updateField('gegenseite', e.target.value)} placeholder="Name/Firma des Gegners" className={inputCls('gegenseite')} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Art des Rechtsstreits</label>
                      <select value={formData.rechtsstreitArt} onChange={e => updateField('rechtsstreitArt', e.target.value)} className={`${inputCls('rechtsstreitArt')} bg-white`}>
                        <option value="">Bitte auswählen</option>
                        <option value="Arbeitsrecht">Arbeitsrecht</option>
                        <option value="Verkehrsrecht">Verkehrsrecht</option>
                        <option value="Mietrecht">Mietrecht</option>
                        <option value="Vertragsrecht">Vertragsrecht</option>
                        <option value="Sonstiges">Sonstiges</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Anwalt bereits beauftragt?</label>
                      {renderRadioGroup('anwaltBeauftragt', [
                        { value: 'ja', label: 'Ja' },
                        { value: 'nein', label: 'Nein' },
                      ])}
                    </div>
                  </>
                )}

                {selectedType === 'bu' && (
                  <>
                    <div className="border-t border-gray-200 pt-4 mt-2">
                      <h3 className="text-base font-bold text-gray-900 mb-3">💼 BU-spezifische Angaben</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Erkrankung/Ursache</label>
                      <input type="text" value={formData.erkrankung} onChange={e => updateField('erkrankung', e.target.value)} className={inputCls('erkrankung')} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Arbeitsunfähig seit</label>
                      <input type="date" value={formData.arbeitsunfaehigSeit} onChange={e => updateField('arbeitsunfaehigSeit', e.target.value)} className={inputCls('arbeitsunfaehigSeit')} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Arzt bereits aufgesucht?</label>
                      {renderRadioGroup('arztAufgesucht', [
                        { value: 'ja', label: 'Ja' },
                        { value: 'nein', label: 'Nein' },
                      ])}
                    </div>
                  </>
                )}

                {selectedType === 'sonstiges' && (
                  <>
                    <div className="border-t border-gray-200 pt-4 mt-2">
                      <h3 className="text-base font-bold text-gray-900 mb-3">📋 Weitere Angaben</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Weitere Details</label>
                      <textarea value={formData.weitereDetails} onChange={e => updateField('weitereDetails', e.target.value)} rows={3} className={inputCls('weitereDetails')} />
                    </div>
                  </>
                )}

                <div className="border-t border-gray-200 pt-4 mt-2">
                  <h3 className="text-base font-bold text-gray-900 mb-3">📷 Fotos & Dokumente anhängen (optional)</h3>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={e => { e.preventDefault(); setIsDragOver(false); handleFiles(e.dataTransfer.files); }}
                    className={`border-dashed border-2 rounded-xl p-6 text-center cursor-pointer transition-colors ${
                      isDragOver ? 'border-[#003781] bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <p className="text-sm text-gray-500">Dateien hierher ziehen oder klicken zum Auswählen</p>
                    <p className="text-xs text-gray-400 mt-1">Max. 5 Dateien, je max. 5 MB (Bilder & PDF)</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    multiple
                    className="hidden"
                    onChange={e => { handleFiles(e.target.files); e.target.value = ''; }}
                  />
                  {files.length > 0 && (
                    <div className="flex flex-col gap-2 mt-3">
                      {files.map((file, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-2">
                          {file.type.startsWith('image/') ? (
                            <img src={URL.createObjectURL(file)} alt="" className="w-12 h-12 object-cover rounded-lg" />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-500">PDF</div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                          </div>
                          <button onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-500 text-xl font-bold px-2">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleStep2Next}
                  className="w-full min-h-[48px] bg-[#E2001A] text-white rounded-xl font-semibold text-base hover:bg-[#c5001a] transition-colors mt-2"
                >
                  Weiter zur Übersicht →
                </button>
              </div>
            </div>
          )}

          {step === 3 && selectedType && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Zusammenfassung</h2>

              <div className="bg-gray-50 rounded-xl p-5 flex flex-col gap-3 mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{damageTypeLabels[selectedType].icon}</span>
                  <span className="font-bold text-gray-900">{damageTypeLabels[selectedType].title}</span>
                </div>
                <div className="flex flex-col gap-1.5 text-sm text-gray-700">
                  <p><span className="font-semibold">Name:</span> {formData.vorname} {formData.nachname}</p>
                  <p><span className="font-semibold">Schadendatum:</span> {formData.schadendatum}</p>
                  <p><span className="font-semibold">Schadenort:</span> {formData.schadenort}</p>
                  <p><span className="font-semibold">Beschreibung:</span> {formData.beschreibung.length > 200 ? formData.beschreibung.slice(0, 200) + '...' : formData.beschreibung}</p>
                  <p><span className="font-semibold">Anzahl Dateien:</span> {files.length}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">Alles korrekt? Bitte prüfen Sie Ihre Angaben.</p>
              </div>

              <div className="flex flex-col gap-3 mb-5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={confirm1} onChange={e => { setConfirm1(e.target.checked); if (errors.confirm1) setErrors(prev => { const n = { ...prev }; delete n.confirm1; return n; }); }} className="mt-1 w-4 h-4 accent-[#003781]" />
                  <span className="text-sm text-gray-700">Alle Angaben sind korrekt und vollständig.</span>
                </label>
                {errors.confirm1 && <span className="text-xs text-red-500 ml-7">{errors.confirm1}</span>}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={confirm2} onChange={e => { setConfirm2(e.target.checked); if (errors.confirm2) setErrors(prev => { const n = { ...prev }; delete n.confirm2; return n; }); }} className="mt-1 w-4 h-4 accent-[#003781]" />
                  <span className="text-sm text-gray-700">Ich bin mit der elektronischen Übermittlung einverstanden.</span>
                </label>
                {errors.confirm2 && <span className="text-xs text-red-500 ml-7">{errors.confirm2}</span>}
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-sm text-red-700">{submitError}</div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full min-h-[48px] bg-[#E2001A] text-white rounded-xl font-semibold text-base hover:bg-[#c5001a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Wird übermittelt...' : '🚨 Schaden jetzt melden'}
              </button>
            </div>
          )}

          {step === 4 && selectedType && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <svg className="w-20 h-20" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="#22c55e" strokeWidth="4" className="animate-[scaleIn_0.4s_ease-out]" style={{ transformOrigin: 'center' }} />
                  <path d="M24 42 L34 52 L56 30" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 60, strokeDashoffset: 60, animation: 'checkDraw 0.5s 0.3s ease-out forwards' }} />
                </svg>
              </div>
              <style>{`
                @keyframes checkDraw {
                  to { stroke-dashoffset: 0; }
                }
                @keyframes scaleIn {
                  from { transform: scale(0); }
                  to { transform: scale(1); }
                }
              `}</style>

              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">✅ Schadensmeldung eingegangen!</h2>
              <p className="text-sm text-gray-600 mb-5">Morino Stübe wurde informiert und wird sich schnellstmöglich bei Ihnen melden.</p>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-left">
                <p className="text-sm font-semibold text-amber-800">⚠️ Bei dringendem Notfall rufen Sie bitte direkt an:</p>
                <a href="tel:015566771019" className="text-base font-bold text-[#003781] underline mt-1 inline-block">015566771019</a>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 mb-5 text-left flex flex-col gap-1.5 text-sm">
                <p><span className="font-semibold">Schadensart:</span> {damageTypeLabels[selectedType].icon} {damageTypeLabels[selectedType].title}</p>
                <p><span className="font-semibold">Name:</span> {formData.vorname} {formData.nachname}</p>
                <p><span className="font-semibold">Eingereicht am:</span> {new Date().toLocaleDateString('de-DE')}</p>
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href="https://wa.me/4915566771019?text=Hallo%20Herr%20St%C3%BCbe%2C%20ich%20habe%20gerade%20eine%20Schadensmeldung%20eingereicht."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[48px] bg-[#25D366] text-white rounded-xl font-semibold text-base flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors"
                >
                  💬 WhatsApp schreiben
                </a>
                <Link href="/" className="w-full min-h-[48px] border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-base flex items-center justify-center hover:bg-gray-50 transition-colors">
                  ← Zurück zur Startseite
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}