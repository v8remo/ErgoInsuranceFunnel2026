import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Briefcase, Building2, Camera, Car, CarFront, Check, ChevronLeft, ClipboardList, FileText, HeartPulse, House, MessageCircle, Phone, Scale, Shield, Upload, X, type LucideIcon } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import SEO from "@/components/SEO";
import ServiceLayout, { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_URL } from "@/components/service/ServiceLayout";

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
  { type: 'kfz', icon: Car, title: 'Kfz-Schaden' },
  { type: 'glasschaden', icon: CarFront, title: 'Kfz-Glasschaden', subtitle: 'In Kooperation mit Carglass' },
  { type: 'hausrat', icon: House, title: 'Hausrat-Schaden' },
  { type: 'gebaeude', icon: Building2, title: 'Gebäudeschaden' },
  { type: 'rechtsschutz', icon: Scale, title: 'Rechtsschutz-Fall' },
  { type: 'haftpflicht', icon: Shield, title: 'Haftpflicht-Schaden' },
  { type: 'bu', icon: Briefcase, title: 'Berufsunfähigkeit' },
  { type: 'sonstiges', icon: ClipboardList, title: 'Sonstiger Schaden' },
];

const damageTypeLabels: Record<DamageType, { title: string }> = {
  kfz: { title: 'Kfz-Schaden' },
  glasschaden: { title: 'Kfz-Glasschaden' },
  hausrat: { title: 'Hausrat-Schaden' },
  gebaeude: { title: 'Gebäudeschaden' },
  rechtsschutz: { title: 'Rechtsschutz-Fall' },
  haftpflicht: { title: 'Haftpflicht-Schaden' },
  bu: { title: 'Berufsunfähigkeit' },
  sonstiges: { title: 'Sonstiger Schaden' },
};

export default function SchadenPage() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<DamageType | null>(null);
  const [formData, setFormData] = useState<FormData>({ ...initialFormData });
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
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

      const res = await apiRequest('POST', '/api/schaden/submit', payload);
      setReference((await res.json().catch(() => ({}))).reference ?? null);
      goToStep(4);
    } catch (err: any) {
      setSubmitError(err.message || 'Fehler beim Senden. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const clearError = (key: string) => {
    if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const cardStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 };

  const renderField = (label: string, field: keyof FormData, type = 'text', opts: { placeholder?: string; required?: boolean; transform?: (v: string) => string; extra?: React.InputHTMLAttributes<HTMLInputElement> } = {}) => {
    const required = opts.required ?? true;
    return (
      <div className="sv-field">
        <label className="sv-label" htmlFor={`f-${field}`}>{label}{!required && <span className="sv-hint"> (optional)</span>}</label>
        <input
          id={`f-${field}`}
          type={type}
          value={formData[field]}
          onChange={e => updateField(field, opts.transform ? opts.transform(e.target.value) : e.target.value)}
          placeholder={opts.placeholder}
          className="sv-input"
          aria-invalid={!!errors[field]}
          {...opts.extra}
        />
        {errors[field] && <span className="sv-error">{errors[field]}</span>}
      </div>
    );
  };

  const renderTextarea = (label: string, field: keyof FormData, rows: number, opts: { placeholder?: string; hint?: string } = {}) => (
    <div className="sv-field">
      <label className="sv-label" htmlFor={`f-${field}`}>{label}</label>
      {opts.hint && <span className="sv-hint" id={`h-${field}`}>{opts.hint}</span>}
      <textarea
        id={`f-${field}`}
        value={formData[field]}
        onChange={e => updateField(field, e.target.value)}
        placeholder={opts.placeholder}
        rows={rows}
        className="sv-input"
        aria-invalid={!!errors[field]}
        aria-describedby={opts.hint ? `h-${field}` : undefined}
      />
      {errors[field] && <span className="sv-error">{errors[field]}</span>}
    </div>
  );

  const renderSelect = (label: string, field: keyof FormData, options: string[]) => (
    <div className="sv-field">
      <label className="sv-label" htmlFor={`f-${field}`}>{label}</label>
      <select id={`f-${field}`} value={formData[field]} onChange={e => updateField(field, e.target.value)} className="sv-input" aria-invalid={!!errors[field]}>
        <option value="">Bitte auswählen</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {errors[field] && <span className="sv-error">{errors[field]}</span>}
    </div>
  );

  // Auswahl als echte Buttons: weiße Karte, ausgewählt mit Rand in Tintenfarbe.
  const renderChoice = (label: string, field: keyof FormData, options: { value: string; label: string }[], opts: { stacked?: boolean; onSelect?: (value: string) => void } = {}) => (
    <fieldset className="sv-field" style={{ border: 'none', margin: 0, padding: 0 }}>
      <legend className="sv-label" style={{ marginBottom: 8 }}>{label}</legend>
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: opts.stacked ? '1fr' : `repeat(${Math.min(options.length, 3)}, minmax(0, 1fr))` }}>
        {options.map(opt => {
          const selected = formData[field] === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={selected}
              onClick={() => (opts.onSelect ? opts.onSelect(opt.value) : updateField(field, opt.value))}
              style={{
                minHeight: 48, padding: '10px 14px', borderRadius: 6, background: '#fff',
                border: `1.5px solid ${selected ? 'var(--sv-ink)' : 'var(--sv-line)'}`,
                display: 'flex', alignItems: 'center', justifyContent: opts.stacked ? 'space-between' : 'center', gap: 8,
                font: 'inherit', fontSize: 15, fontWeight: selected ? 700 : 600, color: 'var(--sv-ink)',
                textAlign: opts.stacked ? 'left' : 'center', cursor: 'pointer',
              }}
            >
              {opt.label}
              {selected && <Check size={18} aria-hidden="true" style={{ flexShrink: 0 }} />}
            </button>
          );
        })}
      </div>
      {errors[field] && <span className="sv-error">{errors[field]}</span>}
    </fieldset>
  );

  const openCamera = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => { handleFiles((e.target as HTMLInputElement).files); };
    input.click();
  };

  const stepNames = ['Schadenart', 'Angaben', 'Prüfen', 'Fertig'];
  const currentStepName = stepNames[step - 1];
  const SelectedIcon = selectedType ? damageTypes.find(d => d.type === selectedType)!.icon : null;

  return (
    <ServiceLayout>
      <SEO
        title="Schaden melden – Agentur Stübe Ganderkesee"
        description="Versicherungsschaden schnell und einfach online melden. Kfz-Schaden, Glasschaden, Hausrat oder Haftpflicht – die Agentur Stübe in Ganderkesee hilft Ihnen weiter."
        keywords="Schaden melden, Versicherungsschaden, Ganderkesee, Kfz-Schaden, Glasschaden melden, Schadensmeldung"
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
                <li key={name} aria-current={name === currentStepName ? 'step' : undefined} style={{ display: 'flex', gap: 8 }}>
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
              <h1 className="sv-h1">Schaden <em>melden</em></h1>
              <p style={{ margin: 0, color: 'var(--sv-body)' }}>Welche Art von Schaden möchten Sie melden?</p>
              <div className="grid grid-cols-2 gap-3">
                {damageTypes.map(card => {
                  const Icon = card.icon;
                  return (
                    <button
                      key={card.type}
                      type="button"
                      onClick={() => handleSelectType(card.type)}
                      aria-pressed={selectedType === card.type}
                      className="sv-tile"
                      style={{ border: 'none', font: 'inherit', color: 'var(--sv-ink)', textAlign: 'left', cursor: 'pointer', minHeight: 96 }}
                    >
                      <Icon size={24} strokeWidth={1.7} aria-hidden="true" />
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{card.title}</span>
                      {card.subtitle && <span className="sv-hint">{card.subtitle}</span>}
                    </button>
                  );
                })}
                <Link href="/schaden-unfall" className="sv-tile" style={{ minHeight: 96 }}>
                  <HeartPulse size={24} strokeWidth={1.7} aria-hidden="true" />
                  <span style={{ fontWeight: 700, fontSize: 15 }}>Unfall</span>
                  <span className="sv-hint">Unfallversicherung</span>
                </Link>
              </div>
            </div>
          )}

          {step === 2 && selectedType && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <h1 className="sv-h1">{damageTypeLabels[selectedType].title}</h1>
                {selectedType === 'glasschaden' && <span className="sv-hint" style={{ fontSize: 15 }}>In Kooperation mit Carglass</span>}
              </div>

              <div className="sv-card" style={cardStyle}>
                <h2 className="sv-section-title" style={{ marginTop: 0 }}>Persönliche Daten</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderField('Vorname', 'vorname', 'text', { extra: { autoComplete: 'given-name', enterKeyHint: 'next' } })}
                  {renderField('Nachname', 'nachname', 'text', { extra: { autoComplete: 'family-name', enterKeyHint: 'next' } })}
                </div>
                {renderField('Telefon', 'telefon', 'tel', { extra: { inputMode: 'tel', autoComplete: 'tel', enterKeyHint: 'next' } })}
                {renderField('E-Mail', 'email', 'email', { placeholder: 'name@beispiel.de', extra: { inputMode: 'email', autoComplete: 'email', enterKeyHint: 'next' } })}
              </div>

              {selectedType === 'glasschaden' && (
                <>
                  <div className="sv-card" style={cardStyle}>
                    <h2 className="sv-section-title" style={{ marginTop: 0 }}>Fahrzeug</h2>
                    {renderField('Fahrzeugidentifikationsnummer (FIN)', 'fin', 'text', { placeholder: 'z. B. WVWZZZ3CZWE123456', extra: { autoCapitalize: 'characters', autoComplete: 'off' } })}
                    {renderField('Kennzeichen', 'glasKennzeichen', 'text', { placeholder: 'z. B. OL-AB 1234', transform: v => v.toUpperCase(), extra: { autoCapitalize: 'characters', autoComplete: 'off' } })}
                  </div>

                  <div className="sv-card" style={cardStyle}>
                    <h2 className="sv-section-title" style={{ marginTop: 0 }}>Schadenfragen</h2>
                    {renderChoice('Welche Scheibe ist beschädigt?', 'glasScheibe', [
                      { value: 'frontscheibe', label: 'Frontscheibe' },
                      { value: 'heckscheibe', label: 'Heckscheibe' },
                      { value: 'seitenscheibe_lv', label: 'Seitenscheibe links vorne' },
                      { value: 'seitenscheibe_lh', label: 'Seitenscheibe links hinten' },
                      { value: 'seitenscheibe_rv', label: 'Seitenscheibe rechts vorne' },
                      { value: 'seitenscheibe_rh', label: 'Seitenscheibe rechts hinten' },
                      { value: 'dachscheibe', label: 'Dachscheibe / Panoramadach' },
                    ], { stacked: true })}
                    {renderChoice('Was liegt vor?', 'glasSchadensart', [
                      { value: 'steinschlag', label: 'Steinschlag (einzeln)' },
                      { value: 'mehrere_steinschlaege', label: 'Mehrere Steinschläge' },
                      { value: 'riss', label: 'Riss' },
                      { value: 'eingeschlagen', label: 'Eingeschlagen / zerstört' },
                    ], {
                      stacked: true,
                      onSelect: value => {
                        updateField('glasSchadensart', value);
                        if (!['steinschlag', 'mehrere_steinschlaege', 'riss'].includes(value)) {
                          updateField('glasBereich', '');
                        }
                        if (value !== 'steinschlag') {
                          updateField('glasGroesse', '');
                        }
                      },
                    })}
                    {['steinschlag', 'mehrere_steinschlaege', 'riss'].includes(formData.glasSchadensart) && (
                      <div className="sv-subbox">
                        {renderChoice('In welchem Bereich befindet sich der Schaden?', 'glasBereich', [
                          { value: 'rand', label: 'Weniger als 10 cm vom Rand' },
                          { value: 'fahrsichtfeld', label: 'Fahrsichtfeld über dem Lenkrad' },
                          { value: 'anderer', label: 'Anderer Bereich' },
                        ], { stacked: true })}
                      </div>
                    )}
                    {formData.glasSchadensart === 'steinschlag' && (
                      <div className="sv-subbox">
                        {renderChoice('Größe des Schlags', 'glasGroesse', [
                          { value: 'kleiner', label: 'Kleiner als eine 2-€-Münze' },
                          { value: 'groesser', label: 'Größer als eine 2-€-Münze' },
                        ], { stacked: true })}
                      </div>
                    )}
                    <p className="sv-hint" style={{ margin: 0, fontSize: 14 }}>
                      Nach Eingang Ihrer Meldung stimmen wir mit unserem Partner Carglass einen Reparaturtermin mit Ihnen ab – bei Ihnen vor Ort oder in einer Carglass-Filiale.
                    </p>
                  </div>
                </>
              )}

              {selectedType !== 'glasschaden' && (
                <div className="sv-card" style={cardStyle}>
                  <h2 className="sv-section-title" style={{ marginTop: 0 }}>Zum Schaden</h2>
                  {renderField('Versicherungsnummer', 'versicherungsnummer', 'text', { extra: { autoComplete: 'off' } })}
                  {renderField('Schadendatum', 'schadendatum', 'date')}
                  {renderField('Schadenort', 'schadenort', 'text', { placeholder: 'Straße, Ort, an dem der Schaden passiert ist' })}
                  {renderTextarea('Schadensbeschreibung', 'beschreibung', 4, { placeholder: 'Bitte beschreiben Sie den Schaden so genau wie möglich …', hint: 'Mindestens 20 Zeichen.' })}
                  {renderChoice('Bereits polizeilich gemeldet?', 'polizeiGemeldet', [
                    { value: 'ja', label: 'Ja' },
                    { value: 'nein', label: 'Nein' },
                    { value: 'nicht_zutreffend', label: 'Nicht zutreffend' },
                  ])}
                  {renderField('Geschätzter Schaden in €', 'geschaetzterSchaden', 'number', { required: false, extra: { inputMode: 'decimal' } })}
                </div>
              )}

              {selectedType === 'kfz' && (
                <div className="sv-card" style={cardStyle}>
                  <h2 className="sv-section-title" style={{ marginTop: 0 }}>Fahrzeug</h2>
                  {renderField('Kennzeichen', 'kennzeichen', 'text', { extra: { autoCapitalize: 'characters', autoComplete: 'off' } })}
                  {renderChoice('Unfallgegner vorhanden?', 'unfallgegner', [
                    { value: 'ja', label: 'Ja' },
                    { value: 'nein', label: 'Nein' },
                  ])}
                  {formData.unfallgegner === 'ja' && (
                    <div className="sv-subbox">
                      {renderField('Name des Gegners', 'gegnerName')}
                      {renderField('Kennzeichen des Gegners', 'gegnerKennzeichen', 'text', { extra: { autoCapitalize: 'characters', autoComplete: 'off' } })}
                    </div>
                  )}
                  {renderChoice('Fahrzeug fahrbereit?', 'fahrbereit', [
                    { value: 'ja', label: 'Ja' },
                    { value: 'nein', label: 'Nein' },
                  ])}
                </div>
              )}

              {(selectedType === 'hausrat' || selectedType === 'gebaeude') && (
                <div className="sv-card" style={cardStyle}>
                  <h2 className="sv-section-title" style={{ marginTop: 0 }}>Weitere Angaben</h2>
                  {renderField('Betroffene Räume/Bereiche', 'betroffeneRaeume')}
                  {renderSelect('Ursache', 'ursache', ['Einbruch', 'Wasserschaden', 'Sturm/Hagel', 'Brand', 'Sonstiges'])}
                  {renderChoice('Wurden bereits Notmaßnahmen ergriffen?', 'notmassnahmen', [
                    { value: 'ja', label: 'Ja' },
                    { value: 'nein', label: 'Nein' },
                  ])}
                </div>
              )}

              {selectedType === 'rechtsschutz' && (
                <div className="sv-card" style={cardStyle}>
                  <h2 className="sv-section-title" style={{ marginTop: 0 }}>Rechtsschutz-Angaben</h2>
                  {renderField('Gegenseite', 'gegenseite', 'text', { placeholder: 'Name/Firma des Gegners' })}
                  {renderSelect('Art des Rechtsstreits', 'rechtsstreitArt', ['Arbeitsrecht', 'Verkehrsrecht', 'Mietrecht', 'Vertragsrecht', 'Sonstiges'])}
                  {renderChoice('Anwalt bereits beauftragt?', 'anwaltBeauftragt', [
                    { value: 'ja', label: 'Ja' },
                    { value: 'nein', label: 'Nein' },
                  ])}
                </div>
              )}

              {selectedType === 'bu' && (
                <div className="sv-card" style={cardStyle}>
                  <h2 className="sv-section-title" style={{ marginTop: 0 }}>Angaben zur Berufsunfähigkeit</h2>
                  {renderField('Erkrankung/Ursache', 'erkrankung')}
                  {renderField('Arbeitsunfähig seit', 'arbeitsunfaehigSeit', 'date')}
                  {renderChoice('Arzt bereits aufgesucht?', 'arztAufgesucht', [
                    { value: 'ja', label: 'Ja' },
                    { value: 'nein', label: 'Nein' },
                  ])}
                </div>
              )}

              {selectedType === 'haftpflicht' && (
                <div className="sv-card" style={cardStyle}>
                  <h2 className="sv-section-title" style={{ marginTop: 0 }}>Haftpflicht-Angaben</h2>
                  {renderTextarea('Bitte beschreiben Sie den Haftpflichtfall', 'weitereDetails', 4, { hint: 'z. B. wem gegenüber ein Schaden entstanden ist, wie es dazu kam, geschätzter Schadenbetrag' })}
                </div>
              )}

              {selectedType === 'sonstiges' && (
                <div className="sv-card" style={cardStyle}>
                  <h2 className="sv-section-title" style={{ marginTop: 0 }}>Weitere Angaben</h2>
                  {renderTextarea('Weitere Details', 'weitereDetails', 3)}
                </div>
              )}

              <div className="sv-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <h2 className="sv-section-title" style={{ marginTop: 0 }}>Fotos &amp; Dokumente <span className="sv-hint" style={{ fontFamily: 'inherit' }}>(optional)</span></h2>
                <p className="sv-hint" style={{ margin: 0, fontSize: 14 }}>Fotografieren Sie den Schaden direkt oder laden Sie vorhandene Bilder hoch. Fotos helfen uns bei der Bearbeitung.</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  multiple
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
                  style={isDragOver ? { background: 'var(--sv-accent-soft)', borderColor: 'var(--sv-accent)' } : undefined}
                >
                  <Upload size={26} strokeWidth={1.7} aria-hidden="true" />
                  <span style={{ fontWeight: 700 }}>Fotos oder PDFs auswählen</span>
                  <span className="sv-hint">Bis zu 5 Dateien, je max. 5 MB</span>
                </button>
                <button type="button" onClick={openCamera} disabled={files.length >= 5} className="sv-btn sv-btn--ghost">
                  <Camera size={18} aria-hidden="true" /> Foto aufnehmen
                </button>
                {files.map((file, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid var(--sv-line)', paddingTop: 10 }}>
                    {file.type.startsWith('image/') ? (
                      <img src={URL.createObjectURL(file)} alt="" style={{ width: 48, height: 48, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
                    ) : (
                      <span style={{ width: 48, height: 48, borderRadius: 6, background: 'var(--sv-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FileText size={22} aria-hidden="true" />
                      </span>
                    )}
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                      <span className="sv-hint">{formatFileSize(file.size)}</span>
                    </span>
                    <button type="button" onClick={() => removeFile(i)} aria-label={`${file.name} entfernen`} style={{ width: 44, height: 44, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--sv-ink)' }}>
                      <X size={18} aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>

              <button type="button" onClick={handleStep2Next} className="sv-btn">
                Weiter zur Übersicht <ArrowRight size={18} aria-hidden="true" />
              </button>
              {Object.keys(errors).length > 0 && (
                <p className="sv-error" role="alert" style={{ margin: 0, textAlign: 'center' }}>Bitte prüfen Sie die markierten Felder.</p>
              )}
            </div>
          )}

          {step === 3 && selectedType && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <h1 className="sv-h1">Alles richtig? <em>Bitte prüfen.</em></h1>

              <div className="sv-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {SelectedIcon && <SelectedIcon size={22} strokeWidth={1.7} aria-hidden="true" />}
                  <span style={{ fontWeight: 700 }}>{damageTypeLabels[selectedType].title}</span>
                </div>
                <dl className="sv-dl">
                  <dt>Name</dt><dd>{formData.vorname} {formData.nachname}</dd>
                  <dt>E-Mail</dt><dd style={{ overflowWrap: 'anywhere' }}>{formData.email}</dd>
                  <dt>Telefon</dt><dd>{formData.telefon}</dd>
                  {selectedType === 'glasschaden' ? (
                    <>
                      <dt>FIN</dt><dd style={{ overflowWrap: 'anywhere' }}>{formData.fin}</dd>
                      <dt>Kennzeichen</dt><dd>{formData.glasKennzeichen}</dd>
                      <dt>Scheibe</dt><dd>{glasScheibeLabel(formData.glasScheibe)}</dd>
                      <dt>Schadensart</dt><dd>{glasSchadensartLabel(formData.glasSchadensart)}</dd>
                      {formData.glasBereich && <><dt>Bereich</dt><dd>{glasBereichLabel(formData.glasBereich)}</dd></>}
                      {formData.glasGroesse && <><dt>Größe</dt><dd>{glasGroesseLabel(formData.glasGroesse)}</dd></>}
                    </>
                  ) : (
                    <>
                      <dt>Schadendatum</dt><dd>{formData.schadendatum}</dd>
                      <dt>Schadenort</dt><dd>{formData.schadenort}</dd>
                    </>
                  )}
                  <dt>Dateien</dt><dd>{files.length}</dd>
                </dl>
                {selectedType !== 'glasschaden' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 15 }}>
                    <span style={{ color: 'var(--sv-muted)' }}>Beschreibung</span>
                    <span style={{ color: 'var(--sv-body)', overflowWrap: 'anywhere' }}>{formData.beschreibung.length > 200 ? formData.beschreibung.slice(0, 200) + '…' : formData.beschreibung}</span>
                  </div>
                )}
                <button type="button" onClick={() => goToStep(2)} className="sv-link-btn" style={{ alignSelf: 'flex-start', fontSize: 14 }}>Angaben bearbeiten</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label className="sv-check">
                    <input type="checkbox" checked={confirm1} onChange={e => { setConfirm1(e.target.checked); clearError('confirm1'); }} />
                    <span>Alle Angaben sind korrekt und vollständig.</span>
                  </label>
                  {errors.confirm1 && <p className="sv-error" style={{ margin: '6px 0 0 34px' }}>{errors.confirm1}</p>}
                </div>
                <div>
                  <label className="sv-check">
                    <input type="checkbox" checked={confirm2} onChange={e => { setConfirm2(e.target.checked); clearError('confirm2'); }} />
                    <span>Ich bin mit der elektronischen Übermittlung einverstanden. Die <Link href="/datenschutz" style={{ fontWeight: 600 }}>Datenschutzhinweise</Link> habe ich gelesen.</span>
                  </label>
                  {errors.confirm2 && <p className="sv-error" style={{ margin: '6px 0 0 34px' }}>{errors.confirm2}</p>}
                </div>
              </div>

              {submitError && (
                <div className="sv-notice sv-notice--error" role="alert">
                  {submitError}
                  <span style={{ display: 'block', marginTop: 6, color: 'var(--sv-ink)' }}>
                    Sie können den Schaden auch per{' '}
                    <a href={`${WHATSAPP_URL}?text=${encodeURIComponent('Hallo Herr Stübe, ich möchte einen Schaden melden.')}`} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>WhatsApp</a>
                    {' '}melden.
                  </span>
                </div>
              )}

              <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="sv-btn">
                {isSubmitting ? <><span className="sv-spin" aria-hidden="true" /> Wird gesendet …</> : <>Schaden melden <ArrowRight size={18} aria-hidden="true" /></>}
              </button>
              <p className="sv-hint" style={{ margin: 0, textAlign: 'center', fontSize: 14 }}>
                Lieber per WhatsApp?{' '}
                <a href={`${WHATSAPP_URL}?text=${encodeURIComponent('Hallo Herr Stübe, ich möchte einen Schaden melden.')}`} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>Direkt schreiben</a>
              </p>
            </div>
          )}

          {step === 4 && selectedType && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <h1 className="sv-h1">Vielen Dank – <em>ist angekommen.</em></h1>
              <p style={{ margin: 0, color: 'var(--sv-body)' }}>
                Ihre Schadenmeldung liegt jetzt bei Morino Stübe. Wir melden uns bei Ihnen.
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
                  <dt>Schadenart</dt><dd>{damageTypeLabels[selectedType].title}</dd>
                  <dt>Name</dt><dd>{formData.vorname} {formData.nachname}</dd>
                  <dt>Eingereicht am</dt><dd>{new Date().toLocaleDateString('de-DE')}</dd>
                </dl>
              </div>

              <div className="sv-card" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontWeight: 600 }}>Dringender Notfall?</span>
                <span style={{ color: 'var(--sv-body)', fontSize: 15 }}>Dann rufen Sie bitte direkt an.</span>
                <a href={PHONE_HREF} className="sv-link-btn" style={{ alignSelf: 'flex-start' }}>
                  <Phone size={16} aria-hidden="true" /> {PHONE_DISPLAY}
                </a>
              </div>

              <a
                href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Hallo Herr Stübe, ich habe gerade eine Schadensmeldung eingereicht${reference ? ` (Vorgang ${reference})` : ''}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="sv-btn sv-btn--ghost"
              >
                <MessageCircle size={18} aria-hidden="true" /> Per WhatsApp schreiben
              </a>
              <Link href="/service" className="sv-link-btn" style={{ alignSelf: 'center' }}>Weiteres Anliegen melden</Link>
            </div>
          )}

        </div>
      </div>
    </ServiceLayout>
  );
}
