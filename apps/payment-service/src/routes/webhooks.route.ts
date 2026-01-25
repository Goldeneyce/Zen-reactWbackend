import { Hono } from "hono";
import crypto from "crypto";

const webhookSecret = process.env.PAYSTACK_SECRET_KEY as string;
const webhookRoute = new Hono();

webhookRoute.get("/", (c) => {
  return c.json({
    status: "ok webhook",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

/**
 * Paystack Webhook Handler
 * Handles payment notifications from Paystack
 * Events: charge.success, charge.failed, etc.
 */
webhookRoute.post("/paystack", async (c) => {
  const body = await c.req.text();
  const signature = c.req.header("x-paystack-signature");

  // Verify webhook signature using HMAC SHA512
  const hash = crypto
    .createHmac("sha512", webhookSecret)
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    console.log("Webhook verification failed!");
    return c.json({ error: "Webhook verification failed!" }, 400);
  }

  let event;
  try {
    event = JSON.parse(body);
  } catch (error) {
    console.error("Failed to parse webhook body:", error);
    return c.json({ error: "Invalid JSON" }, 400);
  }

  console.log("Paystack webhook event received:", event.event);

  switch (event.event) {
    case "charge.success":
      const data = event.data;

      console.log("Payment successful:", {
        reference: data.reference,
        amount: data.amount / 100, // Convert from kobo to naira
        email: data.customer?.email,
        status: data.status,
      });

      // Extract cart and user data from metadata
      const metadata = data.metadata || {};
      const cart = metadata.cart || [];

      // TODO: CREATE ORDER IN DATABASE
      // You can send this to a Kafka queue or directly create an order
      /*
      producer.send("payment.successful", {
        value: {
          userId: metadata.userId,
          email: data.customer?.email,
          amount: data.amount, // Amount in kobo
          status: data.status === "success" ? "success" : "failed",
          reference: data.reference,
          orderDate: metadata.orderDate,
          shippingDetails: {
            fullName: metadata.fullName,
            phone: metadata.phone,
            address: metadata.address,
            city: metadata.city,
            state: metadata.state,
          },
          products: cart.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      });
      */

      console.log("Order details:", {
        userId: metadata.userId,
        email: data.customer?.email,
        amount: data.amount / 100,
        reference: data.reference,
        cart: cart,
        shipping: {
          fullName: metadata.fullName,
          phone: metadata.phone,
          address: metadata.address,
          city: metadata.city,
          state: metadata.state,
        },
      });

      break;

    case "charge.failed":
      console.log("Payment failed:", {
        reference: event.data.reference,
        message: event.data.gateway_response,
      });
      break;

    default:
      console.log("Unhandled webhook event:", event.event);
      break;
  }

  return c.json({ received: true });
});

export default webhookRoute;