import { consumer } from "./kafka.ts";
import { getCache } from "./redis.ts";

/**
 * Subscribe to Kafka topics that keep the local product-price
 * cache in sync, solving the "Stale Price" problem.
 *
 * When a product is created / updated / deleted in the product-service
 * the corresponding Kafka event is consumed here and the cached price
 * in Redis is updated immediately.
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
          console.log(`[history] Cached price for product ${parsed.id}`);
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
          console.log(`[history] Updated cached price for product ${parsed.id}`);
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
          console.log(`[history] Removed cached price for product ${parsed.id}`);
        }
      },
    },
  ]);
};
