import { Link } from "wouter";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle, ArrowRight, Car, ChevronRight, FileUp, FileX, Landmark, Lock, MessageCircle, Pencil, UserCheck, UserPlus,
} from "lucide-react";
import SEO from "@/components/SEO";
import ServiceLayout, { WHATSAPP_URL } from "@/components/service/ServiceLayout";

type Entry = { href: string; icon: LucideIcon; title: string; desc: string };

const UNTERLAGEN: Entry[] = [
  { href: "/service/upload", icon: FileUp, title: "Rechnung oder Beleg", desc: "PDF oder Foto hochladen" },
  { href: "/service/vollmacht", icon: Landmark, title: "Vollmacht & SEPA-Mandat", desc: "Betreuung und Lastschrift erteilen" },
];

const VERTRAEGE: Entry[] = [
  { href: "/service/aenderung", icon: Pencil, title: "Daten ändern", desc: "Adresse, Bankverbindung, Name" },
  { href: "/service/kuendigung", icon: FileX, title: "Kündigung", desc: "Vertrag bei einem anderen Versicherer" },
  { href: "/service/beraterwechsel", icon: UserCheck, title: "Beraterwechsel", desc: "Künftig von uns betreut werden" },
];

function Rows({ title, entries }: { title: string; entries: Entry[] }) {
  return (
    <div>
      <h2 className="sv-group-title">{title}</h2>
      {entries.map(({ href, icon: Icon, title, desc }) => (
        <Link key={href} href={href} className="sv-row">
          <Icon size={22} strokeWidth={1.7} aria-hidden="true" />
          <span style={{ flexGrow: 1 }}>
            <span className="sv-row-title">{title}</span>
            <span className="sv-row-desc">{desc}</span>
          </span>
          <ChevronRight size={18} aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}

export default function ServiceCenter() {
  return (
    <ServiceLayout>
      <SEO
        title="Service-Center – Agentur Stübe Ganderkesee"
        description="Schäden melden, Belege einreichen, Daten ändern, kündigen oder Vollmacht erteilen – online, ohne Konto, mit Eingangsbestätigung."
        keywords="Versicherung Service, Dokumente einreichen, Schaden melden, Kündigung, Ganderkesee"
      />
      <div className="sv-wrap" style={{ display: "flex", flexDirection: "column", gap: 22, paddingTop: 12 }}>
        <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h1 className="sv-h1">Guten Tag. Womit dürfen wir Ihnen <em>heute</em> helfen?</h1>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span
              className="sv-serif"
              aria-hidden="true"
              style={{ width: 48, height: 48, borderRadius: 999, background: "var(--sv-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, flexShrink: 0 }}
            >
              MS
            </span>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.45, color: "var(--sv-body)" }}>
              „Reichen Sie alles bequem online ein – ich kümmere mich persönlich darum.“
              <span style={{ display: "block", fontWeight: 600, color: "var(--sv-ink)", marginTop: 2 }}>Morino Stübe</span>
            </p>
          </div>
        </section>

        <div>
          <h2 className="sv-group-title">Etwas ist passiert</h2>
          <Link href="/schaden" className="sv-feature">
            <AlertTriangle size={24} strokeWidth={1.7} aria-hidden="true" />
            <span style={{ flexGrow: 1 }}>
              <span className="sv-serif" style={{ display: "block", fontWeight: 600, fontSize: 19 }}>Schaden oder Unfall melden</span>
              <span style={{ display: "block", fontSize: 14, color: "#f0e1ea" }}>Mit Fotos, auch direkt vom Unfallort</span>
            </span>
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </div>

        <Rows title="Unterlagen einreichen" entries={UNTERLAGEN} />
        <Rows title="Verträge" entries={VERTRAEGE} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
          <Link href="/kennzeichen" className="sv-tile">
            <Car size={22} strokeWidth={1.7} aria-hidden="true" />
            <span className="sv-row-title">eVB &amp; Kennzeichen</span>
            <span className="sv-row-desc">Zulassung oder Moped</span>
          </Link>
          <Link href="/neukunden" className="sv-tile">
            <UserPlus size={22} strokeWidth={1.7} aria-hidden="true" />
            <span className="sv-row-title">Neu bei uns</span>
            <span className="sv-row-desc">Kundendaten erfassen</span>
          </Link>
        </div>

        <section style={{ paddingTop: 18, borderTop: "1px solid var(--sv-line)", display: "flex", flexDirection: "column", gap: 8, fontSize: 14, color: "var(--sv-body)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Lock size={16} aria-hidden="true" />
            Verschlüsselt übertragen, Eingangsbestätigung per E-Mail
          </span>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, minHeight: 44 }}>
            <MessageCircle size={16} aria-hidden="true" />
            Lieber per WhatsApp schreiben
          </a>
        </section>
      </div>
    </ServiceLayout>
  );
}
