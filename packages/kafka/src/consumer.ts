import type { Consumer, Kafka } from "kafkajs";

export const createConsumer = (kafka: Kafka, groupId: string) => {
    const consumer: Consumer = kafka.consumer({ groupId });
    let connected = false;

    const connect = async () => {
        try {
            await consumer.connect();
            connected = true;
            console.log(`[Kafka] Consumer connected — group: ${groupId}`);
        } catch (error) {
            connected = false;
            console.warn(`[Kafka] Consumer failed to connect (group: ${groupId}) — running without Kafka. Events will not be consumed.`, (error as Error).message);
        }
    };

    const subscribe = async (
        topics: {
            topicName: string;
            topicHandler: (message: any) => Promise<void>;
        }[]
    ) => {
        if (!connected) {
            console.warn(`[Kafka] Consumer not connected — skipping subscriptions for group "${groupId}":`, topics.map((t) => t.topicName).join(", "));
            return;
        }

        // Subscribe to each topic individually so a missing topic (e.g. not yet
        // created on the free tier) doesn't prevent other topics from working.
        const activatedTopics: typeof topics = [];
        for (const topic of topics) {
            try {
                await consumer.subscribe({ topics: [topic.topicName], fromBeginning: true });
                activatedTopics.push(topic);
                console.log(`[Kafka] Subscribed to topic "${topic.topicName}"`);
            } catch (error) {
                console.warn(`[Kafka] Could not subscribe to topic "${topic.topicName}" — skipping. (Topic may not exist yet)`, (error as Error).message);
            }
        }

        if (activatedTopics.length === 0) {
            console.warn(`[Kafka] No topics could be subscribed for group "${groupId}" — consumer.run() skipped.`);
            return;
        }

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const topicConfig = activatedTopics.find((t) => t.topicName === topic);
                    if (topicConfig) {
                        const value = message.value?.toString();
                        if (value) {
                            await topicConfig.topicHandler(JSON.parse(value));
                        }
                    }
                } catch (error) {
                    console.log(`[Kafka] Error processing message on topic "${topic}":`, error);
                }
            },
        });
    };

    const disconnect = async () => {
        if (!connected) return;
        try {
            await consumer.disconnect();
            connected = false;
        } catch (error) {
            console.warn("[Kafka] Error disconnecting consumer:", (error as Error).message);
        }
    };

    return {
        connect,
        subscribe,
        disconnect,
    };
}