import { createRedisClient, CacheHelper } from "@repo/shared-redis";
import type { Redis } from "@upstash/redis";

let cache: CacheHelper;
let rawRedis: Redis;

export const initRedis = () => {
  rawRedis = createRedisClient();
  cache = new CacheHelper(rawRedis, "logistics:");
};

export const getCache = (): CacheHelper => {
  if (!cache) throw new Error("Redis not initialised – call initRedis() first");
  return cache;
};

export const getRawRedis = (): Redis => {
  if (!rawRedis)
    throw new Error("Redis not initialised – call initRedis() first");
  return rawRedis;
};
