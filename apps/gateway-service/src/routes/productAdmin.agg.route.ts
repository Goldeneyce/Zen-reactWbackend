import { Hono } from "hono";
import { shouldBeProductAdmin } from "../middleware/authMiddleware.js";
import { PRODUCT_SERVICE_URL, INVENTORY_SERVICE_URL } from "../utils/services.js";

const productAdminAggRouter = new Hono();

/* ─────────────────────────────────────────────
 *  Product CRUD  →  product-service
 * ───────────────────────────────────────────── */

/** GET /api/product-admin/products — list all products */
productAdminAggRouter.get("/products", shouldBeProductAdmin, async (c) => {
  const query = c.req.url.split("?")[1] ?? "";
  const res = await fetch(`${PRODUCT_SERVICE_URL}/products${query ? `?${query}` : ""}`);
  return c.json(await res.json(), res.status as any);
});

/** GET /api/product-admin/products/:id — single product detail */
productAdminAggRouter.get("/products/:id", shouldBeProductAdmin, async (c) => {
  const id = c.req.param("id");
  const res = await fetch(`${PRODUCT_SERVICE_URL}/products/${id}`);
  return c.json(await res.json(), res.status as any);
});

/** POST /api/product-admin/products — create product */
productAdminAggRouter.post("/products", shouldBeProductAdmin, async (c) => {
  const body = await c.req.text();
  const token = c.req.header("Authorization");
  const res = await fetch(`${PRODUCT_SERVICE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: token } : {}),
    },
    body,
  });
  return c.json(await res.json(), res.status as any);
});

/** PUT /api/product-admin/products/:id — update product */
productAdminAggRouter.put("/products/:id", shouldBeProductAdmin, async (c) => {
  const id = c.req.param("id");
  const body = await c.req.text();
  const token = c.req.header("Authorization");
  const res = await fetch(`${PRODUCT_SERVICE_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: token } : {}),
    },
    body,
  });
  return c.json(await res.json(), res.status as any);
});

/** DELETE /api/product-admin/products/:id — delete product */
productAdminAggRouter.delete("/products/:id", shouldBeProductAdmin, async (c) => {
  const id = c.req.param("id");
  const token = c.req.header("Authorization");
  const res = await fetch(`${PRODUCT_SERVICE_URL}/products/${id}`, {
    method: "DELETE",
    headers: { ...(token ? { Authorization: token } : {}) },
  });
  return c.json(await res.json(), res.status as any);
});

/* ─────────────────────────────────────────────
 *  Product Specifications  →  product-service
 * ───────────────────────────────────────────── */

/** GET /api/product-admin/specifications — all specifications */
productAdminAggRouter.get("/specifications", shouldBeProductAdmin, async (c) => {
  const res = await fetch(`${PRODUCT_SERVICE_URL}/productSpecification`);
  return c.json(await res.json(), res.status as any);
});

/** POST /api/product-admin/specifications — create specification */
productAdminAggRouter.post("/specifications", shouldBeProductAdmin, async (c) => {
  const body = await c.req.text();
  const token = c.req.header("Authorization");
  const res = await fetch(`${PRODUCT_SERVICE_URL}/productSpecification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: token } : {}),
    },
    body,
  });
  return c.json(await res.json(), res.status as any);
});

/** PUT /api/product-admin/specifications/:id — update specification */
productAdminAggRouter.put("/specifications/:id", shouldBeProductAdmin, async (c) => {
  const id = c.req.param("id");
  const body = await c.req.text();
  const token = c.req.header("Authorization");
  const res = await fetch(`${PRODUCT_SERVICE_URL}/productSpecification/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: token } : {}),
    },
    body,
  });
  return c.json(await res.json(), res.status as any);
});

/** DELETE /api/product-admin/specifications/:id — delete specification */
productAdminAggRouter.delete("/specifications/:id", shouldBeProductAdmin, async (c) => {
  const id = c.req.param("id");
  const token = c.req.header("Authorization");
  const res = await fetch(`${PRODUCT_SERVICE_URL}/productSpecification/${id}`, {
    method: "DELETE",
    headers: { ...(token ? { Authorization: token } : {}) },
  });
  return c.json(await res.json(), res.status as any);
});

/* ─────────────────────────────────────────────
 *  Inventory Management  →  inventory-service
 * ───────────────────────────────────────────── */

/** GET /api/product-admin/inventory — paginated inventory list */
productAdminAggRouter.get("/inventory", shouldBeProductAdmin, async (c) => {
  const query = c.req.url.split("?")[1] ?? "";
  const token = c.req.header("Authorization");
  const res = await fetch(
    `${INVENTORY_SERVICE_URL}/inventory${query ? `?${query}` : ""}`,
    { headers: { ...(token ? { Authorization: token } : {}) } }
  );
  return c.json(await res.json(), res.status as any);
});

/** GET /api/product-admin/inventory/:productId — inventory detail */
productAdminAggRouter.get("/inventory/:productId", shouldBeProductAdmin, async (c) => {
  const productId = c.req.param("productId");
  const token = c.req.header("Authorization");
  const res = await fetch(`${INVENTORY_SERVICE_URL}/inventory/${productId}`, {
    headers: { ...(token ? { Authorization: token } : {}) },
  });
  return c.json(await res.json(), res.status as any);
});

/** POST /api/product-admin/inventory — create inventory item */
productAdminAggRouter.post("/inventory", shouldBeProductAdmin, async (c) => {
  const body = await c.req.text();
  const token = c.req.header("Authorization");
  const res = await fetch(`${INVENTORY_SERVICE_URL}/inventory`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: token } : {}),
    },
    body,
  });
  return c.json(await res.json(), res.status as any);
});

/** PATCH /api/product-admin/inventory/:productId/restock */
productAdminAggRouter.patch("/inventory/:productId/restock", shouldBeProductAdmin, async (c) => {
  const productId = c.req.param("productId");
  const body = await c.req.text();
  const token = c.req.header("Authorization");
  const res = await fetch(`${INVENTORY_SERVICE_URL}/inventory/${productId}/restock`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: token } : {}),
    },
    body,
  });
  return c.json(await res.json(), res.status as any);
});

/** PATCH /api/product-admin/inventory/:productId/adjust */
productAdminAggRouter.patch("/inventory/:productId/adjust", shouldBeProductAdmin, async (c) => {
  const productId = c.req.param("productId");
  const body = await c.req.text();
  const token = c.req.header("Authorization");
  const res = await fetch(`${INVENTORY_SERVICE_URL}/inventory/${productId}/adjust`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: token } : {}),
    },
    body,
  });
  return c.json(await res.json(), res.status as any);
});

/* ─────────────────────────────────────────────
 *  Aggregated: Product + Inventory together
 * ───────────────────────────────────────────── */

/** GET /api/product-admin/products/:id/full — product + inventory + specs */
productAdminAggRouter.get("/products/:id/full", shouldBeProductAdmin, async (c) => {
  const id = c.req.param("id");
  const token = c.req.header("Authorization");

  const [productRes, inventoryRes] = await Promise.all([
    fetch(`${PRODUCT_SERVICE_URL}/products/${id}`),
    fetch(`${INVENTORY_SERVICE_URL}/inventory/${id}`, {
      headers: { ...(token ? { Authorization: token } : {}) },
    }),
  ]);

  const product = await productRes.json();
  const inventory = inventoryRes.ok ? await inventoryRes.json() : null;

  return c.json({ product, inventory }, 200);
});

export default productAdminAggRouter;
