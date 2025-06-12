import { Link } from "wouter";
import { Phone, Mail, MapPin } from "lucide-react";
import { FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-ergo-dark text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          
          {/* Contact Info */}
          <div className="mb-6 sm:mb-0">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Kontakt</h3>
            <div className="space-y-2 sm:space-y-3 text-gray-300 text-sm sm:text-base">
              <p className="font-medium text-white">ERGO Versicherungsgruppe</p>
              <p>Deutschlandweite Beratung</p>
              
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p>Bundesweiter Service</p>
                  <p>Deutschland</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <a href="tel:015566771019" className="hover:text-white transition-colors break-all">
                  015566771019
                </a>
              </div>
              
              <div className="flex items-start">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                <a href="mailto:info@ergo-deutschland.de" className="hover:text-white transition-colors break-all">
                  info@ergo-deutschland.de
                </a>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="mb-6 sm:mb-0">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Unsere Versicherungen</h3>
            <ul className="space-y-1 sm:space-y-2 text-gray-300 text-sm sm:text-base">
              <li>
                <Link href="/versicherung/hausrat" className="hover:text-white transition-colors">
                  Hausratversicherung
                </Link>
              </li>
              <li>
                <Link href="/versicherung/haftpflicht" className="hover:text-white transition-colors">
                  Haftpflichtversicherung
                </Link>
              </li>
              <li>
                <Link href="/versicherung/wohngebaeude" className="hover:text-white transition-colors">
                  Wohngebäudeversicherung
                </Link>
              </li>
              <li>
                <Link href="/versicherung/rechtsschutz" className="hover:text-white transition-colors">
                  Rechtsschutzversicherung
                </Link>
              </li>
              <li>
                <Link href="/versicherung/zahnzusatz" className="hover:text-white transition-colors">
                  Zahnzusatzversicherung
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="mb-6 sm:mb-0">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Rechtliches</h3>
            <ul className="space-y-1 sm:space-y-2 text-gray-300 text-sm sm:text-base">
              <li><a href="#" className="hover:text-white transition-colors">Impressum</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Datenschutz</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AGB</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Widerrufsrecht</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Beschwerdeweg</a></li>
            </ul>
          </div>

          {/* Social & Links */}
          <div className="mb-6 sm:mb-0">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Folgen Sie uns</h3>
            <div className="flex space-x-4 mb-4 sm:mb-6">
              <a 
                href="https://www.linkedin.com/in/morino-stuebe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaLinkedin size={20} className="sm:w-6 sm:h-6" />
              </a>
              <a 
                href="https://www.instagram.com/morino.stuebe.ergo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaInstagram size={20} className="sm:w-6 sm:h-6" />
              </a>
            </div>
            
            <div className="space-y-1 sm:space-y-2 text-gray-300 text-sm">
              <p>Öffnungszeiten:</p>
              <p>Mo-Fr: 9:00 - 18:00 Uhr</p>
              <p>Sa: 9:00 - 12:00 Uhr</p>
            </div>
            
            <Link 
              href="/admin" 
              className="inline-block mt-3 sm:mt-4 text-xs sm:text-sm text-gray-400 hover:text-gray-300 transition-colors"
            >
              Admin Dashboard
            </Link>
          </div>

        </div>
        
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400">
          <p className="text-sm sm:text-base">&copy; 2025 ERGO Versicherung - Morino Stübe. Alle Rechte vorbehalten.</p>
          <p className="text-xs sm:text-sm mt-2">
            Vermittlerregister: <a href="https://www.vermittlerregister.info" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 break-all">www.vermittlerregister.info</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
