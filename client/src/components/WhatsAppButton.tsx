import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, ArrowRight } from "lucide-react";
import { trackEvent, trackAppointmentConversion } from "@/lib/analytics";

const WA_NUMBER = "4915566771019";
const WA_MESSAGE = "Hallo, ich möchte eine kostenlose Analyse meiner bestehenden Versicherungen und Informationen zum 15% Bündelnachlass ab 5 Versicherungen!";

interface WhatsAppButtonProps {
  text?: string;
  className?: string;
  variant?: "floating" | "inline";
}

export default function WhatsAppButton({
  text = "💬 Sofort-Beratung",
  className = "",
  variant = "inline",
}: WhatsAppButtonProps) {
  const whatsappUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;
  const [popupOpen, setPopupOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (variant !== "floating") return;
    timerRef.current = setTimeout(() => {
      if (!dismissed) setPopupOpen(true);
    }, 4000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [variant, dismissed]);

  useEffect(() => {
    if (!popupOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setPopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [popupOpen]);

  const handleClick = () => {
    trackEvent("whatsapp_contact", {
      event_category: "Contact",
      event_label: "WhatsApp Conversion Button",
      contact_method: "whatsapp",
      value: 30,
    });
    trackAppointmentConversion(whatsappUrl);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPopupOpen(false);
    setDismissed(true);
  };

  if (variant === "floating") {
    return (
      <div
        ref={popupRef}
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2"
        style={{ pointerEvents: "auto" }}
      >
        {/* Popup card */}
        {popupOpen && (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 w-64 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0 mt-0.5" />
                <span className="text-xs font-bold text-gray-800">Jetzt online · &lt; 1 Std. Antwort</span>
              </div>
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 -mt-0.5"
                aria-label="Schließen"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-3 leading-relaxed">
              Chatte direkt mit Morino Stübe – kostenlos, schnell und persönlich.
            </p>
            <div className="flex flex-col gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#20b958] text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" fill="currentColor" />
                Jetzt schreiben
              </a>
              <a
                href="/whatsapp"
                className="flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Alle WhatsApp-Services
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* Floating button */}
        <button
          onClick={() => setPopupOpen(v => !v)}
          onMouseEnter={() => !dismissed && setPopupOpen(true)}
          className={`bg-[#25d366] hover:bg-[#20b958] text-white rounded-full p-3 sm:p-4 shadow-xl transition-all duration-300 hover:scale-110 ${!popupOpen ? 'animate-pulse' : ''} ${className}`}
          aria-label="WhatsApp Sofort-Beratung"
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" />
        </button>
      </div>
    );
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg font-bold ${className}`}
    >
      <MessageCircle className="h-5 w-5" fill="currentColor" />
      <span>{text}</span>
    </a>
  );
}
