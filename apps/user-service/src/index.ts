import fastify, { type FastifyError } from "fastify";
import cors from "@fastify/cors";
import { shouldBeUser } from "./middleware/authMiddleware.js";
import profileRoute from "./routes/profile.route.js";
import addressRoute from "./routes/address.route.js";
import preferencesRoute from "./routes/preferences.route.js";
import { consumer, producer } from "./utils/kafka.js";

const app = fastify({
  logger: true,
});

await app.register(cors, {
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
});

app.get("/health", async (request, reply) => {
  return reply.send({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.register(profileRoute, { prefix: "/profile" });
app.register(addressRoute, { prefix: "/addresses" });
app.register(preferencesRoute, { prefix: "/preferences" });

app.setErrorHandler((error: FastifyError, request, reply) => {
  console.log(error);
  const status = error.statusCode ?? 500;
  reply.status(status).send({
    message: error.message || "Internal Server Error",
  });
});

const start = async () => {
  try {
    await Promise.all([consumer.connect(), producer.connect()]);

    await app.listen({
      port: Number(process.env.PORT ?? 8004),
      host: "0.0.0.0",
    });

    console.log(`User service listening on 0.0.0.0:${process.env.PORT ?? 8004}`);
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

start();
