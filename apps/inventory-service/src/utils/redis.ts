import { createRedisClient, CacheHelper } from "@repo/shared-redis";
import type { Redis } from "@upstash/redis";

let cache: CacheHelper;
let rawRedis: Redis;

export const initRedis = () => {
  rawRedis = createRedisClient();
  cache = new CacheHelper(rawRedis, "inv:");
};

export const getCache = (): CacheHelper => {
  if (!cache) throw new Error("Redis not initialised – call initRedis() first");
  return cache;
};

export const getRawRedis = (): Redis => {
  if (!rawRedis) throw new Error("Redis not initialised – call initRedis() first");
  return rawRedis;
};

/**
 * Simple distributed lock using Upstash SET NX.
 * Replaces Redlock (which requires ioredis TCP connections).
 */
export const acquireLock = async (
  resource: string,
  ttlMs: number,
  retries = 5,
  retryDelay = 200,
): Promise<{ release: () => Promise<void> }> => {
  const lockKey = `lock:${resource}`;
  const lockValue = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const ttlSec = Math.ceil(ttlMs / 1000);

  for (let i = 0; i < retries; i++) {
    const result = await rawRedis.set(lockKey, lockValue, { nx: true, ex: ttlSec });
    if (result === "OK") {
      return {
        release: async () => {
          // Only release if we still own the lock
          const current = await rawRedis.get(lockKey);
          if (current === lockValue) {
            await rawRedis.del(lockKey);
          }
        },
      };
    }
    // Wait before retry with jitter
    await new Promise((r) => setTimeout(r, retryDelay + Math.random() * 100));
  }
  throw new Error(`Could not acquire lock on ${resource} after ${retries} retries`);
};
