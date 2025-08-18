import { MessageCircle } from "lucide-react";
import { trackEvent, trackConversion, trackAppointmentConversion } from "@/lib/analytics";

interface WhatsAppButtonProps {
  text?: string;
  className?: string;
  variant?: "floating" | "inline";
}

export default function WhatsAppButton({ 
  text = "💬 Sofort-Beratung", 
  className = "",
  variant = "inline" 
}: WhatsAppButtonProps) {
  const phoneNumber = "4915566771019";
  const message = "Hallo, ich möchte eine kostenlose Analyse meiner bestehenden Versicherungen und Informationen zum 15% Bündelnachlass ab 5 Versicherungen!";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const handleClick = () => {
    trackEvent("whatsapp_contact", {
      event_category: "Contact",
      event_label: "WhatsApp Conversion Button",
      contact_method: "whatsapp",
      value: 30
    });
    trackAppointmentConversion(whatsappUrl);
  };

  if (variant === "floating") {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 bg-green-500 hover:bg-green-600 text-white rounded-full p-3 sm:p-4 shadow-xl transition-all duration-300 hover:scale-110 animate-pulse ${className}`}
        aria-label="WhatsApp Sofort-Beratung"
        style={{ 
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 40,
          pointerEvents: 'auto'
        }}
      >
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" />
      </a>
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