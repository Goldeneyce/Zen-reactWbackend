import * as dotenv from "dotenv";
dotenv.config();
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Local SQLite file used by Prisma CLI for migrations (prisma migrate dev).
    // At runtime, the actual Turso connection is handled by the adapter in client.ts.
    url: "file:./prisma/dev.db",
  },
  migrations: {
    path: "prisma/migrations",
  },
});
