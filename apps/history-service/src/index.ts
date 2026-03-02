import { serve } from "@hono/node-server";
import { Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { cors } from "hono/cors";
import { shouldBeUser } from "./middleware/authMiddleware.js";
import wishlistRouter from "./routes/wishlist.route.js";
import historyRouter from "./routes/history.route.js";
import { consumer, producer } from "./utils/kafka.ts";
import { runKafkaSubscriptions } from "./utils/subscriptions.ts";
import { initRedis } from "./utils/redis.ts";

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
      ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : []),
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
    message: "History service authenticated successfully",
    userId: c.get("userId"),
  });
});

app.route("/wishlist", wishlistRouter);
app.route("/history", historyRouter);

app.onError((err, c) => {
  console.error(err);
  const status = ((err as { status?: number })?.status ?? 500) as ContentfulStatusCode;
  return c.json({ message: (err as Error)?.message || "Internal Server Error" }, status);
});

const start = async () => {
  try {
    initRedis();
    await Promise.all([consumer.connect(), producer.connect()]);
    await runKafkaSubscriptions();

    serve(
      { fetch: app.fetch, port: Number(process.env.PORT ?? 8003), hostname: "0.0.0.0" },
      (info) => {
        console.log(`History service listening on ${info.address}:${info.port}`);
      }
    );
  } catch (error) {
    console.error("Error starting history service:", error);
    process.exit(1);
  }
};

start();
