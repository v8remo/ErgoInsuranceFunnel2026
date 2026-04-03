import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cal, { getCalApi } from '@calcom/embed-react';
import { trackEvent, trackConversion } from '@/lib/analytics';
import '@/styles/funnel.css';

interface FunnelData {
  situation: string;
  concerns: string[];
  existingContracts: string;
  priority: string;
  contactType: string;
  timePreference: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dsgvoAccepted: boolean;
}

interface FunnelOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  insuranceType?: string;
  insuranceLabel?: string;
  source?: string;
  initialStep?: number;
}

const STEP_NAMES = [
  'hook', 'lebenssituation', 'absicherungsbedarf', 'bestandsvertraege',
  'prioritaet', 'auswertung', 'kontaktdaten', 'terminwunsch', 'danke'
];

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

export default function FunnelOverlay({ isOpen, onClose, insuranceType, insuranceLabel, source, initialStep }: FunnelOverlayProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAnalysisResult, setShowAnalysisResult] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState<FunnelData>({
    situation: '',
    concerns: [],
    existingContracts: '',
    priority: '',
    contactType: '',
    timePreference: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dsgvoAccepted: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep(initialStep && initialStep > 1 ? initialStep : 1);
      setShowAnalysisResult(false);
      setData({
        situation: '', concerns: [], existingContracts: '', priority: '',
        contactType: '', timePreference: '', firstName: '', lastName: '',
        email: '', phone: '', dsgvoAccepted: false
      });
      setErrors({});
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, initialStep]);

  const handleClose = useCallback(() => {
    if (step >= 3 && step < 9 && !sessionStorage.getItem('funnel_exit_shown')) {
      setShowExitConfirm(true);
      sessionStorage.setItem('funnel_exit_shown', '1');
      return;
    }
    onClose();
  }, [step, onClose]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (isOpen && step >= 1) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'funnel_step_view',
        step_number: step,
        step_name: STEP_NAMES[step - 1]
      });
      trackEvent('funnel_step_view', {
        step: step,
        event_label: STEP_NAMES[step - 1]
      });
    }
  }, [step, isOpen]);

  // Auto-focus first input on step 7
  useEffect(() => {
    if (step === 7) {
      setTimeout(() => firstInputRef.current?.focus(), 400);
    }
  }, [step]);

  // Initialize Cal.com popup for step 9 thank-you screen
  useEffect(() => {
    if (step === 9) {
      (async () => {
        const cal = await getCalApi({ namespace: "funnel-termin" });
        cal("ui", { layout: "month_view", hideEventTypeDetails: false });
      })();
    }
  }, [step]);

  const goTo = useCallback((target: number) => {
    setDirection(target > step ? 1 : -1);
    setStep(target);
  }, [step]);

  const next = useCallback(() => goTo(step + 1), [goTo, step]);
  const back = useCallback(() => goTo(step - 1), [goTo, step]);

  const progress = step === 6 && showAnalysisResult ? 100 : Math.round(((step - 1) / 8) * 100);

  const autoAdvance = useCallback((nextStep: number) => {
    setTimeout(() => goTo(nextStep), 350);
  }, [goTo]);

  const getURLParam = (param: string) => {
    const url = new URL(window.location.href);
    return url.searchParams.get(param) || '';
  };

  const submitLead = async () => {
    setIsSubmitting(true);

    const leadPayload = {
      timestamp: new Date().toISOString(),
      source: 'ergo-stuebe.de',
      utm_source: getURLParam('utm_source') || 'direct',
      utm_medium: getURLParam('utm_medium') || '',
      situation: data.situation,
      concerns: data.concerns,
      existing_contracts: data.existingContracts,
      priority: data.priority,
      contact_type: data.contactType,
      time_preference: data.timePreference,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone
    };

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          insuranceType: insuranceType || 'general_consultation',
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          location: 'Ganderkesee',
          age: data.situation,
          specificData: {
            concerns: data.concerns,
            existing_contracts: data.existingContracts,
            priority: data.priority,
            contact_type: data.contactType,
            time_preference: data.timePreference,
            utm_source: leadPayload.utm_source,
            utm_medium: leadPayload.utm_medium
          },
          source: source || 'perspective_funnel'
        })
      });
    } catch (e) {
      console.error('API submission error:', e);
    }

    // TODO: Replace with your n8n or Make webhook URL
    try {
      await fetch('https://hook.eu2.make.com/PLACEHOLDER', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload)
      });
    } catch (e) {
      // Webhook failure should not block UX
      console.warn('Webhook submission failed:', e);
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'funnel_lead_submitted',
      contact_type: data.contactType,
      situation: data.situation
    });
    trackConversion();
    trackEvent('funnel_lead_submitted', {
      event_category: 'Conversion',
      event_label: data.contactType
    });

    setIsSubmitting(false);
    goTo(9);
  };

  const validateStep7 = () => {
    const newErrors: Record<string, string> = {};
    if (!data.firstName.trim()) newErrors.firstName = 'Bitte Vornamen eingeben';
    if (!data.lastName.trim()) newErrors.lastName = 'Bitte Nachnamen eingeben';
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      newErrors.email = 'Bitte gültige E-Mail eingeben';
    if (!data.phone.trim()) newErrors.phone = 'Bitte Telefonnummer eingeben';
    if (!data.dsgvoAccepted) newErrors.dsgvo = 'Bitte Datenschutz akzeptieren';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="funnel-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      >
        <motion.div
          className="funnel-card"
          initial={{ y: 40, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Progress bar with spring animation */}
          <div className="funnel-progress-bar">
            <motion.div
              className="funnel-progress-fill"
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </div>

          {/* Navigation */}
          <div className="funnel-nav">
            {step > 1 && step < 9 && (
              <motion.button
                className="funnel-back-btn"
                onClick={back}
                aria-label="Zurück"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ←
              </motion.button>
            )}
            <motion.button
              className="funnel-close-btn"
              onClick={handleClose}
              aria-label="Schließen"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>
          </div>

          {/* Step content with AnimatePresence */}
          <div className="funnel-step-content" style={{ overflow: 'hidden' }}>
            <AnimatePresence mode="wait" custom={direction}>

              {/* STEP 1 – Hook */}
              {step === 1 && (
                <motion.div
                  key="step1"
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
                    ⭐ {Math.floor(28 + new Date().getDate() * 1.5)} Beratungen diesen Monat
                  </motion.div>
                  <h2 className="funnel-hook-headline">
                    {insuranceLabel
                      ? `${insuranceLabel} – kostenlose Beratung sichern!`
                      : 'Sind Sie wirklich optimal abgesichert?'}
                  </h2>
                  <p className="funnel-hook-subtext">
                    {insuranceLabel
                      ? `Beantworten Sie 5 kurze Fragen und erhalten Sie eine kostenlose, persönliche Beratung zu Ihrer ${insuranceLabel}.`
                      : 'Beantworten Sie 5 kurze Fragen und erhalten Sie eine kostenlose, persönliche Versicherungsanalyse.'}
                  </p>
                  <motion.button
                    className="funnel-cta-btn"
                    onClick={next}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Jetzt kostenlos prüfen →
                  </motion.button>
                  <p className="funnel-trust-line">🔒 Unverbindlich & kostenlos · Datenschutz nach DSGVO</p>
                </motion.div>
              )}

              {/* STEP 2 – Lebenssituation */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="funnel-step"
                >
                  <h2 className="funnel-headline">Was beschreibt Ihre aktuelle Situation? 🏠</h2>
                  <p className="funnel-subtext">Damit können wir Sie gezielt beraten.</p>
                  <div className="funnel-grid-2x2">
                    {[
                      { icon: '👤', label: 'Single' },
                      { icon: '💑', label: 'Paar ohne Kinder' },
                      { icon: '👨‍👩‍👧', label: 'Familie mit Kindern' },
                      { icon: '🏢', label: 'Selbstständig' }
                    ].map((opt, i) => (
                      <motion.button
                        key={opt.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className={`funnel-option-card ${data.situation === opt.label ? 'selected' : ''}`}
                        onClick={() => {
                          setData(prev => ({ ...prev, situation: opt.label }));
                          autoAdvance(3);
                        }}
                      >
                        <span className="funnel-option-icon">{opt.icon}</span>
                        <span className="funnel-option-label">{opt.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 3 – Absicherungsbedarf */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="funnel-step"
                >
                  <h2 className="funnel-headline">Wo sehen Sie den größten Bedarf? 🔍</h2>
                  <p className="funnel-subtext">Mehrfachauswahl möglich (max. 3)</p>
                  <div className="funnel-grid-2x2 funnel-grid-3col">
                    {[
                      { icon: '🚗', label: 'Kfz & Mobilität' },
                      { icon: '🏡', label: 'Haus & Hausrat' },
                      { icon: '🏠', label: 'Wohngebäude' },
                      { icon: '⚖️', label: 'Rechtsschutz' },
                      { icon: '💼', label: 'Berufsunfähigkeit' },
                      { icon: '👨‍👩‍👧', label: 'Familie & Vorsorge' },
                      { icon: '💊', label: 'Krankenversicherung' },
                      { icon: '🚑', label: 'Unfallversicherung' },
                      { icon: '✈️', label: 'Reise & Ausland' },
                      { icon: '💰', label: 'Leben & Rente' },
                      { icon: '🏢', label: 'Gewerbe & Betrieb' },
                      { icon: '🐾', label: 'Tierversicherung' },
                      { icon: '🧓', label: 'Pflegeversicherung' },
                      { icon: '📋', label: 'Sonstiges' },
                    ].map((opt, i) => {
                      const isSelected = data.concerns.includes(opt.label);
                      return (
                        <motion.button
                          key={opt.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          className={`funnel-option-card funnel-multi ${isSelected ? 'selected' : ''}`}
                          onClick={() => {
                            setData(prev => {
                              const concerns = isSelected
                                ? prev.concerns.filter(c => c !== opt.label)
                                : prev.concerns.length < 3
                                  ? [...prev.concerns, opt.label]
                                  : prev.concerns;
                              return { ...prev, concerns };
                            });
                          }}
                        >
                          {isSelected && <span className="funnel-checkmark">✓</span>}
                          <span className="funnel-option-icon">{opt.icon}</span>
                          <span className="funnel-option-label">{opt.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                  {data.concerns.length > 0 && (
                    <motion.button
                      className="funnel-cta-btn funnel-cta-mt"
                      onClick={next}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Weiter →
                    </motion.button>
                  )}
                </motion.div>
              )}

              {/* STEP 4 – Bestandsverträge */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="funnel-step"
                >
                  <h2 className="funnel-headline">Haben Sie bereits Verträge, die Sie prüfen lassen möchten? 📋</h2>
                  <div className="funnel-options-list">
                    {[
                      { icon: '✅', label: 'Ja, bestehende Verträge prüfen' },
                      { icon: '🆕', label: 'Nein, ich suche neue Absicherung' },
                      { icon: '🤔', label: 'Ich bin mir nicht sicher' }
                    ].map((opt, i) => (
                      <motion.button
                        key={opt.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`funnel-full-option ${data.existingContracts === opt.label ? 'selected' : ''}`}
                        onClick={() => {
                          setData(prev => ({ ...prev, existingContracts: opt.label }));
                          autoAdvance(5);
                        }}
                      >
                        <span className="funnel-option-icon">{opt.icon}</span>
                        <span>{opt.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 5 – Priorität */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="funnel-step"
                >
                  <h2 className="funnel-headline">Was ist Ihnen bei der Beratung am wichtigsten? ⭐</h2>
                  <div className="funnel-grid-2x2">
                    {[
                      { icon: '💰', label: 'Bester Preis' },
                      { icon: '🛡️', label: 'Lückenlose Absicherung' },
                      { icon: '⚡', label: 'Schnelle & unkomplizierte Beratung' },
                      { icon: '🤝', label: 'Langfristiger Ansprechpartner' }
                    ].map((opt, i) => (
                      <motion.button
                        key={opt.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className={`funnel-option-card ${data.priority === opt.label ? 'selected' : ''}`}
                        onClick={() => {
                          setData(prev => ({ ...prev, priority: opt.label }));
                          autoAdvance(6);
                        }}
                      >
                        <span className="funnel-option-icon">{opt.icon}</span>
                        <span className="funnel-option-label">{opt.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 6 – Auswertung / Transition */}
              {step === 6 && (
                <motion.div
                  key="step6"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <Step6Analysis
                    showResult={showAnalysisResult}
                    onShowResult={() => setShowAnalysisResult(true)}
                    onContinue={next}
                  />
                </motion.div>
              )}

              {/* STEP 7 – Kontaktdaten */}
              {step === 7 && (
                <motion.div
                  key="step7"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="funnel-step"
                >
                  <h2 className="funnel-headline">Wohin dürfen wir Ihre Analyse schicken? 📩</h2>
                  <div className="funnel-form">
                    <div className="funnel-form-row">
                      <div className="funnel-form-field">
                        <label>Vorname *</label>
                        <input
                          ref={firstInputRef}
                          type="text"
                          value={data.firstName}
                          onChange={e => { setData(prev => ({ ...prev, firstName: e.target.value })); setErrors(prev => ({ ...prev, firstName: '' })); }}
                          onBlur={() => { if (!data.firstName.trim()) setErrors(prev => ({ ...prev, firstName: 'Pflichtfeld' })); }}
                          className={errors.firstName ? 'error' : ''}
                          placeholder="Ihr Vorname"
                          autoComplete="given-name"
                          enterKeyHint="next"
                        />
                        {errors.firstName && <span className="funnel-error">{errors.firstName}</span>}
                      </div>
                      <div className="funnel-form-field">
                        <label>Nachname *</label>
                        <input
                          type="text"
                          value={data.lastName}
                          onChange={e => { setData(prev => ({ ...prev, lastName: e.target.value })); setErrors(prev => ({ ...prev, lastName: '' })); }}
                          onBlur={() => { if (!data.lastName.trim()) setErrors(prev => ({ ...prev, lastName: 'Pflichtfeld' })); }}
                          className={errors.lastName ? 'error' : ''}
                          placeholder="Ihr Nachname"
                          autoComplete="family-name"
                          enterKeyHint="next"
                        />
                        {errors.lastName && <span className="funnel-error">{errors.lastName}</span>}
                      </div>
                    </div>
                    <div className="funnel-form-field">
                      <label>E-Mail *</label>
                      <input
                        type="email"
                        inputMode="email"
                        value={data.email}
                        onChange={e => { setData(prev => ({ ...prev, email: e.target.value })); setErrors(prev => ({ ...prev, email: '' })); }}
                        onBlur={() => { if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) setErrors(prev => ({ ...prev, email: 'Bitte gültige E-Mail' })); }}
                        className={errors.email ? 'error' : ''}
                        placeholder="ihre.email@beispiel.de"
                        autoComplete="email"
                        enterKeyHint="next"
                      />
                      {errors.email && <span className="funnel-error">{errors.email}</span>}
                    </div>
                    <div className="funnel-form-field">
                      <label>Telefon *</label>
                      <input
                        type="tel"
                        inputMode="tel"
                        value={data.phone}
                        onChange={e => { setData(prev => ({ ...prev, phone: e.target.value })); setErrors(prev => ({ ...prev, phone: '' })); }}
                        onBlur={() => { if (!data.phone.trim()) setErrors(prev => ({ ...prev, phone: 'Pflichtfeld' })); }}
                        className={errors.phone ? 'error' : ''}
                        placeholder="01234 567890"
                        autoComplete="tel"
                        enterKeyHint="done"
                      />
                      {errors.phone && <span className="funnel-error">{errors.phone}</span>}
                    </div>
                    <label className={`funnel-checkbox ${errors.dsgvo ? 'error' : ''}`}>
                      <input
                        type="checkbox"
                        checked={data.dsgvoAccepted}
                        onChange={e => { setData(prev => ({ ...prev, dsgvoAccepted: e.target.checked })); setErrors(prev => ({ ...prev, dsgvo: '' })); }}
                      />
                      <span>
                        Ich stimme der Verarbeitung meiner Daten zur Terminvorbereitung zu.
                        Mehr in unserer <a href="/datenschutz" target="_blank" rel="noopener noreferrer">Datenschutzerklärung</a>.
                      </span>
                    </label>
                    {errors.dsgvo && <span className="funnel-error">{errors.dsgvo}</span>}
                    <motion.button
                      className="funnel-cta-btn funnel-cta-mt"
                      onClick={() => { if (validateStep7()) next(); }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Weiter zum Terminwunsch →
                    </motion.button>
                    <p className="text-center text-xs text-gray-400 mt-3">
                      Lieber direkt schreiben?{' '}
                      <a href="https://wa.me/4915566771019" target="_blank" rel="noopener noreferrer" className="text-green-600 font-semibold hover:underline">
                        WhatsApp →
                      </a>
                    </p>
                  </div>
                </motion.div>
              )}

              {/* STEP 8 – Terminwunsch */}
              {step === 8 && (
                <motion.div
                  key="step8"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="funnel-step"
                >
                  <h2 className="funnel-headline">Wie möchten Sie beraten werden? 📅</h2>
                  <div className="funnel-grid-2x2 funnel-grid-2col">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className={`funnel-option-card funnel-option-tall ${data.contactType === 'online' ? 'selected' : ''}`}
                      onClick={() => setData(prev => ({ ...prev, contactType: 'online' }))}
                    >
                      <span className="funnel-option-icon">📹</span>
                      <span className="funnel-option-label">Online-Beratung</span>
                      <span className="funnel-option-sub">Video / Telefon</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className={`funnel-option-card funnel-option-tall ${data.contactType === 'vorort' ? 'selected' : ''}`}
                      onClick={() => setData(prev => ({ ...prev, contactType: 'vorort' }))}
                    >
                      <span className="funnel-option-icon">🏠</span>
                      <span className="funnel-option-label">Persönlich vor Ort</span>
                      <span className="funnel-option-sub">Ganderkesee & Umgebung</span>
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {data.contactType && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="funnel-sub-headline">Wann passt es Ihnen am besten?</h3>
                        <div className="funnel-grid-2x2">
                          {[
                            { icon: '🌅', label: 'Vormittags', sub: '9–12 Uhr' },
                            { icon: '☀️', label: 'Mittags', sub: '12–14 Uhr' },
                            { icon: '🌤️', label: 'Nachmittags', sub: '14–18 Uhr' },
                            { icon: '🌙', label: 'Abends', sub: 'ab 18 Uhr' }
                          ].map((opt, i) => (
                            <motion.button
                              key={opt.label}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.06 }}
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.97 }}
                              className={`funnel-option-card ${data.timePreference === opt.label ? 'selected' : ''}`}
                              onClick={() => setData(prev => ({ ...prev, timePreference: opt.label }))}
                            >
                              <span className="funnel-option-icon">{opt.icon}</span>
                              <span className="funnel-option-label">{opt.label}</span>
                              <span className="funnel-option-sub">{opt.sub}</span>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {data.contactType && data.timePreference && (
                    <motion.button
                      className="funnel-cta-btn funnel-cta-mt"
                      onClick={submitLead}
                      disabled={isSubmitting}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {isSubmitting ? (
                        <span className="funnel-spinner" />
                      ) : (
                        'Termin anfragen →'
                      )}
                    </motion.button>
                  )}
                </motion.div>
              )}

              {/* STEP 9 – Thank You + Direct Calendar */}
              {step === 9 && (
                <motion.div
                  key="step9"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="funnel-step funnel-step-thankyou"
                >
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                      className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      <svg viewBox="0 0 52 52" className="w-6 h-6">
                        <circle className="funnel-checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                        <path className="funnel-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                      </svg>
                    </motion.div>
                    <h2 className="funnel-headline" style={{ margin: 0 }}>
                      🎉 Anfrage eingegangen – Termin wählen:
                    </h2>
                  </div>
                  <p className="funnel-subtext" style={{ marginBottom: '12px' }}>
                    Wählen Sie direkt Ihren Wunschtermin für die kostenlose Beratung:
                  </p>

                  <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
                    <Cal
                      namespace="funnel-termin"
                      calLink="morino-stuebe-ergo/erstberatung"
                      style={{ width: '100%', minHeight: 500 }}
                      config={{ layout: 'month_view' }}
                    />
                  </div>

                  <motion.a
                    href="https://wa.me/4915566771019"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="funnel-outline-btn"
                    onClick={() => trackEvent('whatsapp_thankyou_clicked')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    💬 Lieber per WhatsApp
                  </motion.a>
                  <p className="funnel-small-text">Sie erhalten eine Bestätigung per E-Mail.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* Exit-Intent Confirmation */}
      {showExitConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowExitConfirm(false); }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl"
          >
            <div className="text-4xl mb-3">🤔</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Ihre Analyse ist fast fertig!</h3>
            <p className="text-sm text-gray-600 mb-5">Wirklich abbrechen? Ihre bisherigen Angaben gehen verloren.</p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="w-full py-3 bg-gradient-to-r from-[#E2001A] to-[#c5001a] text-white font-semibold rounded-xl shadow-lg"
              >
                Weiter machen
              </button>
              <button
                onClick={() => { setShowExitConfirm(false); onClose(); }}
                className="w-full py-3 text-gray-500 text-sm hover:text-gray-700 transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Step6Analysis({ showResult, onShowResult, onContinue }: {
  showResult: boolean;
  onShowResult: () => void;
  onContinue: () => void;
}) {
  useEffect(() => {
    if (!showResult) {
      const timer = setTimeout(onShowResult, 2500);
      return () => clearTimeout(timer);
    }
  }, [showResult, onShowResult]);

  if (!showResult) {
    return (
      <div className="funnel-step funnel-step-analysis">
        <div className="funnel-dots">
          <span /><span /><span />
        </div>
        <p className="funnel-analysis-text">Ihre Angaben werden ausgewertet...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="funnel-step funnel-step-analysis"
    >
      <h2 className="funnel-headline">✅ Perfekt!</h2>
      <p className="funnel-subtext">
        Auf Basis Ihrer Angaben kann Morino Ihnen eine individuelle Analyse erstellen.
      </p>
      <div className="funnel-trust-items">
        {[
          { icon: '🏆', text: 'ERGO – seit 1906 einer der größten Versicherungskonzerne' },
          { icon: '🕐', text: 'Termin in 15 Min. – bequem per Video oder persönlich' },
          { icon: '🔒', text: '100% kostenlos & unverbindlich' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className="funnel-trust-item"
          >
            <span>{item.icon}</span> {item.text}
          </motion.div>
        ))}
      </div>
      <motion.button
        className="funnel-cta-btn funnel-cta-mt"
        onClick={onContinue}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        Jetzt Termin sichern →
      </motion.button>
    </motion.div>
  );
}
