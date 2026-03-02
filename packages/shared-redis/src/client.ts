import { Redis } from "@upstash/redis";

let redisInstance: Redis | null = null;

export interface RedisConfig {
  url?: string;
  token?: string;
  keyPrefix?: string;
}

export const createRedisClient = (config?: RedisConfig): Redis => {
  const url = config?.url ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = config?.token ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN env vars"
    );
  }

  const client = new Redis({ url, token });

  console.log(`[Redis] Client created (prefix: ${config?.keyPrefix ?? "none"})`);
  return client;
};

export const getSharedRedis = (config?: RedisConfig): Redis => {
  if (!redisInstance) {
    redisInstance = createRedisClient(config);
  }
  return redisInstance;
};
