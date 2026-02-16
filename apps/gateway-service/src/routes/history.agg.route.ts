import { Hono } from "hono";
import { shouldBeUser } from "../middleware/authMiddleware.js";
import { HISTORY_SERVICE_URL } from "../utils/services.js";
import { fetchProductsByIds } from "../utils/hydrate.js";

const router = new Hono();

/**
 * GET /api/history
 *
 *  1. Fetch browsing history entries from history-service
 *  2. Bulk-fetch full product data from product-service
 *  3. Merge and return
 */
router.get("/", shouldBeUser, async (c) => {
  const authHeader = c.req.header("Authorization") ?? "";
  const limit = c.req.query("limit") ?? "50";

  const historyRes = await fetch(
    `${HISTORY_SERVICE_URL}/history?limit=${limit}`,
    { headers: { Authorization: authHeader } }
  );

  if (!historyRes.ok) {
    const err = await historyRes.text();
    return c.json({ message: "Failed to fetch history", detail: err }, historyRes.status as any);
  }

  const { history, count } = (await historyRes.json()) as {
    history: { productId: string; viewedAt: number }[];
    count: number;
  };

  if (!history || history.length === 0) {
    return c.json({ items: [], count: 0 });
  }

  // Hydrate
  const productIds = history.map((h) => h.productId);
  const products = await fetchProductsByIds(productIds);
  const productMap = new Map(products.map((p: any) => [p.id, p]));

  const items = history
    .map((entry) => {
      const product = productMap.get(entry.productId);
      if (!product) return null;
      return { ...product, viewedAt: entry.viewedAt };
    })
    .filter(Boolean);

  return c.json({ items, count: items.length });
});

/**
 * POST /api/history  → proxy record view
 */
router.post("/", shouldBeUser, async (c) => {
  const authHeader = c.req.header("Authorization") ?? "";
  const body = await c.req.json();

  const res = await fetch(`${HISTORY_SERVICE_URL}/history`, {
    method: "POST",
    headers: { Authorization: authHeader, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return c.json(data, res.status as any);
});

/**
 * DELETE /api/history  → proxy clear
 */
router.delete("/", shouldBeUser, async (c) => {
  const authHeader = c.req.header("Authorization") ?? "";

  const res = await fetch(`${HISTORY_SERVICE_URL}/history`, {
    method: "DELETE",
    headers: { Authorization: authHeader },
  });

  const data = await res.json();
  return c.json(data, res.status as any);
});

/**
 * DELETE /api/history/:productId  → proxy remove single
 */
router.delete("/:productId", shouldBeUser, async (c) => {
  const authHeader = c.req.header("Authorization") ?? "";
  const productId = c.req.param("productId");

  const res = await fetch(`${HISTORY_SERVICE_URL}/history/${productId}`, {
    method: "DELETE",
    headers: { Authorization: authHeader },
  });

  const data = await res.json();
  return c.json(data, res.status as any);
});

export default router;
