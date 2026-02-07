import { Hono } from "hono";
import { shouldBeUser } from "../middleware/authMiddleware.js";
import { HISTORY_SERVICE_URL } from "../utils/services.js";
import { fetchProductsByIds } from "../utils/hydrate.js";

const router = new Hono();

/**
 * GET /api/wishlist
 *
 * Gateway Aggregator pattern:
 *  1. Fetch product IDs from history-service's wishlist endpoint
 *  2. Bulk-fetch full product data from product-service
 *  3. Merge and return one clean JSON payload to the frontend
 */
router.get("/", shouldBeUser, async (c) => {
  const authHeader = c.req.header("Authorization") ?? "";

  // 1 ─ Fetch wishlist product IDs from history-service
  const wishlistRes = await fetch(`${HISTORY_SERVICE_URL}/wishlist`, {
    headers: { Authorization: authHeader },
  });

  if (!wishlistRes.ok) {
    const err = await wishlistRes.text();
    return c.json({ message: "Failed to fetch wishlist", detail: err }, wishlistRes.status as any);
  }

  const { productIds, count } = (await wishlistRes.json()) as {
    productIds: string[];
    count: number;
  };

  if (!productIds || productIds.length === 0) {
    return c.json({ items: [], count: 0 });
  }

  // 2 ─ Hydrate: bulk-fetch full product details
  const products = await fetchProductsByIds(productIds);

  // 3 ─ Merge: build a map for O(1) lookups, preserve wishlist order
  const productMap = new Map(products.map((p: any) => [p.id, p]));

  const items = productIds
    .map((id) => productMap.get(id))
    .filter(Boolean); // skip any ids that no longer exist

  return c.json({ items, count: items.length });
});

/**
 * POST /api/wishlist  → proxy add to history-service
 */
router.post("/", shouldBeUser, async (c) => {
  const authHeader = c.req.header("Authorization") ?? "";
  const body = await c.req.json();

  const res = await fetch(`${HISTORY_SERVICE_URL}/wishlist`, {
    method: "POST",
    headers: { Authorization: authHeader, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return c.json(data, res.status as any);
});

/**
 * DELETE /api/wishlist/:productId  → proxy remove
 */
router.delete("/:productId", shouldBeUser, async (c) => {
  const authHeader = c.req.header("Authorization") ?? "";
  const productId = c.req.param("productId");

  const res = await fetch(`${HISTORY_SERVICE_URL}/wishlist/${productId}`, {
    method: "DELETE",
    headers: { Authorization: authHeader },
  });

  const data = await res.json();
  return c.json(data, res.status as any);
});

export default router;
