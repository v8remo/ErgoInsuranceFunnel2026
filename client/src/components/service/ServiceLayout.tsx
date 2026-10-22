import { Link } from "wouter";
import { Phone } from "lucide-react";
import "@/styles/service.css";

export const PHONE_DISPLAY = "015566 771019";
export const PHONE_HREF = "tel:015566771019";
export const WHATSAPP_URL = "https://wa.me/4915566771019";

/** Rahmen für alle Service-Center-Seiten (eigener Kopf/Fuß im Design „Handschlag“). */
export default function ServiceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sv">
      <header className="sv-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 18, paddingBottom: 18 }}>
        <Link href="/service" style={{ textDecoration: "none", display: "flex", flexDirection: "column", lineHeight: 1.05 }} aria-label="Service-Center Startseite">
          <span className="sv-serif" style={{ fontWeight: 600, fontSize: 22 }}>Stübe</span>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--sv-muted)" }}>
            Versicherungsagentur
          </span>
        </Link>
        <a
          href={PHONE_HREF}
          style={{ minHeight: 44, padding: "0 16px", borderRadius: 999, border: "1.5px solid var(--sv-ink)", display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 14, textDecoration: "none" }}
        >
          <Phone size={16} aria-hidden="true" />
          Anrufen
        </a>
      </header>

      <main style={{ flex: 1 }}>{children}</main>

      <footer className="sv-wrap" style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px", paddingTop: 28, paddingBottom: 28, fontSize: 13, color: "var(--sv-muted)" }}>
        <Link href="/">Zur Website</Link>
        <Link href="/impressum">Impressum</Link>
        <Link href="/datenschutz">Datenschutz</Link>
        <Link href="/erstinformation">Erstinformation</Link>
      </footer>
    </div>
  );
}
