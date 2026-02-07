import type { Redis } from "ioredis";

/**
 * Generic cache helper that wraps common Redis patterns
 * used by history-service and cart-service.
 */
export class CacheHelper {
  constructor(private readonly redis: Redis) {}

  /* ─── key/value helpers ─── */

  async get<T = unknown>(key: string): Promise<T | null> {
    const raw = await this.redis.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await this.redis.set(key, serialized, "EX", ttlSeconds);
    } else {
      await this.redis.set(key, serialized);
    }
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  /* ─── hash helpers (cart items) ─── */

  async hget<T = unknown>(key: string, field: string): Promise<T | null> {
    const raw = await this.redis.hget(key, field);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  }

  async hset(key: string, field: string, value: unknown): Promise<void> {
    await this.redis.hset(key, field, JSON.stringify(value));
  }

  async hdel(key: string, field: string): Promise<void> {
    await this.redis.hdel(key, field);
  }

  async hgetall<T = unknown>(key: string): Promise<Record<string, T>> {
    const raw = await this.redis.hgetall(key);
    const result: Record<string, T> = {};
    for (const [field, value] of Object.entries(raw)) {
      result[field] = JSON.parse(value as string) as T;
    }
    return result;
  }

  /* ─── list helpers (history) ─── */

  async lpush(key: string, value: unknown): Promise<void> {
    await this.redis.lpush(key, JSON.stringify(value));
  }

  async lrange<T = unknown>(key: string, start: number, stop: number): Promise<T[]> {
    const raw = await this.redis.lrange(key, start, stop);
    return raw.map((item: string) => JSON.parse(item) as T);
  }

  async ltrim(key: string, start: number, stop: number): Promise<void> {
    await this.redis.ltrim(key, start, stop);
  }

  async lrem(key: string, count: number, value: unknown): Promise<void> {
    await this.redis.lrem(key, count, JSON.stringify(value));
  }

  /* ─── sorted set helpers (wishlist ordering, etc.) ─── */

  async zadd(key: string, score: number, member: string): Promise<void> {
    await this.redis.zadd(key, score, member);
  }

  async zrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.redis.zrange(key, start, stop);
  }

  async zrem(key: string, member: string): Promise<void> {
    await this.redis.zrem(key, member);
  }

  async zcard(key: string): Promise<number> {
    return this.redis.zcard(key);
  }

  /* ─── product price cache (Kafka-backed) ─── */

  async cacheProductPrice(productId: string, price: number, name: string): Promise<void> {
    await this.hset("product:prices", productId, { price, name, updatedAt: Date.now() });
  }

  async getProductPrice(productId: string): Promise<{ price: number; name: string; updatedAt: number } | null> {
    return this.hget("product:prices", productId);
  }

  async getAllProductPrices(): Promise<Record<string, { price: number; name: string; updatedAt: number }>> {
    return this.hgetall("product:prices");
  }

  async removeProductPrice(productId: string): Promise<void> {
    await this.hdel("product:prices", productId);
  }

  /* ─── TTL / expiry ─── */

  async expire(key: string, seconds: number): Promise<void> {
    await this.redis.expire(key, seconds);
  }

  async ttl(key: string): Promise<number> {
    return this.redis.ttl(key);
  }
}
