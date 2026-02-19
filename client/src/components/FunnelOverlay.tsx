import { useState, useEffect, useCallback } from 'react';
import { trackEvent, trackConversion } from '@/lib/analytics';

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
}

const STEP_NAMES = [
  'hook', 'lebenssituation', 'absicherungsbedarf', 'bestandsvertraege',
  'prioritaet', 'auswertung', 'kontaktdaten', 'terminwunsch', 'danke'
];

export default function FunnelOverlay({ isOpen, onClose, insuranceType, insuranceLabel }: FunnelOverlayProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAnalysisResult, setShowAnalysisResult] = useState(false);

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
      setStep(1);
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
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

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

  const goTo = useCallback((target: number) => {
    if (isAnimating) return;
    setDirection(target > step ? 'forward' : 'back');
    setIsAnimating(true);
    setTimeout(() => {
      setStep(target);
      setIsAnimating(false);
    }, 300);
  }, [step, isAnimating]);

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
          source: 'perspective_funnel'
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

  const slideClass = isAnimating
    ? direction === 'forward' ? 'funnel-slide-out-left' : 'funnel-slide-out-right'
    : 'funnel-slide-in';

  return (
    <div className="funnel-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="funnel-card">
        {/* Progress bar */}
        <div className="funnel-progress-bar">
          <div className="funnel-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Navigation */}
        <div className="funnel-nav">
          {step > 1 && step < 9 && (
            <button className="funnel-back-btn" onClick={back} aria-label="Zurück">←</button>
          )}
          <button className="funnel-close-btn" onClick={onClose} aria-label="Schließen">×</button>
        </div>

        {/* Step content */}
        <div className={`funnel-step-content ${slideClass}`}>

          {/* STEP 1 – Hook */}
          {step === 1 && (
            <div className="funnel-step funnel-step-hook">
              <div className="funnel-badge-pill">⭐ 47 Beratungen diesen Monat</div>
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
              <button className="funnel-cta-btn" onClick={next}>
                Jetzt kostenlos prüfen →
              </button>
              <p className="funnel-trust-line">🔒 Unverbindlich & kostenlos · Datenschutz nach DSGVO</p>
            </div>
          )}

          {/* STEP 2 – Lebenssituation */}
          {step === 2 && (
            <div className="funnel-step">
              <h2 className="funnel-headline">Was beschreibt Ihre aktuelle Situation? 🏠</h2>
              <p className="funnel-subtext">Damit können wir Sie gezielt beraten.</p>
              <div className="funnel-grid-2x2">
                {[
                  { icon: '👤', label: 'Single' },
                  { icon: '💑', label: 'Paar ohne Kinder' },
                  { icon: '👨‍👩‍👧', label: 'Familie mit Kindern' },
                  { icon: '🏢', label: 'Selbstständig' }
                ].map(opt => (
                  <button
                    key={opt.label}
                    className={`funnel-option-card ${data.situation === opt.label ? 'selected' : ''}`}
                    onClick={() => {
                      setData(prev => ({ ...prev, situation: opt.label }));
                      autoAdvance(3);
                    }}
                  >
                    <span className="funnel-option-icon">{opt.icon}</span>
                    <span className="funnel-option-label">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 – Absicherungsbedarf */}
          {step === 3 && (
            <div className="funnel-step">
              <h2 className="funnel-headline">Wo sehen Sie den größten Bedarf? 🔍</h2>
              <p className="funnel-subtext">Mehrfachauswahl möglich (max. 2)</p>
              <div className="funnel-grid-2x2 funnel-grid-3col">
                {[
                  { icon: '🚗', label: 'Kfz & Mobilität' },
                  { icon: '🏡', label: 'Haus & Hausrat' },
                  { icon: '⚖️', label: 'Rechtsschutz' },
                  { icon: '💼', label: 'Berufsunfähigkeit' },
                  { icon: '👨‍👩‍👧', label: 'Familie & Vorsorge' },
                  { icon: '💊', label: 'Krankenversicherung' }
                ].map(opt => {
                  const isSelected = data.concerns.includes(opt.label);
                  return (
                    <button
                      key={opt.label}
                      className={`funnel-option-card funnel-multi ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setData(prev => {
                          const concerns = isSelected
                            ? prev.concerns.filter(c => c !== opt.label)
                            : prev.concerns.length < 2
                              ? [...prev.concerns, opt.label]
                              : prev.concerns;
                          return { ...prev, concerns };
                        });
                      }}
                    >
                      {isSelected && <span className="funnel-checkmark">✓</span>}
                      <span className="funnel-option-icon">{opt.icon}</span>
                      <span className="funnel-option-label">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
              {data.concerns.length > 0 && (
                <button className="funnel-cta-btn funnel-cta-mt" onClick={next}>
                  Weiter →
                </button>
              )}
            </div>
          )}

          {/* STEP 4 – Bestandsverträge */}
          {step === 4 && (
            <div className="funnel-step">
              <h2 className="funnel-headline">Haben Sie bereits Verträge, die Sie prüfen lassen möchten? 📋</h2>
              <div className="funnel-options-list">
                {[
                  { icon: '✅', label: 'Ja, bestehende Verträge prüfen' },
                  { icon: '🆕', label: 'Nein, ich suche neue Absicherung' },
                  { icon: '🤔', label: 'Ich bin mir nicht sicher' }
                ].map(opt => (
                  <button
                    key={opt.label}
                    className={`funnel-full-option ${data.existingContracts === opt.label ? 'selected' : ''}`}
                    onClick={() => {
                      setData(prev => ({ ...prev, existingContracts: opt.label }));
                      autoAdvance(5);
                    }}
                  >
                    <span className="funnel-option-icon">{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5 – Priorität */}
          {step === 5 && (
            <div className="funnel-step">
              <h2 className="funnel-headline">Was ist Ihnen bei der Beratung am wichtigsten? ⭐</h2>
              <div className="funnel-grid-2x2">
                {[
                  { icon: '💰', label: 'Bester Preis' },
                  { icon: '🛡️', label: 'Lückenlose Absicherung' },
                  { icon: '⚡', label: 'Schnelle & unkomplizierte Beratung' },
                  { icon: '🤝', label: 'Langfristiger Ansprechpartner' }
                ].map(opt => (
                  <button
                    key={opt.label}
                    className={`funnel-option-card ${data.priority === opt.label ? 'selected' : ''}`}
                    onClick={() => {
                      setData(prev => ({ ...prev, priority: opt.label }));
                      autoAdvance(6);
                    }}
                  >
                    <span className="funnel-option-icon">{opt.icon}</span>
                    <span className="funnel-option-label">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6 – Auswertung / Transition */}
          {step === 6 && (
            <Step6Analysis
              showResult={showAnalysisResult}
              onShowResult={() => setShowAnalysisResult(true)}
              onContinue={next}
            />
          )}

          {/* STEP 7 – Kontaktdaten */}
          {step === 7 && (
            <div className="funnel-step">
              <h2 className="funnel-headline">Wohin dürfen wir Ihre Analyse schicken? 📩</h2>
              <div className="funnel-form">
                <div className="funnel-form-row">
                  <div className="funnel-form-field">
                    <label>Vorname *</label>
                    <input
                      type="text"
                      value={data.firstName}
                      onChange={e => { setData(prev => ({ ...prev, firstName: e.target.value })); setErrors(prev => ({ ...prev, firstName: '' })); }}
                      onBlur={() => { if (!data.firstName.trim()) setErrors(prev => ({ ...prev, firstName: 'Pflichtfeld' })); }}
                      className={errors.firstName ? 'error' : ''}
                      placeholder="Ihr Vorname"
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
                    />
                    {errors.lastName && <span className="funnel-error">{errors.lastName}</span>}
                  </div>
                </div>
                <div className="funnel-form-field">
                  <label>E-Mail *</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={e => { setData(prev => ({ ...prev, email: e.target.value })); setErrors(prev => ({ ...prev, email: '' })); }}
                    onBlur={() => { if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) setErrors(prev => ({ ...prev, email: 'Bitte gültige E-Mail' })); }}
                    className={errors.email ? 'error' : ''}
                    placeholder="ihre.email@beispiel.de"
                  />
                  {errors.email && <span className="funnel-error">{errors.email}</span>}
                </div>
                <div className="funnel-form-field">
                  <label>Telefon *</label>
                  <input
                    type="tel"
                    value={data.phone}
                    onChange={e => { setData(prev => ({ ...prev, phone: e.target.value })); setErrors(prev => ({ ...prev, phone: '' })); }}
                    onBlur={() => { if (!data.phone.trim()) setErrors(prev => ({ ...prev, phone: 'Pflichtfeld' })); }}
                    className={errors.phone ? 'error' : ''}
                    placeholder="01234 567890"
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
                <button
                  className="funnel-cta-btn funnel-cta-mt"
                  onClick={() => { if (validateStep7()) next(); }}
                >
                  Weiter zum Terminwunsch →
                </button>
              </div>
            </div>
          )}

          {/* STEP 8 – Terminwunsch */}
          {step === 8 && (
            <div className="funnel-step">
              <h2 className="funnel-headline">Wie möchten Sie beraten werden? 📅</h2>
              <div className="funnel-grid-2x2 funnel-grid-2col">
                <button
                  className={`funnel-option-card funnel-option-tall ${data.contactType === 'online' ? 'selected' : ''}`}
                  onClick={() => setData(prev => ({ ...prev, contactType: 'online' }))}
                >
                  <span className="funnel-option-icon">📹</span>
                  <span className="funnel-option-label">Online-Beratung</span>
                  <span className="funnel-option-sub">Video / Telefon</span>
                </button>
                <button
                  className={`funnel-option-card funnel-option-tall ${data.contactType === 'vorort' ? 'selected' : ''}`}
                  onClick={() => setData(prev => ({ ...prev, contactType: 'vorort' }))}
                >
                  <span className="funnel-option-icon">🏠</span>
                  <span className="funnel-option-label">Persönlich vor Ort</span>
                  <span className="funnel-option-sub">Ganderkesee & Umgebung</span>
                </button>
              </div>

              {data.contactType && (
                <>
                  <h3 className="funnel-sub-headline">Wann passt es Ihnen am besten?</h3>
                  <div className="funnel-grid-2x2">
                    {[
                      { icon: '🌅', label: 'Vormittags', sub: '9–12 Uhr' },
                      { icon: '☀️', label: 'Mittags', sub: '12–14 Uhr' },
                      { icon: '🌤️', label: 'Nachmittags', sub: '14–18 Uhr' },
                      { icon: '🌙', label: 'Abends', sub: 'ab 18 Uhr' }
                    ].map(opt => (
                      <button
                        key={opt.label}
                        className={`funnel-option-card ${data.timePreference === opt.label ? 'selected' : ''}`}
                        onClick={() => setData(prev => ({ ...prev, timePreference: opt.label }))}
                      >
                        <span className="funnel-option-icon">{opt.icon}</span>
                        <span className="funnel-option-label">{opt.label}</span>
                        <span className="funnel-option-sub">{opt.sub}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {data.contactType && data.timePreference && (
                <button
                  className="funnel-cta-btn funnel-cta-mt"
                  onClick={submitLead}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="funnel-spinner" />
                  ) : (
                    'Termin anfragen →'
                  )}
                </button>
              )}
            </div>
          )}

          {/* STEP 9 – Thank You */}
          {step === 9 && (
            <div className="funnel-step funnel-step-thankyou">
              <div className="funnel-check-animation">
                <svg viewBox="0 0 52 52" className="funnel-checkmark-svg">
                  <circle className="funnel-checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                  <path className="funnel-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
              </div>
              <h2 className="funnel-headline">🎉 Vielen Dank, Ihre Anfrage ist eingegangen!</h2>
              <p className="funnel-subtext">Morino Stübe meldet sich innerhalb von 24 Stunden persönlich bei Ihnen.</p>

              <div className="funnel-advisor-mini">
                <img
                  src="/attached_assets/089-Ti9r4yWZjrM_1756458595368.jpeg"
                  alt="Morino Stübe"
                  className="funnel-advisor-img"
                />
                <div>
                  <strong>Morino Stübe</strong>
                  <span>ERGO Versicherungsfachmann · Ganderkesee</span>
                </div>
              </div>

              <a
                href="https://wa.me/4915566771019"
                target="_blank"
                rel="noopener noreferrer"
                className="funnel-cta-btn funnel-btn-whatsapp"
                onClick={() => trackEvent('whatsapp_thankyou_clicked')}
              >
                💬 Per WhatsApp schreiben
              </a>
              <a
                href="/termin"
                className="funnel-outline-btn"
                onClick={() => {
                  trackEvent('booking_from_funnel_clicked');
                  onClose();
                }}
              >
                📅 Direkt Termin buchen
              </a>
              <p className="funnel-small-text">Sie erhalten gleich eine Bestätigung per E-Mail.</p>
            </div>
          )}
        </div>
      </div>
    </div>
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
    <div className="funnel-step funnel-step-analysis">
      <h2 className="funnel-headline">✅ Perfekt!</h2>
      <p className="funnel-subtext">
        Auf Basis Ihrer Angaben kann Morino Ihnen eine individuelle Analyse erstellen.
      </p>
      <div className="funnel-trust-items">
        <div className="funnel-trust-item">
          <span>🏆</span> ERGO – seit 1906 einer der größten Versicherungskonzerne
        </div>
        <div className="funnel-trust-item">
          <span>🕐</span> Termin in 15 Min. – bequem per Video oder persönlich
        </div>
        <div className="funnel-trust-item">
          <span>🔒</span> 100% kostenlos & unverbindlich
        </div>
      </div>
      <button className="funnel-cta-btn funnel-cta-mt" onClick={onContinue}>
        Jetzt Termin sichern →
      </button>
    </div>
  );
}