import { createKafkaClient, createConsumer, createProducer } from "@repo/kafka";

const kafka = createKafkaClient("user-service");
export const consumer = createConsumer(kafka, "user-service-group");
export const producer = createProducer(kafka);
