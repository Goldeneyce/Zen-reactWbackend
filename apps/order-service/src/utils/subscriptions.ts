import { consumer } from "./kafka.ts";
import { createOrder } from "./order.ts";

export const runKafkaSubscriptions = async () => {
    consumer.subscribe("payment.successful", async (message) => {
        console.log("Received message: payment.successful", message);

        const order = message.value;
        await createOrder(order);
    });
};