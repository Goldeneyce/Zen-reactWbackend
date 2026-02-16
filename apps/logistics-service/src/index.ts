import Fastify from "fastify";
import cors from "@fastify/cors";
import { shouldBeUser, shouldBeAdmin } from "./middleware/authMiddleware.ts";
import { consumer, producer } from "./utils/kafka.ts";
import { runKafkaSubscriptions } from "./utils/subscriptions.ts";
import { initRedis } from "./utils/redis.ts";
import { logisticsRoutes } from "./routes/logistics.route.ts";

const fastify = Fastify({ logger: true });
await fastify.register(cors, { origin: true });

/* ─── Health check ─── */
fastify.get("/health", (_request, reply) => {
  return reply.status(200).send({
    status: "ok",
    service: "logistics-service",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

/* ─── Auth smoke-test ─── */
fastify.get("/test", { preHandler: shouldBeUser }, (request, reply) => {
  return reply.status(200).send({
    message: "Logistics service authenticated successfully!",
    userId: request.userId,
  });
});

/* ─── Routes ─── */
fastify.register(async (instance) => {
  logisticsRoutes(instance);
});

/* ─── Boot ─── */
const start = async () => {
  try {
    initRedis();
    await Promise.all([consumer.connect(), producer.connect()]);
    await runKafkaSubscriptions();
    await fastify.listen({ port: 8011 });
    console.log("Logistics service is running on port 8011");
  } catch (err) {
    console.error(err);
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
