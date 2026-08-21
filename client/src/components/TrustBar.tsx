import { Star } from "lucide-react";

interface TrustBarProps {
  className?: string;
}

const TRUST_ITEMS = [
  { value: "1000+", label: "Zufriedene Kunden" },
  { value: "stars", label: "4,9 / 5 Sterne" },
  { value: "97%", label: "Weiterempfehlung" },
  { value: "15+", label: "Jahre Erfahrung" },
] as const;

export default function TrustBar({ className = "" }: TrustBarProps) {
  return (
    <section className={`py-8 sm:py-12 bg-ergo-gray border-y border-ergo-line ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {TRUST_ITEMS.map(item => (
            <div key={item.label} className="ergo-card p-4">
              {item.value === "stars" ? (
                <div className="flex items-center justify-center gap-0.5 mb-1 h-8 sm:h-9">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 sm:w-6 sm:h-6 fill-ergo-yellow text-ergo-yellow" />
                  ))}
                </div>
              ) : (
                <div className="font-serif text-2xl sm:text-3xl font-bold text-ergo-red mb-1">{item.value}</div>
              )}
              <div className="text-xs sm:text-sm font-medium text-ergo-ink">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
