import { Hono } from "hono";
import { shouldBeUser } from "../middleware/authMiddleware.js";
import { CART_SERVICE_URL } from "../utils/services.js";
import { fetchProductsByIds } from "../utils/hydrate.js";

const router = new Hono();

/**
 * GET /api/cart
 *
 * Gateway Aggregator pattern:
 *  1. Fetch cart items (productId + quantity + options) from cart-service
 *  2. Bulk-fetch full product data from product-service
 *  3. Merge product details into each cart line-item
 */
router.get("/", shouldBeUser, async (c) => {
  const authHeader = c.req.header("Authorization") ?? "";

  // 1 ─ Fetch cart items from cart-service
  const cartRes = await fetch(`${CART_SERVICE_URL}/cart`, {
    headers: { Authorization: authHeader },
  });

  if (!cartRes.ok) {
    const err = await cartRes.text();
    return c.json({ message: "Failed to fetch cart", detail: err }, cartRes.status as any);
  }

  const { items: cartItems, count } = (await cartRes.json()) as {
    items: {
      productId: string;
      quantity: number;
      selectedSize?: string;
      selectedColor?: string;
      addedAt: number;
    }[];
    count: number;
  };

  if (!cartItems || cartItems.length === 0) {
    return c.json({ items: [], count: 0, total: 0 });
  }

  // 2 ─ Hydrate: bulk-fetch full product details
  const productIds = cartItems.map((item) => item.productId);
  const products = await fetchProductsByIds(productIds);
  const productMap = new Map(products.map((p: any) => [p.id, p]));

  // 3 ─ Merge product data with cart metadata
  let total = 0;
  const hydratedItems = cartItems
    .map((cartItem) => {
      const product = productMap.get(cartItem.productId);
      if (!product) return null; // product was deleted
      const lineTotal = product.price * cartItem.quantity;
      total += lineTotal;
      return {
        ...product,
        quantity: cartItem.quantity,
        selectedSize: cartItem.selectedSize,
        selectedColor: cartItem.selectedColor,
        addedAt: cartItem.addedAt,
        lineTotal,
      };
    })
    .filter(Boolean);

  return c.json({ items: hydratedItems, count: hydratedItems.length, total });
});

/**
 * POST /api/cart  → proxy add to cart-service
 */
router.post("/", shouldBeUser, async (c) => {
  const authHeader = c.req.header("Authorization") ?? "";
  const body = await c.req.json();

  const res = await fetch(`${CART_SERVICE_URL}/cart`, {
    method: "POST",
    headers: { Authorization: authHeader, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return c.json(data, res.status as any);
});

/**
 * PATCH /api/cart/:productId  → proxy quantity update
 */
router.patch("/:productId", shouldBeUser, async (c) => {
  const authHeader = c.req.header("Authorization") ?? "";
  const productId = c.req.param("productId");
  const body = await c.req.json();

  const res = await fetch(`${CART_SERVICE_URL}/cart/${productId}`, {
    method: "PATCH",
    headers: { Authorization: authHeader, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return c.json(data, res.status as any);
});

/**
 * DELETE /api/cart/:productId  → proxy remove single item
 */
router.delete("/:productId", shouldBeUser, async (c) => {
  const authHeader = c.req.header("Authorization") ?? "";
  const productId = c.req.param("productId");

  const res = await fetch(`${CART_SERVICE_URL}/cart/${productId}`, {
    method: "DELETE",
    headers: { Authorization: authHeader },
  });

  const data = await res.json();
  return c.json(data, res.status as any);
});

/**
 * DELETE /api/cart  → proxy clear cart
 */
router.delete("/", shouldBeUser, async (c) => {
  const authHeader = c.req.header("Authorization") ?? "";

  const res = await fetch(`${CART_SERVICE_URL}/cart`, {
    method: "DELETE",
    headers: { Authorization: authHeader },
  });

  const data = await res.json();
  return c.json(data, res.status as any);
});

export default router;
