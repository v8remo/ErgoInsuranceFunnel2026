#!/bin/sh
# Datenbank- und Upload-Backup. Täglich per crontab, z. B.:
#   15 3 * * * /opt/stuebe/scripts/backup.sh >> /opt/stuebe/backups/backup.log 2>&1
# Die Dateien enthalten Kundendaten: Ordner nur für root lesbar halten und
# zusätzlich verschlüsselt außer Haus kopieren.
set -eu
cd "$(dirname "$0")/.."
umask 077
mkdir -p backups
stamp=$(date +%F)
docker compose exec -T db pg_dump -U stuebe -Fc stuebe > "backups/db-$stamp.dump"
docker compose cp app:/app/uploads "backups/uploads-$stamp"
find backups -maxdepth 1 -name 'db-*.dump' -mtime +14 -delete
find backups -maxdepth 1 -type d -name 'uploads-*' -mtime +14 -exec rm -rf {} +
echo "Backup $stamp fertig"
