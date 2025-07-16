import { MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface WhatsAppButtonProps {
  text?: string;
  className?: string;
  variant?: "floating" | "inline";
}

export default function WhatsAppButton({ 
  text = "WhatsApp Kundenservice", 
  className = "",
  variant = "inline" 
}: WhatsAppButtonProps) {
  const phoneNumber = "4915566771019";
  const message = "Hallo, ich interessiere mich für eine ERGO Versicherung und hätte gerne weitere Informationen.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const handleClick = () => {
    trackEvent("whatsapp_contact", {
      event_category: "Contact",
      event_label: "WhatsApp Button Click",
      contact_method: "whatsapp"
    });
  };

  if (variant === "floating") {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 ${className}`}
        aria-label="WhatsApp Kundenservice"
      >
        <MessageCircle className="h-6 w-6" fill="currentColor" />
      </a>
    );
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors ${className}`}
    >
      <MessageCircle className="h-5 w-5" fill="currentColor" />
      <span>{text}</span>
    </a>
  );
}