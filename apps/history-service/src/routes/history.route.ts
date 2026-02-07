import { Hono } from "hono";
import { shouldBeUser } from "../middleware/authMiddleware.js";
import { getCache } from "../utils/redis.ts";

const router = new Hono();

const MAX_HISTORY = 50; // keep up to 50 recently-viewed items

interface HistoryEntry {
  productId: string;
  viewedAt: number;
}

/**
 * POST /history               → record a product view
 * GET  /history                → list recently-viewed product IDs
 * DELETE /history              → clear browsing history
 * DELETE /history/:productId   → remove a single item
 */

// Record a product view
router.post("/", shouldBeUser, async (c) => {
  const userId = c.get("userId");
  const { productId } = await c.req.json<{ productId: string }>();

  if (!productId) {
    return c.json({ message: "productId is required" }, 400);
  }

  const entry: HistoryEntry = { productId, viewedAt: Date.now() };

  // Remove duplicates (if user viewed same product before)
  const existing = await getCache().lrange<HistoryEntry>(`history:${userId}`, 0, -1);
  for (const item of existing) {
    if (item.productId === productId) {
      await getCache().lrem(`history:${userId}`, 1, item);
    }
  }

  // Push to front
  await getCache().lpush(`history:${userId}`, entry);
  // Trim to max
  await getCache().ltrim(`history:${userId}`, 0, MAX_HISTORY - 1);

  return c.json({ message: "Recorded", productId }, 201);
});

// Get browsing history
router.get("/", shouldBeUser, async (c) => {
  const userId = c.get("userId");
  const limit = Math.min(Number(c.req.query("limit") ?? MAX_HISTORY), MAX_HISTORY);
  const entries = await getCache().lrange<HistoryEntry>(`history:${userId}`, 0, limit - 1);

  return c.json({ history: entries, count: entries.length });
});

// Clear all history
router.delete("/", shouldBeUser, async (c) => {
  const userId = c.get("userId");
  await getCache().del(`history:${userId}`);

  return c.json({ message: "History cleared" });
});

// Remove single entry
router.delete("/:productId", shouldBeUser, async (c) => {
  const userId = c.get("userId");
  const productId = c.req.param("productId");

  const existing = await getCache().lrange<HistoryEntry>(`history:${userId}`, 0, -1);
  for (const item of existing) {
    if (item.productId === productId) {
      await getCache().lrem(`history:${userId}`, 0, item);
    }
  }

  return c.json({ message: "Removed from history", productId });
});

export default router;
