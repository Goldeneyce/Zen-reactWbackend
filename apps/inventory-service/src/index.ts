import Fastify from "fastify";
import cors from "@fastify/cors";
import { shouldBeUser, shouldBeAdmin } from "./middleware/authMiddleware.ts";
import { consumer, producer } from "./utils/kafka.ts";
import { runKafkaSubscriptions } from "./utils/subscriptions.ts";
import { initRedis } from "./utils/redis.ts";
import { inventoryRoutes } from "./routes/inventory.route.ts";

const fastify = Fastify({ logger: true });
await fastify.register(cors, { origin: true });

/* ─── Health check ─── */
fastify.get("/health", (_request, reply) => {
  return reply.status(200).send({
    status: "ok",
    service: "inventory-service",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

/* ─── Auth smoke-test ─── */
fastify.get("/test", { preHandler: shouldBeUser }, (request, reply) => {
  return reply.status(200).send({
    message: "Inventory service authenticated successfully!",
    userId: request.userId,
  });
});

/* ─── Routes ─── */
fastify.register(async (instance) => {
  inventoryRoutes(instance);
});

/* ─── Boot ─── */
const start = async () => {
  try {
    initRedis();
    await Promise.all([consumer.connect(), producer.connect()]);
    await runKafkaSubscriptions();
    await fastify.listen({ port: 8010 });
    console.log("Inventory service is running on port 8010");
  } catch (err) {
    console.error(err);
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
