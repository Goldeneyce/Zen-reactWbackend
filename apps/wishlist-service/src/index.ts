import { serve } from "@hono/node-server";
import { Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { cors } from "hono/cors";
import wishlistRouter from "./routes/wishlist.route.js";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: [
      "http://localhost:3002",
      "http://localhost:3003",
      "http://localhost:3004",
      "http://192.168.0.152:3002",
      "http://192.168.0.152:3003",
      "http://192.168.0.152:3004",
    ],
    credentials: true,
  })
);

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.route("/wishlist", wishlistRouter);

app.onError((err, c) => {
  console.error(err);
  const status = ((err as { status?: number })?.status ?? 500) as ContentfulStatusCode;
  return c.json({ message: (err as Error)?.message || "Internal Server Error" }, status);
});

const PORT = Number(process.env.WISHLIST_SERVICE_PORT ?? 8006);

serve(
  { fetch: app.fetch, port: PORT, hostname: "0.0.0.0" },
  (info) => {
    console.log(`Wishlist service listening on ${info.address}:${info.port}`);
  }
);
