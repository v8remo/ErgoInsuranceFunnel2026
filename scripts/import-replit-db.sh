#!/bin/sh
# Leads, Inhalte, Einreichungen und Admin-Passwort aus der Replit-Datenbank
# übernehmen. ERSETZT diese Tabellen auf dem Server komplett durch den
# Replit-Stand – zum Testen und ein letztes Mal direkt vor der DNS-Umstellung.
# Voraussetzung: `docker compose up -d` lief einmal (Tabellen sind angelegt).
# Aufruf: scripts/import-replit-db.sh 'postgresql://…'   (URL aus Replit → Secrets → DATABASE_URL)
set -eu
[ $# -eq 1 ] || { echo "Aufruf: $0 '<REPLIT_DATABASE_URL>'"; exit 1; }
cd "$(dirname "$0")/.."

tables="leads content admin_config submissions users"
dump_args=""
for t in $tables; do dump_args="$dump_args -t $t"; done

printf 'Ersetzt Leads, Inhalte, Einreichungen und Admin-Passwort auf diesem Server. Fortfahren? [j/N] '
read -r answer
[ "$answer" = "j" ] || { echo "Abgebrochen."; exit 1; }

docker compose stop app
docker compose exec -T db psql -v ON_ERROR_STOP=1 -q -U stuebe -d stuebe -c \
  "TRUNCATE $(echo "$tables" | tr ' ' ',') RESTART IDENTITY;"
# shellcheck disable=SC2086
docker run --rm postgres:17-alpine pg_dump --data-only --no-owner --no-privileges $dump_args "$1" \
  | docker compose exec -T db psql -v ON_ERROR_STOP=1 -q -U stuebe -d stuebe >/dev/null

# IDs fortsetzen, damit neue Einträge nicht mit importierten kollidieren.
for t in $tables; do
  docker compose exec -T db psql -q -U stuebe -d stuebe -c \
    "SELECT setval(pg_get_serial_sequence('$t','id'), COALESCE((SELECT MAX(id) FROM $t), 0) + 1, false);" >/dev/null
done
docker compose start app

for t in $tables; do
  printf '%s: ' "$t"
  docker compose exec -T db psql -tA -U stuebe -d stuebe -c "SELECT count(*) FROM $t;"
done
