import Fastify from 'fastify';
import cors from '@fastify/cors';
import { clerkPlugin} from '@clerk/fastify'
import { shouldBeUser } from './middleware/authMiddleware.js';
import { connectOrderDB } from '@repo/order-db';

const fastify = Fastify();
await fastify.register(cors, {
  origin: true
});
fastify.register(clerkPlugin);

fastify.get('/health', (request,reply) => {
  return reply.status(200).send({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});
fastify.get('/test', {preHandler: shouldBeUser}, (request,reply) => {

  return reply.status(200).send({
    message: "Order service authenticated successfully!",userId: request.userId
  });
});

fastify.register( async (fastifyInstance) => {
  await import('./routes/order.js').then( (module) => {
    module.orderRoutes(fastifyInstance);
  });
});

const start = async () => {
  try {
    await connectOrderDB();
    await fastify.listen({ port: 8001 });
    console.log('Order service is running on port 8001');
  } catch (err) {
    console.log(err);
    fastify.log.error(err);
    process.exit(1);
  }
};

start();