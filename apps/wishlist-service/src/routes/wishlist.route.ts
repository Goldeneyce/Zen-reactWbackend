import { Hono } from "hono";
import { shouldBeUser } from "../middleware/authMiddleware.js";
import { db, wishlistItems } from "@repo/wishlist-db";
import { eq, and, desc } from "drizzle-orm";

const router = new Hono();

/**
 * POST   /wishlist              → add a product to the user's wishlist
 * GET    /wishlist              → get all wishlist items for the user
 * DELETE /wishlist/:productId   → remove a product from the wishlist
 * DELETE /wishlist              → clear the user's wishlist
 */

// Add product to wishlist
router.post("/", shouldBeUser, async (c) => {
  const userId = c.get("userId");
  const { productId } = await c.req.json<{ productId: string }>();

  if (!productId) {
    return c.json({ message: "productId is required" }, 400);
  }

  // Upsert – ignore conflict if already wishlisted
  await db
    .insert(wishlistItems)
    .values({ userId, productId })
    .onConflictDoNothing({
      target: [wishlistItems.userId, wishlistItems.productId],
    });

  return c.json({ message: "Added to wishlist", productId }, 201);
});

// Get user's wishlist
router.get("/", shouldBeUser, async (c) => {
  const userId = c.get("userId");

  const items = await db
    .select()
    .from(wishlistItems)
    .where(eq(wishlistItems.userId, userId))
    .orderBy(desc(wishlistItems.addedAt));

  const productIds = items.map((item) => item.productId);

  return c.json({ productIds, count: productIds.length });
});

// Remove from wishlist
router.delete("/:productId", shouldBeUser, async (c) => {
  const userId = c.get("userId");
  const productId = c.req.param("productId");

  await db
    .delete(wishlistItems)
    .where(
      and(
        eq(wishlistItems.userId, userId),
        eq(wishlistItems.productId, productId)
      )
    );

  return c.json({ message: "Removed from wishlist", productId });
});

// Clear wishlist
router.delete("/", shouldBeUser, async (c) => {
  const userId = c.get("userId");

  await db.delete(wishlistItems).where(eq(wishlistItems.userId, userId));

  return c.json({ message: "Wishlist cleared" });
});

export default router;
