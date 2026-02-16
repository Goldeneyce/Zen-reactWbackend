import fastify from "fastify";
import cors from "@fastify/cors";
import sessionRoute from "./routes/session.route.js";
import webhookRoute from "./routes/webhooks.route.js";
import { consumer, producer } from './utils/kafka.js';
import { runKafkaSubscriptions } from './utils/subscriptions.js';

const app = fastify({ logger: false });

app.get("/health", async () => {
  return {
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  };
});

const start = async () => {
  try {
    // Register plugins
    await app.register(cors, { origin: ["http://localhost:3002"] });
    await app.register(sessionRoute, { prefix: "/sessions" });
    await app.register(webhookRoute, { prefix: "/webhooks" });
    
    // Connect to Kafka
    await Promise.all([
      consumer.connect(), 
      producer.connect()
    ]);
    await runKafkaSubscriptions();
    
    // Start server
    await app.listen({ port: 8002, host: "0.0.0.0" });
    console.log("Payment service is running on 0.0.0.0:8002");
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
}

start();
