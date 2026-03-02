import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// drizzle-kit uses its own internal pg client which doesn't accept custom CA certs.
// NODE_TLS_REJECT_UNAUTHORIZED=0 is safe here because drizzle-kit is a dev CLI tool only.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env["WISHLIST_DIRECT_URL"]!,
  },
});
