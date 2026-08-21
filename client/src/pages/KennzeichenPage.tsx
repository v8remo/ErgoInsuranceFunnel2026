import { compressImageFile, exceedsUploadLimit, UPLOAD_LIMIT_MESSAGE } from '@/lib/uploads';
import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'wouter';
import {
  CarFront, Tag, Lock, Zap, Check, ChevronLeft, FileText, Upload, X, Info,
  HelpCircle, CheckCircle2, ClipboardList, MessageCircle, AlertTriangle,
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";

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
  const [confirm1, setConfirm1] = useState(false);
  const [confirm2, setConfirm2] = useState(false);
  const [fadeClass, setFadeClass] = useState('opacity-100 transition-opacity duration-300');
  const [abeFiles, setAbeFiles] = useState<AbeFile[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleAbeFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    e.target.value = '';
    const incoming = Array.from(files);
    const newFiles: AbeFile[] = [];
    for (const raw of incoming) {
      if (abeFiles.length + newFiles.length >= 5) break;
      if (!raw.type.startsWith('image/') && raw.type !== 'application/pdf') continue;
      const f = await compressImageFile(raw);
      if (f.size > 10 * 1024 * 1024) continue;
      const af: AbeFile = { file: f };
      if (f.type.startsWith('image/')) {
        af.preview = URL.createObjectURL(f);
      }
      newFiles.push(af);
    }
    setAbeFiles(prev => [...prev, ...newFiles].slice(0, 5));
    if (errors.abeFiles) setErrors(prev => { const n = { ...prev }; delete n.abeFiles; return n; });
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

    if (selectedType === 'kennzeichen' && exceedsUploadLimit(abeFiles.map(af => af.file))) {
      setSubmitError(UPLOAD_LIMIT_MESSAGE);
      return;
    }

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

      await apiRequest('POST', '/api/kennzeichen/submit', {
        requestType: selectedType,
        ...formData,
        summary: buildSummary(),
        abeAttachments: abeAttachments.length > 0 ? abeAttachments : undefined,
      });
      goToStep(4);
    } catch (err: any) {
      setSubmitError(err.message || 'Fehler beim Senden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns per WhatsApp.');
      goToStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = (field: string) =>
    `w-full p-3 border rounded text-base outline-none transition-colors ${errors[field] ? 'border-ergo-red' : 'border-ergo-line focus:border-ergo-red'}`;

  const progressPercent = step === 1 ? 33 : step === 2 ? 66 : 100;

  const currentPremium = selectedType === 'kennzeichen' ? getPremium(formData.fahrzeugart, formData.versicherungsumfang, formData.versicherungsbeginn) : null;

  return (
    <div className="min-h-screen bg-white" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <SEO
        title="eVB-Nummer & Versicherungskennzeichen – ERGO Agentur Stübe Ganderkesee"
        description="eVB-Nummer für Kfz-Zulassung oder Versicherungskennzeichen für Kleinkraftrad anfragen. Schnell und unkompliziert bei Ihrer ERGO Agentur Stübe in Ganderkesee."
        keywords="eVB-Nummer, Versicherungskennzeichen, Kfz-Zulassung, ERGO Ganderkesee, Kleinkraftrad Versicherung"
      />
      <Breadcrumb items={[{ label: "eVB & Kennzeichen" }]} />
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
                Schritt {Math.min(step, 3)} von 3 — {step === 1 ? 'Auswahl' : step === 2 ? 'Angaben' : 'Absenden'}
              </span>
            </div>
            <div className="h-1 bg-ergo-fog rounded-full mb-3 overflow-hidden">
              <div className="h-full bg-ergo-red rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="flex items-center justify-center gap-3 text-[11px] text-ergo-mute mb-5">
              <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> DSGVO-konform</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Schnelle Bearbeitung</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Check className="w-3 h-3 text-ergo-check" /> ERGO Partner</span>
            </div>
          </>
        )}

        <div className={fadeClass}>

          {step === 1 && (
            <div>
              <div className="text-center mb-6">
                <p className="ergo-eyebrow">ERGO Agentur Stübe · Kfz-Service</p>
                <h1 className="text-[30px] md:text-[40px] leading-[1.25] mb-2">Was benötigen Sie?</h1>
                <p className="text-sm text-ergo-stone">Morino Stübe stellt Ihnen die Unterlagen schnell und unkompliziert aus.</p>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => handleSelectType('evb')}
                  className="ergo-option p-5 text-left"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="ergo-icon-disc w-10 h-10 shrink-0"><CarFront className="w-4 h-4" /></span>
                    <div>
                      <h3 className="font-sans font-bold text-ergo-ink text-base">eVB-Nummer (Kfz)</h3>
                      <p className="text-xs text-ergo-stone">Elektronische Versicherungsbestätigung für die Kfz-Zulassungsstelle (Auto, Motorrad ab 50ccm)</p>
                    </div>
                  </div>
                  <ul className="ergo-check-list text-sm text-ergo-stone ml-1">
                    <li>Für An- und Ummeldung</li>
                    <li>7-stelliger Code für Behörde</li>
                    <li>Sofort nach Antragsstellung</li>
                  </ul>
                </button>

                <button
                  onClick={() => handleSelectType('kennzeichen')}
                  className="ergo-option p-5 text-left"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="ergo-icon-disc w-10 h-10 shrink-0"><Tag className="w-4 h-4" /></span>
                    <div>
                      <h3 className="font-sans font-bold text-ergo-ink text-base">Versicherungskennzeichen</h3>
                      <p className="text-xs text-ergo-stone">Für Roller, Moped, Mofa, E-Scooter & Kleinkrafträder bis 50ccm</p>
                    </div>
                  </div>
                  <ul className="ergo-check-list text-sm text-ergo-stone ml-1">
                    <li>Kein Gang zur Zulassungsstelle</li>
                    <li>Kennzeichen direkt vom Berater</li>
                    <li>Gültig bis 28.02.2027</li>
                  </ul>
                </button>
              </div>

              <div className="mt-5 bg-ergo-gray border border-ergo-line rounded-lg p-4 text-sm text-ergo-ink flex items-start gap-2">
                <Info className="w-4 h-4 text-ergo-red shrink-0 mt-0.5" />
                <span>Das aktuelle Versicherungskennzeichen 2026/2027 ist <strong>SCHWARZ</strong>. Es gilt vom 01.03.2026 bis 28.02.2027.</span>
              </div>

              <details className="mt-4 bg-white border border-ergo-line rounded-lg overflow-hidden">
                <summary className="p-4 text-sm font-semibold text-ergo-ink cursor-pointer hover:bg-ergo-gray transition-colors">
                  <HelpCircle className="w-4 h-4 text-ergo-red inline-block mr-1 -mt-0.5" /> Was ist eine eVB-Nummer?
                </summary>
                <div className="px-4 pb-4 text-xs text-ergo-stone leading-relaxed">
                  Die <strong>eVB (elektronische Versicherungsbestätigung)</strong> ist ein 7-stelliger Code, den Sie für die Kfz-Zulassungsstelle benötigen. Sie ersetzt die frühere Doppelkarte und bestätigt, dass Ihr Fahrzeug haftpflichtversichert ist. Die eVB wird für Neuzulassungen, Ummeldungen und Halterwechsel benötigt.
                </div>
              </details>

              <div className="mt-6 text-center">
                <Link href="/" className="ergo-link text-sm">Zurück zur Startseite</Link>
              </div>
            </div>
          )}

          {step === 2 && selectedType === 'evb' && (
            <div>
              <h2 className="text-[22px] mb-1 flex items-center gap-2"><CarFront className="w-5 h-5 text-ergo-red shrink-0" /> eVB-Nummer anfordern</h2>
              <p className="text-sm text-ergo-stone mb-4">Bitte füllen Sie alle Pflichtfelder (*) aus.</p>

              <div className="bg-ergo-gray border border-ergo-line rounded-lg p-4 mb-5 text-sm text-ergo-ink flex items-start gap-2">
                <Info className="w-4 h-4 text-ergo-red shrink-0 mt-0.5" />
                <span><strong>Bitte beachten:</strong> Die eVB-Nummer kann nur im Zusammenhang mit dem Abschluss einer Kfz-Versicherung ausgestellt werden. Morino Stübe meldet sich nach Eingang Ihrer Anfrage umgehend bei Ihnen.</span>
              </div>

              <div className="ergo-card p-5 sm:p-6 flex flex-col gap-4">
                <p className="ergo-eyebrow">Persönliche Daten</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1" data-field="vorname">
                    <label className="text-sm font-semibold text-ergo-ink">Vorname *</label>
                    <input type="text" value={formData.vorname} onChange={e => updateField('vorname', e.target.value)} className={inputCls('vorname')} autoComplete="given-name" enterKeyHint="next" />
                    {errors.vorname && <span className="text-xs text-ergo-red">{errors.vorname}</span>}
                  </div>
                  <div className="flex flex-col gap-1" data-field="nachname">
                    <label className="text-sm font-semibold text-ergo-ink">Nachname *</label>
                    <input type="text" value={formData.nachname} onChange={e => updateField('nachname', e.target.value)} className={inputCls('nachname')} autoComplete="family-name" enterKeyHint="next" />
                    {errors.nachname && <span className="text-xs text-ergo-red">{errors.nachname}</span>}
                  </div>
                </div>

                <div className="flex flex-col gap-1" data-field="geburtsdatum">
                  <label className="text-sm font-semibold text-ergo-ink">Geburtsdatum *</label>
                  <input type="date" value={formData.geburtsdatum} onChange={e => updateField('geburtsdatum', e.target.value)} className={inputCls('geburtsdatum')} autoComplete="bday" />
                  {errors.geburtsdatum && <span className="text-xs text-ergo-red">{errors.geburtsdatum}</span>}
                </div>

                <div className="flex flex-col gap-1" data-field="strasse">
                  <label className="text-sm font-semibold text-ergo-ink">Straße + Hausnummer *</label>
                  <input type="text" value={formData.strasse} onChange={e => updateField('strasse', e.target.value)} className={inputCls('strasse')} autoComplete="street-address" enterKeyHint="next" />
                  {errors.strasse && <span className="text-xs text-ergo-red">{errors.strasse}</span>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1" data-field="plz">
                    <label className="text-sm font-semibold text-ergo-ink">PLZ *</label>
                    <input type="text" inputMode="numeric" value={formData.plz} onChange={e => updateField('plz', e.target.value)} maxLength={5} className={inputCls('plz')} autoComplete="postal-code" enterKeyHint="next" />
                    {errors.plz && <span className="text-xs text-ergo-red">{errors.plz}</span>}
                  </div>
                  <div className="flex flex-col gap-1" data-field="ort">
                    <label className="text-sm font-semibold text-ergo-ink">Ort *</label>
                    <input type="text" value={formData.ort} onChange={e => updateField('ort', e.target.value)} className={inputCls('ort')} autoComplete="address-level2" enterKeyHint="next" />
                    {errors.ort && <span className="text-xs text-ergo-red">{errors.ort}</span>}
                  </div>
                </div>

                <div className="flex flex-col gap-1" data-field="email">
                  <label className="text-sm font-semibold text-ergo-ink">E-Mail *</label>
                  <input type="email" inputMode="email" value={formData.email} onChange={e => updateField('email', e.target.value)} className={inputCls('email')} autoComplete="email" enterKeyHint="next" />
                  {errors.email && <span className="text-xs text-ergo-red">{errors.email}</span>}
                </div>

                <div className="flex flex-col gap-1" data-field="telefon">
                  <label className="text-sm font-semibold text-ergo-ink">Telefon *</label>
                  <input type="tel" inputMode="tel" value={formData.telefon} onChange={e => updateField('telefon', e.target.value)} className={inputCls('telefon')} autoComplete="tel" enterKeyHint="next" />
                  {errors.telefon && <span className="text-xs text-ergo-red">{errors.telefon}</span>}
                </div>

                <div className="border-t border-ergo-line pt-4 mt-2">
                  <p className="ergo-eyebrow mb-4">Fahrzeugdaten</p>
                </div>

                <div className="flex flex-col gap-1" data-field="fahrzeugart">
                  <label className="text-sm font-semibold text-ergo-ink">Fahrzeugart *</label>
                  <select value={formData.fahrzeugart} onChange={e => updateField('fahrzeugart', e.target.value)} className={`${inputCls('fahrzeugart')} bg-white`}>
                    <option value="">Bitte auswählen</option>
                    <option value="PKW">PKW</option>
                    <option value="Motorrad (ab 50ccm)">Motorrad (ab 50ccm)</option>
                    <option value="LKW">LKW</option>
                    <option value="Sonstiges">Sonstiges</option>
                  </select>
                  {errors.fahrzeugart && <span className="text-xs text-ergo-red">{errors.fahrzeugart}</span>}
                </div>

                <div className="flex flex-col gap-1" data-field="fahrzeughersteller">
                  <label className="text-sm font-semibold text-ergo-ink">Fahrzeughersteller *</label>
                  <input type="text" value={formData.fahrzeughersteller} onChange={e => updateField('fahrzeughersteller', e.target.value)} placeholder="z.B. VW, BMW, Mercedes..." className={inputCls('fahrzeughersteller')} />
                  {errors.fahrzeughersteller && <span className="text-xs text-ergo-red">{errors.fahrzeughersteller}</span>}
                </div>

                <div className="flex flex-col gap-1" data-field="fahrzeugmodell">
                  <label className="text-sm font-semibold text-ergo-ink">Fahrzeugmodell *</label>
                  <input type="text" value={formData.fahrzeugmodell} onChange={e => updateField('fahrzeugmodell', e.target.value)} placeholder="z.B. Golf, 3er, A-Klasse..." className={inputCls('fahrzeugmodell')} />
                  {errors.fahrzeugmodell && <span className="text-xs text-ergo-red">{errors.fahrzeugmodell}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-ergo-ink">Erstzulassung</label>
                  <input type="date" value={formData.erstzulassung} onChange={e => updateField('erstzulassung', e.target.value)} className={inputCls('erstzulassung')} />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-ergo-ink">FIN (Fahrzeug-Identifizierungsnummer)</label>
                  <input type="text" value={formData.fin} onChange={e => updateField('fin', e.target.value)} placeholder="17-stellige FIN aus Fahrzeugschein" className={inputCls('fin')} />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-ergo-ink">Bisheriger Versicherer</label>
                  <input type="text" value={formData.bisherigVersicherer} onChange={e => updateField('bisherigVersicherer', e.target.value)} className={inputCls('bisherigVersicherer')} />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-ergo-ink">Bisherige SF-Klasse</label>
                  <input type="text" value={formData.bisherigSfKlasse} onChange={e => updateField('bisherigSfKlasse', e.target.value)} placeholder="z.B. SF 12" className={inputCls('bisherigSfKlasse')} />
                </div>

                <div className="flex flex-col gap-1" data-field="jaehrlicheFahrleistung">
                  <label className="text-sm font-semibold text-ergo-ink">Jährliche Fahrleistung *</label>
                  <select value={formData.jaehrlicheFahrleistung} onChange={e => updateField('jaehrlicheFahrleistung', e.target.value)} className={`${inputCls('jaehrlicheFahrleistung')} bg-white`}>
                    <option value="">Bitte auswählen</option>
                    <option value="bis 5.000 km">bis 5.000 km</option>
                    <option value="5.000–10.000 km">5.000–10.000 km</option>
                    <option value="10.000–15.000 km">10.000–15.000 km</option>
                    <option value="15.000–20.000 km">15.000–20.000 km</option>
                    <option value="über 20.000 km">über 20.000 km</option>
                  </select>
                  {errors.jaehrlicheFahrleistung && <span className="text-xs text-ergo-red">{errors.jaehrlicheFahrleistung}</span>}
                </div>

                <div className="flex flex-col gap-1" data-field="hauptfahrer">
                  <label className="text-sm font-semibold text-ergo-ink">Hauptfahrer *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => updateField('hauptfahrer', 'selbst')}
                      className={`ergo-option p-3 text-sm font-semibold text-ergo-ink ${
                        formData.hauptfahrer === 'selbst'
                          ? 'selected'
                          : ''
                      }`}
                    >
                      Versicherungsnehmer selbst
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('hauptfahrer', 'andere')}
                      className={`ergo-option p-3 text-sm font-semibold text-ergo-ink ${
                        formData.hauptfahrer === 'andere'
                          ? 'selected'
                          : ''
                      }`}
                    >
                      Andere Person
                    </button>
                  </div>
                </div>

                {formData.hauptfahrer === 'andere' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1" data-field="hauptfahrerName">
                      <label className="text-sm font-semibold text-ergo-ink">Name des Hauptfahrers *</label>
                      <input type="text" value={formData.hauptfahrerName} onChange={e => updateField('hauptfahrerName', e.target.value)} className={inputCls('hauptfahrerName')} />
                      {errors.hauptfahrerName && <span className="text-xs text-ergo-red">{errors.hauptfahrerName}</span>}
                    </div>
                    <div className="flex flex-col gap-1" data-field="hauptfahrerGeburtsdatum">
                      <label className="text-sm font-semibold text-ergo-ink">Geburtsdatum *</label>
                      <input type="date" value={formData.hauptfahrerGeburtsdatum} onChange={e => updateField('hauptfahrerGeburtsdatum', e.target.value)} className={inputCls('hauptfahrerGeburtsdatum')} />
                      {errors.hauptfahrerGeburtsdatum && <span className="text-xs text-ergo-red">{errors.hauptfahrerGeburtsdatum}</span>}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1" data-field="versicherungsbeginn">
                  <label className="text-sm font-semibold text-ergo-ink">Gewünschter Versicherungsbeginn *</label>
                  <input type="date" value={formData.versicherungsbeginn} onChange={e => updateField('versicherungsbeginn', e.target.value)} min={todayISO()} className={inputCls('versicherungsbeginn')} />
                  {errors.versicherungsbeginn && <span className="text-xs text-ergo-red">{errors.versicherungsbeginn}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-ergo-ink">Gewünschte Versicherungsart *</label>
                  <label className="flex items-center gap-3 p-3 bg-ergo-gray rounded-lg cursor-not-allowed">
                    <input type="checkbox" checked={true} disabled className="w-5 h-5 accent-ergo-red shrink-0 cursor-pointer" />
                    <span className="text-sm text-ergo-ink">Kfz-Haftpflicht <span className="text-xs text-ergo-mute">(Pflicht)</span></span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-white border border-ergo-line rounded-lg cursor-pointer hover:bg-ergo-gray">
                    <input type="checkbox" checked={formData.versicherungsartTeilkasko} onChange={e => updateField('versicherungsartTeilkasko', e.target.checked)} className="w-5 h-5 accent-ergo-red shrink-0 cursor-pointer" />
                    <span className="text-sm text-ergo-ink">Teilkasko</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-white border border-ergo-line rounded-lg cursor-pointer hover:bg-ergo-gray">
                    <input type="checkbox" checked={formData.versicherungsartVollkasko} onChange={e => updateField('versicherungsartVollkasko', e.target.checked)} className="w-5 h-5 accent-ergo-red shrink-0 cursor-pointer" />
                    <span className="text-sm text-ergo-ink">Vollkasko</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-white border border-ergo-line rounded-lg cursor-pointer hover:bg-ergo-gray">
                    <input type="checkbox" checked={formData.versicherungsartSchutzbrief} onChange={e => updateField('versicherungsartSchutzbrief', e.target.checked)} className="w-5 h-5 accent-ergo-red shrink-0 cursor-pointer" />
                    <span className="text-sm text-ergo-ink">Schutzbrief</span>
                  </label>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-ergo-ink">Hinweise</label>
                  <textarea value={formData.hinweise} onChange={e => updateField('hinweise', e.target.value)} rows={3} placeholder="Zusätzliche Hinweise oder Wünsche..." className={inputCls('hinweise')} />
                </div>

                <button
                  onClick={handleStep2Next}
                  className="ergo-btn ergo-btn--primary w-full mt-2"
                >
                  Weiter →
                </button>
              </div>
            </div>
          )}

          {step === 2 && selectedType === 'kennzeichen' && (
            <div>
              <h2 className="text-[22px] mb-1 flex items-center gap-2"><Tag className="w-5 h-5 text-ergo-red shrink-0" /> Versicherungskennzeichen anfordern</h2>
              <p className="text-sm text-ergo-stone mb-4">Bitte füllen Sie alle Pflichtfelder (*) aus.</p>

              <div className="bg-ergo-gray border border-ergo-line rounded-lg p-4 mb-5 text-sm text-ergo-ink flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-ergo-check shrink-0 mt-0.5" />
                <span>Das Versicherungskennzeichen erhalten Sie direkt bei Morino Stübe – kein Gang zur Zulassungsstelle nötig! Alles was Sie brauchen ist die Allgemeine Betriebserlaubnis (ABE) Ihres Fahrzeugs.</span>
              </div>

              <div className="ergo-card p-5 sm:p-6 flex flex-col gap-4">
                <p className="ergo-eyebrow">Persönliche Daten</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1" data-field="vorname">
                    <label className="text-sm font-semibold text-ergo-ink">Vorname *</label>
                    <input type="text" value={formData.vorname} onChange={e => updateField('vorname', e.target.value)} className={inputCls('vorname')} autoComplete="given-name" enterKeyHint="next" />
                    {errors.vorname && <span className="text-xs text-ergo-red">{errors.vorname}</span>}
                  </div>
                  <div className="flex flex-col gap-1" data-field="nachname">
                    <label className="text-sm font-semibold text-ergo-ink">Nachname *</label>
                    <input type="text" value={formData.nachname} onChange={e => updateField('nachname', e.target.value)} className={inputCls('nachname')} autoComplete="family-name" enterKeyHint="next" />
                    {errors.nachname && <span className="text-xs text-ergo-red">{errors.nachname}</span>}
                  </div>
                </div>

                <div className="flex flex-col gap-1" data-field="geburtsdatum">
                  <label className="text-sm font-semibold text-ergo-ink">Geburtsdatum *</label>
                  <input type="date" value={formData.geburtsdatum} onChange={e => updateField('geburtsdatum', e.target.value)} className={inputCls('geburtsdatum')} autoComplete="bday" />
                  {errors.geburtsdatum && <span className="text-xs text-ergo-red">{errors.geburtsdatum}</span>}
                </div>

                <div className="flex flex-col gap-1" data-field="strasse">
                  <label className="text-sm font-semibold text-ergo-ink">Straße + Hausnummer *</label>
                  <input type="text" value={formData.strasse} onChange={e => updateField('strasse', e.target.value)} className={inputCls('strasse')} autoComplete="street-address" enterKeyHint="next" />
                  {errors.strasse && <span className="text-xs text-ergo-red">{errors.strasse}</span>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1" data-field="plz">
                    <label className="text-sm font-semibold text-ergo-ink">PLZ *</label>
                    <input type="text" inputMode="numeric" value={formData.plz} onChange={e => updateField('plz', e.target.value)} maxLength={5} className={inputCls('plz')} autoComplete="postal-code" enterKeyHint="next" />
                    {errors.plz && <span className="text-xs text-ergo-red">{errors.plz}</span>}
                  </div>
                  <div className="flex flex-col gap-1" data-field="ort">
                    <label className="text-sm font-semibold text-ergo-ink">Ort *</label>
                    <input type="text" value={formData.ort} onChange={e => updateField('ort', e.target.value)} className={inputCls('ort')} autoComplete="address-level2" enterKeyHint="next" />
                    {errors.ort && <span className="text-xs text-ergo-red">{errors.ort}</span>}
                  </div>
                </div>

                <div className="flex flex-col gap-1" data-field="email">
                  <label className="text-sm font-semibold text-ergo-ink">E-Mail *</label>
                  <input type="email" inputMode="email" value={formData.email} onChange={e => updateField('email', e.target.value)} className={inputCls('email')} autoComplete="email" enterKeyHint="next" />
                  {errors.email && <span className="text-xs text-ergo-red">{errors.email}</span>}
                </div>

                <div className="flex flex-col gap-1" data-field="telefon">
                  <label className="text-sm font-semibold text-ergo-ink">Telefon *</label>
                  <input type="tel" inputMode="tel" value={formData.telefon} onChange={e => updateField('telefon', e.target.value)} className={inputCls('telefon')} autoComplete="tel" enterKeyHint="next" />
                  {errors.telefon && <span className="text-xs text-ergo-red">{errors.telefon}</span>}
                </div>

                <div className="border-t border-ergo-line pt-4 mt-2">
                  <p className="ergo-eyebrow mb-2">ABE hochladen (Pflicht)</p>
                  <p className="text-xs text-ergo-stone mb-3">Bitte laden Sie die Allgemeine Betriebserlaubnis (ABE) Ihres Fahrzeugs hoch. Diese benötigen wir zur Ausstellung des Versicherungskennzeichens.</p>
                </div>

                <div className="flex flex-col gap-2" data-field="abeFiles">
                  <div
                    className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${errors.abeFiles ? 'border-ergo-red bg-ergo-red-light' : 'border-ergo-line hover:border-ergo-red bg-white hover:bg-ergo-red-light'}`}
                    onClick={() => document.getElementById('abe-file-input')?.click()}
                  >
                    <input
                      id="abe-file-input"
                      type="file"
                      accept="image/*,.pdf"
                      multiple
                      onChange={handleAbeFileSelect}
                      className="hidden"
                    />
                    <Upload className="w-7 h-7 text-ergo-red mx-auto mb-2" />
                    <p className="text-sm font-semibold text-ergo-ink">ABE hochladen *</p>
                    <p className="text-xs text-ergo-stone mt-1">Foto oder PDF der Allgemeinen Betriebserlaubnis</p>
                    <p className="text-xs text-ergo-mute mt-1">Max. 5 Dateien, je max. 10 MB (Bilder oder PDF)</p>
                  </div>
                  {errors.abeFiles && <span className="text-xs text-ergo-red">{errors.abeFiles}</span>}

                  {abeFiles.length > 0 && (
                    <div className="flex flex-col gap-2 mt-1">
                      {abeFiles.map((af, index) => (
                        <div key={index} className="flex items-center gap-3 ergo-card p-3">
                          {af.preview ? (
                            <img src={af.preview} alt="ABE Vorschau" className="w-12 h-12 rounded object-cover flex-shrink-0" />
                          ) : (
                            <span className="ergo-icon-disc w-12 h-12 flex-shrink-0"><FileText className="w-5 h-5" /></span>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-ergo-ink truncate">{af.file.name}</p>
                            <p className="text-xs text-ergo-stone">{(af.file.size / 1024).toFixed(0)} KB</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAbeFile(index)}
                            className="text-ergo-red hover:text-ergo-red-hover px-2 py-1 min-h-[44px] flex items-center"
                            aria-label="Datei entfernen"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bg-ergo-gray border border-ergo-line rounded-lg p-3 text-xs text-ergo-stone">
                    <strong className="text-ergo-ink">Wo finde ich die ABE?</strong> Die ABE wird beim Kauf des Fahrzeugs mitgeliefert. Sie enthält alle technischen Daten wie Hersteller, Typ, Hubraum und Höchstgeschwindigkeit. Bei Verlust kann eine Kopie beim Hersteller angefordert werden.
                  </div>
                </div>

                <div className="border-t border-ergo-line pt-4 mt-2">
                  <p className="ergo-eyebrow mb-2">Fahrzeugdaten (aus der ABE)</p>
                  <p className="text-xs text-ergo-stone mb-4">Alle folgenden Angaben finden Sie in der ABE Ihres Fahrzeugs.</p>
                </div>

                <div className="flex flex-col gap-1" data-field="fahrzeugart">
                  <label className="text-sm font-semibold text-ergo-ink">Fahrzeugart *</label>
                  <select value={formData.fahrzeugart} onChange={e => updateField('fahrzeugart', e.target.value)} className={`${inputCls('fahrzeugart')} bg-white`}>
                    <option value="">Bitte auswählen</option>
                    <option value="E-Scooter">E-Scooter</option>
                    <option value="Mofa / Moped / Mokick / Roller">Mofa / Moped / Mokick / Roller</option>
                    <option value="Segway">Segway</option>
                    <option value="S-Pedelec">S-Pedelec</option>
                    <option value="Krankenfahrstuhl">Krankenfahrstuhl</option>
                  </select>
                  {errors.fahrzeugart && <span className="text-xs text-ergo-red">{errors.fahrzeugart}</span>}
                </div>

                <div className="flex flex-col gap-1" data-field="fahrzeughersteller">
                  <label className="text-sm font-semibold text-ergo-ink">Fahrzeughersteller *</label>
                  <input type="text" value={formData.fahrzeughersteller} onChange={e => updateField('fahrzeughersteller', e.target.value)} className={inputCls('fahrzeughersteller')} />
                  {errors.fahrzeughersteller && <span className="text-xs text-ergo-red">{errors.fahrzeughersteller}</span>}
                </div>

                <div className="flex flex-col gap-1" data-field="fahrzeugmodell">
                  <label className="text-sm font-semibold text-ergo-ink">Fahrzeugmodell *</label>
                  <input type="text" value={formData.fahrzeugmodell} onChange={e => updateField('fahrzeugmodell', e.target.value)} className={inputCls('fahrzeugmodell')} />
                  {errors.fahrzeugmodell && <span className="text-xs text-ergo-red">{errors.fahrzeugmodell}</span>}
                </div>

                <div className="flex flex-col gap-1" data-field="fin">
                  <label className="text-sm font-semibold text-ergo-ink">FIN (Fahrgestellnummer) *</label>
                  <input type="text" value={formData.fin} onChange={e => updateField('fin', e.target.value)} placeholder="Fahrgestellnummer aus der ABE" className={inputCls('fin')} />
                  {errors.fin && <span className="text-xs text-ergo-red">{errors.fin}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-ergo-ink">Hubraum</label>
                  <select value={formData.hubraum} onChange={e => updateField('hubraum', e.target.value)} className={`${inputCls('hubraum')} bg-white`}>
                    <option value="">Bitte auswählen</option>
                    <option value="bis 25ccm">bis 25ccm</option>
                    <option value="bis 50ccm">bis 50ccm</option>
                    <option value="bis 125ccm (mit Führerschein A1)">bis 125ccm (mit Führerschein A1)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1" data-field="hoechstgeschwindigkeit">
                  <label className="text-sm font-semibold text-ergo-ink">Höchstgeschwindigkeit *</label>
                  <select value={formData.hoechstgeschwindigkeit} onChange={e => updateField('hoechstgeschwindigkeit', e.target.value)} className={`${inputCls('hoechstgeschwindigkeit')} bg-white`}>
                    <option value="">Bitte auswählen</option>
                    <option value="bis 25 km/h">bis 25 km/h</option>
                    <option value="bis 45 km/h">bis 45 km/h</option>
                    <option value="bis 60 km/h">bis 60 km/h</option>
                  </select>
                  {errors.hoechstgeschwindigkeit && <span className="text-xs text-ergo-red">{errors.hoechstgeschwindigkeit}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-ergo-ink">Erstzulassung / Baujahr</label>
                  <input type="text" value={formData.erstzulassung} onChange={e => updateField('erstzulassung', e.target.value)} placeholder="z.B. 2023" className={inputCls('erstzulassung')} />
                </div>

                <div className="flex flex-col gap-1" data-field="versicherungsbeginn">
                  <label className="text-sm font-semibold text-ergo-ink">Versicherungsbeginn *</label>
                  <select value={formData.versicherungsbeginn} onChange={e => updateField('versicherungsbeginn', e.target.value)} className={`${inputCls('versicherungsbeginn')} bg-white`}>
                    <option value="">Bitte auswählen</option>
                    {PREMIUM_MONTHS.map(m => (
                      <option key={m} value={m}>{MONTH_LABELS[m]}</option>
                    ))}
                  </select>
                  <p className="text-xs text-ergo-stone">Das Versicherungsjahr läuft bis 28.02.2027</p>
                  {errors.versicherungsbeginn && <span className="text-xs text-ergo-red">{errors.versicherungsbeginn}</span>}
                </div>

                <div className="flex flex-col gap-1" data-field="bisherigVersichert">
                  <label className="text-sm font-semibold text-ergo-ink">Bisherige Versicherung vorhanden?</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => updateField('bisherigVersichert', 'ja')}
                      className={`ergo-option px-4 py-2 text-sm font-semibold text-ergo-ink ${
                        formData.bisherigVersichert === 'ja'
                          ? 'selected'
                          : ''
                      }`}
                    >
                      Ja
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('bisherigVersichert', 'nein')}
                      className={`ergo-option px-4 py-2 text-sm font-semibold text-ergo-ink ${
                        formData.bisherigVersichert === 'nein'
                          ? 'selected'
                          : ''
                      }`}
                    >
                      Nein (Neuanmeldung)
                    </button>
                  </div>
                </div>

                {formData.bisherigVersichert === 'ja' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1" data-field="bisherigVersicherer">
                      <label className="text-sm font-semibold text-ergo-ink">Bisheriger Versicherer *</label>
                      <input type="text" value={formData.bisherigVersicherer} onChange={e => updateField('bisherigVersicherer', e.target.value)} className={inputCls('bisherigVersicherer')} />
                      {errors.bisherigVersicherer && <span className="text-xs text-ergo-red">{errors.bisherigVersicherer}</span>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-ergo-ink">Bisheriges Kennzeichen</label>
                      <input type="text" value={formData.bisherigesKennzeichen} onChange={e => updateField('bisherigesKennzeichen', e.target.value)} className={inputCls('bisherigesKennzeichen')} />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1" data-field="versicherungsumfang">
                  <label className="text-sm font-semibold text-ergo-ink">Versicherungsumfang *</label>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      type="button"
                      onClick={() => updateField('versicherungsumfang', 'haftpflicht')}
                      className={`ergo-option p-4 text-left ${
                        formData.versicherungsumfang === 'haftpflicht'
                          ? 'selected'
                          : ''
                      }`}
                    >
                      <span className="font-semibold text-sm">Nur Haftpflicht</span>
                      <p className="text-xs mt-1 text-ergo-stone">gesetzlich vorgeschrieben</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('versicherungsumfang', 'haftpflicht_teilkasko')}
                      className={`ergo-option p-4 text-left ${
                        formData.versicherungsumfang === 'haftpflicht_teilkasko'
                          ? 'selected'
                          : ''
                      }`}
                    >
                      <span className="font-semibold text-sm">Haftpflicht + Teilkasko inkl. Diebstahlschutz</span>
                      <p className="text-xs mt-1 text-ergo-stone">empfohlen, 150 € SB je Schadenfall</p>
                    </button>
                  </div>
                  {errors.versicherungsumfang && <span className="text-xs text-ergo-red">{errors.versicherungsumfang}</span>}
                </div>

                {currentPremium !== null && (
                  <div className="bg-ergo-red-light border border-ergo-red/30 rounded-lg p-5">
                    <p className="ergo-eyebrow mb-3">Ihr Beitrag</p>
                    <div className="flex flex-col gap-2 text-sm text-ergo-ink">
                      <div className="flex justify-between">
                        <span>Fahrzeugtyp</span>
                        <span className="font-semibold">{formData.fahrzeugart}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Versicherungsumfang</span>
                        <span className="font-semibold">{formData.versicherungsumfang === 'haftpflicht' ? 'Nur Haftpflicht' : 'Haftpflicht + Teilkasko inkl. Diebstahlschutz'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Zeitraum</span>
                        <span className="font-semibold">{getVersicherungszeitraum(formData.versicherungsbeginn)}</span>
                      </div>
                      <div className="border-t border-ergo-red/30 pt-3 mt-1 flex justify-between items-center">
                        <span className="font-bold text-base">Beitrag</span>
                        <span className="font-extrabold text-2xl text-ergo-red">{currentPremium.toFixed(2).replace('.', ',')} €</span>
                      </div>
                    </div>
                    <p className="text-xs text-ergo-stone mt-3">Versicherungssumme: 100 Mio. € pauschal</p>
                    {formData.versicherungsumfang === 'haftpflicht_teilkasko' && (
                      <p className="text-xs text-ergo-stone mt-1">Teilkasko: 150 € Selbstbeteiligung je Schadenfall. Bei Totalentwendung des Fahrzeugs gilt eine Selbstbeteiligung von 300 €.</p>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-ergo-ink">Hinweise</label>
                  <textarea value={formData.hinweise} onChange={e => updateField('hinweise', e.target.value)} rows={3} placeholder="Zusätzliche Hinweise oder Wünsche..." className={inputCls('hinweise')} />
                </div>

                <button
                  onClick={handleStep2Next}
                  className="ergo-btn ergo-btn--primary w-full mt-2"
                >
                  Weiter →
                </button>
              </div>
            </div>
          )}

          {step === 3 && selectedType && (
            <div>
              <h2 className="text-[22px] mb-1">Zusammenfassung</h2>
              <p className="text-sm text-ergo-stone mb-5">Bitte prüfen Sie Ihre Angaben vor dem Absenden.</p>

              <div className="ergo-card p-5 flex flex-col gap-4 mb-5">
                <div>
                  <p className="ergo-eyebrow mb-2">Antragsart</p>
                  <p className="text-sm text-ergo-ink font-semibold flex items-center gap-2">
                    {selectedType === 'evb' ? <CarFront className="w-4 h-4 text-ergo-red shrink-0" /> : <Tag className="w-4 h-4 text-ergo-red shrink-0" />}
                    {selectedType === 'evb' ? 'eVB-Nummer (Kfz)' : 'Versicherungskennzeichen'}
                  </p>
                </div>

                <div>
                  <p className="ergo-eyebrow mb-2">Persönliche Daten</p>
                  <div className="flex flex-col gap-1.5 text-sm text-ergo-ink">
                    <p><span className="font-semibold">Name:</span> {formData.vorname} {formData.nachname}</p>
                    <p><span className="font-semibold">Geburtsdatum:</span> {formatDateDE(formData.geburtsdatum)}</p>
                    <p><span className="font-semibold">Adresse:</span> {formData.strasse}, {formData.plz} {formData.ort}</p>
                    <p><span className="font-semibold">E-Mail:</span> {formData.email}</p>
                    <p><span className="font-semibold">Telefon:</span> {formData.telefon}</p>
                  </div>
                </div>

                <div>
                  <p className="ergo-eyebrow mb-2">Fahrzeugdaten</p>
                  <div className="flex flex-col gap-1.5 text-sm text-ergo-ink">
                    <p><span className="font-semibold">Fahrzeugart:</span> {formData.fahrzeugart}</p>
                    <p><span className="font-semibold">Hersteller:</span> {formData.fahrzeughersteller}</p>
                    <p><span className="font-semibold">Modell:</span> {formData.fahrzeugmodell}</p>
                    {formData.fin && <p><span className="font-semibold">FIN:</span> {formData.fin}</p>}
                    {formData.erstzulassung && <p><span className="font-semibold">Erstzulassung:</span> {selectedType === 'evb' ? formatDateDE(formData.erstzulassung) : formData.erstzulassung}</p>}
                    {selectedType === 'kennzeichen' && formData.hubraum && <p><span className="font-semibold">Hubraum:</span> {formData.hubraum}</p>}
                    {selectedType === 'kennzeichen' && <p><span className="font-semibold">Höchstgeschwindigkeit:</span> {formData.hoechstgeschwindigkeit}</p>}
                  </div>
                </div>

                <div>
                  <p className="ergo-eyebrow mb-2">Versicherung</p>
                  <div className="flex flex-col gap-1.5 text-sm text-ergo-ink">
                    <p><span className="font-semibold">Versicherungsbeginn:</span> {formatDateDE(formData.versicherungsbeginn)}</p>
                    {selectedType === 'evb' && (
                      <>
                        <p><span className="font-semibold">Fahrleistung:</span> {formData.jaehrlicheFahrleistung}</p>
                        <p><span className="font-semibold">Hauptfahrer:</span> {formData.hauptfahrer === 'selbst' ? 'Versicherungsnehmer selbst' : formData.hauptfahrerName}</p>
                        <p><span className="font-semibold">Versicherungsart:</span> {
                          ['Kfz-Haftpflicht',
                            ...(formData.versicherungsartTeilkasko ? ['Teilkasko'] : []),
                            ...(formData.versicherungsartVollkasko ? ['Vollkasko'] : []),
                            ...(formData.versicherungsartSchutzbrief ? ['Schutzbrief'] : []),
                          ].join(', ')
                        }</p>
                        {formData.bisherigVersicherer && <p><span className="font-semibold">Bisheriger Versicherer:</span> {formData.bisherigVersicherer}</p>}
                        {formData.bisherigSfKlasse && <p><span className="font-semibold">SF-Klasse:</span> {formData.bisherigSfKlasse}</p>}
                      </>
                    )}
                    {selectedType === 'kennzeichen' && (
                      <>
                        <p><span className="font-semibold">Versicherungsumfang:</span> {formData.versicherungsumfang === 'haftpflicht' ? 'Nur Haftpflicht' : 'Haftpflicht + Teilkasko inkl. Diebstahlschutz'}</p>
                        {currentPremium !== null && (
                          <>
                            <p><span className="font-semibold">Zeitraum:</span> {getVersicherungszeitraum(formData.versicherungsbeginn)}</p>
                            <p><span className="font-semibold">Beitrag:</span> <span className="text-ergo-red font-bold">{currentPremium.toFixed(2).replace('.', ',')} €</span></p>
                          </>
                        )}
                        {formData.bisherigVersichert === 'ja' && formData.bisherigVersicherer && (
                          <p><span className="font-semibold">Bisheriger Versicherer:</span> {formData.bisherigVersicherer}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {selectedType === 'kennzeichen' && abeFiles.length > 0 && (
                  <div>
                    <p className="ergo-eyebrow mb-2">ABE (Betriebserlaubnis)</p>
                    <div className="flex flex-col gap-1.5 text-sm text-ergo-ink">
                      {abeFiles.map((af, i) => (
                        <p key={i} className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-ergo-red shrink-0" /> {af.file.name} ({(af.file.size / 1024).toFixed(0)} KB)</p>
                      ))}
                    </div>
                  </div>
                )}

                {formData.hinweise && (
                  <div>
                    <p className="ergo-eyebrow mb-2">Hinweise</p>
                    <p className="text-sm text-ergo-ink">{formData.hinweise}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 mb-5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={confirm1} onChange={e => { setConfirm1(e.target.checked); if (errors.confirm1) setErrors(prev => { const n = { ...prev }; delete n.confirm1; return n; }); }} className="mt-1 w-4 h-4 accent-ergo-red" />
                  <span className="text-sm text-ergo-ink">Ich bestätige, dass alle Angaben korrekt und vollständig sind.</span>
                </label>
                {errors.confirm1 && <span className="text-xs text-ergo-red ml-7">{errors.confirm1}</span>}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={confirm2} onChange={e => { setConfirm2(e.target.checked); if (errors.confirm2) setErrors(prev => { const n = { ...prev }; delete n.confirm2; return n; }); }} className="mt-1 w-4 h-4 accent-ergo-red" />
                  <span className="text-sm text-ergo-ink">Ich bin einverstanden, dass meine Daten zur Bearbeitung meiner Anfrage verwendet werden. (Datenschutz nach DSGVO)</span>
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
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Anfrage wird gesendet...
                  </>
                ) : (
                  selectedType === 'evb' ? 'eVB-Nummer anfordern' : 'Versicherungskennzeichen anfordern'
                )}
              </button>
            </div>
          )}

          {step === 4 && selectedType && (
            <div className="text-center py-4">
              {submitError ? (
                <div className="bg-ergo-red-light border border-ergo-red/30 rounded-lg p-4 mb-6 text-left">
                  <p className="text-ergo-red font-semibold text-sm mb-1 flex items-center gap-2"><AlertTriangle className="w-4 h-4 shrink-0" /> Fehler beim Übermitteln</p>
                  <p className="text-ergo-red text-sm">{submitError}</p>
                  <p className="text-ergo-red text-xs mt-2">Bitte versuchen Sie es erneut oder kontaktieren Sie uns per WhatsApp.</p>
                </div>
              ) : (
                <div className="w-16 h-16 mx-auto mb-4 bg-ergo-check rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-white" />
                </div>
              )}

              <h2 className="text-[22px] mb-2">
                {submitError
                  ? 'Fehler beim Senden'
                  : selectedType === 'evb'
                    ? 'eVB-Anfrage eingegangen!'
                    : 'Anfrage für Versicherungskennzeichen eingegangen!'}
              </h2>
              <p className="text-sm text-ergo-stone mb-6">
                {submitError
                  ? 'Bitte versuchen Sie es erneut oder kontaktieren Sie uns per WhatsApp.'
                  : selectedType === 'evb'
                    ? 'Morino Stübe meldet sich schnellstmöglich bei Ihnen, um die eVB-Nummer auszustellen. In der Regel noch am selben Werktag.'
                    : 'Morino Stübe meldet sich bei Ihnen zur Abwicklung. Das Kennzeichen (SCHWARZ, gültig bis 28.02.2027) erhalten Sie direkt von Ihrem ERGO Berater.'}
              </p>

              {!submitError && selectedType === 'evb' && (
                <div className="bg-ergo-gray border border-ergo-line rounded-lg p-4 mb-5 text-left text-sm text-ergo-ink flex items-start gap-2">
                  <Info className="w-4 h-4 text-ergo-red shrink-0 mt-0.5" />
                  <span>Die eVB-Nummer ist 6 Monate gültig. Sie können Ihr Fahrzeug in dieser Zeit bei der Zulassungsstelle anmelden.</span>
                </div>
              )}

              {!submitError && selectedType === 'kennzeichen' && (
                <>
                  <div className="bg-ergo-gray border border-ergo-line rounded-lg p-4 mb-5 text-left text-sm text-ergo-ink flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-ergo-check shrink-0 mt-0.5" />
                    <span>Das aktuelle Versicherungskennzeichen 2026/2027 ist <strong>SCHWARZ</strong>.</span>
                  </div>

                  {currentPremium !== null && (
                    <div className="ergo-card p-5 mb-5 text-left">
                      <p className="ergo-eyebrow mb-4">Überweisungsdaten</p>
                      <div className="flex flex-col gap-3 text-sm text-ergo-ink">
                        <div>
                          <p className="text-xs text-ergo-stone mb-0.5">Empfänger</p>
                          <p className="font-semibold">Morino Stübe</p>
                        </div>
                        <div>
                          <p className="text-xs text-ergo-stone mb-0.5">IBAN</p>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold font-mono">DE09 1101 0101 5121 0459 76</p>
                            <button
                              type="button"
                              onClick={() => copyToClipboard('DE09110101015121045976', 'iban')}
                              className="text-ergo-red hover:text-ergo-red-hover transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                              aria-label="IBAN kopieren"
                            >
                              {copiedField === 'iban' ? <span className="text-xs text-ergo-check font-semibold">Kopiert!</span> : <ClipboardList className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-ergo-stone mb-0.5">Verwendungszweck</p>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm break-all">{getVerwendungszweck(formData.fahrzeugart, formData.versicherungsumfang, formData.nachname, formData.vorname, formData.versicherungsbeginn)}</p>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(getVerwendungszweck(formData.fahrzeugart, formData.versicherungsumfang, formData.nachname, formData.vorname, formData.versicherungsbeginn), 'verwendungszweck')}
                              className="text-ergo-red hover:text-ergo-red-hover transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
                              aria-label="Verwendungszweck kopieren"
                            >
                              {copiedField === 'verwendungszweck' ? <span className="text-xs text-ergo-check font-semibold">Kopiert!</span> : <ClipboardList className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-ergo-stone mb-0.5">Betrag</p>
                          <p className="font-extrabold text-xl text-ergo-red">{currentPremium.toFixed(2).replace('.', ',')} €</p>
                        </div>
                      </div>
                      <p className="text-xs text-ergo-stone mt-4 leading-relaxed">Bitte überweisen Sie den Betrag innerhalb von 7 Tagen. Nach Zahlungseingang erhalten Sie Ihr Versicherungskennzeichen bzw. Ihre Versicherungsplakette von Ihrem ERGO Berater.</p>
                    </div>
                  )}
                </>
              )}

              <div className="ergo-card p-4 text-left mb-6">
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ergo-stone">Antragsart</span>
                    <span className="font-semibold text-ergo-ink">{selectedType === 'evb' ? 'eVB-Nummer' : 'Versicherungskennzeichen'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ergo-stone">Name</span>
                    <span className="font-semibold text-ergo-ink">{formData.vorname} {formData.nachname}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ergo-stone">Fahrzeug</span>
                    <span className="font-semibold text-ergo-ink">{formData.fahrzeughersteller} {formData.fahrzeugmodell}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ergo-stone">Versicherungsbeginn</span>
                    <span className="font-semibold text-ergo-ink">{formatDateDE(formData.versicherungsbeginn)}</span>
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/4915566771019?text=${encodeURIComponent(
                  selectedType === 'evb'
                    ? `Hallo Herr Stübe, ich habe soeben eine eVB-Anfrage über Ihre Website eingereicht. Viele Grüße, ${formData.vorname} ${formData.nachname}`
                    : `Hallo Herr Stübe, ich habe soeben eine Anfrage für ein Versicherungskennzeichen über Ihre Website eingereicht. Viele Grüße, ${formData.vorname} ${formData.nachname}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ergo-btn ergo-btn--whatsapp w-full mb-3"
              >
                <MessageCircle className="w-5 h-5" /> WhatsApp schreiben
              </a>

              <Link
                href="/"
                className="ergo-btn ergo-btn--tertiary w-full"
              >
                <ChevronLeft className="w-5 h-5" /> Zurück zur Startseite
              </Link>

              <p className="text-xs text-ergo-mute mt-4">Bei Fragen: 015566771019</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}