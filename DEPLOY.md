# Betrieb auf dem eigenen Server

Die Website läuft als drei Docker-Container: **app** (Website + API),
**db** (Postgres 17) und **caddy** (HTTPS mit automatischem Zertifikat).
Alles startet mit einem Befehl und funktioniert auf jedem Linux-Server.

## 0. Server

- Linux-Server (z. B. Ubuntu 24.04), mind. 2 GB RAM, 20 GB Platte
- Für die DSGVO: Standort Deutschland/EU, Auftragsverarbeitungsvertrag mit dem Hoster abschließen
- Ports 80 und 443 offen
- Docker installieren: `curl -fsSL https://get.docker.com | sh`

## 1. Einrichten

```bash
git clone https://github.com/v8remo/ErgoInsuranceFunnel2026.git /opt/stuebe
cd /opt/stuebe
cp .env.example .env
nano .env        # alle Werte ausfüllen (Erklärung steht in der Datei)
```

**Erst testen, dann umziehen:** Für den ersten Start in `.env` eine Test-Subdomain
eintragen (z. B. `DOMAIN=neu.ergo-stuebe.de`) und beim Domain-Anbieter einen
A-Record `neu` → IP des Servers anlegen. Die Live-Seite auf Replit läuft so
lange unverändert weiter.

```bash
docker compose up -d --build
docker compose logs -f app      # wartet auf "serving on port 5000"
```

Beim ersten Start legt die App die Tabellen selbst an. Danach ist die Seite
unter `https://<DOMAIN>` erreichbar.

## 2. Daten aus Replit übernehmen

In Replit unter *Secrets* den Wert von `DATABASE_URL` kopieren, dann auf dem Server:

```bash
scripts/import-replit-db.sh 'postgresql://…'
```

Übernommen werden Leads, Inhalte, Einreichungen und das Admin-Passwort – sie
**ersetzen** den Stand auf dem Server (das Skript fragt vorher nach). Am Ende
zeigt es die Anzahl der Einträge pro Tabelle.

## 3. Prüfen

- `/admin` – Login, Leads und Einreichungen sichtbar?
- `/service` – je ein Anliegen testweise absenden: Mail an dich mit Vorgangsnummer, Eingangsbestätigung an die angegebene Adresse?
- `/schaden`, `/schaden-unfall`, `/kennzeichen`, `/neukunden` – ebenso je einmal testweise absenden
- `https://<DOMAIN>/api/submissions` ohne Login aufrufen → muss `401` liefern

## 4. Domain umstellen

1. Schritt 2 noch einmal ausführen, damit alle Leads bis zu diesem Moment drüben sind.
2. In `.env` `DOMAIN=ergo-stuebe.de` setzen, dann `docker compose up -d`.
3. Beim Domain-Anbieter:
   - `ergo-stuebe.de` → **A-Record** auf die IP des Servers
   - `www.ergo-stuebe.de` → **CNAME** auf `ergo-stuebe.de`
   - **Nicht anfassen:** die Einträge für `anfrage.ergo-stuebe.de` (Resend-Mailversand, SPF/DKIM)
4. Caddy holt das Zertifikat automatisch, sobald der DNS-Eintrag auf den Server zeigt (meist wenige Minuten).
5. Die Domain in Replit (Deployments → Domains) entfernen.

## 5. Backups

```bash
crontab -e
# täglich 3:15 Uhr, hebt 14 Tage auf:
15 3 * * * /opt/stuebe/scripts/backup.sh >> /opt/stuebe/backups/backup.log 2>&1
```

Die Backups enthalten Kundendaten. Kopiere sie zusätzlich verschlüsselt auf
einen zweiten Ort (z. B. mit `restic` zu einer Storage Box).

Wiederherstellen:

```bash
docker compose exec -T db pg_restore -U stuebe -d stuebe --clean --if-exists < backups/db-JJJJ-MM-TT.dump
```

## 6. Updates einspielen

```bash
cd /opt/stuebe && git pull && docker compose up -d --build
```

## 7. Replit abschalten

Erst wenn Domain, Formulare und Admin auf dem eigenen Server laufen: in Replit
das Deployment stoppen. Die Replit-Datenbank vorher zusätzlich sichern:

```bash
docker run --rm postgres:17-alpine pg_dump -Fc 'postgresql://…' > backups/replit-final.dump
```
