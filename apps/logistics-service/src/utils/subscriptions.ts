import { consumer } from "./kafka.ts";

/**
 * Subscribe to Kafka topics relevant to logistics/shipping.
 * Add handlers here as the service grows.
 */
export const runKafkaSubscriptions = async () => {
  // Example: listen for order-placed events to auto-create shipments
  await consumer.subscribe({
    topic: "order-placed",
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const value = message.value?.toString();
      if (!value) return;

      console.log(`[logistics] Received message on "${topic}"`);

      switch (topic) {
        case "order-placed": {
          // TODO: auto-create a Shipment record for the new order
          const payload = JSON.parse(value);
          console.log("[logistics] Order placed – will create shipment for:", payload.orderId);
          break;
        }
        default:
          break;
      }
    },
  });
};
