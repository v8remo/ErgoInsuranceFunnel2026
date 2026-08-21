import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  faqs: FAQItem[];
  className?: string;
}

export default function FAQSection({ title, subtitle, faqs, className = "" }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={`py-10 sm:py-14 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {title && (
          <h2 className="text-2xl sm:text-[28px] mb-2">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-ergo-mute mb-8">{subtitle}</p>
        )}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="ergo-card overflow-hidden">
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-white hover:bg-ergo-red-light transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="font-sans font-semibold text-ergo-ink pr-4 text-sm sm:text-base">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-ergo-red flex-shrink-0 transition-transform duration-200 ${openIndex === index ? "rotate-180" : ""}`} />
              </button>
              {openIndex === index && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 bg-white border-t border-ergo-line pt-3">
                  <p className="text-ergo-stone text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
