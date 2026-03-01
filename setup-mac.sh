#!/bin/bash
# ============================================
# ERGO Insurance Funnel 2026 - Mac Setup
# ============================================
# Dieses Skript richtet das Projekt für die
# lokale Entwicklung auf macOS ein.
# ============================================

set -e

echo "======================================"
echo "  ERGO Insurance Funnel - Mac Setup"
echo "======================================"
echo ""

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Node.js prüfen
echo "Prüfe Voraussetzungen..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js ist nicht installiert.${NC}"
    echo "Installiere Node.js 20+ via: brew install node@20"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${YELLOW}Warnung: Node.js $NODE_VERSION gefunden, Version 20+ empfohlen.${NC}"
else
    echo -e "${GREEN}Node.js $(node -v) gefunden.${NC}"
fi

# 2. npm prüfen
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm ist nicht installiert.${NC}"
    exit 1
fi
echo -e "${GREEN}npm $(npm -v) gefunden.${NC}"

# 3. Abhängigkeiten installieren
echo ""
echo "Installiere Abhängigkeiten..."
npm install

# 4. .env Datei erstellen (falls nicht vorhanden)
if [ ! -f .env ]; then
    echo ""
    echo "Erstelle .env aus .env.example..."
    cp .env.example .env
    echo -e "${YELLOW}Bitte trage deine DATABASE_URL in .env ein!${NC}"
    echo -e "${YELLOW}Beispiel: postgresql://user:password@host/dbname?sslmode=require${NC}"
else
    echo -e "${GREEN}.env existiert bereits.${NC}"
fi

# 5. Prüfen ob DATABASE_URL gesetzt ist
echo ""
if [ -f .env ]; then
    source .env 2>/dev/null || true
    if [ -z "$DATABASE_URL" ]; then
        echo -e "${YELLOW}DATABASE_URL ist noch nicht konfiguriert.${NC}"
        echo "Bearbeite die .env Datei und setze DATABASE_URL."
        echo ""
        echo "Neon PostgreSQL einrichten:"
        echo "  1. Erstelle ein Konto auf https://neon.tech"
        echo "  2. Erstelle ein neues Projekt"
        echo "  3. Kopiere die Connection-URL in .env"
        echo ""
    else
        echo -e "${GREEN}DATABASE_URL ist konfiguriert.${NC}"
        echo "Pushe Datenbankschema..."
        npm run db:push
    fi
fi

echo ""
echo "======================================"
echo -e "${GREEN}  Setup abgeschlossen!${NC}"
echo "======================================"
echo ""
echo "Nächste Schritte:"
echo "  1. DATABASE_URL in .env setzen (falls noch nicht geschehen)"
echo "  2. npm run db:push    (Datenbankschema erstellen)"
echo "  3. npm run dev        (Entwicklungsserver starten)"
echo ""
echo "Der Server läuft dann auf: http://localhost:5000"
echo ""
echo "Claude Remote Nutzung:"
echo "  - Öffne Claude Desktop auf deinem Mac"
echo "  - Wähle dieses Projekt als Arbeitsverzeichnis"
echo "  - Claude erkennt automatisch CLAUDE.md und .claude/launch.json"
echo ""
