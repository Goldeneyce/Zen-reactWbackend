import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { clerkMiddleware} from '@hono/clerk-auth'
import { shouldBeUser } from './middleware/authMiddleware.js';

const app = new Hono()
app.use('*', clerkMiddleware())

app.get('/health', (c) => {
  return c.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.get('/test', shouldBeUser, (c) => {
  

  return c.json({
    message: "Payment service authenticated successfully!", userId:c.get("userId")
  });
});

const start = async () => {
  try {
    serve({
  fetch: app.fetch,
  port: 8002
}, (info) => {
  console.log(`Payment service is running on ${info.address}:${info.port}`);
}
);
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
}

start();
