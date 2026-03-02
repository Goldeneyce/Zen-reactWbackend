import { Kafka } from "kafkajs";
import fs from "fs";

export const createKafkaClient = (service: string) => {
    const broker = process.env.KAFKA_BROKER;
    const username = process.env.KAFKA_USERNAME;
    const password = process.env.KAFKA_PASSWORD;

    // Upstash (production): SASL/SSL required
    if (broker && username && password) {
        return new Kafka({
            clientId: service,
            brokers: [broker],
            ssl: true,
            sasl: {
                mechanism: "scram-sha-256",
                username,
                password,
            },
        });
    }

    // Aiven (mTLS): SSL with client certificates
    const caPath = process.env.KAFKA_SSL_CA_PATH;
    const certPath = process.env.KAFKA_SSL_CERT_PATH;
    const keyPath = process.env.KAFKA_SSL_KEY_PATH;

    if (broker && caPath && certPath && keyPath) {
        return new Kafka({
            clientId: service,
            brokers: [broker],
            ssl: {
                ca: [fs.readFileSync(caPath, "utf-8")],
                cert: fs.readFileSync(certPath, "utf-8"),
                key: fs.readFileSync(keyPath, "utf-8"),
            },
        });
    }

    // Local development: plain brokers, no auth
    return new Kafka({
        clientId: service,
        brokers: ["localhost:9094", "localhost:9095", "localhost:9096"],
    });
};