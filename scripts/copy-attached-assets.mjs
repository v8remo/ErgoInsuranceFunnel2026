/**
 * Kopiert die öffentlich referenzierten Dateien aus attached_assets/ in den
 * statischen Build-Output, damit Vercel sie über das CDN ausliefert
 * (auf Replit übernimmt das express.static in server/routes.ts).
 *
 * Bewusst nur Web-Assets: Die im Ordner liegenden .md/.txt-Arbeitsdateien
 * (Trainingsdaten, Notizen) gehören nicht ins öffentliche Deployment.
 */
import { cpSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const SRC = 'attached_assets';
const DEST = 'dist/public/attached_assets';
const ALLOWED = new Set(['.svg', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico', '.mp4', '.webm', '.avif']);

mkdirSync(DEST, { recursive: true });

let copied = 0;
for (const entry of readdirSync(SRC)) {
  const src = join(SRC, entry);
  if (!statSync(src).isFile()) {
    // Unterordner (z. B. optimized/) komplett übernehmen – enthalten nur Bilder
    cpSync(src, join(DEST, entry), { recursive: true });
    copied++;
    continue;
  }
  if (!ALLOWED.has(extname(entry).toLowerCase())) continue;
  cpSync(src, join(DEST, entry));
  copied++;
}

console.log(`attached_assets: ${copied} Einträge nach ${DEST} kopiert`);
