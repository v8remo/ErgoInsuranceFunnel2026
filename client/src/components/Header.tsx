import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-ergo-red rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm" />
            </div>
            <div className="hidden md:block">
              <span className="text-xl font-bold text-ergo-dark">ERGO Ganderkesee</span>
              <p className="text-sm text-gray-600">Morino Stübe</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-ergo-red transition-colors">
              Startseite
            </Link>
            <Link href="/versicherung/hausrat" className="text-gray-700 hover:text-ergo-red transition-colors">
              Hausrat
            </Link>
            <Link href="/versicherung/haftpflicht" className="text-gray-700 hover:text-ergo-red transition-colors">
              Haftpflicht
            </Link>
            <Link href="/versicherung/wohngebaeude" className="text-gray-700 hover:text-ergo-red transition-colors">
              Wohngebäude
            </Link>
            <Link href="/versicherung/rechtsschutz" className="text-gray-700 hover:text-ergo-red transition-colors">
              Rechtsschutz
            </Link>
            <Link href="/versicherung/zahnzusatz" className="text-gray-700 hover:text-ergo-red transition-colors">
              Zahnzusatz
            </Link>
          </nav>

          {/* Contact and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <a 
              href="tel:015566771019" 
              className="hidden sm:flex items-center text-ergo-red hover:text-red-700 transition-colors"
            >
              <Phone className="w-4 h-4 mr-2" />
              <span className="font-medium">015566771019</span>
            </a>
            
            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link href="/" className="text-lg font-medium text-gray-900 hover:text-ergo-red">
                    Startseite
                  </Link>
                  <Link href="/versicherung/hausrat" className="text-lg font-medium text-gray-900 hover:text-ergo-red">
                    Hausratversicherung
                  </Link>
                  <Link href="/versicherung/haftpflicht" className="text-lg font-medium text-gray-900 hover:text-ergo-red">
                    Haftpflichtversicherung
                  </Link>
                  <Link href="/versicherung/wohngebaeude" className="text-lg font-medium text-gray-900 hover:text-ergo-red">
                    Wohngebäudeversicherung
                  </Link>
                  <Link href="/versicherung/rechtsschutz" className="text-lg font-medium text-gray-900 hover:text-ergo-red">
                    Rechtsschutzversicherung
                  </Link>
                  <Link href="/versicherung/zahnzusatz" className="text-lg font-medium text-gray-900 hover:text-ergo-red">
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
