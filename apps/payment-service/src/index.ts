import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { clerkMiddleware} from '@hono/clerk-auth'
import sessionRoute from './routes/session.route.js';
import webhookRoute from './routes/webhooks.route.js';
import { cors } from 'hono/cors';
import { consumer, producer, } from './utils/kafka.ts';
import { runKafkaSubscriptions } from './utils/subscriptions.ts';

const app = new Hono()
app.use('*', clerkMiddleware());
app.use('*', cors({ origin: ["http://localhost:3002"] }));

app.get('/health', (c) => {
  return c.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.route('/sessions', sessionRoute);
app.route('/webhooks', webhookRoute);

const start = async () => {
  try {
    	await Promise.all([
        consumer.connect(), 
        producer.connect()]
      );
      await runKafkaSubscriptions();
      serve({
        fetch: app.fetch,
        port: 8002
      }, (info) => {
      console.log(`Payment service is running on ${info.address}:${info.port}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
}

start();
