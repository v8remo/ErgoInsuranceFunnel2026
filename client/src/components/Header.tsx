import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone } from "lucide-react";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const handleMobileMenuClick = () => {
    setIsOpen(false);
    // Small delay to ensure menu closes before scrolling
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 w-full">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center">
            <div className="text-left">
              <div className="text-xl sm:text-2xl font-bold text-ergo-red">ERGO</div>
              <div className="text-xs sm:text-sm text-gray-600">Agentur Stübe</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link href="/" className="text-sm lg:text-base text-gray-700 hover:text-ergo-red transition-colors">
              Startseite
            </Link>
            <Link href="/versicherung/hausrat" className="text-sm lg:text-base text-gray-700 hover:text-ergo-red transition-colors">
              Hausrat
            </Link>
            <Link href="/versicherung/haftpflicht" className="text-sm lg:text-base text-gray-700 hover:text-ergo-red transition-colors">
              Haftpflicht
            </Link>
            <Link href="/versicherung/wohngebaeude" className="text-sm lg:text-base text-gray-700 hover:text-ergo-red transition-colors">
              Wohngebäude
            </Link>
            <Link href="/versicherung/rechtsschutz" className="text-sm lg:text-base text-gray-700 hover:text-ergo-red transition-colors">
              Rechtsschutz
            </Link>
            <Link href="/versicherung/zahnzusatz" className="text-sm lg:text-base text-gray-700 hover:text-ergo-red transition-colors">
              Zahnzusatz
            </Link>
          </nav>

          {/* Contact and Mobile Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
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
