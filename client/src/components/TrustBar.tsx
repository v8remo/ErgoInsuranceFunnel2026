import { Star } from "lucide-react";

interface TrustBarProps {
  className?: string;
}

export default function TrustBar({ className = "" }: TrustBarProps) {
  return (
    <section className={`py-8 sm:py-12 bg-gray-50 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl sm:text-3xl font-bold text-ergo-red mb-1">1000+</div>
            <div className="text-xs sm:text-sm text-gray-600">Zufriedene Kunden</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-center gap-0.5 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">4,9 / 5 Sterne</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">97%</div>
            <div className="text-xs sm:text-sm text-gray-600">Weiterempfehlung</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">15+</div>
            <div className="text-xs sm:text-sm text-gray-600">Jahre Erfahrung</div>
          </div>
        </div>
      </div>
    </section>
  );
}
