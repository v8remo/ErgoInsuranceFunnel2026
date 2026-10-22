import type { Express, Request, RequestHandler, Response } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

declare module "express-session" {
  interface SessionData {
    isAdmin?: boolean;
  }
}

// Serverseitige Admin-Sitzung: Die Anmeldung gilt nur, wenn der Server sie in
// der Session vermerkt hat – ein Flag im Browser reicht nicht.
export function setupSession(app: Express) {
  const isProd = app.get("env") === "production";
  const secret = process.env.SESSION_SECRET;
  if (!secret && isProd) {
    throw new Error("SESSION_SECRET must be set in production");
  }

  // Hinter Caddy: echte Client-IP und HTTPS-Erkennung für das Secure-Cookie.
  app.set("trust proxy", 1);

  const PgStore = connectPg(session);
  app.use(
    session({
      store: new PgStore({ pool, createTableIfMissing: true }),
      name: "stuebe.sid",
      secret: secret || "dev-only-session-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: isProd,
        maxAge: 8 * 60 * 60 * 1000,
      },
    }),
  );
}

export const requireAdmin: RequestHandler = (req, res, next) => {
  if (req.session?.isAdmin) return next();
  res.status(401).json({ message: "Nicht angemeldet" });
};

// ponytail: In-Memory-Zähler pro IP – reicht für genau eine App-Instanz.
// Bei mehreren Instanzen auf express-rate-limit mit gemeinsamem Store wechseln.
export function rateLimit(max: number, windowMs: number): RequestHandler {
  const hits = new Map<string, { count: number; reset: number }>();
  return (req, res, next) => {
    const now = Date.now();
    if (hits.size > 10_000) hits.clear();
    const key = req.ip ?? "unknown";
    const entry = hits.get(key);
    if (!entry || entry.reset < now) {
      hits.set(key, { count: 1, reset: now + windowMs });
      return next();
    }
    if (++entry.count > max) {
      return res
        .status(429)
        .json({ message: "Zu viele Anfragen – bitte später erneut versuchen." });
    }
    next();
  };
}

// Neue Session-ID nach erfolgreichem Login (Schutz vor Session-Fixation).
export function startAdminSession(req: Request, res: Response) {
  req.session.regenerate((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Authentication error" });
    }
    req.session.isAdmin = true;
    res.json({ success: true, message: "Login successful" });
  });
}
