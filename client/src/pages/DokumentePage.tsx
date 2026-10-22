import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'wouter';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import SignaturePad from 'signature_pad';
import { ArrowRight, ChevronLeft, Download, FileText, MessageCircle, Plus, RotateCcw, Upload, X } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import SEO from "@/components/SEO";
import ServiceLayout, { WHATSAPP_URL } from "@/components/service/ServiceLayout";

type DocType = 'kuendigung' | 'beraterwechsel' | 'aenderung' | 'vollmacht' | 'upload';

interface UploadFile {
  file: File;
  preview?: string;
}

interface KuendigungEntry {
  versicherungsgesellschaft: string;
  versicherungsnummer: string;
  versicherungsart: string;
  kuendigungsgrund: string;
  kuendigungsdatum: string;
  hinweise: string;
}

const emptyKuendigung = (): KuendigungEntry => ({
  versicherungsgesellschaft: '',
  versicherungsnummer: '',
  versicherungsart: '',
  kuendigungsgrund: '',
  kuendigungsdatum: '',
  hinweise: '',
});

interface FormData {
  vorname: string;
  nachname: string;
  strasse: string;
  plz: string;
  ort: string;
  email: string;
  telefon: string;
  versicherungsgesellschaft: string;
  versicherungsnummer: string;
  versicherungsart: string;
  kuendigungsgrund: string;
  kuendigungsdatum: string;
  hinweise: string;
  geburtsdatum: string;
  ergoKundennummer: string;
  vertraegeUebertragen: string[];
  aenderungen: string[];
  neueStrasse: string;
  neuePlz: string;
  neuerOrt: string;
  kontoinhaber: string;
  neueIban: string;
  bic: string;
  bank: string;
  neueEmail: string;
  neueTelefon: string;
  kennzeichen: string;
  fahrzeugtyp: string;
  erstzulassung: string;
  sonstigesText: string;
  iban: string;
  kreditinstitut: string;
  schadennummer: string;
  uploadBeschreibung: string;
}

const initialFormData: FormData = {
  vorname: '', nachname: '', strasse: '', plz: '', ort: '', email: '', telefon: '',
  versicherungsgesellschaft: '', versicherungsnummer: '', versicherungsart: '', kuendigungsgrund: '',
  kuendigungsdatum: '', hinweise: '', geburtsdatum: '', ergoKundennummer: '',
  vertraegeUebertragen: [], aenderungen: [],
  neueStrasse: '', neuePlz: '', neuerOrt: '', kontoinhaber: '', neueIban: '', bic: '', bank: '',
  neueEmail: '', neueTelefon: '', kennzeichen: '', fahrzeugtyp: '', erstzulassung: '',
  sonstigesText: '', iban: '', kreditinstitut: '',
  schadennummer: '', uploadBeschreibung: '',
};

const docTypeLabels: Record<DocType, string> = {
  kuendigung: 'Kündigungsschreiben',
  beraterwechsel: 'Beraterwechsel-Antrag',
  aenderung: 'Änderungsantrag',
  vollmacht: 'Vollmacht & SEPA',
  upload: 'Rechnung / Beleg einreichen',
};

const versicherungsarten = ['Kfz', 'Hausrat', 'Haftpflicht', 'Rechtsschutz', 'Lebensversicherung', 'Kranken', 'Sonstiges'];
const kuendigungsgruende = [
  'Ordentliche Kündigung zum nächstmöglichen Termin',
  'Sonderkündigung nach Beitragserhöhung',
  'Sonderkündigung nach Schadenfall',
  'Zum Vertragsende',
];
const beraterwechselVertraege = ['Kfz', 'Hausrat', 'Haftpflicht', 'Rechtsschutz', 'Leben/Rente', 'Kranken', 'Alle ERGO-Verträge'];
const aenderungsOptionen = ['Adresse', 'IBAN/Bankverbindung', 'E-Mail-Adresse', 'Telefonnummer', 'Fahrzeugdaten', 'Sonstiges'];

function downloadPdf(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function todayFormatted(): string {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}

function formatDateDE(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}.${m}.${y}`;
}

export default function DokumentePage({ initialType }: { initialType?: string }) {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<DocType | null>(null);
  const [formData, setFormData] = useState<FormData>({ ...initialFormData });
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [confirm1, setConfirm1] = useState(false);
  const [confirm2, setConfirm2] = useState(false);
  const [fadeClass, setFadeClass] = useState('opacity-100 transition-opacity duration-300');
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [kuendigungen, setKuendigungen] = useState<KuendigungEntry[]>([emptyKuendigung()]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sigPadRef = useRef<SignaturePad | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      uploadFiles.forEach(uf => { if (uf.preview) URL.revokeObjectURL(uf.preview); });
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const validTypes: DocType[] = ['kuendigung', 'beraterwechsel', 'aenderung', 'vollmacht', 'upload'];
    const formularParam = params.get('formular');
    const typeParam = params.get('type');
    const rawParam = initialType || formularParam || typeParam;
    const resolved = rawParam as DocType | null;
    if (resolved && validTypes.includes(resolved)) {
      setSelectedType(resolved);
      setStep(2);
    } else {
      // Ohne gültiges Anliegen geht es zur Übersicht im Service-Center.
      setLocation('/service', { replace: true });
    }
  }, [initialType]);

  useEffect(() => {
    if (step === 3 && canvasRef.current && !sigPadRef.current) {
      const canvas = canvasRef.current;
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(ratio, ratio);
      sigPadRef.current = new SignaturePad(canvas, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(43, 33, 28)',
      });
    }
  }, [step]);

  const goToStep = useCallback((next: number) => {
    setFadeClass('opacity-0 transition-opacity duration-150');
    setTimeout(() => {
      setStep(next);
      setFadeClass('opacity-100 transition-opacity duration-300');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 150);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles: UploadFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (uploadFiles.length + newFiles.length >= 10) break;
      if (!f.type.startsWith('image/') && f.type !== 'application/pdf') continue;
      if (f.size > 10 * 1024 * 1024) continue;
      const uf: UploadFile = { file: f };
      if (f.type.startsWith('image/')) {
        uf.preview = URL.createObjectURL(f);
      }
      newFiles.push(uf);
    }
    setUploadFiles(prev => [...prev, ...newFiles].slice(0, 10));
    if (errors.files) setErrors(prev => { const n = { ...prev }; delete n.files; return n; });
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setUploadFiles(prev => {
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

  const handleUploadSubmit = async () => {
    const errs: Record<string, string> = {};
    if (!formData.vorname.trim()) errs.vorname = 'Pflichtfeld';
    if (!formData.nachname.trim()) errs.nachname = 'Pflichtfeld';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) errs.email = 'Gültige E-Mail eingeben';
    if (!formData.versicherungsnummer.trim()) errs.versicherungsnummer = 'Pflichtfeld';
    if (uploadFiles.length === 0) errs.files = 'Bitte mindestens eine Datei hochladen';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const fileAttachments = await Promise.all(
        uploadFiles.map(async (uf) => ({
          filename: uf.file.name,
          content: await fileToBase64(uf.file),
        }))
      );

      const uploadRes = await apiRequest('POST', '/api/documents/upload', {
        vorname: formData.vorname.trim(),
        nachname: formData.nachname.trim(),
        email: formData.email.trim(),
        telefon: formData.telefon.trim(),
        versicherungsnummer: formData.versicherungsnummer.trim(),
        schadennummer: formData.schadennummer.trim(),
        beschreibung: formData.uploadBeschreibung.trim(),
        fileAttachments,
      });
      setReference((await uploadRes.json()).reference ?? null);

      goToStep(4);
    } catch (err: any) {
      setSubmitError(err.message || 'Fehler beim Senden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns per WhatsApp.');
      goToStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const toggleArrayField = (field: 'vertraegeUebertragen' | 'aenderungen', value: string) => {
    setFormData(prev => {
      const arr = prev[field] as string[];
      const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
      return { ...prev, [field]: next };
    });
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const updateKuendigung = (index: number, field: keyof KuendigungEntry, value: string) => {
    setKuendigungen(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
    const errKey = `k_${index}_${field}`;
    if (errors[errKey]) setErrors(prev => { const n = { ...prev }; delete n[errKey]; return n; });
  };

  const addKuendigung = () => {
    setKuendigungen(prev => [...prev, emptyKuendigung()]);
  };

  const removeKuendigung = (index: number) => {
    if (kuendigungen.length <= 1) return;
    setKuendigungen(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep2 = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.vorname.trim()) e.vorname = 'Pflichtfeld';
    if (!formData.nachname.trim()) e.nachname = 'Pflichtfeld';
    if (!formData.strasse.trim()) e.strasse = 'Pflichtfeld';
    if (!formData.plz.trim() || !/^\d{5}$/.test(formData.plz.trim())) e.plz = 'Gültige 5-stellige PLZ eingeben';
    if (!formData.ort.trim()) e.ort = 'Pflichtfeld';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) e.email = 'Gültige E-Mail eingeben';
    if (!formData.telefon.trim()) e.telefon = 'Pflichtfeld';

    if (selectedType === 'kuendigung') {
      kuendigungen.forEach((k, i) => {
        if (!k.versicherungsgesellschaft.trim()) e[`k_${i}_versicherungsgesellschaft`] = 'Pflichtfeld';
        if (!k.versicherungsnummer.trim()) e[`k_${i}_versicherungsnummer`] = 'Pflichtfeld';
        if (!k.versicherungsart) e[`k_${i}_versicherungsart`] = 'Bitte auswählen';
        if (!k.kuendigungsgrund) e[`k_${i}_kuendigungsgrund`] = 'Bitte auswählen';
      });
    }
    if (selectedType === 'beraterwechsel') {
      if (!formData.geburtsdatum) e.geburtsdatum = 'Pflichtfeld';
      if (formData.vertraegeUebertragen.length === 0) e.vertraegeUebertragen = 'Mindestens einen Vertrag auswählen';
    }
    if (selectedType === 'aenderung') {
      if (!formData.versicherungsnummer.trim()) e.versicherungsnummer = 'Pflichtfeld';
      if (formData.aenderungen.length === 0) e.aenderungen = 'Mindestens eine Änderung auswählen';
    }
    if (selectedType === 'vollmacht') {
      if (!formData.geburtsdatum) e.geburtsdatum = 'Pflichtfeld';
      if (!formData.iban.trim() || !formData.iban.trim().startsWith('DE') || formData.iban.replace(/\s/g, '').length !== 22) e.iban = 'Gültige IBAN (DE, 22 Zeichen) eingeben';
      if (!formData.kontoinhaber.trim()) e.kontoinhaber = 'Pflichtfeld';
      if (!formData.bic.trim()) e.bic = 'Pflichtfeld';
      if (!formData.kreditinstitut.trim()) e.kreditinstitut = 'Pflichtfeld';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleStep2Next = () => {
    if (validateStep2()) {
      sigPadRef.current = null;
      goToStep(3);
    }
  };

  function dataUrlToBytes(dataUrl: string): Uint8Array {
    const base64 = dataUrl.split(',')[1];
    const binaryStr = atob(base64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    return bytes;
  }

  async function generatePdf(sigDataUrl?: string): Promise<Uint8Array> {
    const s = (str: string) => str
      .replace(/\u2013|\u2014/g, '-')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/\u2026/g, '...')
      .replace(/[^\x00-\xFF]/g, '?');

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const { width, height } = page.getSize();
    const ergoRed = rgb(226 / 255, 0, 26 / 255);
    const ergoBlue = rgb(0, 55 / 255, 129 / 255);
    const black = rgb(0, 0, 0);
    const margin = 50;
    let y = height - 50;

    if (selectedType !== 'kuendigung') {
      page.drawText('Agentur Stuebe', { x: width - margin - 170, y, font: helveticaBold, size: 20, color: ergoRed });
      y -= 18;
      page.drawText('Agentur Stuebe - Morino Stuebe', { x: width - margin - 170, y, font: helvetica, size: 12, color: ergoBlue });
      y -= 20;
      page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 2, color: ergoRed });
      y -= 30;

      const title = docTypeLabels[selectedType!];
      const titleWidth = helveticaBold.widthOfTextAtSize(title, 18);
      page.drawText(s(title), { x: (width - titleWidth) / 2, y, font: helveticaBold, size: 18, color: ergoBlue });
      y -= 35;
    }

    const drawText = (text: string, opts?: { bold?: boolean; size?: number; color?: typeof black }) => {
      const font = opts?.bold ? helveticaBold : helvetica;
      const size = opts?.size || 11;
      const color = opts?.color || black;
      const maxWidth = width - 2 * margin;
      const words = s(text).split(' ');
      let line = '';
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
          page.drawText(line, { x: margin, y, font, size, color });
          y -= size + 4;
          line = word;
        } else {
          line = test;
        }
      }
      if (line) {
        page.drawText(line, { x: margin, y, font, size, color });
        y -= size + 4;
      }
    };

    const drawLine = (label: string, value: string) => {
      page.drawText(s(`${label}:`), { x: margin, y, font: helveticaBold, size: 10, color: black });
      page.drawText(s(value), { x: margin + 180, y, font: helvetica, size: 10, color: black });
      y -= 16;
    };

    const today = todayFormatted();

    if (selectedType === 'kuendigung') {
      let sigImg: any = null;
      let sigDims: any = null;
      const sigSrc = sigDataUrl || signatureDataUrl;
      if (sigSrc) {
        try {
          sigImg = await pdfDoc.embedPng(dataUrlToBytes(sigSrc));
          sigDims = sigImg.scale(0.4);
        } catch { /* signature embed failed */ }
      }

      for (let ki = 0; ki < kuendigungen.length; ki++) {
        const k = kuendigungen[ki];
        const currentPage = ki === 0 ? page : pdfDoc.addPage([595.28, 841.89]);
        y = height - 60;

        if (ki === 0) {
          page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(1, 1, 1) });
        }

        const drawOnPage = (text: string, opts?: { bold?: boolean; size?: number; color?: typeof black; indent?: number }) => {
          const f = opts?.bold ? helveticaBold : helvetica;
          const sz = opts?.size || 11;
          const c = opts?.color || black;
          const xPos = margin + (opts?.indent || 0);
          const maxW = width - margin - xPos;
          const words = s(text).split(' ');
          let ln = '';
          for (const w of words) {
            const test = ln ? `${ln} ${w}` : w;
            if (f.widthOfTextAtSize(test, sz) > maxW && ln) {
              currentPage.drawText(ln, { x: xPos, y, font: f, size: sz, color: c });
              y -= sz + 5;
              ln = w;
            } else {
              ln = test;
            }
          }
          if (ln) {
            currentPage.drawText(ln, { x: xPos, y, font: f, size: sz, color: c });
            y -= sz + 5;
          }
        };

        drawOnPage(`${formData.vorname} ${formData.nachname}`, { bold: true, size: 11 });
        drawOnPage(formData.strasse);
        drawOnPage(`${formData.plz} ${formData.ort}`);
        if (formData.email) drawOnPage(formData.email);
        if (formData.telefon) drawOnPage(`Tel.: ${formData.telefon}`);

        y -= 20;

        drawOnPage(k.versicherungsgesellschaft, { bold: true });
        y -= 25;

        drawOnPage(`${formData.ort}, den ${today}`, { size: 10 });
        y -= 20;

        drawOnPage(`Kündigung meiner ${k.versicherungsart}-Versicherung`, { bold: true, size: 13 });
        drawOnPage(`Versicherungsnummer: ${k.versicherungsnummer}`, { size: 10 });
        y -= 15;

        drawOnPage('Sehr geehrte Damen und Herren,');
        y -= 8;

        const datumText = k.kuendigungsdatum ? `zum ${formatDateDE(k.kuendigungsdatum)}` : 'zum nächstmöglichen Termin';
        drawOnPage(`hiermit kündige ich den oben genannten Versicherungsvertrag ${datumText}, hilfsweise zum nächstmöglichen Termin.`);
        y -= 5;
        drawOnPage(`Kündigungsgrund: ${k.kuendigungsgrund}`);
        y -= 8;

        drawOnPage('Bitte bestätigen Sie mir den Eingang dieser Kündigung sowie den genauen Beendigungszeitpunkt schriftlich.');
        y -= 5;
        drawOnPage('Bitte senden Sie die Bestätigung an die oben genannte Adresse.');

        if (k.hinweise.trim()) {
          y -= 10;
          drawOnPage(`Ergänzende Hinweise: ${k.hinweise}`);
        }

        y -= 20;
        drawOnPage('Mit freundlichen Grüßen');

        y -= 10;
        if (sigImg && sigDims) {
          currentPage.drawImage(sigImg, { x: margin, y: y - sigDims.height, width: sigDims.width, height: sigDims.height });
          y -= sigDims.height + 5;
        }
        currentPage.drawText('_______________________________', { x: margin, y, font: helvetica, size: 10, color: black });
        y -= 14;
        currentPage.drawText(s(`${formData.vorname} ${formData.nachname}`), { x: margin, y, font: helvetica, size: 10, color: black });
      }
    } else if (selectedType === 'beraterwechsel') {
      drawText(`${formData.ort}, ${today}`);
      drawText(`${formData.vorname} ${formData.nachname}, geb. ${formatDateDE(formData.geburtsdatum)}`);
      drawText(`${formData.strasse}, ${formData.plz} ${formData.ort}`);
      if (formData.ergoKundennummer) drawText(`ERGO Kundennummer: ${formData.ergoKundennummer}`);
      y -= 15;
      drawText('An: ERGO Versicherung AG', { bold: true });
      y -= 10;
      drawText('Betreff: Antrag auf Betreuerwechsel', { bold: true, size: 12 });
      y -= 15;
      drawText('Sehr geehrte Damen und Herren,');
      y -= 8;
      drawText(`ich bitte um Übertragung der Betreuung meiner ERGO-Verträge (${formData.vertraegeUebertragen.join(', ')}) auf:`);
      y -= 10;
      drawText('Morino Stübe', { bold: true });
      drawText('ERGO Versicherungsfachmann');
      drawText('Vermittlerregister-Nr.: D-5H7J-7DUI1-10');
      drawText('Tel: 015566771019');
      y -= 15;
      drawText('Mit freundlichen Grüßen');
    } else if (selectedType === 'aenderung') {
      drawText(`${formData.ort}, ${today}`);
      drawText(`${formData.vorname} ${formData.nachname}`);
      drawText(`${formData.strasse}, ${formData.plz} ${formData.ort}`);
      drawText(`Versicherungsnummer: ${formData.versicherungsnummer}`);
      y -= 15;
      drawText('Änderungsantrag', { bold: true, size: 14 });
      y -= 10;
      if (formData.aenderungen.includes('Adresse')) {
        drawLine('Neue Straße', formData.neueStrasse);
        drawLine('Neue PLZ', formData.neuePlz);
        drawLine('Neuer Ort', formData.neuerOrt);
        y -= 5;
      }
      if (formData.aenderungen.includes('IBAN/Bankverbindung')) {
        drawLine('Kontoinhaber', formData.kontoinhaber);
        drawLine('Neue IBAN', formData.neueIban);
        drawLine('BIC', formData.bic);
        drawLine('Bank', formData.bank);
        y -= 5;
      }
      if (formData.aenderungen.includes('E-Mail-Adresse')) { drawLine('Neue E-Mail', formData.neueEmail); y -= 5; }
      if (formData.aenderungen.includes('Telefonnummer')) { drawLine('Neue Telefonnummer', formData.neueTelefon); y -= 5; }
      if (formData.aenderungen.includes('Fahrzeugdaten')) {
        drawLine('Kennzeichen', formData.kennzeichen);
        drawLine('Fahrzeugtyp', formData.fahrzeugtyp);
        drawLine('Erstzulassung', formData.erstzulassung);
        y -= 5;
      }
      if (formData.aenderungen.includes('Sonstiges')) { drawLine('Sonstiges', formData.sonstigesText); y -= 5; }
      y -= 10;
      drawText('Mit freundlichen Grüßen');
    } else if (selectedType === 'vollmacht') {
      drawText(`${formData.ort}, ${today}`);
      drawText(`${formData.vorname} ${formData.nachname}, geb. ${formatDateDE(formData.geburtsdatum)}`);
      drawText(`${formData.strasse}, ${formData.plz} ${formData.ort}`);
      y -= 15;
      drawText('Betreuungsvollmacht & SEPA-Lastschriftmandat', { bold: true, size: 14 });
      y -= 10;
      drawText('Hiermit bevollmächtige ich Morino Stübe (Vermittlerregister-Nr.: D-5H7J-7DUI1-10) zur Betreuung meiner ERGO-Verträge.');
      y -= 10;
      drawText('SEPA-Lastschriftmandat:', { bold: true });
      y -= 5;
      drawLine('Kontoinhaber', formData.kontoinhaber);
      drawLine('IBAN', formData.iban);
      drawLine('BIC', formData.bic);
      drawLine('Kreditinstitut', formData.kreditinstitut);
      y -= 10;
      drawText('Mit freundlichen Grüßen');
    }

    if (selectedType !== 'kuendigung') {
      y -= 10;
      const sigToEmbed = sigDataUrl || signatureDataUrl;
      if (sigToEmbed) {
        try {
          const sigImg = await pdfDoc.embedPng(dataUrlToBytes(sigToEmbed));
          const sigDims = sigImg.scale(0.4);
          page.drawImage(sigImg, { x: margin, y: y - sigDims.height, width: sigDims.width, height: sigDims.height });
          y -= sigDims.height + 5;
        } catch { /* signature embed failed */ }
      }

      page.drawText('_______________________________', { x: margin, y, font: helvetica, size: 10, color: black });
      y -= 14;
      page.drawText(s(`${formData.vorname} ${formData.nachname}`), { x: margin, y, font: helvetica, size: 10, color: black });

      const footerY = 30;
      const footerText = 'Erstellt ueber ergo-stuebe.de | Agentur Stuebe | Tel: 015566771019 | Vermittlerregister-Nr.: D-5H7J-7DUI1-10';
      const footerWidth = helvetica.widthOfTextAtSize(footerText, 8);
      page.drawText(footerText, { x: (width - footerWidth) / 2, y: footerY, font: helvetica, size: 8, color: rgb(0.5, 0.5, 0.5) });
    }

    return pdfDoc.save();
  }

  const handleSubmit = async () => {
    const errs: Record<string, string> = {};
    if (!sigPadRef.current || sigPadRef.current.isEmpty()) errs.signature = 'Bitte unterschreiben Sie das Dokument.';
    if (!confirm1) errs.confirm1 = 'Bitte bestätigen.';
    if (!confirm2) errs.confirm2 = 'Bitte bestätigen.';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const sigUrl = sigPadRef.current!.toDataURL('image/png');
    setSignatureDataUrl(sigUrl);

    try {
      const bytes = await generatePdf(sigUrl);
      setPdfBytes(bytes);

      let pdfBase64 = '';
      const chunkSize = 8192;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        pdfBase64 += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
      }
      pdfBase64 = btoa(pdfBase64);
      const summary = buildSummary();

      try {
        const submitRes = await apiRequest('POST', '/api/documents/submit', {
          documentType: docTypeLabels[selectedType!],
          customerName: `${formData.vorname} ${formData.nachname}`,
          customerEmail: formData.email,
          customerPhone: formData.telefon,
          summary,
          pdfBase64,
        });
        setReference((await submitRes.json()).reference ?? null);
        downloadPdf(bytes, `${docTypeLabels[selectedType!].replace(/\s/g, '_')}_${formData.nachname}.pdf`);
        goToStep(4);
      } catch (err: any) {
        downloadPdf(bytes, `${docTypeLabels[selectedType!].replace(/\s/g, '_')}_${formData.nachname}.pdf`);
        setSubmitError(err.message || 'Fehler beim Senden. Das PDF wurde trotzdem heruntergeladen.');
        goToStep(4);
      }
    } catch (err: any) {
      setSubmitError('Fehler bei der PDF-Erstellung: ' + (err.message || 'Unbekannter Fehler'));
      goToStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  const buildSummary = (): string => {
    const lines: string[] = [];
    lines.push(`Dokumenttyp: ${docTypeLabels[selectedType!]}`);
    lines.push(`Name: ${formData.vorname} ${formData.nachname}`);
    lines.push(`Adresse: ${formData.strasse}, ${formData.plz} ${formData.ort}`);
    lines.push(`E-Mail: ${formData.email}`);
    lines.push(`Telefon: ${formData.telefon}`);
    if (selectedType === 'kuendigung') {
      kuendigungen.forEach((k, i) => {
        if (kuendigungen.length > 1) lines.push(`--- Kündigung ${i + 1} ---`);
        lines.push(`Versicherer: ${k.versicherungsgesellschaft}`);
        lines.push(`Versicherungsnummer: ${k.versicherungsnummer}`);
        lines.push(`Art: ${k.versicherungsart}`);
        lines.push(`Grund: ${k.kuendigungsgrund}`);
        if (k.kuendigungsdatum) lines.push(`Datum: ${formatDateDE(k.kuendigungsdatum)}`);
        if (k.hinweise.trim()) lines.push(`Hinweise: ${k.hinweise}`);
      });
    }
    if (selectedType === 'beraterwechsel') {
      lines.push(`Geburtsdatum: ${formatDateDE(formData.geburtsdatum)}`);
      lines.push(`Verträge: ${formData.vertraegeUebertragen.join(', ')}`);
    }
    if (selectedType === 'aenderung') {
      lines.push(`Versicherungsnummer: ${formData.versicherungsnummer}`);
      lines.push(`Änderungen: ${formData.aenderungen.join(', ')}`);
    }
    if (selectedType === 'vollmacht') {
      lines.push(`Geburtsdatum: ${formatDateDE(formData.geburtsdatum)}`);
      lines.push(`IBAN: ${formData.iban}`);
    }
    return lines.join('\n');
  };

  const clearSignature = () => {
    sigPadRef.current?.clear();
  };

  const clearError = (key: string) => {
    if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const renderField = (label: string, field: keyof FormData, type = 'text', placeholder = '', required = true, extraProps?: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className="sv-field">
      <label className="sv-label" htmlFor={`f-${field}`}>{label}{!required && <span className="sv-hint"> (optional)</span>}</label>
      <input
        id={`f-${field}`}
        type={type}
        value={formData[field] as string}
        onChange={e => updateField(field, e.target.value)}
        placeholder={placeholder}
        className="sv-input"
        aria-invalid={!!errors[field]}
        {...extraProps}
      />
      {errors[field] && <span className="sv-error">{errors[field]}</span>}
    </div>
  );

  const renderKField = (i: number, label: string, field: keyof KuendigungEntry, opts: { placeholder?: string; options?: string[]; required?: boolean; type?: string } = {}) => {
    const key = `k_${i}_${field}`;
    const id = `f-${key}`;
    const required = opts.required ?? true;
    return (
      <div className="sv-field">
        <label className="sv-label" htmlFor={id}>{label}{!required && <span className="sv-hint"> (optional)</span>}</label>
        {opts.options ? (
          <select id={id} value={kuendigungen[i][field]} onChange={e => updateKuendigung(i, field, e.target.value)} className="sv-input" aria-invalid={!!errors[key]}>
            <option value="">Bitte auswählen</option>
            {opts.options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : field === 'hinweise' ? (
          <textarea id={id} value={kuendigungen[i][field]} onChange={e => updateKuendigung(i, field, e.target.value)} rows={2} className="sv-input" />
        ) : (
          <input id={id} type={opts.type || 'text'} value={kuendigungen[i][field]} onChange={e => updateKuendigung(i, field, e.target.value)} placeholder={opts.placeholder} className="sv-input" aria-invalid={!!errors[key]} />
        )}
        {errors[key] && <span className="sv-error">{errors[key]}</span>}
      </div>
    );
  };

  const renderChecklist = (field: 'vertraegeUebertragen' | 'aenderungen', label: string, options: string[]) => (
    <fieldset className="sv-field" style={{ border: 'none', margin: 0, padding: 0 }}>
      <legend className="sv-label" style={{ marginBottom: 8 }}>{label}</legend>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {options.map(o => (
          <label key={o} className="sv-check">
            <input type="checkbox" checked={formData[field].includes(o)} onChange={() => toggleArrayField(field, o)} />
            {o}
          </label>
        ))}
      </div>
      {errors[field] && <span className="sv-error">{errors[field]}</span>}
    </fieldset>
  );

  const isUpload = selectedType === 'upload';
  const stepNames = isUpload ? ['Angaben', 'Fertig'] : ['Angaben', 'Unterschrift', 'Fertig'];
  const currentStepName = step === 4 ? 'Fertig' : step === 3 ? 'Unterschrift' : 'Angaben';
  const pdfName = selectedType ? `${docTypeLabels[selectedType].replace(/\s/g, '_')}_${formData.nachname}.pdf` : 'Dokument.pdf';

  if (!selectedType) return null;

  return (
    <ServiceLayout>
      <SEO
        title={`${docTypeLabels[selectedType]} – Service-Center Agentur Stübe`}
        description="Versicherungsdokumente digital einreichen: Kündigungen, Änderungen, Vollmachten, Rechnungen und Belege – mit Unterschrift auf dem Bildschirm und Eingangsbestätigung."
        keywords="Versicherung kündigen, Dokumente einreichen, Ganderkesee, Rechnung einreichen, Kündigung Versicherung"
      />
      <div className="sv-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 4 }}>
        {step < 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {step === 3 ? (
              <button type="button" onClick={() => goToStep(2)} className="sv-link-btn" style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>
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
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <h1 className="sv-h1">{docTypeLabels[selectedType]}</h1>

              <div className="sv-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h2 className="sv-section-title" style={{ marginTop: 0 }}>{isUpload ? 'Kontaktdaten' : 'Persönliche Daten'}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderField('Vorname', 'vorname', 'text', '', true, { autoComplete: 'given-name', enterKeyHint: 'next' as any })}
                  {renderField('Nachname', 'nachname', 'text', '', true, { autoComplete: 'family-name', enterKeyHint: 'next' as any })}
                </div>
                {!isUpload && (
                  <>
                    {renderField('Straße und Hausnummer', 'strasse', 'text', '', true, { autoComplete: 'street-address', enterKeyHint: 'next' as any })}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {renderField('PLZ', 'plz', 'text', '27777', true, { inputMode: 'numeric' as any, autoComplete: 'postal-code', maxLength: 5, enterKeyHint: 'next' as any })}
                      {renderField('Ort', 'ort', 'text', '', true, { autoComplete: 'address-level2', enterKeyHint: 'next' as any })}
                    </div>
                  </>
                )}
                {renderField('E-Mail', 'email', 'email', 'name@beispiel.de', true, { inputMode: 'email' as any, autoComplete: 'email', enterKeyHint: 'next' as any })}
                {renderField('Telefon', 'telefon', 'tel', '0151 12345678', !isUpload, { inputMode: 'tel' as any, autoComplete: 'tel', enterKeyHint: 'next' as any })}
              </div>

              {selectedType === 'kuendigung' && (
                <>
                  {kuendigungen.map((_, i) => (
                    <div key={i} className="sv-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 className="sv-section-title" style={{ marginTop: 0 }}>Vertrag{kuendigungen.length > 1 ? ` ${i + 1}` : ''}</h2>
                        {kuendigungen.length > 1 && (
                          <button type="button" onClick={() => removeKuendigung(i)} className="sv-link-btn" style={{ fontSize: 14 }}>
                            <X size={16} aria-hidden="true" /> Entfernen
                          </button>
                        )}
                      </div>
                      {renderKField(i, 'Versicherungsgesellschaft', 'versicherungsgesellschaft', { placeholder: 'z. B. Muster Versicherung AG' })}
                      {renderKField(i, 'Versicherungsnummer', 'versicherungsnummer')}
                      {renderKField(i, 'Versicherungsart', 'versicherungsart', { options: versicherungsarten })}
                      {renderKField(i, 'Kündigungsgrund', 'kuendigungsgrund', { options: kuendigungsgruende })}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {renderKField(i, 'Kündigen zum', 'kuendigungsdatum', { type: 'date', required: false })}
                        <span className="sv-hint">Ohne Angabe kündigen wir zum nächstmöglichen Termin.</span>
                      </div>
                      {renderKField(i, 'Hinweise', 'hinweise', { required: false })}
                    </div>
                  ))}
                  <button type="button" onClick={addKuendigung} className="sv-btn sv-btn--ghost">
                    <Plus size={18} aria-hidden="true" /> Weiteren Vertrag kündigen
                  </button>
                </>
              )}

              {selectedType === 'beraterwechsel' && (
                <div className="sv-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h2 className="sv-section-title" style={{ marginTop: 0 }}>Vertragsdaten</h2>
                  {renderField('Geburtsdatum', 'geburtsdatum', 'date')}
                  {renderField('Kundennummer beim Versicherer', 'ergoKundennummer', 'text', '', false)}
                  {renderChecklist('vertraegeUebertragen', 'Welche Verträge sollen wir betreuen?', beraterwechselVertraege)}
                </div>
              )}

              {selectedType === 'aenderung' && (
                <div className="sv-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h2 className="sv-section-title" style={{ marginTop: 0 }}>Was ändert sich?</h2>
                  {renderField('Versicherungsnummer', 'versicherungsnummer')}
                  {renderChecklist('aenderungen', 'Bitte auswählen', aenderungsOptionen)}
                  {formData.aenderungen.includes('Adresse') && (
                    <div className="sv-subbox">
                      <span className="sv-label">Neue Adresse</span>
                      {renderField('Straße und Hausnummer', 'neueStrasse')}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {renderField('PLZ', 'neuePlz', 'text', '', true, { inputMode: 'numeric' as any, maxLength: 5 })}
                        {renderField('Ort', 'neuerOrt')}
                      </div>
                    </div>
                  )}
                  {formData.aenderungen.includes('IBAN/Bankverbindung') && (
                    <div className="sv-subbox">
                      <span className="sv-label">Neue Bankverbindung</span>
                      {renderField('Kontoinhaber', 'kontoinhaber')}
                      {renderField('IBAN', 'neueIban')}
                      {renderField('BIC', 'bic')}
                      {renderField('Bank', 'bank')}
                    </div>
                  )}
                  {formData.aenderungen.includes('E-Mail-Adresse') && (
                    <div className="sv-subbox">
                      {renderField('Neue E-Mail-Adresse', 'neueEmail', 'email', '', true, { inputMode: 'email' as any, autoComplete: 'email' })}
                    </div>
                  )}
                  {formData.aenderungen.includes('Telefonnummer') && (
                    <div className="sv-subbox">
                      {renderField('Neue Telefonnummer', 'neueTelefon', 'tel', '', true, { inputMode: 'tel' as any, autoComplete: 'tel' })}
                    </div>
                  )}
                  {formData.aenderungen.includes('Fahrzeugdaten') && (
                    <div className="sv-subbox">
                      <span className="sv-label">Fahrzeugdaten</span>
                      {renderField('Kennzeichen', 'kennzeichen')}
                      {renderField('Fahrzeugtyp', 'fahrzeugtyp')}
                      {renderField('Erstzulassung', 'erstzulassung', 'date')}
                    </div>
                  )}
                  {formData.aenderungen.includes('Sonstiges') && (
                    <div className="sv-subbox">
                      <div className="sv-field">
                        <label className="sv-label" htmlFor="f-sonstigesText">Was soll geändert werden?</label>
                        <textarea id="f-sonstigesText" value={formData.sonstigesText} onChange={e => updateField('sonstigesText', e.target.value)} rows={3} className="sv-input" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedType === 'vollmacht' && (
                <div className="sv-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h2 className="sv-section-title" style={{ marginTop: 0 }}>Vollmacht &amp; SEPA-Mandat</h2>
                  {renderField('Geburtsdatum', 'geburtsdatum', 'date')}
                  {renderField('IBAN', 'iban', 'text', 'DE00 0000 0000 0000 0000 00', true, { autoComplete: 'off' })}
                  {renderField('Kontoinhaber', 'kontoinhaber')}
                  {renderField('BIC', 'bic')}
                  {renderField('Kreditinstitut', 'kreditinstitut')}
                </div>
              )}

              {isUpload && (
                <>
                  <div className="sv-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <h2 className="sv-section-title" style={{ marginTop: 0 }}>Zum Vertrag</h2>
                    {renderField('Versicherungsnummer', 'versicherungsnummer', 'text', 'z. B. 12345678')}
                    {renderField('Schadennummer', 'schadennummer', 'text', 'falls vorhanden', false)}
                    <div className="sv-field">
                      <label className="sv-label" htmlFor="f-uploadBeschreibung">Worum geht es? <span className="sv-hint">(optional)</span></label>
                      <textarea id="f-uploadBeschreibung" value={formData.uploadBeschreibung} onChange={e => updateField('uploadBeschreibung', e.target.value)} rows={3} placeholder="z. B. Zahnarztrechnung vom 15.01." className="sv-input" />
                    </div>
                  </div>

                  <div className="sv-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <h2 className="sv-section-title" style={{ marginTop: 0 }}>Dateien</h2>
                    <input ref={fileInputRef} type="file" accept="image/*,application/pdf" multiple onChange={handleFileSelect} className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadFiles.length >= 10} className="sv-dropzone">
                      <Upload size={26} strokeWidth={1.7} aria-hidden="true" />
                      <span style={{ fontWeight: 700 }}>Fotos oder PDFs auswählen</span>
                      <span className="sv-hint">Bis zu 10 Dateien, je max. 10 MB</span>
                    </button>
                    {uploadFiles.map((uf, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid var(--sv-line)', paddingTop: 10 }}>
                        {uf.preview ? (
                          <img src={uf.preview} alt="" style={{ width: 48, height: 48, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
                        ) : (
                          <span style={{ width: 48, height: 48, borderRadius: 6, background: 'var(--sv-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <FileText size={22} aria-hidden="true" />
                          </span>
                        )}
                        <span style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ display: 'block', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{uf.file.name}</span>
                          <span className="sv-hint">{(uf.file.size / 1024).toFixed(0)} KB</span>
                        </span>
                        <button type="button" onClick={() => removeFile(i)} aria-label={`${uf.file.name} entfernen`} style={{ width: 44, height: 44, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--sv-ink)' }}>
                          <X size={18} aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                    {errors.files && <span className="sv-error">{errors.files}</span>}
                    <p className="sv-hint" style={{ margin: 0 }}>
                      Mehr als 10 Dateien? Schicken Sie den Rest gern per{' '}
                      <a href={`${WHATSAPP_URL}?text=${encodeURIComponent('Hallo Herr Stübe, ich möchte Ihnen weitere Rechnungen/Belege zusenden.')}`} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>WhatsApp</a>.
                    </p>
                  </div>

                  <div>
                    <label className="sv-check">
                      <input type="checkbox" checked={confirm1} onChange={e => { setConfirm1(e.target.checked); clearError('confirm1'); }} />
                      <span>Ich bin einverstanden, dass meine Angaben und Dokumente zur Bearbeitung meines Anliegens verarbeitet werden. Die <Link href="/datenschutz" style={{ fontWeight: 600 }}>Datenschutzhinweise</Link> habe ich gelesen.</span>
                    </label>
                    {errors.confirm1 && <p className="sv-error" style={{ margin: '6px 0 0 34px' }}>{errors.confirm1}</p>}
                  </div>
                </>
              )}

              {isUpload ? (
                <button
                  type="button"
                  onClick={() => {
                    if (!confirm1) { setErrors(prev => ({ ...prev, confirm1: 'Bitte bestätigen.' })); return; }
                    handleUploadSubmit();
                  }}
                  disabled={isSubmitting}
                  className="sv-btn"
                >
                  {isSubmitting ? <><span className="sv-spin" aria-hidden="true" /> Wird gesendet …</> : <>Unterlagen einreichen <ArrowRight size={18} aria-hidden="true" /></>}
                </button>
              ) : (
                <button type="button" onClick={handleStep2Next} className="sv-btn">
                  Weiter zur Unterschrift <ArrowRight size={18} aria-hidden="true" />
                </button>
              )}
              {Object.keys(errors).length > 0 && (
                <p className="sv-error" role="alert" style={{ margin: 0, textAlign: 'center' }}>Bitte prüfen Sie die markierten Felder.</p>
              )}
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <h1 className="sv-h1">{docTypeLabels[selectedType]} – <em>bitte unterschreiben</em></h1>

              <div className="sv-card" style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 15, lineHeight: 1.55, color: 'var(--sv-body)' }}>
                <span style={{ fontWeight: 700, color: 'var(--sv-ink)' }}>{formData.vorname} {formData.nachname}</span>
                <span>{formData.strasse}, {formData.plz} {formData.ort}</span>
                {selectedType === 'kuendigung' && kuendigungen.map((k, i) => (
                  <span key={i}>Kündigung: {k.versicherungsgesellschaft}, Nr. {k.versicherungsnummer} – {k.kuendigungsdatum ? `zum ${formatDateDE(k.kuendigungsdatum)}` : 'zum nächstmöglichen Termin'}</span>
                ))}
                {selectedType === 'beraterwechsel' && <span>Verträge: {formData.vertraegeUebertragen.join(', ')}</span>}
                {selectedType === 'aenderung' && <span>Vertrag {formData.versicherungsnummer}: {formData.aenderungen.join(', ')}</span>}
                {selectedType === 'vollmacht' && <span>Lastschrift von {formData.kontoinhaber}, IBAN {formData.iban}</span>}
                <button type="button" onClick={() => goToStep(2)} className="sv-link-btn" style={{ alignSelf: 'flex-start', fontSize: 14 }}>Angaben bearbeiten</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span className="sv-label" id="sig-label">Ihre Unterschrift</span>
                <span className="sv-hint">Mit dem Finger oder der Maus im weißen Feld unterschreiben.</span>
                <div className="sv-sign">
                  <canvas ref={canvasRef} aria-labelledby="sig-label" />
                  <span className="sv-sign-line" />
                  <span className="sv-sign-caption">{formData.ort ? `${formData.ort}, ` : ''}{todayFormatted()}</span>
                </div>
                <button type="button" onClick={clearSignature} className="sv-link-btn" style={{ alignSelf: 'flex-start', fontSize: 14 }}>
                  <RotateCcw size={15} aria-hidden="true" /> Unterschrift löschen
                </button>
                {errors.signature && <span className="sv-error">{errors.signature}</span>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label className="sv-check">
                    <input type="checkbox" checked={confirm1} onChange={e => { setConfirm1(e.target.checked); clearError('confirm1'); }} />
                    <span>Meine Angaben sind richtig und vollständig.</span>
                  </label>
                  {errors.confirm1 && <p className="sv-error" style={{ margin: '6px 0 0 34px' }}>{errors.confirm1}</p>}
                </div>
                <div>
                  <label className="sv-check">
                    <input type="checkbox" checked={confirm2} onChange={e => { setConfirm2(e.target.checked); clearError('confirm2'); }} />
                    <span>Das Dokument darf elektronisch verarbeitet und weitergeleitet werden. Die <Link href="/datenschutz" style={{ fontWeight: 600 }}>Datenschutzhinweise</Link> habe ich gelesen.</span>
                  </label>
                  {errors.confirm2 && <p className="sv-error" style={{ margin: '6px 0 0 34px' }}>{errors.confirm2}</p>}
                </div>
              </div>

              <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="sv-btn">
                {isSubmitting ? <><span className="sv-spin" aria-hidden="true" /> Wird gesendet …</> : <>Unterschrieben absenden <ArrowRight size={18} aria-hidden="true" /></>}
              </button>
              <p className="sv-hint" style={{ margin: 0, textAlign: 'center', fontSize: 14 }}>
                Das unterschriebene PDF wird direkt auf Ihrem Gerät gespeichert. Die Eingangsbestätigung kommt per E-Mail.
              </p>
            </div>
          )}

          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {submitError ? (
                <>
                  <h1 className="sv-h1">Das hat leider <em>nicht geklappt</em></h1>
                  <div className="sv-notice sv-notice--error" role="alert">{submitError}</div>
                  <p style={{ margin: 0, color: 'var(--sv-body)' }}>
                    {isUpload
                      ? 'Bitte versuchen Sie es erneut oder schicken Sie uns die Unterlagen per WhatsApp.'
                      : 'Das unterschriebene PDF liegt auf Ihrem Gerät. Schicken Sie es uns bitte per WhatsApp oder E-Mail.'}
                  </p>
                </>
              ) : (
                <>
                  <h1 className="sv-h1">Vielen Dank – <em>ist angekommen.</em></h1>
                  <p style={{ margin: 0, color: 'var(--sv-body)' }}>
                    Ihre Unterlagen liegen jetzt bei Morino Stübe. Wir melden uns, falls wir noch etwas brauchen.
                    {formData.email && <> Eine Eingangsbestätigung geht an <strong>{formData.email}</strong>.</>}
                  </p>
                  {reference && (
                    <div className="sv-card" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span className="sv-hint">Ihre Vorgangsnummer</span>
                      <span className="sv-ref">{reference}</span>
                    </div>
                  )}
                </>
              )}

              <div className="sv-card">
                <dl className="sv-dl">
                  <dt>Anliegen</dt><dd>{docTypeLabels[selectedType]}</dd>
                  <dt>Name</dt><dd>{formData.vorname} {formData.nachname}</dd>
                  {selectedType === 'kuendigung' && <><dt>Verträge</dt><dd>{kuendigungen.length}</dd></>}
                  {isUpload && <><dt>Dateien</dt><dd>{uploadFiles.length}</dd></>}
                  <dt>Datum</dt><dd>{todayFormatted()}</dd>
                </dl>
              </div>

              {pdfBytes && !isUpload && (
                <button type="button" onClick={() => downloadPdf(pdfBytes, pdfName)} className="sv-btn">
                  <Download size={18} aria-hidden="true" /> PDF erneut herunterladen
                </button>
              )}
              <a
                href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Hallo Herr Stübe, ich habe soeben „${docTypeLabels[selectedType]}“ über das Service-Center eingereicht${reference ? ` (Vorgang ${reference})` : ''}. Viele Grüße, ${formData.vorname} ${formData.nachname}`)}`}
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
