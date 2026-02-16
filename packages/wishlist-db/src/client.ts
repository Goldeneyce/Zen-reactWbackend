import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

const connectionString = process.env["WISHLIST_DATABASE_URL"];

if (!connectionString) {
  throw new Error("WISHLIST_DATABASE_URL environment variable is not set");
}

const client = postgres(connectionString);

export const db = drizzle(client, { schema });
