import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'wouter';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import SignaturePad from 'signature_pad';
import { apiRequest } from '@/lib/queryClient';

type DocType = 'kuendigung' | 'beraterwechsel' | 'aenderung' | 'vollmacht';

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
}

const initialFormData: FormData = {
  vorname: '', nachname: '', strasse: '', plz: '', ort: '', email: '', telefon: '',
  versicherungsgesellschaft: '', versicherungsnummer: '', versicherungsart: '', kuendigungsgrund: '',
  kuendigungsdatum: '', hinweise: '', geburtsdatum: '', ergoKundennummer: '',
  vertraegeUebertragen: [], aenderungen: [],
  neueStrasse: '', neuePlz: '', neuerOrt: '', kontoinhaber: '', neueIban: '', bic: '', bank: '',
  neueEmail: '', neueTelefon: '', kennzeichen: '', fahrzeugtyp: '', erstzulassung: '',
  sonstigesText: '', iban: '', kreditinstitut: '',
};

const docTypeLabels: Record<DocType, string> = {
  kuendigung: 'Kündigungsschreiben',
  beraterwechsel: 'Beraterwechsel-Antrag',
  aenderung: 'Änderungsantrag',
  vollmacht: 'Vollmacht & SEPA',
};

const docTypeCards: { type: DocType; icon: string; title: string; desc: string }[] = [
  { type: 'kuendigung', icon: '📄', title: 'Kündigungsschreiben', desc: 'Kündigung bei einem anderen Versicherer einreichen' },
  { type: 'beraterwechsel', icon: '🔄', title: 'Beraterwechsel-Antrag', desc: 'Von Morino Stübe bei ERGO betreut werden' },
  { type: 'aenderung', icon: '✏️', title: 'Änderungsantrag', desc: 'Adresse, IBAN oder andere Vertragsdaten ändern' },
  { type: 'vollmacht', icon: '📋', title: 'Vollmacht & SEPA', desc: 'Betreuungsvollmacht & Lastschriftmandat erteilen' },
];

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

export default function DokumentePage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<DocType | null>(null);
  const [formData, setFormData] = useState<FormData>({ ...initialFormData });
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirm1, setConfirm1] = useState(false);
  const [confirm2, setConfirm2] = useState(false);
  const [fadeClass, setFadeClass] = useState('opacity-100 transition-opacity duration-300');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sigPadRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get('type') as DocType | null;
    if (typeParam && ['kuendigung', 'beraterwechsel', 'aenderung', 'vollmacht'].includes(typeParam)) {
      setSelectedType(typeParam);
      setStep(2);
    }
  }, []);

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
        penColor: 'rgb(0, 0, 0)',
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

  const handleSelectType = (type: DocType) => {
    setSelectedType(type);
    setFormData({ ...initialFormData });
    setErrors({});
    goToStep(2);
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
      if (!formData.versicherungsgesellschaft.trim()) e.versicherungsgesellschaft = 'Pflichtfeld';
      if (!formData.versicherungsnummer.trim()) e.versicherungsnummer = 'Pflichtfeld';
      if (!formData.versicherungsart) e.versicherungsart = 'Bitte auswählen';
      if (!formData.kuendigungsgrund) e.kuendigungsgrund = 'Bitte auswählen';
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

  async function generatePdf(): Promise<Uint8Array> {
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

    page.drawText('ERGO', { x: width - margin - 80, y, font: helveticaBold, size: 28, color: ergoRed });
    y -= 18;
    page.drawText('Agentur Stübe – Morino Stübe', { x: width - margin - 170, y, font: helvetica, size: 12, color: ergoBlue });
    y -= 20;
    page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 2, color: ergoRed });
    y -= 30;

    const title = docTypeLabels[selectedType!];
    const titleWidth = helveticaBold.widthOfTextAtSize(title, 18);
    page.drawText(title, { x: (width - titleWidth) / 2, y, font: helveticaBold, size: 18, color: ergoBlue });
    y -= 35;

    const drawText = (text: string, opts?: { bold?: boolean; size?: number; color?: typeof black }) => {
      const font = opts?.bold ? helveticaBold : helvetica;
      const size = opts?.size || 11;
      const color = opts?.color || black;
      const maxWidth = width - 2 * margin;
      const words = text.split(' ');
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
      page.drawText(`${label}:`, { x: margin, y, font: helveticaBold, size: 10, color: black });
      page.drawText(value, { x: margin + 180, y, font: helvetica, size: 10, color: black });
      y -= 16;
    };

    const today = todayFormatted();

    if (selectedType === 'kuendigung') {
      drawText(`${formData.ort}, ${today}`);
      y -= 10;
      drawText(`${formData.vorname} ${formData.nachname}`);
      drawText(`${formData.strasse}`);
      drawText(`${formData.plz} ${formData.ort}`);
      y -= 15;
      drawText(formData.versicherungsgesellschaft);
      drawText(`Versicherungsnummer: ${formData.versicherungsnummer}`);
      y -= 15;
      drawText(`Betreff: Kündigung meiner ${formData.versicherungsart}-Versicherung`, { bold: true, size: 12 });
      y -= 15;
      drawText('Sehr geehrte Damen und Herren,');
      y -= 8;
      const datumText = formData.kuendigungsdatum ? `zum ${formatDateDE(formData.kuendigungsdatum)}` : 'zum nächstmöglichen Termin';
      drawText(`hiermit kündige ich die oben genannte Versicherung (${formData.kuendigungsgrund}) ${datumText}, hilfsweise zum nächstmöglichen Termin.`);
      y -= 8;
      drawText('Ich bitte um eine schriftliche Eingangsbestätigung.');
      if (formData.hinweise.trim()) { y -= 8; drawText(`Hinweise: ${formData.hinweise}`); }
      y -= 15;
      drawText('Mit freundlichen Grüßen');
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

    y -= 10;
    if (signatureDataUrl) {
      try {
        const sigBytes = await fetch(signatureDataUrl).then(r => r.arrayBuffer());
        const sigImg = await pdfDoc.embedPng(new Uint8Array(sigBytes));
        const sigDims = sigImg.scale(0.4);
        page.drawImage(sigImg, { x: margin, y: y - sigDims.height, width: sigDims.width, height: sigDims.height });
        y -= sigDims.height + 5;
      } catch { /* signature embed failed */ }
    }

    page.drawText('_______________________________', { x: margin, y, font: helvetica, size: 10, color: black });
    y -= 14;
    page.drawText(`${formData.vorname} ${formData.nachname}`, { x: margin, y, font: helvetica, size: 10, color: black });

    const footerY = 30;
    const footerText = 'Erstellt über ergo-stuebe.de | ERGO Agentur Stübe | Tel: 015566771019 | Vermittlerregister-Nr.: D-5H7J-7DUI1-10';
    const footerWidth = helvetica.widthOfTextAtSize(footerText, 8);
    page.drawText(footerText, { x: (width - footerWidth) / 2, y: footerY, font: helvetica, size: 8, color: rgb(0.5, 0.5, 0.5) });

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
      await new Promise(r => setTimeout(r, 50));
      const bytes = await generatePdf();
      setPdfBytes(bytes);

      let pdfBase64 = '';
      const chunkSize = 8192;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        pdfBase64 += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
      }
      pdfBase64 = btoa(pdfBase64);
      const summary = buildSummary();

      downloadPdf(bytes, `${docTypeLabels[selectedType!].replace(/\s/g, '_')}_${formData.nachname}.pdf`);

      try {
        await apiRequest('POST', '/api/documents/submit', {
          documentType: docTypeLabels[selectedType!],
          customerName: `${formData.vorname} ${formData.nachname}`,
          customerEmail: formData.email,
          customerPhone: formData.telefon,
          summary,
          pdfBase64,
        });
        goToStep(4);
      } catch (err: any) {
        setSubmitError(err.message || 'Fehler beim Senden. Das PDF wurde trotzdem heruntergeladen.');
        goToStep(4);
      }
    } catch (err: any) {
      setSubmitError('Fehler bei der PDF-Erstellung: ' + (err.message || 'Unbekannter Fehler'));
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
      lines.push(`Versicherer: ${formData.versicherungsgesellschaft}`);
      lines.push(`Versicherungsnummer: ${formData.versicherungsnummer}`);
      lines.push(`Art: ${formData.versicherungsart}`);
      lines.push(`Grund: ${formData.kuendigungsgrund}`);
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

  const inputCls = (field: string) =>
    `w-full p-3 border-2 rounded-xl text-base outline-none transition-colors ${errors[field] ? 'border-red-500' : 'border-gray-200 focus:border-[#003781]'}`;

  const selectCls = (field: string) =>
    `w-full p-3 border-2 rounded-xl text-base outline-none transition-colors bg-white ${errors[field] ? 'border-red-500' : 'border-gray-200 focus:border-[#003781]'}`;

  const renderField = (label: string, field: keyof FormData, type = 'text', placeholder = '', required = true) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-700">{label}{required && ' *'}</label>
      <input
        type={type}
        value={formData[field] as string}
        onChange={e => updateField(field, e.target.value)}
        placeholder={placeholder}
        className={inputCls(field)}
      />
      {errors[field] && <span className="text-xs text-red-500">{errors[field]}</span>}
    </div>
  );

  const progressPercent = step === 1 ? 33 : step === 2 ? 66 : step === 3 ? 100 : 100;

  return (
    <div className="min-h-screen bg-gray-50 safe-area-bottom">
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
                <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Dokument erstellen</h1>
                <p className="text-sm text-gray-500">Wählen Sie den gewünschten Dokumenttyp aus</p>
              </div>
              <div className="flex flex-col gap-3">
                {docTypeCards.map(card => (
                  <button
                    key={card.type}
                    onClick={() => handleSelectType(card.type)}
                    className="w-full bg-white border-2 border-gray-200 rounded-xl p-4 text-left flex items-start gap-3 transition-colors active:border-[#E2001A] hover:border-[#E2001A]"
                  >
                    <span className="text-2xl mt-0.5 shrink-0">{card.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{card.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{card.desc}</p>
                    </div>
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
              <h2 className="text-xl font-bold text-gray-900 mb-1">{docTypeLabels[selectedType]}</h2>
              <p className="text-sm text-gray-500 mb-5">Bitte füllen Sie alle Pflichtfelder (*) aus.</p>
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold text-[#003781] uppercase tracking-wide">Persönliche Daten</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderField('Vorname', 'vorname')}
                  {renderField('Nachname', 'nachname')}
                </div>
                {renderField('Straße + Hausnummer', 'strasse')}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderField('PLZ', 'plz', 'text', '12345')}
                  {renderField('Ort', 'ort')}
                </div>
                {renderField('E-Mail', 'email', 'email', 'name@beispiel.de')}
                {renderField('Telefon', 'telefon', 'tel', '0151 12345678')}

                {selectedType === 'kuendigung' && (
                  <>
                    <h3 className="text-sm font-bold text-[#003781] uppercase tracking-wide mt-2">Versicherungsdaten</h3>
                    {renderField('Versicherungsgesellschaft', 'versicherungsgesellschaft', 'text', 'z.B. Allianz, HUK-Coburg')}
                    {renderField('Versicherungsnummer', 'versicherungsnummer')}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Versicherungsart *</label>
                      <select value={formData.versicherungsart} onChange={e => updateField('versicherungsart', e.target.value)} className={selectCls('versicherungsart')}>
                        <option value="">Bitte auswählen</option>
                        {versicherungsarten.map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                      {errors.versicherungsart && <span className="text-xs text-red-500">{errors.versicherungsart}</span>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Kündigungsgrund *</label>
                      <select value={formData.kuendigungsgrund} onChange={e => updateField('kuendigungsgrund', e.target.value)} className={selectCls('kuendigungsgrund')}>
                        <option value="">Bitte auswählen</option>
                        {kuendigungsgruende.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                      {errors.kuendigungsgrund && <span className="text-xs text-red-500">{errors.kuendigungsgrund}</span>}
                    </div>
                    {renderField('Gewünschtes Kündigungsdatum', 'kuendigungsdatum', 'date', '', false)}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Hinweise (optional)</label>
                      <textarea
                        value={formData.hinweise}
                        onChange={e => updateField('hinweise', e.target.value)}
                        rows={3}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl text-base outline-none focus:border-[#003781] resize-none"
                      />
                    </div>
                  </>
                )}

                {selectedType === 'beraterwechsel' && (
                  <>
                    <h3 className="text-sm font-bold text-[#003781] uppercase tracking-wide mt-2">Vertragsdaten</h3>
                    {renderField('Geburtsdatum', 'geburtsdatum', 'date')}
                    {renderField('ERGO Kundennummer', 'ergoKundennummer', 'text', '', false)}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Welche Verträge übertragen? *</label>
                      <div className="flex flex-col gap-2 mt-1">
                        {beraterwechselVertraege.map(v => (
                          <label key={v} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.vertraegeUebertragen.includes(v)}
                              onChange={() => toggleArrayField('vertraegeUebertragen', v)}
                              className="w-5 h-5 accent-[#E2001A] shrink-0"
                            />
                            {v}
                          </label>
                        ))}
                      </div>
                      {errors.vertraegeUebertragen && <span className="text-xs text-red-500">{errors.vertraegeUebertragen}</span>}
                    </div>
                  </>
                )}

                {selectedType === 'aenderung' && (
                  <>
                    <h3 className="text-sm font-bold text-[#003781] uppercase tracking-wide mt-2">Änderungsdaten</h3>
                    {renderField('Versicherungsnummer', 'versicherungsnummer')}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-gray-700">Was soll geändert werden? *</label>
                      <div className="flex flex-col gap-2 mt-1">
                        {aenderungsOptionen.map(opt => (
                          <label key={opt} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.aenderungen.includes(opt)}
                              onChange={() => toggleArrayField('aenderungen', opt)}
                              className="w-5 h-5 accent-[#E2001A] shrink-0"
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                      {errors.aenderungen && <span className="text-xs text-red-500">{errors.aenderungen}</span>}
                    </div>
                    {formData.aenderungen.includes('Adresse') && (
                      <div className="bg-blue-50 rounded-xl p-4 flex flex-col gap-3">
                        <span className="text-xs font-bold text-[#003781]">Neue Adresse</span>
                        {renderField('Neue Straße + Hausnummer', 'neueStrasse')}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {renderField('Neue PLZ', 'neuePlz')}
                          {renderField('Neuer Ort', 'neuerOrt')}
                        </div>
                      </div>
                    )}
                    {formData.aenderungen.includes('IBAN/Bankverbindung') && (
                      <div className="bg-blue-50 rounded-xl p-4 flex flex-col gap-3">
                        <span className="text-xs font-bold text-[#003781]">Neue Bankverbindung</span>
                        {renderField('Kontoinhaber', 'kontoinhaber')}
                        {renderField('Neue IBAN', 'neueIban')}
                        {renderField('BIC', 'bic')}
                        {renderField('Bank', 'bank')}
                      </div>
                    )}
                    {formData.aenderungen.includes('E-Mail-Adresse') && (
                      <div className="bg-blue-50 rounded-xl p-4 flex flex-col gap-3">
                        <span className="text-xs font-bold text-[#003781]">Neue E-Mail</span>
                        {renderField('Neue E-Mail-Adresse', 'neueEmail', 'email')}
                      </div>
                    )}
                    {formData.aenderungen.includes('Telefonnummer') && (
                      <div className="bg-blue-50 rounded-xl p-4 flex flex-col gap-3">
                        <span className="text-xs font-bold text-[#003781]">Neue Telefonnummer</span>
                        {renderField('Neue Telefonnummer', 'neueTelefon', 'tel')}
                      </div>
                    )}
                    {formData.aenderungen.includes('Fahrzeugdaten') && (
                      <div className="bg-blue-50 rounded-xl p-4 flex flex-col gap-3">
                        <span className="text-xs font-bold text-[#003781]">Fahrzeugdaten</span>
                        {renderField('Kennzeichen', 'kennzeichen')}
                        {renderField('Fahrzeugtyp', 'fahrzeugtyp')}
                        {renderField('Erstzulassung', 'erstzulassung', 'date')}
                      </div>
                    )}
                    {formData.aenderungen.includes('Sonstiges') && (
                      <div className="bg-blue-50 rounded-xl p-4 flex flex-col gap-3">
                        <span className="text-xs font-bold text-[#003781]">Sonstiges</span>
                        <div className="flex flex-col gap-1">
                          <label className="text-sm font-semibold text-gray-700">Freitext</label>
                          <textarea
                            value={formData.sonstigesText}
                            onChange={e => updateField('sonstigesText', e.target.value)}
                            rows={3}
                            className="w-full p-3 border-2 border-gray-200 rounded-xl text-base outline-none focus:border-[#003781] resize-none"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {selectedType === 'vollmacht' && (
                  <>
                    <h3 className="text-sm font-bold text-[#003781] uppercase tracking-wide mt-2">Vollmacht & SEPA-Daten</h3>
                    {renderField('Geburtsdatum', 'geburtsdatum', 'date')}
                    {renderField('IBAN', 'iban', 'text', 'DE89 3704 0044 0532 0130 00')}
                    {renderField('Kontoinhaber', 'kontoinhaber')}
                    {renderField('BIC', 'bic')}
                    {renderField('Kreditinstitut', 'kreditinstitut')}
                  </>
                )}

                <button
                  onClick={handleStep2Next}
                  className="w-full bg-ergo-red text-white font-semibold text-base py-4 rounded-xl min-h-[48px] active:scale-[0.97] transition-transform mt-2"
                >
                  Weiter zur Unterschrift →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Unterschrift & Absenden</h2>
              <p className="text-sm text-gray-500 mb-5">Bitte unterschreiben Sie im Feld und bestätigen Sie die Angaben.</p>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Ihre Unterschrift *</label>
                  <canvas
                    ref={canvasRef}
                    className="w-full border-2 border-dashed border-[#003781] rounded-xl bg-white touch-none"
                    style={{ height: 180 }}
                  />
                  <button onClick={clearSignature} className="text-sm text-[#003781] mt-2 font-medium">
                    🗑️ Unterschrift löschen
                  </button>
                  {errors.signature && <p className="text-xs text-red-500 mt-1">{errors.signature}</p>}
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-700 font-medium mb-3">Datum: {todayFormatted()}</p>

                  <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={confirm1}
                      onChange={e => { setConfirm1(e.target.checked); if (errors.confirm1) setErrors(prev => { const n = { ...prev }; delete n.confirm1; return n; }); }}
                      className="w-5 h-5 accent-[#E2001A] shrink-0 mt-0.5"
                    />
                    <span>Ich bestätige, dass alle Angaben korrekt und vollständig sind.</span>
                  </label>
                  {errors.confirm1 && <p className="text-xs text-red-500 mb-2 ml-7">{errors.confirm1}</p>}

                  <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={confirm2}
                      onChange={e => { setConfirm2(e.target.checked); if (errors.confirm2) setErrors(prev => { const n = { ...prev }; delete n.confirm2; return n; }); }}
                      className="w-5 h-5 accent-[#E2001A] shrink-0 mt-0.5"
                    />
                    <span>Ich bin einverstanden, dass dieses Dokument elektronisch verarbeitet und weitergeleitet wird.</span>
                  </label>
                  {errors.confirm2 && <p className="text-xs text-red-500 mb-2 ml-7">{errors.confirm2}</p>}

                  <p className="text-xs text-gray-400 mt-2">
                    Ihre Daten werden gemäß DSGVO vertraulich behandelt und ausschließlich zur Bearbeitung Ihres Anliegens verwendet.
                  </p>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-ergo-red text-white font-semibold text-base py-4 rounded-xl min-h-[48px] active:scale-[0.97] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      Wird gesendet...
                    </>
                  ) : (
                    '📨 Dokument jetzt absenden'
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-4">
              {submitError ? (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 text-left">
                  <p className="text-red-700 font-semibold text-sm mb-1">⚠️ Fehler beim Übermitteln</p>
                  <p className="text-red-600 text-sm">{submitError}</p>
                  <p className="text-red-500 text-xs mt-2">Das PDF wurde trotzdem heruntergeladen. Sie können es auch per WhatsApp senden.</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto mb-4">
                    <svg viewBox="0 0 52 52" className="w-full h-full">
                      <circle cx="26" cy="26" r="24" fill="none" stroke="#22c55e" strokeWidth="2"
                        strokeDasharray="150" strokeDashoffset="150"
                        style={{ animation: 'dokStroke 0.6s cubic-bezier(0.65,0,0.45,1) forwards' }} />
                      <path fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                        d="M14 27l8 8 16-16"
                        strokeDasharray="40" strokeDashoffset="40"
                        style={{ animation: 'dokStroke 0.3s cubic-bezier(0.65,0,0.45,1) 0.4s forwards' }} />
                    </svg>
                  </div>
                  <style>{`@keyframes dokStroke { to { stroke-dashoffset: 0; } }`}</style>
                </>
              )}

              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {submitError ? 'PDF wurde gespeichert' : '✅ Dokument erfolgreich übermittelt!'}
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                {submitError
                  ? 'Das PDF wurde auf Ihrem Gerät gespeichert. Bitte senden Sie es per WhatsApp oder E-Mail.'
                  : 'Morino Stübe hat Ihre Unterlagen erhalten und meldet sich bei Bedarf bei Ihnen.'}
              </p>

              <div className="bg-blue-50 rounded-xl p-4 text-left mb-6">
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Dokumenttyp</span>
                    <span className="font-semibold text-gray-900">{docTypeLabels[selectedType!]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name</span>
                    <span className="font-semibold text-gray-900">{formData.vorname} {formData.nachname}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Eingereicht am</span>
                    <span className="font-semibold text-gray-900">{todayFormatted()}</span>
                  </div>
                </div>
              </div>

              {pdfBytes && (
                <button
                  onClick={() => downloadPdf(pdfBytes, `${docTypeLabels[selectedType!].replace(/\s/g, '_')}_${formData.nachname}.pdf`)}
                  className="w-full bg-[#003781] text-white font-semibold text-base py-4 rounded-xl min-h-[48px] active:scale-[0.97] transition-transform mb-3 flex items-center justify-center gap-2"
                >
                  📥 PDF erneut herunterladen
                </button>
              )}

              <a
                href={`https://wa.me/4915566771019?text=${encodeURIComponent(`Hallo Herr Stübe, ich habe soeben ein ${docTypeLabels[selectedType!]} über Ihre Website eingereicht. Bitte um Bestätigung. Viele Grüße, ${formData.vorname} ${formData.nachname}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25d366] text-white font-semibold text-base py-4 rounded-xl min-h-[48px] active:scale-[0.97] transition-transform mb-3 flex items-center justify-center gap-2"
              >
                💬 WhatsApp schreiben
              </a>

              <Link
                href="/"
                className="w-full border-2 border-[#003781] text-[#003781] font-semibold text-base py-4 rounded-xl min-h-[48px] transition-colors hover:bg-blue-50 flex items-center justify-center gap-2"
              >
                ← Zurück zur Startseite
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}