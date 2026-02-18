import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

const connectionString = process.env["WISHLIST_DATABASE_URL"];

if (!connectionString) {
  throw new Error("WISHLIST_DATABASE_URL environment variable is not set");
}

/* ── SSL certificate for verify-full ── */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const certPath = path.resolve(__dirname, "..", "certs", "prod-ca-2021.crt");

const sslOptions = fs.existsSync(certPath)
  ? { ssl: { rejectUnauthorized: true, ca: fs.readFileSync(certPath, "utf-8") } }
  : {};

const client = postgres(connectionString, {
  ...sslOptions,
});

export const db = drizzle(client, { schema });
