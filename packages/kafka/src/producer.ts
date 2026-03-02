import type { Kafka, Producer } from "kafkajs";

export const createProducer = (kafka: Kafka) => {
    const producer: Producer = kafka.producer();
    let connected = false;

    const connect = async () => {
        try {
            await producer.connect();
            connected = true;
            console.log("[Kafka] Producer connected");
        } catch (error) {
            connected = false;
            console.warn("[Kafka] Producer failed to connect — running without Kafka. Events will not be published.", (error as Error).message);
        }
    };

    const send = async (topic: string, messages: object) => {
        if (!connected) {
            console.warn(`[Kafka] Producer not connected — skipping event on topic "${topic}"`);
            return;
        }
        try {
            await producer.send({
                topic,
                messages: [{ value: JSON.stringify(messages) }],
            });
        } catch (error) {
            console.warn(`[Kafka] Failed to send message to topic "${topic}":`, (error as Error).message);
        }
    };

    const disconnect = async () => {
        if (!connected) return;
        try {
            await producer.disconnect();
            connected = false;
        } catch (error) {
            console.warn("[Kafka] Error disconnecting producer:", (error as Error).message);
        }
    };

    return {
        connect,
        send,
        disconnect,
    };
}