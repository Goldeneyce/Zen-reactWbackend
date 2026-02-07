import { createRedisClient, CacheHelper } from "@repo/shared-redis";
import Redis from "ioredis";

let cache: CacheHelper;
let rawRedis: Redis;

export const initRedis = () => {
  rawRedis = createRedisClient({ keyPrefix: "logistics:" });
  cache = new CacheHelper(rawRedis);
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
