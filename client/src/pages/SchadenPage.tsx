import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'wouter';
import {
  CarFront, Zap, Home, Building2, Scale, Shield, Briefcase, ClipboardList, Ambulance,
  Lock, Check, ChevronLeft, Camera, Upload, FileText, X, Star, AlertTriangle, MessageCircle,
  type LucideIcon,
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";

type DamageType = 'kfz' | 'glasschaden' | 'hausrat' | 'gebaeude' | 'rechtsschutz' | 'bu' | 'haftpflicht' | 'sonstiges';

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
  fin: string;
  glasKennzeichen: string;
  glasScheibe: string;
  glasSchadensart: string;
  glasBereich: string;
  glasGroesse: string;
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
  fin: '',
  glasKennzeichen: '',
  glasScheibe: '',
  glasSchadensart: '',
  glasBereich: '',
  glasGroesse: '',
};

const damageTypes: { type: DamageType; icon: LucideIcon; title: string; subtitle?: string }[] = [
  { type: 'kfz', icon: CarFront, title: 'Kfz-Schaden' },
  { type: 'glasschaden', icon: Zap, title: 'Kfz-Glasschaden', subtitle: 'In Kooperation mit Carglass' },
  { type: 'hausrat', icon: Home, title: 'Hausrat-Schaden' },
  { type: 'gebaeude', icon: Building2, title: 'Gebäudeschaden' },
  { type: 'rechtsschutz', icon: Scale, title: 'Rechtsschutz-Fall' },
  { type: 'haftpflicht', icon: Shield, title: 'Haftpflicht-Schaden' },
  { type: 'bu', icon: Briefcase, title: 'Berufsunfähigkeit' },
  { type: 'sonstiges', icon: ClipboardList, title: 'Sonstiger Schaden' },
];

const damageTypeLabels: Record<DamageType, { icon: LucideIcon; title: string }> = {
  kfz: { icon: CarFront, title: 'Kfz-Schaden' },
  glasschaden: { icon: Zap, title: 'Kfz-Glasschaden' },
  hausrat: { icon: Home, title: 'Hausrat-Schaden' },
  gebaeude: { icon: Building2, title: 'Gebäudeschaden' },
  rechtsschutz: { icon: Scale, title: 'Rechtsschutz-Fall' },
  haftpflicht: { icon: Shield, title: 'Haftpflicht-Schaden' },
  bu: { icon: Briefcase, title: 'Berufsunfähigkeit' },
  sonstiges: { icon: ClipboardList, title: 'Sonstiger Schaden' },
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
  const [fadeClass, setFadeClass] = useState('opacity-100 transition-opacity duration-300');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const validTypes: DamageType[] = ['kfz', 'glasschaden', 'hausrat', 'gebaeude', 'rechtsschutz', 'haftpflicht', 'bu', 'sonstiges'];
    const typeParam = (params.get('typ') || params.get('type')) as DamageType | null;
    if (typeParam && validTypes.includes(typeParam)) {
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

    if (selectedType === 'glasschaden') {
      if (!formData.fin.trim()) e.fin = 'Pflichtfeld';
      if (!formData.glasKennzeichen.trim()) e.glasKennzeichen = 'Pflichtfeld';
      if (!formData.glasScheibe) e.glasScheibe = 'Pflichtfeld';
      if (!formData.glasSchadensart) e.glasSchadensart = 'Pflichtfeld';
      const needsBereich = ['steinschlag', 'mehrere_steinschlaege', 'riss'].includes(formData.glasSchadensart);
      if (needsBereich && !formData.glasBereich) e.glasBereich = 'Pflichtfeld';
      const needsGroesse = formData.glasSchadensart === 'steinschlag';
      if (needsGroesse && !formData.glasGroesse) e.glasGroesse = 'Pflichtfeld';
    } else {
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
      if (selectedType === 'sonstiges' || selectedType === 'haftpflicht') {
        if (!formData.weitereDetails.trim() || formData.weitereDetails.trim().length < 10) e.weitereDetails = 'Mindestens 10 Zeichen erforderlich';
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleStep2Next = () => {
    if (validateStep2()) {
      goToStep(3);
    }
  };

  const glasScheibeLabel = (val: string) => {
    const labels: Record<string, string> = {
      frontscheibe: 'Frontscheibe',
      heckscheibe: 'Heckscheibe',
      seitenscheibe_lv: 'Seitenscheibe links vorne',
      seitenscheibe_lh: 'Seitenscheibe links hinten',
      seitenscheibe_rv: 'Seitenscheibe rechts vorne',
      seitenscheibe_rh: 'Seitenscheibe rechts hinten',
      dachscheibe: 'Dachscheibe / Panoramadach',
    };
    return labels[val] || val;
  };

  const glasSchadensartLabel = (val: string) => {
    const labels: Record<string, string> = {
      steinschlag: 'Steinschlag (einzeln)',
      mehrere_steinschlaege: 'Mehrere Steinschläge',
      riss: 'Riss',
      eingeschlagen: 'Eingeschlagen / zerstört',
    };
    return labels[val] || val;
  };

  const glasBereichLabel = (val: string) => {
    const labels: Record<string, string> = {
      rand: 'Weniger als 10 cm vom Rand',
      fahrsichtfeld: 'Fahrsichtfeld über dem Lenkrad',
      anderer: 'Anderer Bereich',
    };
    return labels[val] || val;
  };

  const glasGroesseLabel = (val: string) => {
    const labels: Record<string, string> = {
      kleiner: 'Kleiner als eine 2-€-Münze',
      groesser: 'Größer als eine 2-€-Münze',
    };
    return labels[val] || val;
  };

  const buildExtraFields = (): string => {
    const lines: string[] = [];
    if (selectedType === 'glasschaden') {
      lines.push(`Fahrzeugidentifikationsnummer (FIN): ${formData.fin}`);
      lines.push(`Kennzeichen: ${formData.glasKennzeichen}`);
      lines.push(`Beschädigte Scheibe: ${glasScheibeLabel(formData.glasScheibe)}`);
      lines.push(`Art des Schadens: ${glasSchadensartLabel(formData.glasSchadensart)}`);
      if (formData.glasBereich) lines.push(`Bereich des Schadens: ${glasBereichLabel(formData.glasBereich)}`);
      if (formData.glasGroesse) lines.push(`Größe des Schlags: ${glasGroesseLabel(formData.glasGroesse)}`);
    }
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
    if (selectedType === 'sonstiges' || selectedType === 'haftpflicht') {
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
    if (selectedType === 'glasschaden') {
      lines.push(`FIN: ${formData.fin}`);
      lines.push(`Kennzeichen: ${formData.glasKennzeichen}`);
      lines.push(`Scheibe: ${glasScheibeLabel(formData.glasScheibe)}`);
      lines.push(`Schadensart: ${glasSchadensartLabel(formData.glasSchadensart)}`);
      if (formData.glasBereich) lines.push(`Bereich: ${glasBereichLabel(formData.glasBereich)}`);
      if (formData.glasGroesse) lines.push(`Größe: ${glasGroesseLabel(formData.glasGroesse)}`);
    } else {
      lines.push(`Versicherungsnummer: ${formData.versicherungsnummer}`);
      lines.push(`Schadendatum: ${formData.schadendatum}`);
      lines.push(`Schadenort: ${formData.schadenort}`);
      lines.push(`Beschreibung: ${formData.beschreibung}`);
      lines.push(`Polizeilich gemeldet: ${formData.polizeiGemeldet}`);
      if (formData.geschaetzterSchaden) lines.push(`Geschätzter Schaden: ${formData.geschaetzterSchaden} €`);
      const extra = buildExtraFields();
      if (extra) lines.push(extra);
    }
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

      const payload: Record<string, any> = {
        damageType: damageTypeLabels[selectedType!].title,
        customerName: `${formData.vorname} ${formData.nachname}`,
        customerEmail: formData.email,
        customerPhone: formData.telefon,
        extraFields: buildExtraFields(),
        attachmentsCount: files.length,
        summary: buildSummary(),
        fileAttachments,
      };

      if (selectedType === 'glasschaden') {
        payload.isGlasschaden = true;
        payload.glasScheibe = glasScheibeLabel(formData.glasScheibe);
      } else {
        payload.insuranceNumber = formData.versicherungsnummer;
        payload.damageDate = formData.schadendatum;
        payload.damageLocation = formData.schadenort;
        payload.damageDescription = formData.beschreibung;
        payload.policeReport = formData.polizeiGemeldet;
        payload.estimatedDamage = formData.geschaetzterSchaden || null;
      }

      await apiRequest('POST', '/api/schaden/submit', payload);
      goToStep(4);
    } catch (err: any) {
      setSubmitError(err.message || 'Fehler beim Senden. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = (field: string) =>
    `w-full p-3 border rounded text-base outline-none transition-colors ${errors[field] ? 'border-ergo-red' : 'border-ergo-line focus:border-ergo-red'}`;

  const renderRadioGroup = (field: keyof FormData, options: { value: string; label: string }[]) => (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => updateField(field, opt.value)}
          className={`ergo-option px-4 py-2 text-sm font-semibold text-ergo-ink ${
            formData[field] === opt.value ? 'selected' : ''
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
    <div className="min-h-screen bg-white" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <SEO
        title="Schaden melden – ERGO Agentur Stübe Ganderkesee"
        description="Versicherungsschaden schnell und einfach online melden. Kfz-Schaden, Glasschaden, Hausrat oder Haftpflicht – Ihre ERGO Agentur Stübe in Ganderkesee hilft sofort."
        keywords="Schaden melden, Versicherungsschaden, ERGO Ganderkesee, Kfz-Schaden, Glasschaden melden, Schadensmeldung"
      />
      <Breadcrumb items={[{ label: "Schaden melden" }]} />
      <div className="max-w-[600px] mx-auto px-5 py-6">
        {step < 4 && (
          <>
            <div className="flex items-center justify-between mb-4">
              {step > 1 ? (
                <button onClick={() => goToStep(step - 1)} className="text-ergo-red font-bold text-sm flex items-center gap-1 min-h-[44px]">
                  <ChevronLeft className="w-4 h-4" /> Zurück
                </button>
              ) : (
                <div />
              )}
              <span className="text-xs text-ergo-stone font-medium">
                Schritt {Math.min(step, 3)} von 3 — {step === 1 ? 'Schadenart' : step === 2 ? 'Details' : 'Absenden'}
              </span>
            </div>
            <div className="h-1 bg-ergo-fog rounded-full mb-3 overflow-hidden">
              <div className="h-full bg-ergo-red rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="flex items-center justify-center gap-3 text-[11px] text-ergo-mute mb-5">
              <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> DSGVO-konform</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Antwort in 24h</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Check className="w-3 h-3 text-ergo-check" /> Kostenlos</span>
            </div>
          </>
        )}

        <div className={fadeClass}>

          {step === 1 && (
            <div>
              <div className="text-center mb-6">
                <p className="ergo-eyebrow">ERGO Agentur Stübe · Schadenservice</p>
                <h1 className="text-[30px] md:text-[40px] leading-[1.25] mb-2">Schaden melden</h1>
                <p className="text-sm text-ergo-stone">Wählen Sie die Art des Schadens aus</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {damageTypes.map(card => (
                  <button
                    key={card.type}
                    onClick={() => handleSelectType(card.type)}
                    className="ergo-option p-4 text-center flex flex-col items-center gap-2"
                  >
                    <span className="ergo-icon-disc w-10 h-10"><card.icon className="w-4 h-4" /></span>
                    <span className="font-sans font-bold text-ergo-ink text-sm">{card.title}</span>
                    {card.subtitle && <span className="text-xs text-ergo-stone -mt-1">{card.subtitle}</span>}
                  </button>
                ))}
                <Link
                  href="/schaden-unfall"
                  className="ergo-option p-4 text-center flex flex-col items-center gap-2"
                >
                  <span className="ergo-icon-disc w-10 h-10"><Ambulance className="w-4 h-4" /></span>
                  <span className="font-sans font-bold text-ergo-ink text-sm">Unfall</span>
                  <span className="text-xs text-ergo-stone -mt-1">Unfallversicherung</span>
                </Link>
              </div>
              <div className="mt-6 text-center">
                <Link href="/" className="ergo-link text-sm">Zurück zur Startseite</Link>
              </div>
            </div>
          )}

          {step === 2 && selectedType && (
            <div>
              <h2 className="text-[22px] mb-1 flex items-center gap-2">
                {(() => { const TypeIcon = damageTypeLabels[selectedType].icon; return <TypeIcon className="w-5 h-5 text-ergo-red shrink-0" />; })()}
                {damageTypeLabels[selectedType].title}
              </h2>
              {selectedType === 'glasschaden' && <p className="text-xs text-ergo-stone mb-1">In Kooperation mit Carglass</p>}
              <p className="text-sm text-ergo-stone mb-5">Bitte füllen Sie alle Pflichtfelder (*) aus.</p>
              <div className="ergo-card p-5 sm:p-6 flex flex-col gap-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-ergo-ink">Vorname *</label>
                    <input type="text" value={formData.vorname} onChange={e => updateField('vorname', e.target.value)} className={inputCls('vorname')} autoComplete="given-name" enterKeyHint="next" />
                    {errors.vorname && <span className="text-xs text-ergo-red">{errors.vorname}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-ergo-ink">Nachname *</label>
                    <input type="text" value={formData.nachname} onChange={e => updateField('nachname', e.target.value)} className={inputCls('nachname')} autoComplete="family-name" enterKeyHint="next" />
                    {errors.nachname && <span className="text-xs text-ergo-red">{errors.nachname}</span>}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-ergo-ink">Telefon *</label>
                  <input type="tel" inputMode="tel" value={formData.telefon} onChange={e => updateField('telefon', e.target.value)} className={inputCls('telefon')} autoComplete="tel" enterKeyHint="next" />
                  {errors.telefon && <span className="text-xs text-ergo-red">{errors.telefon}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-ergo-ink">E-Mail *</label>
                  <input type="email" inputMode="email" value={formData.email} onChange={e => updateField('email', e.target.value)} className={inputCls('email')} autoComplete="email" enterKeyHint="next" />
                  {errors.email && <span className="text-xs text-ergo-red">{errors.email}</span>}
                </div>

                {selectedType === 'glasschaden' && (
                  <>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-ergo-ink">Fahrzeugidentifikationsnummer (FIN) *</label>
                      <input type="text" value={formData.fin} onChange={e => updateField('fin', e.target.value)} placeholder="z.B. WVWZZZ3CZWE123456" className={inputCls('fin')} />
                      {errors.fin && <span className="text-xs text-ergo-red">{errors.fin}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-ergo-ink">Kennzeichen *</label>
                      <input type="text" value={formData.glasKennzeichen} onChange={e => updateField('glasKennzeichen', e.target.value.toUpperCase())} placeholder="z.B. OL-AB 1234" className={inputCls('glasKennzeichen')} />
                      {errors.glasKennzeichen && <span className="text-xs text-ergo-red">{errors.glasKennzeichen}</span>}
                    </div>

                    <div className="border-t border-ergo-line pt-4 mt-2">
                      <h3 className="text-base font-sans font-bold text-ergo-ink mb-3">Schadenfragen</h3>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-ergo-ink">Welche Scheibe ist beschädigt? *</label>
                      <div className="flex flex-col gap-2">
                        {[
                          { value: 'frontscheibe', label: 'Frontscheibe' },
                          { value: 'heckscheibe', label: 'Heckscheibe' },
                          { value: 'seitenscheibe_lv', label: 'Seitenscheibe links vorne' },
                          { value: 'seitenscheibe_lh', label: 'Seitenscheibe links hinten' },
                          { value: 'seitenscheibe_rv', label: 'Seitenscheibe rechts vorne' },
                          { value: 'seitenscheibe_rh', label: 'Seitenscheibe rechts hinten' },
                          { value: 'dachscheibe', label: 'Dachscheibe / Panoramadach' },
                        ].map(opt => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => updateField('glasScheibe', opt.value)}
                            className={`ergo-option w-full text-left px-4 py-3 text-sm font-semibold text-ergo-ink ${
                              formData.glasScheibe === opt.value
                                ? 'selected'
                                : ''
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      {errors.glasScheibe && <span className="text-xs text-ergo-red">{errors.glasScheibe}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-ergo-ink">Was liegt vor? *</label>
                      <div className="flex flex-col gap-2">
                        {[
                          { value: 'steinschlag', label: 'Steinschlag (einzeln)' },
                          { value: 'mehrere_steinschlaege', label: 'Mehrere Steinschläge' },
                          { value: 'riss', label: 'Riss' },
                          { value: 'eingeschlagen', label: 'Eingeschlagen / zerstört' },
                        ].map(opt => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              updateField('glasSchadensart', opt.value);
                              if (!['steinschlag', 'mehrere_steinschlaege', 'riss'].includes(opt.value)) {
                                updateField('glasBereich', '');
                              }
                              if (opt.value !== 'steinschlag') {
                                updateField('glasGroesse', '');
                              }
                            }}
                            className={`ergo-option w-full text-left px-4 py-3 text-sm font-semibold text-ergo-ink ${
                              formData.glasSchadensart === opt.value
                                ? 'selected'
                                : ''
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      {errors.glasSchadensart && <span className="text-xs text-ergo-red">{errors.glasSchadensart}</span>}
                    </div>

                    {['steinschlag', 'mehrere_steinschlaege', 'riss'].includes(formData.glasSchadensart) && (
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-ergo-ink">In welchem Bereich befindet sich der Schaden? *</label>
                        <div className="flex flex-col gap-2">
                          {[
                            { value: 'rand', label: 'Weniger als 10 cm vom Rand' },
                            { value: 'fahrsichtfeld', label: 'Fahrsichtfeld über dem Lenkrad' },
                            { value: 'anderer', label: 'Anderer Bereich' },
                          ].map(opt => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => updateField('glasBereich', opt.value)}
                              className={`ergo-option w-full text-left px-4 py-3 text-sm font-semibold text-ergo-ink ${
                                formData.glasBereich === opt.value
                                  ? 'selected'
                                  : ''
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                        {errors.glasBereich && <span className="text-xs text-ergo-red">{errors.glasBereich}</span>}
                      </div>
                    )}

                    {formData.glasSchadensart === 'steinschlag' && (
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-ergo-ink">Größe des Schlags *</label>
                        <div className="flex flex-col gap-2">
                          {[
                            { value: 'kleiner', label: 'Kleiner als eine 2-€-Münze' },
                            { value: 'groesser', label: 'Größer als eine 2-€-Münze' },
                          ].map(opt => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => updateField('glasGroesse', opt.value)}
                              className={`ergo-option w-full text-left px-4 py-3 text-sm font-semibold text-ergo-ink ${
                                formData.glasGroesse === opt.value
                                  ? 'selected'
                                  : ''
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                        {errors.glasGroesse && <span className="text-xs text-ergo-red">{errors.glasGroesse}</span>}
                      </div>
                    )}

                    <div className="bg-ergo-gray border border-ergo-line rounded-lg p-4 mt-2">
                      <p className="text-sm text-ergo-ink">
                        <span className="font-bold">Hinweis:</span> Nach Eingang Ihrer Meldung koordinieren wir gemeinsam mit unserem Partner Carglass einen Reparaturtermin – direkt bei Ihnen oder in einer Carglass-Filiale.
                      </p>
                    </div>
                  </>
                )}

                {selectedType !== 'glasschaden' && (
                  <>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-ergo-ink">Versicherungsnummer *</label>
                      <input type="text" value={formData.versicherungsnummer} onChange={e => updateField('versicherungsnummer', e.target.value)} className={inputCls('versicherungsnummer')} />
                      {errors.versicherungsnummer && <span className="text-xs text-ergo-red">{errors.versicherungsnummer}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-ergo-ink">Schadendatum *</label>
                      <input type="date" value={formData.schadendatum} onChange={e => updateField('schadendatum', e.target.value)} className={inputCls('schadendatum')} />
                      {errors.schadendatum && <span className="text-xs text-ergo-red">{errors.schadendatum}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-ergo-ink">Schadenort *</label>
                      <input type="text" value={formData.schadenort} onChange={e => updateField('schadenort', e.target.value)} placeholder="Straße, Ort wo der Schaden passiert ist" className={inputCls('schadenort')} />
                      {errors.schadenort && <span className="text-xs text-ergo-red">{errors.schadenort}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-ergo-ink">Schadensbeschreibung *</label>
                      <textarea value={formData.beschreibung} onChange={e => updateField('beschreibung', e.target.value)} placeholder="Bitte beschreiben Sie den Schaden so genau wie möglich..." rows={4} className={inputCls('beschreibung')} />
                      {errors.beschreibung && <span className="text-xs text-ergo-red">{errors.beschreibung}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-ergo-ink">Bereits polizeilich gemeldet?</label>
                      {renderRadioGroup('polizeiGemeldet', [
                        { value: 'ja', label: 'Ja' },
                        { value: 'nein', label: 'Nein' },
                        { value: 'nicht_zutreffend', label: 'Nicht zutreffend' },
                      ])}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-ergo-ink">Geschätzter Schaden in €</label>
                      <input type="number" value={formData.geschaetzterSchaden} onChange={e => updateField('geschaetzterSchaden', e.target.value)} className={inputCls('geschaetzterSchaden')} />
                    </div>
                  </>
                )}

                {selectedType === 'kfz' && (
                  <>
                    <div className="border-t border-ergo-line pt-4 mt-2">
                      <h3 className="text-base font-sans font-bold text-ergo-ink mb-3">Kfz-spezifische Angaben</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-ergo-ink">Kennzeichen *</label>
                      <input type="text" value={formData.kennzeichen} onChange={e => updateField('kennzeichen', e.target.value)} className={inputCls('kennzeichen')} />
                      {errors.kennzeichen && <span className="text-xs text-ergo-red">{errors.kennzeichen}</span>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-ergo-ink">Unfallgegner vorhanden?</label>
                      {renderRadioGroup('unfallgegner', [
                        { value: 'ja', label: 'Ja' },
                        { value: 'nein', label: 'Nein' },
                      ])}
                    </div>
                    {formData.unfallgegner === 'ja' && (
                      <>
                        <div className="flex flex-col gap-1">
                          <label className="text-sm font-semibold text-ergo-ink">Name des Gegners</label>
                          <input type="text" value={formData.gegnerName} onChange={e => updateField('gegnerName', e.target.value)} className={inputCls('gegnerName')} />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-sm font-semibold text-ergo-ink">Kennzeichen des Gegners</label>
                          <input type="text" value={formData.gegnerKennzeichen} onChange={e => updateField('gegnerKennzeichen', e.target.value)} className={inputCls('gegnerKennzeichen')} />
                        </div>
                      </>
                    )}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-ergo-ink">Fahrzeug fahrbereit?</label>
                      {renderRadioGroup('fahrbereit', [
                        { value: 'ja', label: 'Ja' },
                        { value: 'nein', label: 'Nein' },
                      ])}
                    </div>
                  </>
                )}

                {(selectedType === 'hausrat' || selectedType === 'gebaeude') && (
                  <>
                    <div className="border-t border-ergo-line pt-4 mt-2">
                      <h3 className="text-base font-sans font-bold text-ergo-ink mb-3">Weitere Angaben</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-ergo-ink">Betroffene Räume/Bereiche</label>
                      <input type="text" value={formData.betroffeneRaeume} onChange={e => updateField('betroffeneRaeume', e.target.value)} className={inputCls('betroffeneRaeume')} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-ergo-ink">Ursache</label>
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
                      <label className="text-sm font-semibold text-ergo-ink">Wurden bereits Notmaßnahmen ergriffen?</label>
                      {renderRadioGroup('notmassnahmen', [
                        { value: 'ja', label: 'Ja' },
                        { value: 'nein', label: 'Nein' },
                      ])}
                    </div>
                  </>
                )}

                {selectedType === 'rechtsschutz' && (
                  <>
                    <div className="border-t border-ergo-line pt-4 mt-2">
                      <h3 className="text-base font-sans font-bold text-ergo-ink mb-3">Rechtsschutz-Angaben</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-ergo-ink">Gegenseite</label>
                      <input type="text" value={formData.gegenseite} onChange={e => updateField('gegenseite', e.target.value)} placeholder="Name/Firma des Gegners" className={inputCls('gegenseite')} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-ergo-ink">Art des Rechtsstreits</label>
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
                      <label className="text-sm font-semibold text-ergo-ink">Anwalt bereits beauftragt?</label>
                      {renderRadioGroup('anwaltBeauftragt', [
                        { value: 'ja', label: 'Ja' },
                        { value: 'nein', label: 'Nein' },
                      ])}
                    </div>
                  </>
                )}

                {selectedType === 'bu' && (
                  <>
                    <div className="border-t border-ergo-line pt-4 mt-2">
                      <h3 className="text-base font-sans font-bold text-ergo-ink mb-3">BU-spezifische Angaben</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-ergo-ink">Erkrankung/Ursache</label>
                      <input type="text" value={formData.erkrankung} onChange={e => updateField('erkrankung', e.target.value)} className={inputCls('erkrankung')} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-ergo-ink">Arbeitsunfähig seit</label>
                      <input type="date" value={formData.arbeitsunfaehigSeit} onChange={e => updateField('arbeitsunfaehigSeit', e.target.value)} className={inputCls('arbeitsunfaehigSeit')} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-ergo-ink">Arzt bereits aufgesucht?</label>
                      {renderRadioGroup('arztAufgesucht', [
                        { value: 'ja', label: 'Ja' },
                        { value: 'nein', label: 'Nein' },
                      ])}
                    </div>
                  </>
                )}

                {selectedType === 'haftpflicht' && (
                  <>
                    <div className="border-t border-ergo-line pt-4 mt-2">
                      <h3 className="text-base font-sans font-bold text-ergo-ink mb-3">Haftpflicht-Angaben</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-ergo-ink">Bitte beschreiben Sie den Haftpflichtfall *</label>
                      <p className="text-xs text-ergo-stone mb-1">z.B. wem gegenüber ein Schaden entstanden ist, wie es dazu kam, geschätzter Schadenbetrag</p>
                      <textarea value={formData.weitereDetails} onChange={e => updateField('weitereDetails', e.target.value)} rows={4} className={inputCls('weitereDetails')} />
                      {errors.weitereDetails && <span className="text-xs text-ergo-red">{errors.weitereDetails}</span>}
                    </div>
                  </>
                )}

                {selectedType === 'sonstiges' && (
                  <>
                    <div className="border-t border-ergo-line pt-4 mt-2">
                      <h3 className="text-base font-sans font-bold text-ergo-ink mb-3">Weitere Angaben</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-ergo-ink">Weitere Details</label>
                      <textarea value={formData.weitereDetails} onChange={e => updateField('weitereDetails', e.target.value)} rows={3} className={inputCls('weitereDetails')} />
                    </div>
                  </>
                )}

                <div className="border-t border-ergo-line pt-4 mt-2">
                  <h3 className="text-base font-sans font-bold text-ergo-ink mb-2 flex items-center gap-2"><Camera className="w-4 h-4 text-ergo-red" /> Fotos & Dokumente anhängen (optional)</h3>
                  <p className="text-xs text-ergo-stone mb-3">Fotografieren Sie den Schaden direkt oder laden Sie vorhandene Bilder hoch. Das beschleunigt die Bearbeitung erheblich.</p>

                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="ergo-btn ergo-btn--secondary ergo-btn--sm flex-1"
                    >
                      <Upload className="w-4 h-4" /> Dateien auswählen
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.capture = 'environment';
                        input.onchange = (e) => { handleFiles((e.target as HTMLInputElement).files); };
                        input.click();
                      }}
                      className="ergo-btn ergo-btn--tertiary ergo-btn--sm"
                    >
                      <Camera className="w-4 h-4" /> Kamera
                    </button>
                  </div>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={e => { e.preventDefault(); setIsDragOver(false); handleFiles(e.dataTransfer.files); }}
                    className={`border-dashed border-2 rounded-lg p-4 text-center cursor-pointer transition-colors ${
                      isDragOver ? 'border-ergo-red bg-ergo-red-light' : 'border-ergo-line hover:border-ergo-red'
                    }`}
                  >
                    <p className="text-xs text-ergo-mute">Oder Dateien hierher ziehen (max. 5 Dateien, je max. 5 MB)</p>
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
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-ergo-ink mb-2">{files.length} Datei{files.length !== 1 ? 'en' : ''} ausgewählt:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {files.map((file, i) => (
                          <div key={i} className="relative group ergo-card overflow-hidden">
                            {file.type.startsWith('image/') ? (
                              <img src={URL.createObjectURL(file)} alt="" className="w-full h-24 object-cover" />
                            ) : (
                              <div className="w-full h-24 bg-ergo-gray flex items-center justify-center"><FileText className="w-6 h-6 text-ergo-red" /></div>
                            )}
                            <div className="p-2">
                              <p className="text-xs font-medium text-ergo-ink truncate">{file.name}</p>
                              <p className="text-xs text-ergo-mute">{formatFileSize(file.size)}</p>
                            </div>
                            <button
                              onClick={() => removeFile(i)}
                              className="absolute -top-1 -right-1 w-8 h-8 bg-ergo-red text-white rounded-full flex items-center justify-center opacity-90 hover:opacity-100"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleStep2Next}
                  className="ergo-btn ergo-btn--primary w-full mt-2"
                >
                  Weiter zur Übersicht →
                </button>
              </div>
            </div>
          )}

          {step === 3 && selectedType && (
            <div>
              <h2 className="text-[22px] mb-4">Zusammenfassung</h2>

              <div className="ergo-card p-5 flex flex-col gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <span className="ergo-icon-disc w-10 h-10">
                    {(() => { const TypeIcon = damageTypeLabels[selectedType].icon; return <TypeIcon className="w-4 h-4" />; })()}
                  </span>
                  <span className="font-sans font-bold text-ergo-ink">{damageTypeLabels[selectedType].title}</span>
                </div>
                <div className="flex flex-col gap-1.5 text-sm text-ergo-ink">
                  <p><span className="font-semibold">Name:</span> {formData.vorname} {formData.nachname}</p>
                  <p><span className="font-semibold">E-Mail:</span> {formData.email}</p>
                  <p><span className="font-semibold">Telefon:</span> {formData.telefon}</p>
                  {selectedType === 'glasschaden' ? (
                    <>
                      <p><span className="font-semibold">FIN:</span> {formData.fin}</p>
                      <p><span className="font-semibold">Kennzeichen:</span> {formData.glasKennzeichen}</p>
                      <p><span className="font-semibold">Scheibe:</span> {glasScheibeLabel(formData.glasScheibe)}</p>
                      <p><span className="font-semibold">Schadensart:</span> {glasSchadensartLabel(formData.glasSchadensart)}</p>
                      {formData.glasBereich && <p><span className="font-semibold">Bereich:</span> {glasBereichLabel(formData.glasBereich)}</p>}
                      {formData.glasGroesse && <p><span className="font-semibold">Größe:</span> {glasGroesseLabel(formData.glasGroesse)}</p>}
                    </>
                  ) : (
                    <>
                      <p><span className="font-semibold">Schadendatum:</span> {formData.schadendatum}</p>
                      <p><span className="font-semibold">Schadenort:</span> {formData.schadenort}</p>
                      <p><span className="font-semibold">Beschreibung:</span> {formData.beschreibung.length > 200 ? formData.beschreibung.slice(0, 200) + '...' : formData.beschreibung}</p>
                    </>
                  )}
                  <p><span className="font-semibold">Anzahl Dateien:</span> {files.length}</p>
                </div>
                <p className="text-xs text-ergo-stone mt-1">Alles korrekt? Bitte prüfen Sie Ihre Angaben.</p>
              </div>

              <div className="flex flex-col gap-3 mb-5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={confirm1} onChange={e => { setConfirm1(e.target.checked); if (errors.confirm1) setErrors(prev => { const n = { ...prev }; delete n.confirm1; return n; }); }} className="mt-0.5 w-5 h-5 accent-ergo-red shrink-0 cursor-pointer" />
                  <span className="text-sm text-ergo-ink">Alle Angaben sind korrekt und vollständig.</span>
                </label>
                {errors.confirm1 && <span className="text-xs text-ergo-red ml-7">{errors.confirm1}</span>}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={confirm2} onChange={e => { setConfirm2(e.target.checked); if (errors.confirm2) setErrors(prev => { const n = { ...prev }; delete n.confirm2; return n; }); }} className="mt-0.5 w-5 h-5 accent-ergo-red shrink-0 cursor-pointer" />
                  <span className="text-sm text-ergo-ink">Ich bin mit der elektronischen Übermittlung einverstanden.</span>
                </label>
                {errors.confirm2 && <span className="text-xs text-ergo-red ml-7">{errors.confirm2}</span>}
              </div>

              {submitError && (
                <div className="bg-ergo-red-light border border-ergo-red/30 rounded-lg p-4 mb-4 text-sm text-ergo-red">{submitError}</div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="ergo-btn ergo-btn--primary w-full"
              >
                {isSubmitting ? 'Wird übermittelt...' : 'Schaden jetzt melden'}
              </button>
              <p className="text-center text-xs text-ergo-mute mt-3">
                Lieber per WhatsApp?{' '}
                <a href="https://wa.me/4915566771019?text=Hallo%20Herr%20St%C3%BCbe%2C%20ich%20m%C3%B6chte%20einen%20Schaden%20melden." target="_blank" rel="noopener noreferrer" className="text-[#1da851] font-bold underline">
                  Direkt schreiben →
                </a>
              </p>
            </div>
          )}

          {step === 4 && selectedType && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-ergo-check rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-white" />
                </div>
              </div>

              <h2 className="text-2xl mb-2">Schadensmeldung eingegangen!</h2>
              <p className="text-sm text-ergo-stone mb-4">Morino Stübe wurde informiert und wird sich innerhalb von 24 Stunden bei Ihnen melden.</p>
              <div className="flex items-center justify-center gap-3 mb-5 text-xs text-ergo-stone">
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-ergo-yellow text-ergo-yellow" /> 4,9/5 Bewertung</span>
                <span>·</span>
                <span>ERGO Versicherungsfachmann</span>
              </div>

              <div className="bg-ergo-red-light border border-ergo-red/30 rounded-lg p-4 mb-5 text-left">
                <p className="text-sm font-semibold text-ergo-red flex items-center gap-2"><AlertTriangle className="w-4 h-4 shrink-0" /> Bei dringendem Notfall rufen Sie bitte direkt an:</p>
                <a href="tel:015566771019" className="text-base font-bold text-ergo-red underline mt-1 inline-block">015566771019</a>
              </div>

              <div className="ergo-card p-4 mb-5 text-left flex flex-col gap-1.5 text-sm text-ergo-ink">
                <p><span className="font-semibold">Schadensart:</span> {damageTypeLabels[selectedType].title}</p>
                <p><span className="font-semibold">Name:</span> {formData.vorname} {formData.nachname}</p>
                <p><span className="font-semibold">Eingereicht am:</span> {new Date().toLocaleDateString('de-DE')}</p>
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href="https://wa.me/4915566771019?text=Hallo%20Herr%20St%C3%BCbe%2C%20ich%20habe%20gerade%20eine%20Schadensmeldung%20eingereicht."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ergo-btn ergo-btn--whatsapp w-full"
                >
                  <MessageCircle className="w-5 h-5" /> WhatsApp schreiben
                </a>
                <Link href="/" className="ergo-btn ergo-btn--tertiary w-full">
                  <ChevronLeft className="w-5 h-5" /> Zurück zur Startseite
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}