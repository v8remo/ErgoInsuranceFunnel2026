import { Link } from "wouter";
import { Phone, Mail, MapPin } from "lucide-react";
import { FaLinkedin, FaInstagram } from "react-icons/fa";
import WhatsAppButton from "@/components/WhatsAppButton";

const INSURANCE_LINKS = [
  { href: "/kfz", label: "KFZ-Versicherung" },
  { href: "/hausrat", label: "Hausratversicherung" },
  { href: "/haftpflicht", label: "Haftpflichtversicherung" },
  { href: "/rechtsschutz", label: "Rechtsschutzversicherung" },
  { href: "/zahnzusatz", label: "Zahnzusatzversicherung" },
  { href: "/berufsunfaehigkeit", label: "Berufsunfähigkeit" },
  { href: "/unternehmensversicherung", label: "Gewerbeversicherung" },
  { href: "/leben-vorsorge", label: "Leben & Vorsorge" },
];

const SERVICE_LINKS = [
  { href: "/termin", label: "Termin buchen" },
  { href: "/beratung", label: "Kostenlose Beratung" },
  { href: "/dokumente", label: "Dokumente einreichen" },
  { href: "/schaden", label: "Schaden melden" },
  { href: "/schaden-unfall", label: "Unfall melden" },
  { href: "/kennzeichen", label: "Kennzeichen / eVB" },
  { href: "/whatsapp", label: "WhatsApp Service" },
];

const CUSTOMER_LINKS = [
  { href: "/bestandskunden", label: "Kunden-Service-Hub" },
  { href: "/versicherungscheck", label: "Versicherungscheck" },
  { href: "/sparrechner", label: "Sparrechner" },
];

const REGION_LINKS = [
  { href: "/versicherung-ganderkesee", label: "Versicherung Ganderkesee" },
  { href: "/versicherung-delmenhorst", label: "Versicherung Delmenhorst" },
  { href: "/versicherung-oldenburg", label: "Versicherung Oldenburg" },
  { href: "/versicherung-stuhr", label: "Versicherung Stuhr" },
  { href: "/versicherung-achim", label: "Versicherung Achim" },
  { href: "/versicherung-syke", label: "Versicherung Syke" },
];

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link href={href} className="text-sm text-ergo-dark hover:text-ergo-red hover:underline transition-colors">
        {label}
      </Link>
    </li>
  );
}

export default function Footer() {
  return (
    <footer className="ds-site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Kontakt */}
          <div>
            <h3 className="font-sans text-base font-bold text-ergo-ink mb-4">Kontakt</h3>
            <div className="space-y-3 text-sm text-ergo-dark">
              <p className="font-bold text-ergo-ink">ERGO Agentur Stübe</p>
              <p>Morino Stübe</p>

              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 text-ergo-red" />
                <div>
                  <p>Friedensstraße 91 A</p>
                  <p>27777 Ganderkesee</p>
                </div>
              </div>

              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0 text-ergo-red" />
                <a href="tel:015566771019" className="hover:text-ergo-red hover:underline transition-colors break-all">
                  015566 771019
                </a>
              </div>

              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0 text-ergo-red" />
                <a href="tel:042212959999" className="hover:text-ergo-red hover:underline transition-colors break-all">
                  04221 2959999
                </a>
              </div>

              <div className="flex items-start">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 text-ergo-red" />
                <a href="mailto:morino.stuebe@ergo.de" className="hover:text-ergo-red hover:underline transition-colors break-all">
                  morino.stuebe@ergo.de
                </a>
              </div>

              <div className="pt-2">
                <WhatsAppButton text="WhatsApp Service" className="w-full sm:w-auto" />
              </div>

              <div className="pt-2 text-sm text-ergo-dark">
                <p className="font-bold text-ergo-ink">Öffnungszeiten</p>
                <p>Mo–Fr: 9:00 – 18:00 Uhr</p>
                <p>Sa: 9:00 – 12:00 Uhr</p>
              </div>
            </div>
          </div>

          {/* Versicherungen */}
          <div>
            <h3 className="font-sans text-base font-bold text-ergo-ink mb-4">Unsere Versicherungen</h3>
            <ul className="space-y-2">
              {INSURANCE_LINKS.map(link => <FooterLink key={link.href} {...link} />)}
            </ul>
          </div>

          {/* Service & Regionen */}
          <div>
            <h3 className="font-sans text-base font-bold text-ergo-ink mb-4">Service</h3>
            <ul className="space-y-2 mb-6">
              {SERVICE_LINKS.map(link => <FooterLink key={link.href} {...link} />)}
            </ul>
            <h3 className="font-sans text-base font-bold text-ergo-ink mb-4">Für Kunden</h3>
            <ul className="space-y-2">
              {CUSTOMER_LINKS.map(link => <FooterLink key={link.href} {...link} />)}
            </ul>
          </div>

          {/* Rechtliches, Regionen & Social */}
          <div>
            <h3 className="font-sans text-base font-bold text-ergo-ink mb-4">Rechtliches</h3>
            <ul className="space-y-2 mb-6">
              <FooterLink href="/impressum" label="Impressum" />
              <FooterLink href="/datenschutz" label="Datenschutz" />
              <FooterLink href="/erstinformation" label="Erstinformation" />
              <li>
                <button
                  onClick={() => {
                    import('@/lib/analytics').then(m => {
                      m.revokeMarketingConsent();
                      localStorage.removeItem(m.CONSENT_KEY);
                      window.location.reload();
                    });
                  }}
                  className="text-sm text-ergo-dark hover:text-ergo-red hover:underline transition-colors cursor-pointer"
                >
                  Cookie-Einstellungen
                </button>
              </li>
            </ul>

            <h3 className="font-sans text-base font-bold text-ergo-ink mb-4">Regionen</h3>
            <ul className="space-y-2 mb-6">
              {REGION_LINKS.map(link => <FooterLink key={link.href} {...link} />)}
            </ul>

            <h3 className="font-sans text-base font-bold text-ergo-ink mb-3">Folgen Sie uns</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/in/morino-stuebe"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-ergo-stone hover:text-ergo-red transition-colors"
              >
                <FaLinkedin size={22} />
              </a>
              <a
                href="https://www.instagram.com/morino.stuebe.ergo"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-ergo-stone hover:text-ergo-red transition-colors"
              >
                <FaInstagram size={22} />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Markenzeile */}
      <div className="border-t border-ergo-line bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/attached_assets/ergo-logo-hq.svg"
              alt="ERGO"
              className="h-5 w-auto"
              width={80}
              height={23}
              loading="lazy"
            />
            <span className="text-sm text-ergo-stone">Einfach, weil's wichtig ist.</span>
          </div>
          <div className="text-center sm:text-right text-xs text-ergo-mute space-y-1">
            <p>&copy; 2026 ERGO Agentur Stübe · Morino Stübe. Alle Rechte vorbehalten.</p>
            <p>
              Vermittlerregister-Nr. D-5H7J-7DUI1-10 ·{" "}
              <a
                href="https://www.vermittlerregister.info"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ergo-red hover:underline"
              >
                www.vermittlerregister.info
              </a>
            </p>
            <p>
              <Link href="/admin" className="hover:text-ergo-red hover:underline">
                Admin Dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
