# ERGO Insurance Funnel 2026

## Projektübersicht

Professionelle Lead-Generierungsplattform für ERGO-Versicherungsagenturen. Full-Stack-Webanwendung mit optimierten Landing Pages, Conversion Funnels und Admin-Dashboard.

## Tech Stack

- **Frontend:** React 18 + TypeScript, Vite, TailwindCSS, shadcn/ui, Radix UI
- **Backend:** Express.js + TypeScript, tsx Runtime
- **Datenbank:** PostgreSQL (Neon Serverless), Drizzle ORM
- **E-Mail:** Resend API
- **Tracking:** Google Analytics 4, Meta Pixel, Google Ads Conversion

## Schnellstart (lokale Entwicklung / Mac)

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Umgebungsvariablen konfigurieren
cp .env.example .env
# -> DATABASE_URL und optional RESEND_API_KEY eintragen

# 3. Datenbank-Schema pushen
npm run db:push

# 4. Entwicklungsserver starten
npm run dev
```

Der Server läuft auf `http://localhost:5000` (API + Client).

## Befehle

| Befehl | Beschreibung |
|---|---|
| `npm run dev` | Entwicklungsserver starten (Port 5000) |
| `npm run build` | Produktion-Build (Client + Server) |
| `npm run start` | Produktionsserver starten |
| `npm run check` | TypeScript-Typprüfung |
| `npm run db:push` | Datenbankschema aktualisieren |

## Umgebungsvariablen

| Variable | Erforderlich | Beschreibung |
|---|---|---|
| `DATABASE_URL` | Ja | PostgreSQL-Verbindungsstring (Neon) |
| `RESEND_API_KEY` | Nein | Resend API-Key für E-Mail-Benachrichtigungen |

## Projektstruktur

```
client/          → React SPA (Frontend)
  src/
    components/  → React-Komponenten
    pages/       → Seitenkomponenten
    hooks/       → Custom React Hooks
    lib/         → Hilfsfunktionen
server/          → Express Backend
  index.ts       → Server-Einstiegspunkt
  routes.ts      → API-Routen
  db.ts          → Datenbankverbindung
  email.ts       → E-Mail-Service
shared/          → Geteilter Code
  schema.ts      → Drizzle ORM Schema (DB-Modelle)
```

## Pfad-Aliase

- `@/` → `client/src/`
- `@shared/` → `shared/`
- `@assets/` → `attached_assets/`

## Architektur-Hinweise

- Server dient sowohl API als auch Client über Port 5000
- Im Development-Modus: Vite HMR über Express-Middleware
- Im Production-Modus: Statische Dateien aus `dist/public`
- Datenbank nutzt Neon Serverless mit WebSocket-Verbindung
- E-Mail-Benachrichtigungen sind optional (funktioniert ohne RESEND_API_KEY)
