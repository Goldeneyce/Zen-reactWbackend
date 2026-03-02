import { consumer } from "./kafka.ts";

/**
 * Subscribe to Kafka topics relevant to logistics/shipping.
 * Add handlers here as the service grows.
 */
export const runKafkaSubscriptions = async () => {
  await consumer.subscribe([
    {
      topicName: "order-placed",
      topicHandler: async (message: any) => {
        // The @repo/kafka wrapper already JSON-parses the message value,
        // but handle both parsed-object and raw-string cases defensively.
        const parsed = typeof message === "string" ? JSON.parse(message) : message;
        const payload = typeof parsed.value === "string" ? JSON.parse(parsed.value) : parsed;
        console.log("[logistics] Order placed – will create shipment for:", payload.orderId);
        // TODO: auto-create a Shipment record for the new order
      },
    },
  ]);
};
