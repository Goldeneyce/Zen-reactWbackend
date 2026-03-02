import Fastify from "fastify";
import cors from "@fastify/cors";
import { connectReviewDb } from "@repo/review-db";
import { shouldBeUser, shouldBeAdmin } from "./middleware/authMiddleware.ts";
import { reviewRoutes } from "./routes/review.route.ts";

const fastify = Fastify({ logger: true });
await fastify.register(cors, { origin: true });

/* ─── Health check ─── */
fastify.get("/health", (_request, reply) => {
  return reply.status(200).send({
    status: "ok",
    service: "review-service",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

/* ─── Auth smoke-test ─── */
fastify.get("/test", { preHandler: shouldBeUser }, (request, reply) => {
  return reply.status(200).send({
    message: "Review service authenticated successfully!",
    userId: request.userId,
  });
});

/* ─── Routes ─── */
fastify.register(async (instance) => {
  reviewRoutes(instance);
});

/* ─── Boot ─── */
const start = async () => {
  try {
    await connectReviewDb();
    await fastify.listen({ port: Number(process.env.PORT ?? 8020), host: "0.0.0.0" });
    console.log(`Review service is running on port ${process.env.PORT ?? 8020}`);
  } catch (err) {
    console.error(err);
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
