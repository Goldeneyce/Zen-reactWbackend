import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { clerkMiddleware} from '@hono/clerk-auth'
import sessionRoute from './routes/session.route.ts';
import { cors } from 'hono/cors';

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

app.route('/session', sessionRoute);

//getting product price from product db and not cart page.
// app.get("/pay", shouldBeUser, async (c) => {

//   const {products} = await c.req.json()

//   const totalPrice = await Promise.all(
//     products.map(async (product:any)=>{
//       const productsInDb:any = await fetch ("Localhost:8000/products{product.id}");
//       return productsInDb.price * product.quantity;
//     })
//   );

//     return c.json({
//       message: "Payment service is Authenticated", userId:c.get("userId")
//     })
// });

// app.post('/create-payment-page', async (c) => {

//   const res = await stripe.products.create({
//     id:"234",
//     name:"Test Product",
//     default_price_data: {
//       currency: 'ngn',
//       unit_amount: 10*100,
//     },
//   });

//   return c.json(res);
  
// });

// app.get('/stripe-product-price', async (c) => {

//   const res = await stripe.prices.list({
//     product: '234',
//   });

//   return c.json(res);
  
// });

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
