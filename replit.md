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
The platform features a clean, professional design with a focus on user experience and conversion optimization.
- **Color Scheme:** Utilizes ERGO's brand colors with optimized contrast ratios for WCAG compliance.
- **Typography:** Responsive font sizes and increased line height/letter spacing for improved readability.
- **Responsiveness:** Mobile-first CSS ensures optimal viewing and interaction across all devices. Touch-optimized buttons and larger input fields for mobile funnels.
- **Trust Elements:** Integration of professional photos, ERGO Testsieger-Badges, and customer testimonials to build credibility.
- **Conversion Psychology:** Implementation of urgency, social proof, loss aversion, scarcity, and authority principles in CTAs and page layouts.

### Technical Implementations
- **Frontend:** Built with React and TypeScript, providing a dynamic and responsive user interface.
  - **Homepage:** Overview of insurance products with trust elements.
  - **Insurance Landing Pages:** Dedicated, conversion-optimized pages for each insurance product, featuring lead funnels and direct CTAs.
  - **Document & Claims Pages:** Multi-step flows for submitting documents (with file upload) and reporting claims.
  - **License Plate Page (`/kennzeichen`):** Flow for requesting eVB numbers (car) and insurance plates (mopeds).
  - **Appointment Page (`/termin`):** Integrates Microsoft Outlook Booking for direct online appointment scheduling.
  - **Lead Funnel:** A consistent 9-step conversion funnel (`FunnelOverlay`) integrated across all relevant pages.
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
- **Instagram Generator:** Admin-only tool at `/admin/instagram` for generating branded ERGO social media slides (html-to-image, Inter/Montserrat fonts).
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
- **Microsoft Outlook Booking:** Embedded for online appointment scheduling.
- **IHK (Industrie- und Handelskammer):** Registration number and details included in legal disclosures.
- **LfD Niedersachsen (Landesbeauftragte für den Datenschutz):** Referenced for data protection compliance.