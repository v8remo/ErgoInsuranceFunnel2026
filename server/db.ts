import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Standard-Postgres-Treiber: funktioniert mit Supabase (Pooler), Neon und der
// Replit/Neon-URL gleichermaßen. In der Serverless Function hält jede Instanz
// nur wenige Verbindungen – das eigentliche Pooling übernimmt der Anbieter
// (Supavisor bzw. Neon-Pooler).
// rejectUnauthorized: false, weil Supabase-Direktverbindungen ein Zertifikat
// einer eigenen CA nutzen; die Verbindung bleibt TLS-verschlüsselt.
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 3,
  ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL)
    ? undefined
    : { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });
