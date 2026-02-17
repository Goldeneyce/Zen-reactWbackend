import type { FastifyPluginAsync } from "fastify";
import crypto from "crypto";
import { producer } from "../utils/kafka.ts";

const webhookSecret = process.env.PAYSTACK_SECRET_KEY as string;
const webhookRoute: FastifyPluginAsync = async (app) => {
  app.get("/", async () => {
    return {
      status: "ok webhook",
      uptime: process.uptime(),
      timestamp: Date.now(),
    };
  });

  /**
   * Paystack Webhook Handler
   * Handles payment notifications from Paystack
   * Events: charge.success, charge.failed, etc.
   */
  app.post(
    "/paystack",
    { config: { rawBody: true } },
    async (request, reply) => {
      const body = request.rawBody || "";
      const signature = request.headers["x-paystack-signature"] as string | undefined;

      const hash = crypto
        .createHmac("sha512", webhookSecret)
        .update(body)
        .digest("hex");

      if (hash !== signature) {
        console.log("Webhook verification failed!");
        return reply.code(400).send({ error: "Webhook verification failed!" });
      }

      let event: any;
      try {
        event = JSON.parse(body);
      } catch (error) {
        console.error("Failed to parse webhook body:", error);
        return reply.code(400).send({ error: "Invalid JSON" });
      }

      console.log("Paystack webhook event received:", event.event);

      switch (event.event) {
        case "charge.success": {
          const data = event.data;

          console.log("Payment successful:", {
            reference: data.reference,
            amount: data.amount / 100,
            email: data.customer?.email,
            status: data.status,
          });

          const metadata = data.metadata || {};
          const cart = metadata.cart || [];

          producer.send("payment.successful", {
            value: {
              userId: metadata.userId,
              email: data.customer?.email,
              amount: data.amount,
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
              shippingMethodId: metadata.shipping_method_id || "",
              shippingCost: Number(metadata.shipping_cost) || 0,
              products: cart.map((item: any) => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price,
              })),
            },
          });

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
        }

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

      return reply.send({ received: true });
    }
  );
};

export default webhookRoute;