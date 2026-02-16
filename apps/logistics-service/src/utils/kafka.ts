import { createConsumer, createKafkaClient, createProducer } from "@repo/kafka";

const kafkaClient = createKafkaClient("logistics-service");

export const producer = createProducer(kafkaClient);
export const consumer = createConsumer(kafkaClient, "logistics-group");
