import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

const CALLBACK_TIMES = [
  'So früh wie möglich',
  'Vormittags (9–12 Uhr)',
  'Mittags (12–14 Uhr)',
  'Nachmittags (14–18 Uhr)',
  'Abends (ab 18 Uhr)',
];

const TOPICS = [
  'Neue Versicherung',
  'Bestehenden Vertrag prüfen',
  'Schadensmeldung',
  'Kündigung / Wechsel',
  'Sonstiges',
];

export default function CallbackWidget() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    vorname: '',
    nachname: '',
    phone: '',
    callbackTime: 'So früh wie möglich',
    topic: '',
  });
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const hidden = location === '/dokumente' || location === '/schaden';

  useEffect(() => {
    if (hidden) return;
    const flag = localStorage.getItem('ergo_callback_tooltip_shown');
    if (flag) return;
    const timer = setTimeout(() => {
      setShowTooltip(true);
      localStorage.setItem('ergo_callback_tooltip_shown', '1');
      setTimeout(() => setShowTooltip(false), 4000);
    }, 8000);
    return () => clearTimeout(timer);
  }, [hidden]);

  const close = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => buttonRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    document.addEventListener('keydown', handleEsc);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, close]);

  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(() => {
      setIsOpen(false);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ vorname: '', nachname: '', phone: '', callbackTime: 'So früh wie möglich', topic: '' });
      }, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [submitted]);

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.vorname.trim()) e.vorname = 'Pflichtfeld';
    if (!form.nachname.trim()) e.nachname = 'Pflichtfeld';
    if (!form.phone.trim()) e.phone = 'Pflichtfeld';
    if (!form.callbackTime) e.callbackTime = 'Pflichtfeld';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await apiRequest('POST', '/api/callback/submit', {
        name: `${form.vorname} ${form.nachname}`,
        phone: form.phone,
        callbackTime: form.callbackTime,
        topic: form.topic || null,
      });
      setSubmitted(true);
    } catch {
      setSubmitError('Fehler beim Senden. Bitte rufen Sie direkt an: 015566771019');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hidden) return null;

  const inputCls = (field: string) =>
    `w-full p-2.5 border-2 rounded-xl text-sm outline-none transition-colors ${errors[field] ? 'border-red-500' : 'border-gray-200 focus:border-[#003781]'}`;

  return (
    <>
      <style>{`
        @keyframes cb-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(226, 0, 26, 0.5); }
          50% { box-shadow: 0 0 0 12px rgba(226, 0, 26, 0); }
        }
        .cb-pulse { animation: cb-pulse 2s ease-in-out infinite; }
        @keyframes cb-pop-in {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .cb-pop-in { animation: cb-pop-in 0.2s ease-out forwards; }
        @keyframes cb-tooltip-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cb-tooltip { animation: cb-tooltip-in 0.3s ease-out forwards; }
        @keyframes cb-check {
          from { stroke-dashoffset: 50; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>

      {showTooltip && !isOpen && (
        <div className="cb-tooltip fixed z-[9997] right-5 bg-white text-gray-800 text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg border border-gray-100"
          style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px)' }}>
          Rückruf gewünscht? 👆
        </div>
      )}

      <button
        ref={buttonRef}
        onClick={() => { setIsOpen(!isOpen); setShowTooltip(false); }}
        className="cb-pulse fixed z-[9998] right-5 w-14 h-14 rounded-full bg-[#E2001A] text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)' }}
        aria-label="Rückruf anfordern"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      </button>

      {isOpen && (
        <div
          ref={popupRef}
          className="cb-pop-in fixed z-[9999] right-5 w-[320px] max-w-[calc(100vw-40px)] bg-white rounded-2xl shadow-2xl overflow-hidden"
          style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 88px)' }}
        >
          <button
            onClick={close}
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 text-gray-600 hover:bg-white hover:text-gray-900 transition-colors text-lg font-bold"
          >
            ×
          </button>

          {submitted ? (
            <div className="p-6 text-center" role="alert" aria-live="assertive">
              <svg width="56" height="56" viewBox="0 0 56 56" className="mx-auto mb-3">
                <circle cx="28" cy="28" r="26" fill="#22c55e" opacity="0.15" />
                <circle cx="28" cy="28" r="26" fill="none" stroke="#22c55e" strokeWidth="2" />
                <path d="M17 28l7 7 15-15" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="50" style={{ animation: 'cb-check 0.4s ease-out 0.2s forwards', strokeDashoffset: 50 }} />
              </svg>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Vielen Dank, {form.vorname}!</h3>
              <p className="text-sm text-gray-600">
                Morino meldet sich {form.callbackTime === 'So früh wie möglich' ? 'so bald wie möglich' : form.callbackTime.toLowerCase()} bei Ihnen unter {form.phone}.
              </p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <div className="bg-[#E2001A] text-white px-5 py-4">
                <h3 className="font-bold text-base">Rückruf anfordern</h3>
                <p className="text-xs opacity-90 mt-0.5">Wir melden uns innerhalb von 24h bei Ihnen</p>
              </div>

              <div className="p-4 flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="cb-vorname" className="text-xs font-semibold text-gray-700 mb-0.5 block">Vorname *</label>
                    <input ref={firstInputRef} id="cb-vorname" type="text" value={form.vorname} onChange={e => updateField('vorname', e.target.value)} className={inputCls('vorname')} aria-invalid={!!errors.vorname} />
                    {errors.vorname && <span role="alert" className="text-[11px] text-red-500">{errors.vorname}</span>}
                  </div>
                  <div>
                    <label htmlFor="cb-nachname" className="text-xs font-semibold text-gray-700 mb-0.5 block">Nachname *</label>
                    <input id="cb-nachname" type="text" value={form.nachname} onChange={e => updateField('nachname', e.target.value)} className={inputCls('nachname')} aria-invalid={!!errors.nachname} />
                    {errors.nachname && <span role="alert" className="text-[11px] text-red-500">{errors.nachname}</span>}
                  </div>
                </div>

                <div>
                  <label htmlFor="cb-phone" className="text-xs font-semibold text-gray-700 mb-0.5 block">Telefonnummer *</label>
                  <input id="cb-phone" type="tel" value={form.phone} onChange={e => updateField('phone', e.target.value)} placeholder="0151 12345678" className={inputCls('phone')} aria-invalid={!!errors.phone} />
                  {errors.phone && <span role="alert" className="text-[11px] text-red-500">{errors.phone}</span>}
                </div>

                <div>
                  <label htmlFor="cb-time" className="text-xs font-semibold text-gray-700 mb-0.5 block">Wann soll ich zurückrufen? *</label>
                  <select id="cb-time" value={form.callbackTime} onChange={e => updateField('callbackTime', e.target.value)} className={inputCls('callbackTime')}>
                    {CALLBACK_TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="cb-topic" className="text-xs font-semibold text-gray-700 mb-0.5 block">Worum geht es?</label>
                  <select id="cb-topic" value={form.topic} onChange={e => updateField('topic', e.target.value)} className={inputCls('topic')}>
                    <option value="">– Optional auswählen –</option>
                    {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {submitError && (
                  <div role="alert" className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm">
                    <p className="text-red-600 font-medium">{submitError}</p>
                    <a href="https://wa.me/4915566771019" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-green-600 font-semibold text-sm">
                      WhatsApp schreiben
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#E2001A] text-white font-semibold text-sm py-3 rounded-xl active:scale-[0.97] transition-transform disabled:opacity-60"
                >
                  {isSubmitting ? 'Wird gesendet...' : 'Rückruf anfordern'}
                </button>

                <p className="text-[11px] text-gray-400 text-center">
                  Ihre Daten werden nur zur Terminvereinbarung genutzt.
                </p>
              </div>
            </form>
          )}
        </div>
      )}
    </>
  );
}