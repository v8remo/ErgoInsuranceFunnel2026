/**
 * Upload-Helfer für Schaden-, Dokumente- und Kennzeichen-Formulare.
 *
 * Hintergrund: Beim Hosting auf Vercel ist der Request-Body einer Serverless
 * Function auf 4,5 MB begrenzt. Fotos werden deshalb clientseitig
 * herunterskaliert, und vor dem Absenden wird die Gesamtgröße geprüft.
 */

// Nach Base64-Encoding wächst der Payload um ~37 %; 3,2 MB Rohdaten bleiben
// damit sicher unter dem 4,5-MB-Limit inkl. Formularfeldern.
export const MAX_TOTAL_UPLOAD_BYTES = 3.2 * 1024 * 1024;

export const UPLOAD_LIMIT_MESSAGE =
  'Die Dateien sind zusammen zu groß für den Upload (max. ca. 3 MB). ' +
  'Bitte entfernen Sie einzelne Dateien – oder senden Sie die Unterlagen ' +
  'direkt per WhatsApp an 01556 6771019.';

const COMPRESS_MAX_DIMENSION = 1600;
const COMPRESS_QUALITY = 0.8;
// Kleine Bilder unverändert lassen – Neukompression würde nichts sparen.
const COMPRESS_THRESHOLD_BYTES = 400 * 1024;

/**
 * Skaliert ein Foto auf max. 1600px Kantenlänge und kodiert es als JPEG.
 * Nicht-Bilder (PDFs) und kleine Bilder werden unverändert zurückgegeben.
 * Schlägt die Kompression fehl (z. B. exotisches Format), bleibt die
 * Originaldatei erhalten.
 */
export async function compressImageFile(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file;
  if (file.size <= COMPRESS_THRESHOLD_BYTES) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, COMPRESS_MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>(resolve =>
      canvas.toBlob(resolve, 'image/jpeg', COMPRESS_QUALITY)
    );
    if (!blob || blob.size >= file.size) return file;

    const newName = file.name.replace(/\.(png|webp|heic|heif|gif|bmp|tiff?)$/i, '.jpg');
    return new File([blob], newName, { type: 'image/jpeg' });
  } catch {
    return file;
  }
}

/** Summe der Dateigrößen in Bytes. */
export function totalFileSize(files: Array<{ size: number }>): number {
  return files.reduce((sum, f) => sum + f.size, 0);
}

/** true, wenn die Dateien zusammen über dem Upload-Limit liegen. */
export function exceedsUploadLimit(files: Array<{ size: number }>): boolean {
  return totalFileSize(files) > MAX_TOTAL_UPLOAD_BYTES;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
