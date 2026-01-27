import { consumer } from "./kafka.ts";
import { ProductType } from "@repo/types";
import { productCache } from "./productCache.ts";

export const runKafkaSubscriptions = async () => {
    consumer.subscribe("product.created", async (message) => {
        try {
            const product = JSON.parse(message.value) as ProductType;
            console.log("📦 Received product.created event:", product.name);
            
            // Update local cache
            productCache.set(product);
        } catch (error) {
            console.error("Error handling product.created event:", error);
        }
    });

    consumer.subscribe("product.updated", async (message) => {
        try {
            const product = JSON.parse(message.value) as ProductType;
            console.log("🔄 Received product.updated event:", product.name);
            
            // Update local cache with new data (including price changes)
            productCache.set(product);
        } catch (error) {
            console.error("Error handling product.updated event:", error);
        }
    });

    consumer.subscribe("product.deleted", async (message) => {
        try {
            const productId = JSON.parse(message.value) as string;
            console.log("🗑️  Received product.deleted event:", productId);
            
            // Remove from local cache
            productCache.delete(productId);
        } catch (error) {
            console.error("Error handling product.deleted event:", error);
        }
    });

    console.log("🎧 Kafka subscriptions initialized - listening for product events");
}