import { createRedisClient, CacheHelper } from "@repo/shared-redis";
import Redis from "ioredis";
import Redlock from "redlock";

let cache: CacheHelper;
let rawRedis: Redis;
let redlock: Redlock;

export const initRedis = () => {
  rawRedis = createRedisClient({ keyPrefix: "inv:" });
  cache = new CacheHelper(rawRedis);

  // Redlock needs a raw ioredis client **without** a keyPrefix,
  // because lock keys must be written exactly as supplied.
  const lockClient = createRedisClient();
  redlock = new Redlock([lockClient], {
    retryCount: 5,
    retryDelay: 200,   // ms between retries
    retryJitter: 100,  // random jitter added to retry delay
  });
};

export const getCache = (): CacheHelper => {
  if (!cache) throw new Error("Redis not initialised – call initRedis() first");
  return cache;
};

export const getRawRedis = (): Redis => {
  if (!rawRedis) throw new Error("Redis not initialised – call initRedis() first");
  return rawRedis;
};

export const getRedlock = (): Redlock => {
  if (!redlock) throw new Error("Redis not initialised – call initRedis() first");
  return redlock;
};
