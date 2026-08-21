import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, Calendar, ChevronDown, Home, Scale, Smile, Car, Briefcase, HeartHandshake, FileText, AlertTriangle, Tag, LayoutGrid, Activity, MessageCircle, UserCheck } from "lucide-react";

const INSURANCE_LINKS = [
  { href: "/hausrat", label: "Hausrat", icon: Home, desc: "Schutz für Ihr Hab & Gut" },
  { href: "/haftpflicht", label: "Haftpflicht", icon: Scale, desc: "Absicherung gegen Schadensersatz" },
  { href: "/rechtsschutz", label: "Rechtsschutz", icon: Briefcase, desc: "Ihr Recht durchsetzen" },
  { href: "/zahnzusatz", label: "Zahnzusatz", icon: Smile, desc: "Mehr Leistung beim Zahnarzt" },
  { href: "/kfz", label: "KFZ", icon: Car, desc: "Auto & Mobilität" },
  { href: "/berufsunfaehigkeit", label: "Berufsunfähigkeit", icon: Activity, desc: "Absicherung bei Berufsunfähigkeit" },
  { href: "/unternehmensversicherung", label: "Gewerbe", icon: LayoutGrid, desc: "Schutz für Ihr Unternehmen" },
];

const SERVICE_LINKS = [
  { href: "/termin", label: "Termin buchen", icon: Calendar },
  { href: "/whatsapp", label: "WhatsApp Service", icon: MessageCircle },
  { href: "/dokumente", label: "Dokument einreichen", icon: FileText },
  { href: "/schaden", label: "Schaden melden", icon: AlertTriangle },
  { href: "/schaden-unfall", label: "Unfall melden", icon: AlertTriangle },
  { href: "/kennzeichen", label: "Kennzeichen / eVB", icon: Tag },
];

const SPARTEN_PATHS = INSURANCE_LINKS.map(l => l.href);

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [location] = useLocation();

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

  const isInsurancePage = SPARTEN_PATHS.some(p => location === p) || location === "/leben-vorsorge";

  return (
    <header className="ds-site-header sticky top-0 z-50 w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="ERGO Agentur Stübe – Startseite">
            <img
              src="/attached_assets/ergo-logo-hq.svg"
              alt="ERGO"
              className="h-6 md:h-7 w-auto"
              width={96}
              height={28}
            />
            <div className="border-l border-ergo-line pl-3 leading-tight">
              <div className="text-sm md:text-[15px] font-bold text-ergo-ink">Agentur Stübe</div>
              <div className="text-[11px] md:text-xs text-ergo-mute">Ganderkesee</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">

            {/* Versicherungen Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(v => !v)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[15px] font-semibold transition-colors ${
                  isInsurancePage || dropdownOpen
                    ? "text-ergo-red bg-ergo-red-light"
                    : "text-ergo-ink hover:text-ergo-red hover:bg-ergo-red-light"
                }`}
                aria-expanded={dropdownOpen}
              >
                Versicherungen
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-[480px] max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-[0_8px_24px_rgba(38,38,38,0.14)] border border-ergo-line p-3 grid grid-cols-2 gap-1">
                  {INSURANCE_LINKS.map(({ href, label, icon: Icon, desc }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-ergo-red-light group transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-ergo-red-light flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-ergo-red" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-ergo-ink group-hover:text-ergo-red transition-colors">{label}</div>
                        <div className="text-xs text-ergo-mute">{desc}</div>
                      </div>
                    </Link>
                  ))}
                  <Link
                    href="/leben-vorsorge"
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-ergo-red-light group transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-ergo-red-light flex items-center justify-center shrink-0 mt-0.5">
                      <HeartHandshake className="w-4 h-4 text-ergo-red" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-ergo-ink group-hover:text-ergo-red transition-colors">Leben & Vorsorge</div>
                      <div className="text-xs text-ergo-mute">BU, Rente & Altersvorsorge</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/bestandskunden"
              className={`px-3 py-2 rounded-lg text-[15px] font-semibold transition-colors ${
                location === "/bestandskunden"
                  ? "text-ergo-red bg-ergo-red-light"
                  : "text-ergo-ink hover:text-ergo-red hover:bg-ergo-red-light"
              }`}
            >
              Mein Service
            </Link>

            <Link
              href="/termin"
              className={`px-3 py-2 rounded-lg text-[15px] font-semibold transition-colors ${
                location === "/termin"
                  ? "text-ergo-red bg-ergo-red-light"
                  : "text-ergo-ink hover:text-ergo-red hover:bg-ergo-red-light"
              }`}
            >
              Termin
            </Link>
          </nav>

          {/* Right: CTA + Phone + Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="tel:015566771019"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg text-ergo-ink hover:text-ergo-red hover:bg-ergo-red-light transition-colors text-[15px] font-semibold"
            >
              <Phone className="w-4 h-4" />
              015566 771019
            </a>

            <Link
              href="/termin"
              className="ergo-btn ergo-btn--primary ergo-btn--sm hidden lg:inline-flex"
            >
              <Calendar className="w-4 h-4" />
              Termin buchen
            </Link>

            <a
              href="tel:015566771019"
              className="flex lg:hidden items-center text-ergo-red p-2 rounded-lg hover:bg-ergo-red-light transition-colors"
              aria-label="Anrufen"
            >
              <Phone className="w-5 h-5" />
            </a>

            {/* Mobile Hamburger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menü">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[340px] p-0 flex flex-col">

                {/* Sheet Header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-ergo-line">
                  <img src="/attached_assets/ergo-logo-hq.svg" alt="ERGO" className="h-5 w-auto" width={80} height={23} />
                  <div className="border-l border-ergo-line pl-3 leading-tight">
                    <div className="text-sm font-bold text-ergo-ink">Agentur Stübe</div>
                    <div className="text-[11px] text-ergo-mute">Ganderkesee</div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">

                  {/* Versicherungen */}
                  <div>
                    <p className="text-xs font-bold text-ergo-red mb-2 px-1">Versicherungen</p>
                    <div className="space-y-0.5">
                      {INSURANCE_LINKS.map(({ href, label, icon: Icon }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-ergo-red-light group transition-colors"
                        >
                          <div className="w-7 h-7 rounded-full bg-ergo-red-light flex items-center justify-center shrink-0">
                            <Icon className="w-3.5 h-3.5 text-ergo-red" />
                          </div>
                          <span className="text-sm font-medium text-ergo-ink group-hover:text-ergo-red transition-colors">{label}</span>
                        </Link>
                      ))}
                      <Link
                        href="/leben-vorsorge"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-ergo-red-light group transition-colors"
                      >
                        <div className="w-7 h-7 rounded-full bg-ergo-red-light flex items-center justify-center shrink-0">
                          <HeartHandshake className="w-3.5 h-3.5 text-ergo-red" />
                        </div>
                        <span className="text-sm font-medium text-ergo-ink group-hover:text-ergo-red transition-colors">Leben & Vorsorge</span>
                      </Link>
                    </div>
                  </div>

                  {/* Service */}
                  <div>
                    <p className="text-xs font-bold text-ergo-red mb-2 px-1">Service</p>
                    <div className="space-y-0.5">
                      {SERVICE_LINKS.map(({ href, label, icon: Icon }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-ergo-red-light group transition-colors"
                        >
                          <div className="w-7 h-7 rounded-full bg-ergo-gray flex items-center justify-center shrink-0">
                            <Icon className="w-3.5 h-3.5 text-ergo-stone" />
                          </div>
                          <span className="text-sm font-medium text-ergo-ink group-hover:text-ergo-red transition-colors">{label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Bestandskunden */}
                  <div>
                    <p className="text-xs font-bold text-ergo-red mb-2 px-1">Bestandskunden</p>
                    <Link
                      href="/bestandskunden"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-ergo-gray hover:bg-ergo-red-light transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-white border border-ergo-line flex items-center justify-center shrink-0">
                        <UserCheck className="w-3.5 h-3.5 text-ergo-red" />
                      </div>
                      <span className="text-sm font-semibold text-ergo-ink">Mein Service-Portal</span>
                    </Link>
                  </div>
                </div>

                {/* Bottom: Phone CTAs */}
                <div className="px-4 py-4 border-t border-ergo-line space-y-2">
                  <a
                    href="tel:015566771019"
                    className="ergo-btn ergo-btn--primary w-full text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    015566 771019 · Mobil
                  </a>
                  <a
                    href="tel:042212959999"
                    className="ergo-btn ergo-btn--secondary w-full text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    04221 2959999 · Büro
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
