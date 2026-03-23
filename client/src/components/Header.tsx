import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, Calendar } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMobileMenuClick = () => {
    setIsOpen(false);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] border-b border-gray-200/50"
          : "bg-white border-b border-gray-200"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center group">
            <div className="text-left">
              <div className="text-xl sm:text-2xl font-bold text-ergo-red transition-transform duration-200 group-hover:scale-105 origin-left">ERGO</div>
              <div className="text-xs sm:text-sm text-gray-600">Agentur Stübe</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link href="/" className="text-sm lg:text-base text-gray-700 hover:text-ergo-red transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-ergo-red after:transition-all after:duration-300 hover:after:w-full">
              Startseite
            </Link>
            <Link href="/versicherung/hausrat" className="text-sm lg:text-base text-gray-700 hover:text-ergo-red transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-ergo-red after:transition-all after:duration-300 hover:after:w-full">
              Hausrat
            </Link>
            <Link href="/versicherung/haftpflicht" className="text-sm lg:text-base text-gray-700 hover:text-ergo-red transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-ergo-red after:transition-all after:duration-300 hover:after:w-full">
              Haftpflicht
            </Link>
            <Link href="/versicherung/wohngebaeude" className="text-sm lg:text-base text-gray-700 hover:text-ergo-red transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-ergo-red after:transition-all after:duration-300 hover:after:w-full">
              Wohngebäude
            </Link>
            <Link href="/versicherung/rechtsschutz" className="text-sm lg:text-base text-gray-700 hover:text-ergo-red transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-ergo-red after:transition-all after:duration-300 hover:after:w-full">
              Rechtsschutz
            </Link>
            <Link href="/versicherung/zahnzusatz" className="text-sm lg:text-base text-gray-700 hover:text-ergo-red transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-ergo-red after:transition-all after:duration-300 hover:after:w-full">
              Zahnzusatz
            </Link>
            <Link href="/leben-vorsorge" className="text-sm lg:text-base text-gray-700 hover:text-ergo-red transition-colors font-medium relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-ergo-red after:transition-all after:duration-300 hover:after:w-full">
              Leben & Vorsorge
            </Link>
            <div className="w-px h-5 bg-gray-300 mx-1" />
            <Link href="/bestandskunden" className="text-sm lg:text-base text-[#003781] hover:text-[#002a5e] font-semibold transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#003781] after:transition-all after:duration-300 hover:after:w-full">
              Mein Service
            </Link>
          </nav>

          {/* Contact and Mobile Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              href="/termin"
              className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-[#E2001A] to-[#c5001a] text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 text-sm font-medium"
            >
              <Calendar className="w-4 h-4" />
              Termin buchen
            </Link>
            <a
              href="tel:015566771019"
              className="hidden lg:flex items-center text-ergo-red hover:text-red-700 transition-colors"
            >
              <Phone className="w-4 h-4 mr-2" />
              <span className="font-medium">015566771019</span>
            </a>

            <a
              href="tel:015566771019"
              className="flex lg:hidden items-center text-ergo-red hover:text-red-700 transition-colors p-2"
            >
              <Phone className="w-5 h-5" />
            </a>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link href="/" className="text-lg font-medium text-gray-900 hover:text-ergo-red" onClick={handleMobileMenuClick}>
                    Startseite
                  </Link>
                  <Link href="/versicherung/hausrat" className="text-lg font-medium text-gray-900 hover:text-ergo-red" onClick={handleMobileMenuClick}>
                    Hausratversicherung
                  </Link>
                  <Link href="/versicherung/haftpflicht" className="text-lg font-medium text-gray-900 hover:text-ergo-red" onClick={handleMobileMenuClick}>
                    Haftpflichtversicherung
                  </Link>
                  <Link href="/versicherung/wohngebaeude" className="text-lg font-medium text-gray-900 hover:text-ergo-red" onClick={handleMobileMenuClick}>
                    Wohngebäudeversicherung
                  </Link>
                  <Link href="/versicherung/rechtsschutz" className="text-lg font-medium text-gray-900 hover:text-ergo-red" onClick={handleMobileMenuClick}>
                    Rechtsschutzversicherung
                  </Link>
                  <Link href="/versicherung/zahnzusatz" className="text-lg font-medium text-gray-900 hover:text-ergo-red" onClick={handleMobileMenuClick}>
                    Zahnzusatzversicherung
                  </Link>
                  <Link href="/leben-vorsorge" className="text-lg font-bold text-ergo-red hover:text-red-700" onClick={handleMobileMenuClick}>
                    Leben & Vorsorge
                  </Link>

                  <div className="pt-4 border-t space-y-4">
                    <Link href="/bestandskunden" className="flex items-center gap-2 text-lg font-bold text-[#003781] hover:text-[#002a5e]" onClick={handleMobileMenuClick}>
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#003781]/10 text-xs">✓</span>
                      Mein Service
                    </Link>
                    <Link href="/termin" className="block text-lg font-bold text-ergo-red hover:text-red-700" onClick={handleMobileMenuClick}>
                      Termin buchen
                    </Link>
                    <Link href="/versicherungscheck" className="block text-lg font-medium text-gray-900 hover:text-ergo-red" onClick={handleMobileMenuClick}>
                      Versicherungscheck
                    </Link>
                    <Link href="/sparrechner" className="block text-lg font-medium text-gray-900 hover:text-ergo-red" onClick={handleMobileMenuClick}>
                      Sparrechner
                    </Link>
                    <Link href="/dokumente" className="block text-lg font-medium text-gray-900 hover:text-ergo-red" onClick={handleMobileMenuClick}>
                      Dokumente
                    </Link>
                    <Link href="/schaden" className="block text-lg font-medium text-gray-900 hover:text-ergo-red" onClick={handleMobileMenuClick}>
                      Schaden melden
                    </Link>
                    <Link href="/kennzeichen" className="block text-lg font-medium text-gray-900 hover:text-ergo-red" onClick={handleMobileMenuClick}>
                      Kennzeichen / eVB
                    </Link>
                  </div>

                  <div className="pt-4 border-t">
                    <a
                      href="tel:015566771019"
                      className="flex items-center text-ergo-red font-medium text-lg"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      015566771019
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
