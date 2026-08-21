# Deployment auf Vercel (weg von Replit)

Die App läuft auf Vercel als statisches Vite-Frontend + eine Serverless Function
(`api/index.ts`), die die komplette Express-API aus `server/routes.ts` ausführt.
`vercel.json` steuert Build, Rewrites und die Region (Frankfurt, `fra1`).

## 1. Datenbank (Neon, EU)

Die App nutzt bereits den Neon-Serverless-Treiber – es braucht nur eine eigene
Neon-Instanz statt der Replit-DB:

1. [neon.tech](https://neon.tech) → neues Projekt, **Region AWS eu-central-1 (Frankfurt)**.
2. Connection String kopieren (`postgresql://…?sslmode=require`).
3. Schema anlegen (lokal, einmalig):
   ```bash
   DATABASE_URL="postgresql://…" npm run db:push
   ```
4. Bestehende Leads/Submissions aus Replit übernehmen (optional):
   ```bash
   pg_dump --no-owner --no-privileges "$REPLIT_DATABASE_URL" | psql "$NEON_DATABASE_URL"
   ```
   Die `REPLIT_DATABASE_URL` steht in Replit unter *Secrets* → `DATABASE_URL`.
   (Wenn `db:push` vorher lief: Dump nur mit `--data-only` einspielen.)

## 2. Vercel-Projekt

1. [vercel.com/new](https://vercel.com/new) → GitHub-Repo `v8remo/ErgoInsuranceFunnel2026` importieren.
2. Framework-Preset: **Other** (die `vercel.json` im Repo übernimmt Build & Routing – nichts überschreiben).
3. Environment Variables setzen (Production + Preview):

   | Variable | Wert |
   |---|---|
   | `DATABASE_URL` | Neon-Connection-String |
   | `RESEND_API_KEY` | Key aus [resend.com/api-keys](https://resend.com/api-keys) |
   | `ADMIN_PASSWORD` | eigenes Initialpasswort für `/admin` |
   | `OPENAI_API_KEY` | *(optional)* nur für den Instagram-Generator unter `/admin/instagram` |

4. Deploy klicken. Fertig ist die `*.vercel.app`-Preview.

**Resend:** Nichts weiter nötig. Die Absender-Domain `anfrage.ergo-stuebe.de`
ist im Resend-Account bereits verifiziert (EU-Region). Alle Formular-Mails
(Leads, Rückruf, Schaden, Dokumente, Kennzeichen, Neukunden) gehen wie bisher
an morino.stuebe@ergo.de.

## 3. Domain umziehen

Im Vercel-Projekt unter *Settings → Domains* `ergo-ganderkesee.de` (und `www.`)
hinzufügen, dann beim Domain-Registrar:

- `ergo-ganderkesee.de` → **A-Record** auf `76.76.21.21`
- `www.ergo-ganderkesee.de` → **CNAME** auf `cname.vercel-dns.com`

SSL stellt Vercel automatisch aus. Solange DNS noch auf Replit zeigt, läuft die
alte Seite unterbrechungsfrei weiter – der Umzug ist erst mit dem DNS-Wechsel live.

## 4. Nach dem Deploy testen

- `/beratung` → Lead absenden (Mail kommt an? Lead im `/admin`-Dashboard?)
- `/schaden` → Meldung mit 2–3 Handyfotos (werden clientseitig komprimiert)
- `/dokumente` → Upload-Flow und Kündigungs-Flow mit Unterschrift (PDF-Anhang in der Mail)
- `/kennzeichen` → eVB-Anfrage
- Rückruf-Widget (roter Telefon-Button unten rechts)
- `/admin` → Login mit `ADMIN_PASSWORD`, danach Passwort im Dashboard ändern
- `/termin` → Cal.com-Embed lädt (läuft unabhängig vom Hosting weiter)

Google Analytics/Ads (GTM) und der Cookie-Consent laufen rein clientseitig weiter –
keine Änderung nötig.

## 5. Replit abschalten

Erst wenn Domain + Formulare auf Vercel verifiziert sind: Replit-Deployment
stoppen. Die Replit-Neon-DB vorher als Dump sichern (Befehl oben), falls das
Replit-Projekt gelöscht wird.

## Technische Grenzen auf Vercel

- **Request-Limit 4,5 MB:** Fotos werden clientseitig auf max. 1600 px
  komprimiert; vor dem Absenden prüft der Client die Gesamtgröße (~3 MB) und
  verweist sonst auf den WhatsApp-Kanal. Sehr große PDF-Konvolute → WhatsApp.
- **Kein beschreibbares Dateisystem:** Admin-Content-Bilder werden als
  Data-URI im Content-Datensatz gespeichert (`/api/upload-image`), nicht mehr
  in `attached_assets/` geschrieben.
- **Statische Assets:** `attached_assets/` (Logo, Fotos, Videos) kopiert der
  Build nach `dist/public/attached_assets` – Arbeitsdateien (.md/.txt) bleiben
  dabei bewusst außen vor.
