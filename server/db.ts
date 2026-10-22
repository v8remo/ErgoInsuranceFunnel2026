import path from "path";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Standard-Postgres-Treiber für die eigene Datenbank (Docker-Compose-Dienst
// "db"). TLS steuert die URL selbst, z. B. `?sslmode=require` für eine
// externe Datenbank.
export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

// Spielt beim Start alle noch fehlenden SQL-Migrationen aus migrations/ ein.
export function runMigrations() {
  return migrate(db, { migrationsFolder: path.resolve(process.cwd(), "migrations") });
}
