import type { Redis } from "@upstash/redis";

/**
 * Generic cache helper that wraps common Redis patterns
 * used by history-service and cart-service.
 *
 * Uses '@upstash/redis' (HTTP / REST) instead of ioredis.
 * Values are auto-serialised to JSON by the Upstash client.
 */
export class CacheHelper {
  constructor(
    private readonly redis: Redis,
    private readonly prefix: string = "",
  ) {}

  private key(k: string): string {
    return this.prefix + k;
  }

  /* ─── key/value helpers ─── */

  async get<T = unknown>(key: string): Promise<T | null> {
    const raw = await this.redis.get<T>(this.key(key));
    return raw ?? null;
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.redis.set(this.key(key), value, { ex: ttlSeconds });
    } else {
      await this.redis.set(this.key(key), value);
    }
  }

  async del(key: string): Promise<void> {
    await this.redis.del(this.key(key));
  }

  /* ─── hash helpers (cart items) ─── */

  async hget<T = unknown>(key: string, field: string): Promise<T | null> {
    const raw = await this.redis.hget<T>(this.key(key), field);
    return raw ?? null;
  }

  async hset(key: string, field: string, value: unknown): Promise<void> {
    await this.redis.hset(this.key(key), { [field]: value });
  }

  async hdel(key: string, field: string): Promise<void> {
    await this.redis.hdel(this.key(key), field);
  }

  async hgetall<T = unknown>(key: string): Promise<Record<string, T>> {
    const raw = await this.redis.hgetall<Record<string, T>>(this.key(key));
    return raw ?? {};
  }

  /* ─── list helpers (history) ─── */

  async lpush(key: string, value: unknown): Promise<void> {
    await this.redis.lpush(this.key(key), value);
  }

  async lrange<T = unknown>(key: string, start: number, stop: number): Promise<T[]> {
    const raw = await this.redis.lrange<T>(this.key(key), start, stop);
    return raw ?? [];
  }

  async ltrim(key: string, start: number, stop: number): Promise<void> {
    await this.redis.ltrim(this.key(key), start, stop);
  }

  async lrem(key: string, count: number, value: unknown): Promise<void> {
    await this.redis.lrem(this.key(key), count, value);
  }

  /* ─── sorted set helpers (wishlist ordering, etc.) ─── */

  async zadd(key: string, score: number, member: string): Promise<void> {
    await this.redis.zadd(this.key(key), { score, member });
  }

  async zrange(key: string, start: number, stop: number): Promise<string[]> {
    const raw = await this.redis.zrange<string[]>(this.key(key), start, stop);
    return raw ?? [];
  }

  async zrem(key: string, member: string): Promise<void> {
    await this.redis.zrem(this.key(key), member);
  }

  async zcard(key: string): Promise<number> {
    return this.redis.zcard(this.key(key));
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
    await this.redis.expire(this.key(key), seconds);
  }

  async ttl(key: string): Promise<number> {
    return this.redis.ttl(this.key(key));
  }
}
