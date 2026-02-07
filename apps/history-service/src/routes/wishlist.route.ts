import { Hono } from "hono";
import { shouldBeUser } from "../middleware/authMiddleware.js";
import { getCache } from "../utils/redis.ts";

const router = new Hono();

/**
 * POST /wishlist          → add a product to the user's wishlist
 * GET  /wishlist          → get all wishlist product IDs for the user
 * DELETE /wishlist/:productId → remove a product from the wishlist
 */

// Add product to wishlist
router.post("/", shouldBeUser, async (c) => {
  const userId = c.get("userId");
  const { productId } = await c.req.json<{ productId: string }>();

  if (!productId) {
    return c.json({ message: "productId is required" }, 400);
  }

  const score = Date.now();
  await getCache().zadd(`wishlist:${userId}`, score, productId);

  return c.json({ message: "Added to wishlist", productId }, 201);
});

// Get user's wishlist (product IDs only – hydration via Gateway)
router.get("/", shouldBeUser, async (c) => {
  const userId = c.get("userId");
  const productIds = await getCache().zrange(`wishlist:${userId}`, 0, -1);
  const count = await getCache().zcard(`wishlist:${userId}`);

  return c.json({ productIds, count });
});

// Remove from wishlist
router.delete("/:productId", shouldBeUser, async (c) => {
  const userId = c.get("userId");
  const productId = c.req.param("productId");

  await getCache().zrem(`wishlist:${userId}`, productId);

  return c.json({ message: "Removed from wishlist", productId });
});

export default router;
