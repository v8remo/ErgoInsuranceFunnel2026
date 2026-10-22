import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic, log } from "./static";
import { setupSession } from "./auth";
import { runMigrations } from "./db";

const app = express();
setupSession(app);
const UPLOAD_ROUTES = new Set([
  '/api/schaden/submit',
  '/api/documents/submit',
  '/api/documents/upload',
  '/api/kennzeichen/submit',
]);
app.use((req, res, next) => {
  const limit = UPLOAD_ROUTES.has(req.path) ? '75mb' : '5mb';
  express.json({ limit })(req, res, next);
});
app.use(express.urlencoded({ extended: false }));

// Nur Methode, Pfad, Status und Dauer loggen – keine Antwortinhalte, weil
// Admin-Antworten personenbezogene Daten enthalten.
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      log(`${req.method} ${req.path} ${res.statusCode} in ${Date.now() - start}ms`);
    }
  });
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

(async () => {
  await runMigrations();
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    if (status >= 500) console.error(err);
    if (!res.headersSent) res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    // Dynamisch, damit Vite nur in der Entwicklung geladen wird.
    const { setupVite } = await import("./vite");
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // API und Client laufen über denselben Port (Standard 5000).
  const port = Number(process.env.PORT) || 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
