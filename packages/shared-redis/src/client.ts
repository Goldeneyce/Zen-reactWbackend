import { Redis } from "ioredis";

let redisInstance: Redis | null = null;

export interface RedisConfig {
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
}

export const createRedisClient = (config?: RedisConfig): Redis => {
  const client = new Redis({
    host: config?.host ?? process.env.REDIS_HOST ?? "localhost",
    port: config?.port ?? Number(process.env.REDIS_PORT ?? 6379),
    password: config?.password ?? process.env.REDIS_PASSWORD ?? undefined,
    db: config?.db ?? Number(process.env.REDIS_DB ?? 0),
    keyPrefix: config?.keyPrefix ?? "",
    maxRetriesPerRequest: 3,
    retryStrategy(times: number) {
      const delay = Math.min(times * 200, 5000);
      return delay;
    },
  });

  client.on("connect", () => console.log(`[Redis] Connected (prefix: ${config?.keyPrefix ?? "none"})`));
  client.on("error", (err: Error) => console.error("[Redis] Error:", err.message));

  return client;
};

export const getSharedRedis = (config?: RedisConfig): Redis => {
  if (!redisInstance) {
    redisInstance = createRedisClient(config);
  }
  return redisInstance;
};
