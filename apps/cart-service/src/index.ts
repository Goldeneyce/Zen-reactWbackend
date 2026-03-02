import Fastify from "fastify";
import cors from "@fastify/cors";
import { shouldBeUser } from "./middleware/authMiddleware.js";
import { consumer, producer } from "./utils/kafka.ts";
import { runKafkaSubscriptions } from "./utils/subscriptions.ts";
import { initRedis } from "./utils/redis.ts";
import { cartRoutes } from "./routes/cart.route.ts";

const fastify = Fastify();
await fastify.register(cors, { origin: true });

fastify.get("/health", (_request, reply) => {
  return reply.status(200).send({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

fastify.get("/test", { preHandler: shouldBeUser }, (request, reply) => {
  return reply.status(200).send({
    message: "Cart service authenticated successfully!",
    userId: request.userId,
  });
});

fastify.register(async (fastifyInstance) => {
  cartRoutes(fastifyInstance);
});

const start = async () => {
  try {
    initRedis();
    await Promise.all([consumer.connect(), producer.connect()]);
    await runKafkaSubscriptions();
    await fastify.listen({ port: Number(process.env.PORT ?? 8004), host: "0.0.0.0" });
    console.log(`Cart service is running on port ${process.env.PORT ?? 8004}`);
  } catch (err) {
    console.error(err);
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
