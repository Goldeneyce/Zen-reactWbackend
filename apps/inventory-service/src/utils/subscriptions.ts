import { consumer } from "./kafka.ts";
import { reserveStock, releaseStock, commitStock } from "../controllers/inventory.controller.ts";

/**
 * Subscribe to Kafka topics that other services publish to.
 *
 *  • order.created   → reserve stock
 *  • order.cancelled → release the reservation
 *  • order.paid      → commit (convert reservation into outbound)
 */
export const runKafkaSubscriptions = async () => {
  await consumer.subscribe([
    {
      topicName: "order.created",
      topicHandler: async (message) => {
        const data = JSON.parse(message.value?.toString() ?? "{}");
        console.log("[Kafka] order.created →", data);
        await reserveStock(data);
      },
    },
    {
      topicName: "order.cancelled",
      topicHandler: async (message) => {
        const data = JSON.parse(message.value?.toString() ?? "{}");
        console.log("[Kafka] order.cancelled →", data);
        await releaseStock(data);
      },
    },
    {
      topicName: "order.paid",
      topicHandler: async (message) => {
        const data = JSON.parse(message.value?.toString() ?? "{}");
        console.log("[Kafka] order.paid →", data);
        await commitStock(data);
      },
    },
  ]);
};
