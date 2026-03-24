import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, Calendar, ChevronDown, X, Shield, Home, Scale, Smile, Car, Briefcase, HeartHandshake, FileText, AlertTriangle, Tag, LayoutGrid } from "lucide-react";

const INSURANCE_LINKS = [
  { href: "/versicherung/hausrat", label: "Hausrat", icon: Home, desc: "Schutz für Ihr Hab & Gut" },
  { href: "/versicherung/haftpflicht", label: "Haftpflicht", icon: Scale, desc: "Absicherung gegen Schadensersatz" },
  { href: "/versicherung/wohngebaeude", label: "Wohngebäude", icon: Shield, desc: "Für Haus & Immobilie" },
  { href: "/versicherung/rechtsschutz", label: "Rechtsschutz", icon: Briefcase, desc: "Ihr Recht durchsetzen" },
  { href: "/versicherung/zahnzusatz", label: "Zahnzusatz", icon: Smile, desc: "Mehr Leistung beim Zahnarzt" },
  { href: "/kfz", label: "KFZ", icon: Car, desc: "Auto & Mobilität" },
  { href: "/unternehmensversicherung", label: "Gewerbe", icon: LayoutGrid, desc: "Schutz für Ihr Unternehmen" },
];

const SERVICE_LINKS = [
  { href: "/termin", label: "Termin buchen", icon: Calendar },
  { href: "/dokumente", label: "Dokument einreichen", icon: FileText },
  { href: "/schaden", label: "Schaden melden", icon: AlertTriangle },
  { href: "/kennzeichen", label: "Kennzeichen / eVB", icon: Tag },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLink = "text-sm text-gray-700 hover:text-ergo-red transition-colors font-medium";
  const isInsurancePage = INSURANCE_LINKS.some(l => location === l.href) || location.startsWith("/versicherung");

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.08)] border-b border-gray-200/60"
          : "bg-white border-b border-gray-200"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center group shrink-0">
            <div className="text-left">
              <div className="text-xl sm:text-2xl font-bold text-ergo-red group-hover:opacity-80 transition-opacity">ERGO</div>
              <div className="text-[11px] sm:text-xs text-gray-500 leading-tight">Agentur Stübe · Ganderkesee</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">

            {/* Versicherungen Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(v => !v)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isInsurancePage || dropdownOpen
                    ? "text-ergo-red bg-red-50"
                    : "text-gray-700 hover:text-ergo-red hover:bg-gray-50"
                }`}
              >
                Versicherungen
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-[480px] bg-white rounded-2xl shadow-xl border border-gray-100 p-3 grid grid-cols-2 gap-1">
                  {INSURANCE_LINKS.map(({ href, label, icon: Icon, desc }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-red-50 group transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 group-hover:bg-ergo-red/20 flex items-center justify-center shrink-0 transition-colors mt-0.5">
                        <Icon className="w-4 h-4 text-ergo-red" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-ergo-red transition-colors">{label}</div>
                        <div className="text-xs text-gray-500">{desc}</div>
                      </div>
                    </Link>
                  ))}
                  <Link
                    href="/leben-vorsorge"
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-red-50 group transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-50 group-hover:bg-ergo-red/20 flex items-center justify-center shrink-0 transition-colors mt-0.5">
                      <HeartHandshake className="w-4 h-4 text-ergo-red" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 group-hover:text-ergo-red transition-colors">Leben & Vorsorge</div>
                      <div className="text-xs text-gray-500">BU, Rente & Altersvorsorge</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/bestandskunden"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                location === "/bestandskunden"
                  ? "text-[#003781] bg-blue-50"
                  : "text-[#003781] hover:bg-blue-50"
              }`}
            >
              Mein Service
            </Link>

            <Link
              href="/termin"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location === "/termin"
                  ? "text-ergo-red bg-red-50"
                  : "text-gray-700 hover:text-ergo-red hover:bg-gray-50"
              }`}
            >
              Termin
            </Link>
          </nav>

          {/* Right: CTA + Phone + Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/termin"
              className="hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-[#E2001A] to-[#c5001a] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200"
            >
              <Calendar className="w-3.5 h-3.5" />
              Termin buchen
            </Link>

            <a
              href="tel:015566771019"
              className="hidden lg:flex items-center gap-1.5 text-gray-700 hover:text-ergo-red transition-colors text-sm"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">015566 771019</span>
            </a>

            <a
              href="tel:015566771019"
              className="flex lg:hidden items-center text-ergo-red p-2 rounded-lg hover:bg-red-50 transition-colors"
              aria-label="Anrufen"
            >
              <Phone className="w-5 h-5" />
            </a>

            {/* Mobile Hamburger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden p-2 rounded-lg" aria-label="Menü">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[340px] p-0 flex flex-col">

                {/* Sheet Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div>
                    <div className="text-lg font-bold text-ergo-red">ERGO</div>
                    <div className="text-xs text-gray-500">Agentur Stübe · Ganderkesee</div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">

                  {/* Versicherungen */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 px-1">Versicherungen</p>
                    <div className="space-y-0.5">
                      {INSURANCE_LINKS.map(({ href, label, icon: Icon }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 group transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                            <Icon className="w-3.5 h-3.5 text-ergo-red" />
                          </div>
                          <span className="text-sm font-medium text-gray-800 group-hover:text-ergo-red transition-colors">{label}</span>
                        </Link>
                      ))}
                      <Link
                        href="/leben-vorsorge"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 group transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                          <HeartHandshake className="w-3.5 h-3.5 text-ergo-red" />
                        </div>
                        <span className="text-sm font-medium text-gray-800 group-hover:text-ergo-red transition-colors">Leben & Vorsorge</span>
                      </Link>
                    </div>
                  </div>

                  {/* Service */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 px-1">Service</p>
                    <div className="space-y-0.5">
                      {SERVICE_LINKS.map(({ href, label, icon: Icon }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 group transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                            <Icon className="w-3.5 h-3.5 text-gray-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-800 group-hover:text-ergo-red transition-colors">{label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Mein Service / Bestandskunden */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 px-1">Bestandskunden</p>
                    <Link
                      href="/bestandskunden"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#003781]/10 flex items-center justify-center shrink-0">
                        <span className="text-[#003781] text-xs font-bold">✓</span>
                      </div>
                      <span className="text-sm font-semibold text-[#003781]">Mein Service-Portal</span>
                    </Link>
                  </div>
                </div>

                {/* Bottom: Phone CTA */}
                <div className="px-4 py-4 border-t border-gray-100">
                  <a
                    href="tel:015566771019"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-ergo-red text-white font-semibold text-sm hover:bg-red-700 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    015566 771019 · Jetzt anrufen
                  </a>
                </div>

              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </header>
  );
}
