import { createConsumer, createKafkaClient, createProducer } from "@repo/kafka";

const kafkaClient = createKafkaClient("history-service");

export const producer = createProducer(kafkaClient);
export const consumer = createConsumer(kafkaClient, "history-group");
