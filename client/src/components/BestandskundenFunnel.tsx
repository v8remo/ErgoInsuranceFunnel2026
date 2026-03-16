import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent, trackConversion } from '@/lib/analytics';
import '@/styles/funnel.css';

type BestandskundenContext =
  | 'jahrescheck'
  | 'heirat'
  | 'nachwuchs'
  | 'hauskauf'
  | 'umzug'
  | 'jobwechsel'
  | 'ruhestand';

interface BestandskundenFunnelProps {
  isOpen: boolean;
  onClose: () => void;
  context: BestandskundenContext;
  label?: string;
}

interface Question {
  question: string;
  options: string[];
}

interface ContactData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dsgvoAccepted: boolean;
}

const contextQuestions: Record<BestandskundenContext, Question[]> = {
  jahrescheck: [
    { question: 'Wie viele ERGO-Verträge haben Sie?', options: ['1', '2–3', '4–5', 'Mehr als 5'] },
    { question: 'Hat sich Ihre Lebenssituation im letzten Jahr verändert?', options: ['Ja', 'Nein', 'Nicht wesentlich'] },
    { question: 'Wie zufrieden sind Sie mit Ihrem aktuellen Versicherungsschutz?', options: ['Sehr zufrieden', 'Eher zufrieden', 'Unsicher', 'Nicht zufrieden'] },
    { question: 'Wie möchten Sie den Jahrescheck durchführen?', options: ['Telefonat', 'Persönliches Treffen', 'Video-Call'] },
  ],
  heirat: [
    { question: 'Ziehen Sie mit Ihrem Partner/Ihrer Partnerin zusammen?', options: ['Ja', 'Schon zusammen', 'Nein'] },
    { question: 'Haben Sie separate Hausrat-Verträge?', options: ['Ja, getrennte Verträge', 'Nein, schon zusammen', 'Habe noch keinen Hausrat'] },
    { question: 'Besteht bei einem von Ihnen bereits eine Risikolebensversicherung?', options: ['Ja', 'Nein', 'Weiß nicht'] },
  ],
  nachwuchs: [
    { question: 'Wann kommt bzw. kam Ihr Kind?', options: ['Bald (schwanger)', 'Bereits geboren'] },
    { question: 'Haben Sie bereits eine Risikolebensversicherung?', options: ['Ja', 'Nein', 'Möchte ich besprechen'] },
    { question: 'Besteht eine Kinderunfallversicherung?', options: ['Ja', 'Nein', 'Noch nicht'] },
  ],
  hauskauf: [
    { question: 'Handelt es sich um eine selbstgenutzte oder vermietete Immobilie?', options: ['Selbstgenutzt', 'Vermietet', 'Beides'] },
    { question: 'Haben Sie bereits eine Wohngebäudeversicherung?', options: ['Ja, über ERGO', 'Ja, anderer Anbieter', 'Noch nicht'] },
    { question: 'Besteht Elementarschutz (Überschwemmung, Starkregen)?', options: ['Ja', 'Nein', 'Weiß nicht'] },
  ],
  umzug: [
    { question: 'In welche Region ziehen Sie?', options: ['Gleicher Ort', 'Anderer Ort in Niedersachsen', 'Anderes Bundesland'] },
    { question: 'Vergrößert sich Ihre Wohnfläche?', options: ['Ja', 'Nein', 'Ungefähr gleich'] },
    { question: 'Möchten Sie Ihre Hausrat-Deckungssumme anpassen?', options: ['Ja bitte', 'Bin unsicher', 'Nein'] },
  ],
  jobwechsel: [
    { question: 'Wechseln Sie in die Selbstständigkeit?', options: ['Ja', 'Nein, ich bleibe angestellt'] },
    { question: 'Haben Sie eine Berufsunfähigkeitsversicherung?', options: ['Ja', 'Nein', 'Möchte ich prüfen'] },
    { question: 'Wie ist Ihre Krankenversicherung geregelt?', options: ['Gesetzlich', 'Privat', 'Noch unklar'] },
  ],
  ruhestand: [
    { question: 'Wann planen Sie in Rente zu gehen?', options: ['Innerhalb eines Jahres', '1–3 Jahre', 'Bereits im Ruhestand'] },
    { question: 'Haben Sie eine private Pflegezusatzversicherung?', options: ['Ja', 'Nein', 'Interessiert mich'] },
    { question: 'Reisen Sie häufig (mehr als 2x/Jahr)?', options: ['Ja', 'Nein'] },
  ],
};

const contextTitles: Record<BestandskundenContext, string> = {
  jahrescheck: 'Jahrescheck',
  heirat: 'Heirat / Partnerschaft',
  nachwuchs: 'Nachwuchs',
  hauskauf: 'Hauskauf / Immobilie',
  umzug: 'Umzug',
  jobwechsel: 'Jobwechsel / Selbstständigkeit',
  ruhestand: 'Ruhestand',
};

const contextEmojis: Record<BestandskundenContext, string> = {
  jahrescheck: '📋',
  heirat: '💍',
  nachwuchs: '👶',
  hauskauf: '🏠',
  umzug: '📦',
  jobwechsel: '💼',
  ruhestand: '🌅',
};

const stepVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -60 : 60, opacity: 0 }),
};

export default function BestandskundenFunnel({ isOpen, onClose, context, label }: BestandskundenFunnelProps) {
  const questions = contextQuestions[context];
  const totalSteps = questions.length + 2;
  const contactStep = questions.length + 1;
  const doneStep = questions.length + 2;

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [contact, setContact] = useState<ContactData>({ firstName: '', lastName: '', phone: '', email: '', dsgvoAccepted: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep(0);
      setAnswers({});
      setContact({ firstName: '', lastName: '', phone: '', email: '', dsgvoAccepted: false });
      setErrors({});
      setIsSubmitting(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (step === contactStep) {
      setTimeout(() => firstInputRef.current?.focus(), 400);
    }
  }, [step, contactStep]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && step >= 0) {
      trackEvent('bestandskunden_funnel_step', { step, context });
    }
  }, [step, isOpen, context]);

  const goTo = useCallback((target: number) => {
    setDirection(target > step ? 1 : -1);
    setStep(target);
  }, [step]);

  const progress = Math.min(100, Math.round((step / (totalSteps - 1)) * 100));

  const selectAnswer = useCallback((questionIdx: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionIdx]: answer }));
    setTimeout(() => goTo(questionIdx + 2), 350);
  }, [goTo]);

  const validateContact = () => {
    const newErrors: Record<string, string> = {};
    if (!contact.firstName.trim()) newErrors.firstName = 'Bitte Vornamen eingeben';
    if (!contact.lastName.trim()) newErrors.lastName = 'Bitte Nachnamen eingeben';
    if (!contact.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email))
      newErrors.email = 'Bitte gültige E-Mail eingeben';
    if (!contact.phone.trim()) newErrors.phone = 'Bitte Telefonnummer eingeben';
    if (!contact.dsgvoAccepted) newErrors.dsgvo = 'Bitte Datenschutz akzeptieren';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getURLParam = (param: string) => {
    try {
      return new URL(window.location.href).searchParams.get(param) || '';
    } catch { return ''; }
  };

  const submitLead = async () => {
    if (!validateContact()) return;
    setIsSubmitting(true);

    const specificData: Record<string, any> = {
      context,
      context_label: label || contextTitles[context],
      utm_source: getURLParam('utm_source') || 'direct',
      utm_medium: getURLParam('utm_medium') || '',
    };

    questions.forEach((q, i) => {
      specificData[`frage_${i + 1}`] = q.question;
      specificData[`antwort_${i + 1}`] = answers[i] || '';
    });

    const source = context === 'jahrescheck' ? 'jahrescheck' : 'bestandskunden_lebenslage';

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          insuranceType: context,
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          location: 'Ganderkesee',
          age: '',
          specificData,
          source,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      trackConversion();
      trackEvent('bestandskunden_lead_submitted', {
        event_category: 'Conversion',
        context,
        source,
      });

      setIsSubmitting(false);
      goTo(doneStep);
    } catch (e) {
      console.error('Lead submission error:', e);
      setIsSubmitting(false);
      setErrors({ submit: 'Ihre Anfrage konnte leider nicht gesendet werden. Bitte versuchen Sie es erneut.' });
    }
  };

  if (!isOpen) return null;

  const title = label || contextTitles[context];
  const emoji = contextEmojis[context];

  return (
    <AnimatePresence>
      <motion.div
        className="funnel-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          className="funnel-card"
          initial={{ y: 40, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="funnel-progress-bar">
            <motion.div
              className="funnel-progress-fill"
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            />
          </div>

          <div className="funnel-nav">
            {step > 0 && step < doneStep && (
              <motion.button
                className="funnel-back-btn"
                onClick={() => goTo(step - 1)}
                aria-label="Zurück"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ←
              </motion.button>
            )}
            <motion.button
              className="funnel-close-btn"
              onClick={onClose}
              aria-label="Schließen"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>
          </div>

          <div className="funnel-step-content" style={{ overflow: 'hidden' }}>
            <AnimatePresence mode="wait" custom={direction}>

              {step === 0 && (
                <motion.div
                  key="hook"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="funnel-step funnel-step-hook"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="funnel-badge-pill"
                  >
                    {emoji} Für ERGO-Bestandskunden
                  </motion.div>
                  <h2 className="funnel-hook-headline">
                    {context === 'jahrescheck'
                      ? 'Ihr kostenloser Jahrescheck – in 2 Minuten starten'
                      : `${title} – Versicherungsschutz anpassen`}
                  </h2>
                  <p className="funnel-hook-subtext">
                    {context === 'jahrescheck'
                      ? 'Beantworten Sie 4 kurze Fragen und wir prüfen Ihre bestehenden Verträge auf Lücken und Sparpotenzial.'
                      : `Beantworten Sie ${questions.length} kurze Fragen zu Ihrer Situation und erhalten Sie eine persönliche Empfehlung von Ihrem Berater.`}
                  </p>
                  <motion.button
                    className="funnel-cta-btn"
                    onClick={() => goTo(1)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Jetzt starten →
                  </motion.button>
                  <p className="funnel-trust-line">🔒 Unverbindlich & kostenlos · Datenschutz nach DSGVO</p>
                </motion.div>
              )}

              {questions.map((q, idx) => {
                const questionStep = idx + 1;
                if (step !== questionStep) return null;
                return (
                  <motion.div
                    key={`q-${idx}`}
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="funnel-step"
                  >
                    <h2 className="funnel-headline">{q.question}</h2>
                    <p className="funnel-subtext">Frage {idx + 1} von {questions.length}</p>
                    <div className="funnel-options-list">
                      {q.options.map((opt, i) => (
                        <motion.button
                          key={opt}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          className={`funnel-full-option ${answers[idx] === opt ? 'selected' : ''}`}
                          onClick={() => selectAnswer(idx, opt)}
                        >
                          <span>{opt}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                );
              })}

              {step === contactStep && (
                <motion.div
                  key="contact"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="funnel-step"
                >
                  <h2 className="funnel-headline">Fast geschafft! Ihre Kontaktdaten 📞</h2>
                  <p className="funnel-subtext">Wir melden uns innerhalb von 24 Stunden bei Ihnen.</p>
                  <div>
                    <div className="funnel-form-row">
                      <div className="funnel-form-field">
                        <label>Vorname *</label>
                        <input
                          ref={firstInputRef}
                          type="text"
                          placeholder="Ihr Vorname"
                          className={errors.firstName ? 'error' : ''}
                          value={contact.firstName}
                          onChange={(e) => { setContact(p => ({ ...p, firstName: e.target.value })); setErrors(p => ({ ...p, firstName: '' })); }}
                          autoComplete="given-name"
                        />
                        {errors.firstName && <span className="funnel-error">{errors.firstName}</span>}
                      </div>
                      <div className="funnel-form-field">
                        <label>Nachname *</label>
                        <input
                          type="text"
                          placeholder="Ihr Nachname"
                          className={errors.lastName ? 'error' : ''}
                          value={contact.lastName}
                          onChange={(e) => { setContact(p => ({ ...p, lastName: e.target.value })); setErrors(p => ({ ...p, lastName: '' })); }}
                          autoComplete="family-name"
                        />
                        {errors.lastName && <span className="funnel-error">{errors.lastName}</span>}
                      </div>
                    </div>
                    <div className="funnel-form-field">
                      <label>Telefon *</label>
                      <input
                        type="tel"
                        inputMode="tel"
                        placeholder="01234 567890"
                        className={errors.phone ? 'error' : ''}
                        value={contact.phone}
                        onChange={(e) => { setContact(p => ({ ...p, phone: e.target.value })); setErrors(p => ({ ...p, phone: '' })); }}
                        autoComplete="tel"
                      />
                      {errors.phone && <span className="funnel-error">{errors.phone}</span>}
                    </div>
                    <div className="funnel-form-field">
                      <label>E-Mail *</label>
                      <input
                        type="email"
                        inputMode="email"
                        placeholder="ihre.email@beispiel.de"
                        className={errors.email ? 'error' : ''}
                        value={contact.email}
                        onChange={(e) => { setContact(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: '' })); }}
                        autoComplete="email"
                      />
                      {errors.email && <span className="funnel-error">{errors.email}</span>}
                    </div>
                    <label className={`funnel-checkbox ${errors.dsgvo ? 'error' : ''}`}>
                      <input
                        type="checkbox"
                        checked={contact.dsgvoAccepted}
                        onChange={(e) => { setContact(p => ({ ...p, dsgvoAccepted: e.target.checked })); setErrors(p => ({ ...p, dsgvo: '' })); }}
                      />
                      <span>Ich stimme der Verarbeitung meiner Daten gemäß der <a href="/datenschutz" target="_blank" rel="noopener noreferrer">Datenschutzerklärung</a> zu. *</span>
                    </label>
                    {errors.dsgvo && <span className="funnel-error">{errors.dsgvo}</span>}
                    {errors.submit && (
                      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#b91c1c', marginTop: '8px' }}>
                        {errors.submit}
                      </div>
                    )}
                    <motion.button
                      className="funnel-cta-btn funnel-cta-mt"
                      onClick={submitLead}
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {isSubmitting ? 'Wird gesendet...' : 'Absenden →'}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === doneStep && (
                <motion.div
                  key="done"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="funnel-step funnel-step-hook"
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                    style={{ fontSize: '48px', marginBottom: '16px' }}
                  >
                    ✅
                  </motion.div>
                  <h2 className="funnel-hook-headline">Vielen Dank!</h2>
                  <p className="funnel-hook-subtext">
                    {context === 'jahrescheck'
                      ? 'Ihre Jahrescheck-Anfrage ist eingegangen. Wir melden uns innerhalb von 24 Stunden bei Ihnen, um einen Termin zu vereinbaren.'
                      : `Ihre Anfrage zum Thema „${title}" ist bei uns eingegangen. Ihr Berater Morino Stübe meldet sich in Kürze bei Ihnen.`}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px', width: '100%', maxWidth: '300px', marginInline: 'auto' }}>
                    <a
                      href={`https://wa.me/15566771019?text=${encodeURIComponent(`Hallo Herr Stübe, ich habe gerade den ${context === 'jahrescheck' ? 'Jahrescheck' : title}-Fragebogen ausgefüllt und hätte gerne einen Termin.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="funnel-cta-btn"
                      style={{ background: '#25d366', textAlign: 'center', textDecoration: 'none' }}
                    >
                      💬 Per WhatsApp kontaktieren
                    </a>
                    <motion.button
                      className="funnel-cta-btn"
                      style={{ background: '#6b7280' }}
                      onClick={onClose}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Schließen
                    </motion.button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
