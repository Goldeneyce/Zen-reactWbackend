import { createRedisClient, CacheHelper } from "@repo/shared-redis";

let cache: CacheHelper;

export const initRedis = () => {
  const redis = createRedisClient({ keyPrefix: "history:" });
  cache = new CacheHelper(redis);
};

export const getCache = (): CacheHelper => {
  if (!cache) throw new Error("Redis not initialised – call initRedis() first");
  return cache;
};
