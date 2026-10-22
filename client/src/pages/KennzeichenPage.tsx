import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowRight, Bike, Car, Check, ChevronLeft, Copy, FileText, Info, MessageCircle, Upload, X } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import SEO from "@/components/SEO";
import ServiceLayout, { WHATSAPP_URL, PHONE_HREF, PHONE_DISPLAY } from "@/components/service/ServiceLayout";

type KennzeichenType = 'evb' | 'kennzeichen';

interface AbeFile {
  file: File;
  preview?: string;
}

interface FormData {
  vorname: string;
  nachname: string;
  geburtsdatum: string;
  strasse: string;
  plz: string;
  ort: string;
  email: string;
  telefon: string;
  fahrzeugart: string;
  fahrzeughersteller: string;
  fahrzeugmodell: string;
  erstzulassung: string;
  fin: string;
  bisherigVersicherer: string;
  bisherigSfKlasse: string;
  jaehrlicheFahrleistung: string;
  hauptfahrer: string;
  hauptfahrerName: string;
  hauptfahrerGeburtsdatum: string;
  versicherungsbeginn: string;
  versicherungsartHaftpflicht: boolean;
  versicherungsartTeilkasko: boolean;
  versicherungsartVollkasko: boolean;
  versicherungsartSchutzbrief: boolean;
  hinweise: string;
  hubraum: string;
  hoechstgeschwindigkeit: string;
  bisherigVersichert: string;
  bisherigesKennzeichen: string;
  versicherungsumfang: string;
}

const initialFormData: FormData = {
  vorname: '', nachname: '', geburtsdatum: '', strasse: '', plz: '', ort: '', email: '', telefon: '',
  fahrzeugart: '', fahrzeughersteller: '', fahrzeugmodell: '', erstzulassung: '', fin: '',
  bisherigVersicherer: '', bisherigSfKlasse: '', jaehrlicheFahrleistung: '', hauptfahrer: 'selbst',
  hauptfahrerName: '', hauptfahrerGeburtsdatum: '', versicherungsbeginn: '',
  versicherungsartHaftpflicht: true, versicherungsartTeilkasko: false,
  versicherungsartVollkasko: false, versicherungsartSchutzbrief: false, hinweise: '',
  hubraum: '', hoechstgeschwindigkeit: '', bisherigVersichert: 'nein', bisherigesKennzeichen: '',
  versicherungsumfang: 'haftpflicht',
};

const PREMIUM_MONTHS = ['2026-03','2026-04','2026-05','2026-06','2026-07','2026-08','2026-09','2026-10','2026-11','2026-12','2027-01','2027-02'];

const PREMIUM_TABLE: Record<string, Record<string, Record<string, number>>> = {
  "E-Scooter": {
    "haftpflicht_teilkasko": { "2026-03": 69.00, "2026-04": 62.09, "2026-05": 55.19, "2026-06": 51.75, "2026-07": 48.29, "2026-08": 41.39, "2026-09": 34.51, "2026-10": 27.61, "2026-11": 20.70, "2026-12": 17.25, "2027-01": 10.35, "2027-02": 10.35 },
    "haftpflicht": { "2026-03": 42.00, "2026-04": 37.79, "2026-05": 33.59, "2026-06": 31.50, "2026-07": 29.39, "2026-08": 25.19, "2026-09": 21.00, "2026-10": 16.80, "2026-11": 12.60, "2026-12": 10.50, "2027-01": 6.30, "2027-02": 6.30 },
  },
  "Mofa / Moped / Mokick / Roller": {
    "haftpflicht_teilkasko": { "2026-03": 111.00, "2026-04": 99.90, "2026-05": 88.80, "2026-06": 83.25, "2026-07": 77.70, "2026-08": 66.59, "2026-09": 55.52, "2026-10": 44.41, "2026-11": 33.30, "2026-12": 27.75, "2027-01": 16.65, "2027-02": 16.65 },
    "haftpflicht": { "2026-03": 79.00, "2026-04": 71.10, "2026-05": 63.20, "2026-06": 59.25, "2026-07": 55.30, "2026-08": 47.40, "2026-09": 39.51, "2026-10": 31.61, "2026-11": 23.70, "2026-12": 19.75, "2027-01": 11.85, "2027-02": 11.85 },
  },
  "Segway": {
    "haftpflicht_teilkasko": { "2026-03": 97.00, "2026-04": 87.30, "2026-05": 77.60, "2026-06": 72.76, "2026-07": 67.89, "2026-08": 58.19, "2026-09": 48.50, "2026-10": 38.80, "2026-11": 29.10, "2026-12": 24.26, "2027-01": 14.55, "2027-02": 14.55 },
    "haftpflicht": { "2026-03": 60.00, "2026-04": 54.00, "2026-05": 48.00, "2026-06": 45.01, "2026-07": 42.00, "2026-08": 36.00, "2026-09": 30.00, "2026-10": 24.00, "2026-11": 18.00, "2026-12": 15.01, "2027-01": 9.00, "2027-02": 9.00 },
  },
  "S-Pedelec": {
    "haftpflicht_teilkasko": { "2026-03": 111.00, "2026-04": 99.90, "2026-05": 88.80, "2026-06": 83.27, "2026-07": 77.71, "2026-08": 66.60, "2026-09": 55.50, "2026-10": 44.40, "2026-11": 33.30, "2026-12": 27.77, "2027-01": 16.66, "2027-02": 16.66 },
    "haftpflicht": { "2026-03": 62.00, "2026-04": 55.80, "2026-05": 49.60, "2026-06": 46.51, "2026-07": 43.40, "2026-08": 37.20, "2026-09": 31.00, "2026-10": 24.80, "2026-11": 18.60, "2026-12": 15.51, "2027-01": 9.31, "2027-02": 9.31 },
  },
  "Krankenfahrstuhl": {
    "haftpflicht_teilkasko": { "2026-03": 96.01, "2026-04": 86.42, "2026-05": 76.80, "2026-06": 72.01, "2026-07": 67.21, "2026-08": 57.61, "2026-09": 48.02, "2026-10": 38.40, "2026-11": 28.81, "2026-12": 24.00, "2027-01": 14.40, "2027-02": 14.40 },
    "haftpflicht": { "2026-03": 75.01, "2026-04": 67.51, "2026-05": 60.00, "2026-06": 56.25, "2026-07": 52.50, "2026-08": 45.01, "2026-09": 37.51, "2026-10": 30.00, "2026-11": 22.50, "2026-12": 18.75, "2027-01": 11.25, "2027-02": 11.25 },
  },
};

const MONTH_LABELS: Record<string, string> = {
  "2026-03": "März 2026",
  "2026-04": "April 2026",
  "2026-05": "Mai 2026",
  "2026-06": "Juni 2026",
  "2026-07": "Juli 2026",
  "2026-08": "August 2026",
  "2026-09": "September 2026",
  "2026-10": "Oktober 2026",
  "2026-11": "November 2026",
  "2026-12": "Dezember 2026",
  "2027-01": "Januar 2027",
  "2027-02": "Februar 2027",
};

const VEHICLE_SHORT_NAMES: Record<string, string> = {
  "E-Scooter": "E-Scooter",
  "Mofa / Moped / Mokick / Roller": "Moped",
  "Segway": "Segway",
  "S-Pedelec": "S-Pedelec",
  "Krankenfahrstuhl": "KFS",
};

function getPremium(fahrzeugart: string, versicherungsumfang: string, versicherungsbeginn: string): number | null {
  if (!fahrzeugart || !versicherungsumfang || !versicherungsbeginn) return null;
  const cat = PREMIUM_TABLE[fahrzeugart];
  if (!cat) return null;
  const cov = cat[versicherungsumfang];
  if (!cov) return null;
  const price = cov[versicherungsbeginn];
  return price !== undefined ? price : null;
}

function getVersicherungszeitraum(versicherungsbeginn: string): string {
  if (!versicherungsbeginn) return '';
  const [y, m] = versicherungsbeginn.split('-');
  return `01.${m}.${y} – 28.02.2027`;
}

function getVerwendungszweck(fahrzeugart: string, versicherungsumfang: string, nachname: string, vorname: string, versicherungsbeginn: string): string {
  const shortVehicle = VEHICLE_SHORT_NAMES[fahrzeugart] || fahrzeugart;
  const shortCoverage = versicherungsumfang === 'haftpflicht_teilkasko' ? 'HP+TK' : 'HP';
  const [y, m] = versicherungsbeginn.split('-');
  return `ERGO ${shortVehicle} ${shortCoverage} | ${nachname}, ${vorname} | ab ${m}/${y}`;
}

function formatDateDE(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 2) {
    const [y, m] = parts;
    return `01.${m}.${y}`;
  }
  const [y, m, d] = parts;
  return `${d}.${m}.${y}`;
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export default function KennzeichenPage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<KennzeichenType | null>(null);
  const [formData, setFormData] = useState<FormData>({ ...initialFormData });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [confirm1, setConfirm1] = useState(false);
  const [confirm2, setConfirm2] = useState(false);
  const [fadeClass, setFadeClass] = useState('opacity-100 transition-opacity duration-300');
  const [abeFiles, setAbeFiles] = useState<AbeFile[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleAbeFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles: AbeFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (abeFiles.length + newFiles.length >= 5) break;
      if (!f.type.startsWith('image/') && f.type !== 'application/pdf') continue;
      if (f.size > 10 * 1024 * 1024) continue;
      const af: AbeFile = { file: f };
      if (f.type.startsWith('image/')) {
        af.preview = URL.createObjectURL(f);
      }
      newFiles.push(af);
    }
    setAbeFiles(prev => [...prev, ...newFiles].slice(0, 5));
    if (errors.abeFiles) setErrors(prev => { const n = { ...prev }; delete n.abeFiles; return n; });
    e.target.value = '';
  };

  const removeAbeFile = (index: number) => {
    setAbeFiles(prev => {
      const next = [...prev];
      if (next[index]?.preview) URL.revokeObjectURL(next[index].preview!);
      next.splice(index, 1);
      return next;
    });
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get('type') as KennzeichenType | null;
    if (typeParam && ['evb', 'kennzeichen'].includes(typeParam)) {
      setSelectedType(typeParam);
      setStep(2);
    }
  }, []);

  const goToStep = useCallback((next: number) => {
    setFadeClass('opacity-0 transition-opacity duration-150');
    setTimeout(() => {
      setStep(next);
      setFadeClass('opacity-100 transition-opacity duration-300');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 150);
  }, []);

  const handleSelectType = (type: KennzeichenType) => {
    setSelectedType(type);
    setFormData({ ...initialFormData });
    setErrors({});
    setConfirm1(false);
    setConfirm2(false);
    goToStep(2);
  };

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as string]) setErrors(prev => { const n = { ...prev }; delete n[field as string]; return n; });
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const validateStep2 = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.vorname.trim()) e.vorname = 'Pflichtfeld';
    if (!formData.nachname.trim()) e.nachname = 'Pflichtfeld';
    if (!formData.geburtsdatum) e.geburtsdatum = 'Pflichtfeld';
    if (!formData.strasse.trim()) e.strasse = 'Pflichtfeld';
    if (!formData.plz.trim() || !/^\d{5}$/.test(formData.plz.trim())) e.plz = 'Gültige 5-stellige PLZ eingeben';
    if (!formData.ort.trim()) e.ort = 'Pflichtfeld';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) e.email = 'Gültige E-Mail eingeben';
    if (!formData.telefon.trim()) e.telefon = 'Pflichtfeld';
    if (!formData.fahrzeugart) e.fahrzeugart = 'Bitte auswählen';
    if (!formData.fahrzeughersteller.trim()) e.fahrzeughersteller = 'Pflichtfeld';
    if (!formData.fahrzeugmodell.trim()) e.fahrzeugmodell = 'Pflichtfeld';

    if (selectedType === 'evb') {
      if (!formData.jaehrlicheFahrleistung) e.jaehrlicheFahrleistung = 'Bitte auswählen';
      if (!formData.versicherungsbeginn) e.versicherungsbeginn = 'Pflichtfeld';
      if (formData.hauptfahrer === 'andere') {
        if (!formData.hauptfahrerName.trim()) e.hauptfahrerName = 'Pflichtfeld';
        if (!formData.hauptfahrerGeburtsdatum) e.hauptfahrerGeburtsdatum = 'Pflichtfeld';
      }
    }

    if (selectedType === 'kennzeichen') {
      if (!formData.fin.trim()) e.fin = 'Pflichtfeld';
      if (!formData.hoechstgeschwindigkeit) e.hoechstgeschwindigkeit = 'Bitte auswählen';
      if (!formData.versicherungsbeginn) e.versicherungsbeginn = 'Pflichtfeld';
      if (!formData.versicherungsumfang) e.versicherungsumfang = 'Bitte auswählen';
      if (abeFiles.length === 0) e.abeFiles = 'Bitte laden Sie die ABE (Allgemeine Betriebserlaubnis) hoch';
      if (formData.bisherigVersichert === 'ja') {
        if (!formData.bisherigVersicherer.trim()) e.bisherigVersicherer = 'Pflichtfeld';
      }
    }

    setErrors(e);
    if (Object.keys(e).length > 0) {
      const firstErrorKey = Object.keys(e)[0];
      const el = document.querySelector(`[data-field="${firstErrorKey}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return Object.keys(e).length === 0;
  };

  const handleStep2Next = () => {
    if (validateStep2()) {
      goToStep(3);
    }
  };

  const buildSummary = () => {
    const lines: string[] = [];
    lines.push(`Antragsart: ${selectedType === 'evb' ? 'eVB-Nummer (Kfz)' : 'Versicherungskennzeichen'}`);
    lines.push(`Name: ${formData.vorname} ${formData.nachname}`);
    lines.push(`Geburtsdatum: ${formatDateDE(formData.geburtsdatum)}`);
    lines.push(`Adresse: ${formData.strasse}, ${formData.plz} ${formData.ort}`);
    lines.push(`E-Mail: ${formData.email}`);
    lines.push(`Telefon: ${formData.telefon}`);
    lines.push(`Fahrzeugart: ${formData.fahrzeugart}`);
    lines.push(`Hersteller: ${formData.fahrzeughersteller}`);
    lines.push(`Modell: ${formData.fahrzeugmodell}`);
    if (formData.fin) lines.push(`FIN: ${formData.fin}`);
    lines.push(`Versicherungsbeginn: ${formatDateDE(formData.versicherungsbeginn)}`);
    if (selectedType === 'evb') {
      lines.push(`Fahrleistung: ${formData.jaehrlicheFahrleistung}`);
      lines.push(`Hauptfahrer: ${formData.hauptfahrer === 'selbst' ? 'Versicherungsnehmer selbst' : formData.hauptfahrerName}`);
      const arten = ['Kfz-Haftpflicht'];
      if (formData.versicherungsartTeilkasko) arten.push('Teilkasko');
      if (formData.versicherungsartVollkasko) arten.push('Vollkasko');
      if (formData.versicherungsartSchutzbrief) arten.push('Schutzbrief');
      lines.push(`Versicherungsart: ${arten.join(', ')}`);
    }
    if (selectedType === 'kennzeichen') {
      lines.push(`Höchstgeschwindigkeit: ${formData.hoechstgeschwindigkeit}`);
      lines.push(`Versicherungsumfang: ${formData.versicherungsumfang === 'haftpflicht' ? 'Nur Haftpflicht' : 'Haftpflicht + Teilkasko inkl. Diebstahlschutz'}`);
      const premium = getPremium(formData.fahrzeugart, formData.versicherungsumfang, formData.versicherungsbeginn);
      if (premium !== null) {
        lines.push(`Zeitraum: ${getVersicherungszeitraum(formData.versicherungsbeginn)}`);
        lines.push(`Beitrag: ${premium.toFixed(2).replace('.', ',')} €`);
        lines.push(`Verwendungszweck: ${getVerwendungszweck(formData.fahrzeugart, formData.versicherungsumfang, formData.nachname, formData.vorname, formData.versicherungsbeginn)}`);
      }
    }
    if (formData.hinweise) lines.push(`Hinweise: ${formData.hinweise}`);
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
      let abeAttachments: { filename: string; content: string }[] = [];
      if (selectedType === 'kennzeichen' && abeFiles.length > 0) {
        abeAttachments = await Promise.all(
          abeFiles.map(async (af) => ({
            filename: af.file.name,
            content: await fileToBase64(af.file),
          }))
        );
      }

      const res = await apiRequest('POST', '/api/kennzeichen/submit', {
        requestType: selectedType,
        ...formData,
        summary: buildSummary(),
        abeAttachments: abeAttachments.length > 0 ? abeAttachments : undefined,
      });
      setReference((await res.json()).reference ?? null);
      goToStep(4);
    } catch (err: any) {
      setSubmitError(err.message || 'Fehler beim Senden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns per WhatsApp.');
      goToStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };


  const clearError = (key: string) => {
    if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const currentPremium = selectedType === 'kennzeichen' ? getPremium(formData.fahrzeugart, formData.versicherungsumfang, formData.versicherungsbeginn) : null;
  const umfangLabel = formData.versicherungsumfang === 'haftpflicht' ? 'Nur Haftpflicht' : 'Haftpflicht + Teilkasko inkl. Diebstahlschutz';
  const verwendungszweck = selectedType === 'kennzeichen' && formData.versicherungsbeginn
    ? getVerwendungszweck(formData.fahrzeugart, formData.versicherungsumfang, formData.nachname, formData.vorname, formData.versicherungsbeginn)
    : '';

  const stepNames = ['Auswahl', 'Angaben', 'Prüfen', 'Fertig'];
  const cardStyle = { display: 'flex', flexDirection: 'column', gap: 16 } as const;

  const label = (id: string, text: string, required: boolean) => (
    <label className="sv-label" htmlFor={id}>{text}{!required && <span className="sv-hint"> (optional)</span>}</label>
  );

  const renderField = (
    field: keyof FormData,
    text: string,
    opts: { type?: string; placeholder?: string; required?: boolean; hint?: string; extra?: React.InputHTMLAttributes<HTMLInputElement> } = {},
  ) => {
    const id = `f-${field}`;
    const required = opts.required ?? true;
    return (
      <div className="sv-field" data-field={field}>
        {label(id, text, required)}
        <input
          id={id}
          type={opts.type || 'text'}
          value={formData[field] as string}
          onChange={e => updateField(field, e.target.value)}
          placeholder={opts.placeholder}
          className="sv-input"
          aria-invalid={!!errors[field]}
          {...opts.extra}
        />
        {opts.hint && <span className="sv-hint">{opts.hint}</span>}
        {errors[field] && <span className="sv-error">{errors[field]}</span>}
      </div>
    );
  };

  const renderSelect = (field: keyof FormData, text: string, options: { value: string; label: string }[], opts: { required?: boolean; hint?: string } = {}) => {
    const id = `f-${field}`;
    const required = opts.required ?? true;
    return (
      <div className="sv-field" data-field={field}>
        {label(id, text, required)}
        <select id={id} value={formData[field] as string} onChange={e => updateField(field, e.target.value)} className="sv-input" aria-invalid={!!errors[field]}>
          <option value="">Bitte auswählen</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {opts.hint && <span className="sv-hint">{opts.hint}</span>}
        {errors[field] && <span className="sv-error">{errors[field]}</span>}
      </div>
    );
  };

  const opts = (values: string[]) => values.map(v => ({ value: v, label: v }));

  const renderChoice = (selected: boolean, onClick: () => void, title: string, desc?: string) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      style={{
        minHeight: 52, padding: '12px 16px', borderRadius: 6, textAlign: 'left', cursor: 'pointer',
        background: 'var(--sv-card)', color: 'var(--sv-ink)', font: 'inherit',
        border: `1.5px solid ${selected ? 'var(--sv-ink)' : 'var(--sv-line)'}`,
        display: 'flex', alignItems: 'flex-start', gap: 10,
      }}
    >
      <span style={{ flex: 1 }}>
        <span style={{ display: 'block', fontWeight: 700, fontSize: 15 }}>{title}</span>
        {desc && <span className="sv-hint" style={{ display: 'block', marginTop: 2 }}>{desc}</span>}
      </span>
      {selected && <Check size={18} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />}
    </button>
  );

  const renderNote = (children: React.ReactNode) => (
    <div className="sv-card" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 15, lineHeight: 1.55, color: 'var(--sv-body)' }}>
      <Info size={20} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2, color: 'var(--sv-accent)' }} />
      <div>{children}</div>
    </div>
  );

  const renderCopyButton = (text: string, fieldName: string, labelText: string) => (
    <button
      type="button"
      onClick={() => copyToClipboard(text, fieldName)}
      aria-label={`${labelText} kopieren`}
      style={{ minWidth: 44, minHeight: 44, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--sv-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexShrink: 0, font: 'inherit', fontSize: 13, fontWeight: 600 }}
    >
      {copiedField === fieldName ? <><Check size={16} aria-hidden="true" style={{ color: 'var(--sv-ok)' }} /> Kopiert</> : <Copy size={18} aria-hidden="true" />}
    </button>
  );

  const personalCard = (
    <div className="sv-card" style={cardStyle}>
      <h2 className="sv-section-title" style={{ marginTop: 0 }}>Persönliche Daten</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderField('vorname', 'Vorname', { extra: { autoComplete: 'given-name', enterKeyHint: 'next' } })}
        {renderField('nachname', 'Nachname', { extra: { autoComplete: 'family-name', enterKeyHint: 'next' } })}
      </div>
      {renderField('geburtsdatum', 'Geburtsdatum', { type: 'date', extra: { autoComplete: 'bday' } })}
      {renderField('strasse', 'Straße und Hausnummer', { extra: { autoComplete: 'street-address', enterKeyHint: 'next' } })}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderField('plz', 'PLZ', { extra: { inputMode: 'numeric', maxLength: 5, autoComplete: 'postal-code', enterKeyHint: 'next' } })}
        {renderField('ort', 'Ort', { extra: { autoComplete: 'address-level2', enterKeyHint: 'next' } })}
      </div>
      {renderField('email', 'E-Mail', { type: 'email', placeholder: 'name@beispiel.de', extra: { inputMode: 'email', autoComplete: 'email', enterKeyHint: 'next' } })}
      {renderField('telefon', 'Telefon', { type: 'tel', placeholder: '0151 12345678', extra: { inputMode: 'tel', autoComplete: 'tel', enterKeyHint: 'next' } })}
    </div>
  );

  const hinweiseField = (
    <div className="sv-field">
      {label('f-hinweise', 'Hinweise', false)}
      <textarea id="f-hinweise" value={formData.hinweise} onChange={e => updateField('hinweise', e.target.value)} rows={3} placeholder="Zusätzliche Hinweise oder Wünsche" className="sv-input" />
    </div>
  );

  const step2Footer = (
    <>
      <button type="button" onClick={handleStep2Next} className="sv-btn">
        Weiter zur Prüfung <ArrowRight size={18} aria-hidden="true" />
      </button>
      {Object.keys(errors).length > 0 && (
        <p className="sv-error" role="alert" style={{ margin: 0, textAlign: 'center' }}>Bitte prüfen Sie die markierten Felder.</p>
      )}
    </>
  );

  return (
    <ServiceLayout>
      <SEO
        title="eVB-Nummer & Versicherungskennzeichen – Agentur Stübe Ganderkesee"
        description="eVB-Nummer für Kfz-Zulassung oder Versicherungskennzeichen für Kleinkraftrad anfragen. Schnell und unkompliziert bei der Agentur Stübe in Ganderkesee."
        keywords="eVB-Nummer, Versicherungskennzeichen, Kfz-Zulassung, Ganderkesee, Kleinkraftrad Versicherung"
      />
      <div className="sv-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 4, paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {step < 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {step > 1 ? (
              <button type="button" onClick={() => goToStep(step - 1)} className="sv-link-btn" style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>
                <ChevronLeft size={18} aria-hidden="true" /> Zurück
              </button>
            ) : (
              <Link href="/service" className="sv-link-btn" style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>
                <ChevronLeft size={18} aria-hidden="true" /> Alle Anliegen
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

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <h1 className="sv-h1">Was <em>benötigen</em> Sie?</h1>
              <p style={{ margin: 0, color: 'var(--sv-body)' }}>Morino Stübe stellt Ihnen die Unterlagen unkompliziert aus.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {([
                  {
                    type: 'evb' as const, Icon: Car, title: 'eVB-Nummer (Kfz)',
                    desc: 'Elektronische Versicherungsbestätigung für die Kfz-Zulassungsstelle (Auto, Motorrad ab 50ccm)',
                    points: ['Für An- und Ummeldung', '7-stelliger Code für Behörde'],
                  },
                  {
                    type: 'kennzeichen' as const, Icon: Bike, title: 'Versicherungskennzeichen',
                    desc: 'Für Roller, Moped, Mofa, E-Scooter & Kleinkrafträder bis 50ccm',
                    points: ['Kein Gang zur Zulassungsstelle', 'Kennzeichen direkt vom Berater', 'Gültig bis 28.02.2027'],
                  },
                ]).map(({ type, Icon, title, desc, points }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleSelectType(type)}
                    aria-pressed={selectedType === type}
                    className="sv-tile"
                    style={{ border: 'none', font: 'inherit', color: 'var(--sv-ink)', textAlign: 'left', cursor: 'pointer', gap: 12 }}
                  >
                    <span style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      <Icon size={26} strokeWidth={1.7} aria-hidden="true" style={{ flexShrink: 0, color: 'var(--sv-accent)' }} />
                      <span style={{ flex: 1 }}>
                        <span className="sv-row-title">{title}</span>
                        <span className="sv-row-desc">{desc}</span>
                      </span>
                      <ArrowRight size={18} aria-hidden="true" style={{ flexShrink: 0, marginTop: 3 }} />
                    </span>
                    <ul style={{ margin: 0, padding: '0 0 0 40px', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4, fontSize: 14, color: 'var(--sv-body)' }}>
                      {points.map(p => (
                        <li key={p} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Check size={15} aria-hidden="true" style={{ color: 'var(--sv-ok)', flexShrink: 0 }} /> {p}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>

              {renderNote(<>Das aktuelle Versicherungskennzeichen 2026/2027 ist <strong>SCHWARZ</strong>. Es gilt vom 01.03.2026 bis 28.02.2027.</>)}

              <details className="sv-card" style={{ padding: 0 }}>
                <summary style={{ padding: '14px 20px', minHeight: 48, display: 'flex', alignItems: 'center', fontWeight: 600, cursor: 'pointer' }}>
                  Was ist eine eVB-Nummer?
                </summary>
                <p style={{ margin: 0, padding: '0 20px 18px', fontSize: 15, lineHeight: 1.6, color: 'var(--sv-body)' }}>
                  Die <strong>eVB (elektronische Versicherungsbestätigung)</strong> ist ein 7-stelliger Code, den Sie für die Kfz-Zulassungsstelle benötigen. Sie ersetzt die frühere Doppelkarte und bestätigt, dass Ihr Fahrzeug haftpflichtversichert ist. Die eVB wird für Neuzulassungen, Ummeldungen und Halterwechsel benötigt.
                </p>
              </details>
            </div>
          )}

          {step === 2 && selectedType === 'evb' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <h1 className="sv-h1">eVB-Nummer <em>anfordern</em></h1>

              {renderNote(<><strong>Bitte beachten:</strong> Die eVB-Nummer kann nur im Zusammenhang mit dem Abschluss einer Kfz-Versicherung ausgestellt werden. Morino Stübe meldet sich nach Eingang Ihrer Anfrage bei Ihnen.</>)}

              {personalCard}

              <div className="sv-card" style={cardStyle}>
                <h2 className="sv-section-title" style={{ marginTop: 0 }}>Fahrzeugdaten</h2>
                {renderSelect('fahrzeugart', 'Fahrzeugart', opts(['PKW', 'Motorrad (ab 50ccm)', 'LKW', 'Sonstiges']))}
                {renderField('fahrzeughersteller', 'Fahrzeughersteller', { placeholder: 'z. B. VW, BMW, Mercedes' })}
                {renderField('fahrzeugmodell', 'Fahrzeugmodell', { placeholder: 'z. B. Golf, 3er, A-Klasse' })}
                {renderField('erstzulassung', 'Erstzulassung', { type: 'date', required: false })}
                {renderField('fin', 'FIN (Fahrzeug-Identifizierungsnummer)', { placeholder: '17-stellige FIN aus Fahrzeugschein', required: false, extra: { autoCapitalize: 'characters', autoComplete: 'off' } })}
                {renderField('bisherigVersicherer', 'Bisheriger Versicherer', { required: false })}
                {renderField('bisherigSfKlasse', 'Bisherige SF-Klasse', { placeholder: 'z. B. SF 12', required: false })}
              </div>

              <div className="sv-card" style={cardStyle}>
                <h2 className="sv-section-title" style={{ marginTop: 0 }}>Versicherung</h2>
                {renderSelect('jaehrlicheFahrleistung', 'Jährliche Fahrleistung', opts(['bis 5.000 km', '5.000–10.000 km', '10.000–15.000 km', '15.000–20.000 km', 'über 20.000 km']))}

                <div className="sv-field" data-field="hauptfahrer" role="group" aria-labelledby="l-hauptfahrer">
                  <span className="sv-label" id="l-hauptfahrer">Hauptfahrer</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {renderChoice(formData.hauptfahrer === 'selbst', () => updateField('hauptfahrer', 'selbst'), 'Versicherungsnehmer selbst')}
                    {renderChoice(formData.hauptfahrer === 'andere', () => updateField('hauptfahrer', 'andere'), 'Andere Person')}
                  </div>
                </div>

                {formData.hauptfahrer === 'andere' && (
                  <div className="sv-subbox">
                    {renderField('hauptfahrerName', 'Name des Hauptfahrers')}
                    {renderField('hauptfahrerGeburtsdatum', 'Geburtsdatum des Hauptfahrers', { type: 'date' })}
                  </div>
                )}

                {renderField('versicherungsbeginn', 'Gewünschter Versicherungsbeginn', { type: 'date', extra: { min: todayISO() } })}

                <fieldset className="sv-field" style={{ border: 'none', margin: 0, padding: 0 }}>
                  <legend className="sv-label" style={{ marginBottom: 8 }}>Gewünschte Versicherungsart</legend>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <label className="sv-check" style={{ cursor: 'not-allowed' }}>
                      <input type="checkbox" checked={true} disabled />
                      <span>Kfz-Haftpflicht <span className="sv-hint">(Pflicht)</span></span>
                    </label>
                    <label className="sv-check">
                      <input type="checkbox" checked={formData.versicherungsartTeilkasko} onChange={e => updateField('versicherungsartTeilkasko', e.target.checked)} />
                      <span>Teilkasko</span>
                    </label>
                    <label className="sv-check">
                      <input type="checkbox" checked={formData.versicherungsartVollkasko} onChange={e => updateField('versicherungsartVollkasko', e.target.checked)} />
                      <span>Vollkasko</span>
                    </label>
                    <label className="sv-check">
                      <input type="checkbox" checked={formData.versicherungsartSchutzbrief} onChange={e => updateField('versicherungsartSchutzbrief', e.target.checked)} />
                      <span>Schutzbrief</span>
                    </label>
                  </div>
                </fieldset>

                {hinweiseField}
              </div>

              {step2Footer}
            </div>
          )}

          {step === 2 && selectedType === 'kennzeichen' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <h1 className="sv-h1">Versicherungs&shy;kennzeichen <em>anfordern</em></h1>

              {renderNote(<>Das Versicherungskennzeichen erhalten Sie direkt bei Morino Stübe – kein Gang zur Zulassungsstelle nötig. Alles, was Sie brauchen, ist die Allgemeine Betriebserlaubnis (ABE) Ihres Fahrzeugs.</>)}

              {personalCard}

              <div className="sv-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }} data-field="abeFiles">
                <h2 className="sv-section-title" style={{ marginTop: 0 }}>ABE hochladen</h2>
                <p className="sv-hint" style={{ margin: 0, fontSize: 14 }}>Bitte laden Sie die Allgemeine Betriebserlaubnis (ABE) Ihres Fahrzeugs hoch. Diese benötigen wir zur Ausstellung des Versicherungskennzeichens.</p>
                <input
                  id="abe-file-input"
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  onChange={handleAbeFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('abe-file-input')?.click()}
                  disabled={abeFiles.length >= 5}
                  className="sv-dropzone"
                  aria-invalid={!!errors.abeFiles}
                  style={errors.abeFiles ? { borderColor: 'var(--sv-error)' } : undefined}
                >
                  <Upload size={26} strokeWidth={1.7} aria-hidden="true" />
                  <span style={{ fontWeight: 700 }}>ABE als Foto oder PDF auswählen</span>
                  <span className="sv-hint">Max. 5 Dateien, je max. 10 MB</span>
                </button>
                {abeFiles.map((af, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid var(--sv-line)', paddingTop: 10 }}>
                    {af.preview ? (
                      <img src={af.preview} alt="" style={{ width: 48, height: 48, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
                    ) : (
                      <span style={{ width: 48, height: 48, borderRadius: 6, background: 'var(--sv-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FileText size={22} aria-hidden="true" />
                      </span>
                    )}
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{af.file.name}</span>
                      <span className="sv-hint">{(af.file.size / 1024).toFixed(0)} KB</span>
                    </span>
                    <button type="button" onClick={() => removeAbeFile(index)} aria-label={`${af.file.name} entfernen`} style={{ width: 44, height: 44, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--sv-ink)' }}>
                      <X size={18} aria-hidden="true" />
                    </button>
                  </div>
                ))}
                {errors.abeFiles && <span className="sv-error">{errors.abeFiles}</span>}
                <div className="sv-subbox" style={{ fontSize: 14, color: 'var(--sv-body)' }}>
                  <span><strong>Wo finde ich die ABE?</strong> Die ABE wird beim Kauf des Fahrzeugs mitgeliefert. Sie enthält alle technischen Daten wie Hersteller, Typ, Hubraum und Höchstgeschwindigkeit. Bei Verlust kann eine Kopie beim Hersteller angefordert werden.</span>
                </div>
              </div>

              <div className="sv-card" style={cardStyle}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <h2 className="sv-section-title" style={{ marginTop: 0 }}>Fahrzeugdaten</h2>
                  <span className="sv-hint" style={{ fontSize: 14 }}>Alle folgenden Angaben finden Sie in der ABE Ihres Fahrzeugs.</span>
                </div>
                {renderSelect('fahrzeugart', 'Fahrzeugart', opts(['E-Scooter', 'Mofa / Moped / Mokick / Roller', 'Segway', 'S-Pedelec', 'Krankenfahrstuhl']))}
                {renderField('fahrzeughersteller', 'Fahrzeughersteller')}
                {renderField('fahrzeugmodell', 'Fahrzeugmodell')}
                {renderField('fin', 'FIN (Fahrgestellnummer)', { placeholder: 'Fahrgestellnummer aus der ABE', extra: { autoCapitalize: 'characters', autoComplete: 'off' } })}
                {renderSelect('hubraum', 'Hubraum', opts(['bis 25ccm', 'bis 50ccm', 'bis 125ccm (mit Führerschein A1)']), { required: false })}
                {renderSelect('hoechstgeschwindigkeit', 'Höchstgeschwindigkeit', opts(['bis 25 km/h', 'bis 45 km/h', 'bis 60 km/h']))}
                {renderField('erstzulassung', 'Erstzulassung / Baujahr', { placeholder: 'z. B. 2023', required: false, extra: { inputMode: 'numeric' } })}
              </div>

              <div className="sv-card" style={cardStyle}>
                <h2 className="sv-section-title" style={{ marginTop: 0 }}>Versicherung</h2>
                {renderSelect('versicherungsbeginn', 'Versicherungsbeginn', PREMIUM_MONTHS.map(m => ({ value: m, label: MONTH_LABELS[m] })), { hint: 'Das Versicherungsjahr läuft bis 28.02.2027' })}

                <div className="sv-field" data-field="bisherigVersichert" role="group" aria-labelledby="l-bisherigVersichert">
                  <span className="sv-label" id="l-bisherigVersichert">Bisherige Versicherung vorhanden?</span>
                  <div className="grid grid-cols-2 gap-3">
                    {renderChoice(formData.bisherigVersichert === 'ja', () => updateField('bisherigVersichert', 'ja'), 'Ja')}
                    {renderChoice(formData.bisherigVersichert === 'nein', () => updateField('bisherigVersichert', 'nein'), 'Nein', 'Neuanmeldung')}
                  </div>
                </div>

                {formData.bisherigVersichert === 'ja' && (
                  <div className="sv-subbox">
                    {renderField('bisherigVersicherer', 'Bisheriger Versicherer')}
                    {renderField('bisherigesKennzeichen', 'Bisheriges Kennzeichen', { required: false, extra: { autoCapitalize: 'characters' } })}
                  </div>
                )}

                <div className="sv-field" data-field="versicherungsumfang" role="group" aria-labelledby="l-versicherungsumfang">
                  <span className="sv-label" id="l-versicherungsumfang">Versicherungsumfang</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {renderChoice(formData.versicherungsumfang === 'haftpflicht', () => updateField('versicherungsumfang', 'haftpflicht'), 'Nur Haftpflicht', 'gesetzlich vorgeschrieben')}
                    {renderChoice(formData.versicherungsumfang === 'haftpflicht_teilkasko', () => updateField('versicherungsumfang', 'haftpflicht_teilkasko'), 'Haftpflicht + Teilkasko inkl. Diebstahlschutz', 'empfohlen, 150 € SB je Schadenfall')}
                  </div>
                  {errors.versicherungsumfang && <span className="sv-error">{errors.versicherungsumfang}</span>}
                </div>

                {currentPremium !== null && (
                  <div className="sv-subbox" aria-live="polite">
                    <span className="sv-group-title" style={{ margin: 0 }}>Ihr Beitrag</span>
                    <dl className="sv-dl">
                      <dt>Fahrzeugtyp</dt><dd>{formData.fahrzeugart}</dd>
                      <dt>Umfang</dt><dd>{umfangLabel}</dd>
                      <dt>Zeitraum</dt><dd>{getVersicherungszeitraum(formData.versicherungsbeginn)}</dd>
                    </dl>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid var(--sv-line)', paddingTop: 12 }}>
                      <span style={{ fontWeight: 700 }}>Beitrag</span>
                      <span className="sv-ref">{currentPremium.toFixed(2).replace('.', ',')} €</span>
                    </div>
                    <span className="sv-hint">Versicherungssumme: 100 Mio. € pauschal</span>
                    {formData.versicherungsumfang === 'haftpflicht_teilkasko' && (
                      <span className="sv-hint">Teilkasko: 150 € Selbstbeteiligung je Schadenfall. Bei Totalentwendung des Fahrzeugs gilt eine Selbstbeteiligung von 300 €.</span>
                    )}
                  </div>
                )}

                {hinweiseField}
              </div>

              {step2Footer}
            </div>
          )}

          {step === 3 && selectedType && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <h1 className="sv-h1">Bitte <em>prüfen</em> Sie Ihre Angaben</h1>

              <div className="sv-card" style={cardStyle}>
                <h2 className="sv-section-title" style={{ marginTop: 0 }}>{selectedType === 'evb' ? 'eVB-Nummer (Kfz)' : 'Versicherungskennzeichen'}</h2>

                <span className="sv-group-title" style={{ margin: 0 }}>Persönliche Daten</span>
                <dl className="sv-dl">
                  <dt>Name</dt><dd>{formData.vorname} {formData.nachname}</dd>
                  <dt>Geburtsdatum</dt><dd>{formatDateDE(formData.geburtsdatum)}</dd>
                  <dt>Adresse</dt><dd>{formData.strasse}, {formData.plz} {formData.ort}</dd>
                  <dt>E-Mail</dt><dd style={{ wordBreak: 'break-all' }}>{formData.email}</dd>
                  <dt>Telefon</dt><dd>{formData.telefon}</dd>
                </dl>

                <span className="sv-group-title" style={{ margin: 0 }}>Fahrzeugdaten</span>
                <dl className="sv-dl">
                  <dt>Fahrzeugart</dt><dd>{formData.fahrzeugart}</dd>
                  <dt>Hersteller</dt><dd>{formData.fahrzeughersteller}</dd>
                  <dt>Modell</dt><dd>{formData.fahrzeugmodell}</dd>
                  {formData.fin && <><dt>FIN</dt><dd style={{ wordBreak: 'break-all' }}>{formData.fin}</dd></>}
                  {formData.erstzulassung && <><dt>Erstzulassung</dt><dd>{selectedType === 'evb' ? formatDateDE(formData.erstzulassung) : formData.erstzulassung}</dd></>}
                  {selectedType === 'kennzeichen' && formData.hubraum && <><dt>Hubraum</dt><dd>{formData.hubraum}</dd></>}
                  {selectedType === 'kennzeichen' && <><dt>Höchstgeschwindigkeit</dt><dd>{formData.hoechstgeschwindigkeit}</dd></>}
                </dl>

                <span className="sv-group-title" style={{ margin: 0 }}>Versicherung</span>
                <dl className="sv-dl">
                  <dt>Versicherungsbeginn</dt><dd>{formatDateDE(formData.versicherungsbeginn)}</dd>
                  {selectedType === 'evb' && (
                    <>
                      <dt>Fahrleistung</dt><dd>{formData.jaehrlicheFahrleistung}</dd>
                      <dt>Hauptfahrer</dt><dd>{formData.hauptfahrer === 'selbst' ? 'Versicherungsnehmer selbst' : formData.hauptfahrerName}</dd>
                      <dt>Versicherungsart</dt><dd>{
                        ['Kfz-Haftpflicht',
                          ...(formData.versicherungsartTeilkasko ? ['Teilkasko'] : []),
                          ...(formData.versicherungsartVollkasko ? ['Vollkasko'] : []),
                          ...(formData.versicherungsartSchutzbrief ? ['Schutzbrief'] : []),
                        ].join(', ')
                      }</dd>
                      {formData.bisherigVersicherer && <><dt>Bisheriger Versicherer</dt><dd>{formData.bisherigVersicherer}</dd></>}
                      {formData.bisherigSfKlasse && <><dt>SF-Klasse</dt><dd>{formData.bisherigSfKlasse}</dd></>}
                    </>
                  )}
                  {selectedType === 'kennzeichen' && (
                    <>
                      <dt>Versicherungsumfang</dt><dd>{umfangLabel}</dd>
                      {currentPremium !== null && (
                        <>
                          <dt>Zeitraum</dt><dd>{getVersicherungszeitraum(formData.versicherungsbeginn)}</dd>
                          <dt>Beitrag</dt><dd style={{ color: 'var(--sv-accent)' }}>{currentPremium.toFixed(2).replace('.', ',')} €</dd>
                        </>
                      )}
                      {formData.bisherigVersichert === 'ja' && formData.bisherigVersicherer && (
                        <><dt>Bisheriger Versicherer</dt><dd>{formData.bisherigVersicherer}</dd></>
                      )}
                    </>
                  )}
                </dl>

                {selectedType === 'kennzeichen' && abeFiles.length > 0 && (
                  <>
                    <span className="sv-group-title" style={{ margin: 0 }}>ABE (Betriebserlaubnis)</span>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 15 }}>
                      {abeFiles.map((af, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                          <FileText size={16} aria-hidden="true" style={{ flexShrink: 0 }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{af.file.name}</span>
                          <span className="sv-hint" style={{ flexShrink: 0 }}>{(af.file.size / 1024).toFixed(0)} KB</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {formData.hinweise && (
                  <>
                    <span className="sv-group-title" style={{ margin: 0 }}>Hinweise</span>
                    <p style={{ margin: 0, fontSize: 15, color: 'var(--sv-body)' }}>{formData.hinweise}</p>
                  </>
                )}

                <button type="button" onClick={() => goToStep(2)} className="sv-link-btn" style={{ alignSelf: 'flex-start', fontSize: 14 }}>Angaben bearbeiten</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label className="sv-check">
                    <input type="checkbox" checked={confirm1} onChange={e => { setConfirm1(e.target.checked); clearError('confirm1'); }} />
                    <span>Ich bestätige, dass alle Angaben korrekt und vollständig sind.</span>
                  </label>
                  {errors.confirm1 && <p className="sv-error" style={{ margin: '6px 0 0 34px' }}>{errors.confirm1}</p>}
                </div>
                <div>
                  <label className="sv-check">
                    <input type="checkbox" checked={confirm2} onChange={e => { setConfirm2(e.target.checked); clearError('confirm2'); }} />
                    <span>Ich bin einverstanden, dass meine Daten zur Bearbeitung meiner Anfrage verwendet werden. Die <Link href="/datenschutz" style={{ fontWeight: 600 }}>Datenschutzhinweise</Link> habe ich gelesen.</span>
                  </label>
                  {errors.confirm2 && <p className="sv-error" style={{ margin: '6px 0 0 34px' }}>{errors.confirm2}</p>}
                </div>
              </div>

              {submitError && (
                <div className="sv-notice sv-notice--error" role="alert">{submitError}</div>
              )}

              <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="sv-btn">
                {isSubmitting
                  ? <><span className="sv-spin" aria-hidden="true" /> Wird gesendet …</>
                  : <>{selectedType === 'evb' ? 'eVB-Nummer anfordern' : 'Versicherungskennzeichen anfordern'} <ArrowRight size={18} aria-hidden="true" /></>}
              </button>
            </div>
          )}

          {step === 4 && selectedType && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {submitError ? (
                <>
                  <h1 className="sv-h1">Das hat leider <em>nicht geklappt</em></h1>
                  <div className="sv-notice sv-notice--error" role="alert">{submitError}</div>
                  <p style={{ margin: 0, color: 'var(--sv-body)' }}>
                    Bitte versuchen Sie es erneut oder schreiben Sie uns per WhatsApp.
                  </p>
                  <button type="button" onClick={() => goToStep(3)} className="sv-btn">
                    Erneut versuchen <ArrowRight size={18} aria-hidden="true" />
                  </button>
                </>
              ) : (
                <>
                  <h1 className="sv-h1">Vielen Dank – <em>ist angekommen.</em></h1>
                  <p style={{ margin: 0, color: 'var(--sv-body)' }}>
                    {selectedType === 'evb'
                      ? 'Ihre Anfrage liegt jetzt bei Morino Stübe. Er meldet sich bei Ihnen, um die eVB-Nummer auszustellen.'
                      : 'Ihre Anfrage liegt jetzt bei Morino Stübe. Er meldet sich bei Ihnen zur Abwicklung. Das Kennzeichen (SCHWARZ, gültig bis 28.02.2027) erhalten Sie direkt von Ihrem Berater.'}
                  </p>
                  {reference && (
                    <div className="sv-card" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span className="sv-hint">Ihre Vorgangsnummer</span>
                      <span className="sv-ref">{reference}</span>
                    </div>
                  )}

                  {selectedType === 'evb' && renderNote(<>Die eVB-Nummer ist 6 Monate gültig. Sie können Ihr Fahrzeug in dieser Zeit bei der Zulassungsstelle anmelden.</>)}

                  {selectedType === 'kennzeichen' && renderNote(<>Das aktuelle Versicherungskennzeichen 2026/2027 ist <strong>SCHWARZ</strong>.</>)}

                  {selectedType === 'kennzeichen' && currentPremium !== null && (
                    <div className="sv-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <h2 className="sv-section-title" style={{ marginTop: 0 }}>Überweisungsdaten</h2>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span className="sv-hint">Empfänger</span>
                        <span style={{ fontWeight: 600 }}>Morino Stübe</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span className="sv-hint">IBAN</span>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                          <span style={{ fontWeight: 600, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 15 }}>DE09 1101 0101 5121 0459 76</span>
                          {renderCopyButton('DE09110101015121045976', 'iban', 'IBAN')}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span className="sv-hint">Verwendungszweck</span>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                          <span style={{ fontWeight: 600, fontSize: 15, wordBreak: 'break-all' }}>{verwendungszweck}</span>
                          {renderCopyButton(verwendungszweck, 'verwendungszweck', 'Verwendungszweck')}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span className="sv-hint">Betrag</span>
                        <span className="sv-ref">{currentPremium.toFixed(2).replace('.', ',')} €</span>
                      </div>
                      <p className="sv-hint" style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>Bitte überweisen Sie den Betrag innerhalb von 7 Tagen. Nach Zahlungseingang erhalten Sie Ihr Versicherungskennzeichen bzw. Ihre Versicherungsplakette von Ihrem Berater.</p>
                    </div>
                  )}
                </>
              )}

              <div className="sv-card">
                <dl className="sv-dl">
                  <dt>Antragsart</dt><dd>{selectedType === 'evb' ? 'eVB-Nummer' : 'Versicherungskennzeichen'}</dd>
                  <dt>Name</dt><dd>{formData.vorname} {formData.nachname}</dd>
                  <dt>Fahrzeug</dt><dd>{formData.fahrzeughersteller} {formData.fahrzeugmodell}</dd>
                  <dt>Versicherungsbeginn</dt><dd>{formatDateDE(formData.versicherungsbeginn)}</dd>
                </dl>
              </div>

              <a
                href={`${WHATSAPP_URL}?text=${encodeURIComponent(
                  `Hallo Herr Stübe, ich habe soeben ${selectedType === 'evb' ? 'eine eVB-Anfrage' : 'eine Anfrage für ein Versicherungskennzeichen'} über Ihre Website eingereicht${reference ? ` (Vorgang ${reference})` : ''}. Viele Grüße, ${formData.vorname} ${formData.nachname}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="sv-btn sv-btn--ghost"
              >
                <MessageCircle size={18} aria-hidden="true" /> Per WhatsApp schreiben
              </a>
              <Link href="/service" className="sv-link-btn" style={{ alignSelf: 'center' }}>Weiteres Anliegen erledigen</Link>
              <p className="sv-hint" style={{ margin: 0, textAlign: 'center', fontSize: 14 }}>
                Bei Fragen: <a href={PHONE_HREF} style={{ fontWeight: 600 }}>{PHONE_DISPLAY}</a>
              </p>
            </div>
          )}

        </div>
      </div>
    </ServiceLayout>
  );
}
