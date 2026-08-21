# ERGO Versicherungsplattform

## Overview
The ERGO Versicherungsplattform is a professional lead generation platform designed for ERGO insurance agencies. It features optimized landing pages for various insurance products and an administrative dashboard for content and lead management. The platform aims to enhance online presence, streamline lead capture, and provide robust tools for managing customer interactions and marketing efforts. Key capabilities include comprehensive SEO, high performance, and conversion-optimized funnels to maximize lead generation from campaigns like Google Ads. The business vision is to provide a competitive edge in the insurance market through a highly effective digital presence.

## User Preferences
- Admin-Passwort: Wird über die Umgebungsvariable ADMIN_PASSWORD konfiguriert (bcrypt-gehasht in der Datenbank gespeichert)
- E-Mail-Benachrichtigungen für neue Leads gewünscht
- Platform soll Google Ads ready sein
- Sichere Admin-Authentifizierung mit Passwort-Änderungsfunktion gewünscht

## System Architecture

### UI/UX Decisions
The platform follows the authentic ERGO corporate design (tokens extracted from ergo.de). The design system lives centrally in `client/src/index.css` (component classes) and `tailwind.config.ts` (color/font tokens).
- **Color Scheme:** ERGO berry red `#8E0038` (hover `#71022E`) as the single accent; text `#333`; lines `#D9D9D9`; surfaces `#F6F5F5`/`#FBF4F4`; petrol check green `#009284` (ERGO CheckColorIcon) for success/checkmarks; pastel accents (`#FAD782`, `#B3DA8A`, `#96C8FF`, `#FA7D73`) only for chips/badges. WhatsApp CTAs keep WhatsApp green. Never use Allianz blue `#003781` or bright red `#E2001A`.
- **Typography:** Serif headlines h1–h4 (Source Serif 4, standing in for ERGO's Fedra Serif), Open Sans body/UI (standing in for FS Me). Hero H1 `text-[30px] md:text-[40px]`.
- **Components:** Pill buttons with 2px border per the ergo.de CTA system (`ergo-btn` + `--primary/--secondary/--tertiary/--inverted/--whatsapp`); cards 8px radius with 1px border instead of shadows (`ergo-card`, hoverable `ergo-tile`); selection tiles `ergo-option`; inputs 4px radius with red focus ring; `ergo-check-list` with petrol circle checkmarks; `ergo-eyebrow` red bold intro line; `ergo-section--red` berry closing CTA bands; `ergo-icon-disc` rosé icon circles. Icons: lucide-react only, no emojis in UI.
- **Layout language:** White heros (eyebrow + serif H1 + pill CTAs), alternating white and `bg-ergo-gray` sections, calm motion (single fadeInUp per section, no marquees/parallax/pulse/glassmorphism/gradients).
- **Responsiveness:** Mobile-first; touch-optimized buttons (min-height 48px) and larger input fields for mobile funnels.
- **Trust Elements:** Professional photos, ERGO Testsieger badges, customer testimonials, `TrustBar` component. Honest static claims only — no computed fake urgency/scarcity (no "X free slots today" derived from the date).

### Technical Implementations
- **Frontend:** Built with React and TypeScript, providing a dynamic and responsive user interface.
  - **Homepage:** Overview of insurance products with trust elements.
  - **Insurance Landing Pages:** Dedicated, conversion-optimized pages for each insurance product, featuring lead funnels and direct CTAs.
  - **Google Ads Sparten-Landing-Pages:** 7 dedicated, conversion-optimized landing pages (`/kfz`, `/hausrat`, `/haftpflicht`, `/rechtsschutz`, `/berufsunfaehigkeit`, `/zahnzusatz`, `/unternehmensversicherung`) with minimal header/footer, hero with star rating, trust bar, 4 spartenspezifische benefits, customer reviews, FAQ accordion, and final CTA. Each uses FunnelOverlay with sparten-specific `source` tag (e.g. `lp_kfz`, `lp_gewerbe`). Built with shared `SpartenLandingPage` component and typed config in `spartenConfig.ts`. Schema.org FAQPage and Service structured data included.
  - **Document & Claims Pages:** Multi-step flows for submitting documents (with file upload) and reporting claims.
  - **License Plate Page (`/kennzeichen`):** Flow for requesting eVB numbers (car) and insurance plates (mopeds).
  - **Appointment Page (`/termin`):** Integrates Cal.com embed (`@calcom/embed-react`, calLink: `morino-stuebe-ergo/erstberatung`, month_view layout) for direct online appointment scheduling.
  - **Lead Funnel:** A consistent 9-step conversion funnel (`FunnelOverlay`) integrated across all relevant pages. Supports custom `source` prop for lead tracking.
  - **Bestandskunden-Service-Hub (`/bestandskunden`):** Dedicated landing page for existing customers with quick-access service tiles, Lebenslagen-Beratung (6 life situations with insurance recommendations), Jahrescheck CTA, customer benefits, and referral program. Own minimal header/footer, no global nav.
  - **Perspective Scroll-Funnel (`/beratung`):** Full-page long-scroll lead generation funnel (replaces LeadPage modal) modeled after Perspective-style funnels. 7 sections: Hero + Q1 (insurance type, 7 tiles), Trust + Q2 (existing contracts), Benefits + Testimonials + Q3 (timing), Comparison table, Advisor/Stats, FAQ accordion, Lead form. Clicking quiz answers triggers smooth scroll to next section. Sticky header with animated progress bar. Mobile sticky CTA bar. Cal.com popup (namespace: `beratung-termin`) on form success. Lead source: `lp_beratung_perspective`. Old LeadPage kept for reference only.
  - **Admin Dashboard:** Password-protected interface for content management, lead administration, and CSV export.
- **Backend:** Developed with Express.js and PostgreSQL.
  - **API Routes:** RESTful API for managing leads and content.
  - **Database:** PostgreSQL with Drizzle ORM for robust data management.
  - **Session Management:** Express-Session handles admin authentication.

### Feature Specifications
- **SEO Optimization:** Comprehensive meta-tags, sitemap.xml, robots.txt, Schema.org structured data (LocalBusiness, FAQPage), and LLM-friendly meta-tags.
- **Performance:** Optimized images, lazy loading, minimal bundle size, and fast loading times.
- **Lead Optimization:** Clear Call-to-Actions, trust elements, simplified multi-step processes, and immediate lead capture.
- **Tracking:** Google Analytics 4, Meta Pixel integration, event tracking for key interactions, funnel tracking, and conversion tracking for lead generation (Google Ads conversion tracking).
- **Admin Features:** Lead management with filtering, content management system, CSV export, real-time statistics, and PDF download button for Dokument-Submissions (base64 stored in `pdf_data` column).
- **Instagram Generator:** Admin-only tool at `/admin/instagram` for generating branded ERGO social media slides (html-to-image, Inter/Montserrat fonts). Features mobile-optimized layout, inline topic switcher, hook-type selector, and AI-powered content regeneration (POST /api/instagram/generate via OpenAI gpt-5.2) that generates fresh story variations in the same style for any topic.
- **Email Notifications:** Automated lead notifications via Resend API (e.g., for document uploads, claims, and license plate requests).
- **Compliance:** Full compliance with German legal requirements (Impressum, Datenschutzerklärung, Cookie-Consent-Banner, Erstinformation nach § 15 VersVermV).
- **Local SEO:** Dedicated city landing pages (`/versicherung-ganderkesee`, `/versicherung-delmenhorst`, `/versicherung-oldenburg`) with localized content, FAQs, testimonials, and regional information.
- **Customer Service:** Integration of WhatsApp customer service with dedicated buttons and pre-filled messages.
- **Business Strategy Integration:** All CTAs and texts reflect the strategy of offering free insurance analysis and 15% bundle discounts for 5+ policies.

## External Dependencies
- **PostgreSQL:** Primary database for storing application data.
- **Drizzle ORM:** Used for interacting with the PostgreSQL database.
- **Resend API:** For sending automated email notifications (e.g., new lead alerts, document submission confirmations).
- **Google Analytics 4:** For website analytics and user behavior tracking.
- **Meta Pixel:** For tracking marketing campaign performance and retargeting.
- **Google Ads Conversion Tracking:** Integrated for measuring the effectiveness of Google Ads campaigns.
- **Cal.com (`@calcom/embed-react`):** Embedded for online appointment scheduling at `/termin` (namespace: `erstberatung`, calLink: `morino-stuebe-ergo/erstberatung`).
- **IHK (Industrie- und Handelskammer):** Registration number and details included in legal disclosures.
- **LfD Niedersachsen (Landesbeauftragte für den Datenschutz):** Referenced for data protection compliance.
- **OpenAI (via Replit AI Integrations):** Used for Instagram content generation (gpt-5.2, POST /api/instagram/generate). No own API key needed – billed to Replit credits.