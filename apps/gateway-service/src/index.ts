import { serve } from "@hono/node-server";
import { Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { cors } from "hono/cors";
import { shouldBeUser } from "./middleware/authMiddleware.js";
import wishlistAggRouter from "./routes/wishlist.agg.route.js";
import cartAggRouter from "./routes/cart.agg.route.js";
import historyAggRouter from "./routes/history.agg.route.js";
import inventoryAggRouter from "./routes/inventory.agg.route.js";
import productAdminAggRouter from "./routes/productAdmin.agg.route.js";

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

app.get("/test", shouldBeUser, (c) => {
  return c.json({
    message: "Gateway service authenticated successfully",
    userId: c.get("userId"),
  });
});

// Aggregation routes
app.route("/api/wishlist", wishlistAggRouter);
app.route("/api/cart", cartAggRouter);
app.route("/api/history", historyAggRouter);
app.route("/api/inventory", inventoryAggRouter);
app.route("/api/product-admin", productAdminAggRouter);

app.onError((err, c) => {
  console.error(err);
  const status = ((err as { status?: number })?.status ?? 500) as ContentfulStatusCode;
  return c.json({ message: (err as Error)?.message || "Internal Server Error" }, status);
});

const PORT = Number(process.env.GATEWAY_PORT ?? 8005);

serve(
  { fetch: app.fetch, port: PORT, hostname: "0.0.0.0" },
  (info) => {
    console.log(`Gateway/BFF service listening on ${info.address}:${info.port}`);
  }
);
