import { consumer } from "./kafka.ts";
import { getCache } from "./redis.ts";

/**
 * Kafka subscriptions to solve the "Stale Price" problem.
 *
 * Whenever a product is created / updated / deleted in the product-service,
 * the price cache inside Redis is updated so that the cart always reflects
 * the latest price without having to call the product service on every request.
 */
export const runKafkaSubscriptions = async () => {
  await consumer.subscribe([
    {
      topicName: "product.created",
      topicHandler: async (message: any) => {
        const product = typeof message === "string" ? JSON.parse(message) : message;
        const parsed = typeof product.value === "string" ? JSON.parse(product.value) : product;
        if (parsed.id && parsed.price != null) {
          await getCache().cacheProductPrice(parsed.id, parsed.price, parsed.name ?? "");
          console.log(`[cart] Cached price for product ${parsed.id}`);
        }
      },
    },
    {
      topicName: "product.updated",
      topicHandler: async (message: any) => {
        const product = typeof message === "string" ? JSON.parse(message) : message;
        const parsed = typeof product.value === "string" ? JSON.parse(product.value) : product;
        if (parsed.id && parsed.price != null) {
          await getCache().cacheProductPrice(parsed.id, parsed.price, parsed.name ?? "");
          console.log(`[cart] Updated cached price for product ${parsed.id}`);
        }
      },
    },
    {
      topicName: "product.deleted",
      topicHandler: async (message: any) => {
        const product = typeof message === "string" ? JSON.parse(message) : message;
        const parsed = typeof product.value === "string" ? JSON.parse(product.value) : product;
        if (parsed.id) {
          await getCache().removeProductPrice(parsed.id);
          console.log(`[cart] Removed cached price for product ${parsed.id}`);
        }
      },
    },
  ]);
};
