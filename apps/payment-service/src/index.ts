import { serve } from '@hono/node-server'
import { ok } from 'assert';
import { Hono } from 'hono'

const app = new Hono()

app.get('/health', (c) => {
  return c.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
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
