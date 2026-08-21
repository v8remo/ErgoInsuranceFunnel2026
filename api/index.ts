/**
 * Vercel Serverless Function – bündelt die komplette Express-API.
 *
 * Alle Requests auf /api/* werden per Rewrite (vercel.json) hierher geleitet;
 * die Express-App aus server/routes.ts übernimmt das Routing unverändert.
 * Statische Dateien liefert Vercel direkt aus dist/public (CDN), daher gibt es
 * hier – anders als in server/index.ts – kein Vite/serveStatic und kein listen().
 */
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";

const app = express();

// Upload-Routen erhalten ein höheres JSON-Limit (Base64-Anhänge). Vercel
// begrenzt den Request-Body plattformseitig auf 4,5 MB – der Client
// komprimiert Bilder und prüft die Gesamtgröße vor dem Absenden.
const UPLOAD_ROUTES = new Set([
  "/api/schaden/submit",
  "/api/documents/submit",
  "/api/documents/upload",
  "/api/kennzeichen/submit",
]);
app.use((req, res, next) => {
  const limit = UPLOAD_ROUTES.has(req.path) ? "10mb" : "5mb";
  express.json({ limit })(req, res, next);
});
app.use(express.urlencoded({ extended: false }));

const ready = (async () => {
  await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });
})();

export default async function handler(req: Request, res: Response) {
  await ready;
  app(req, res);
}
