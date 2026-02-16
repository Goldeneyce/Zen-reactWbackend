import { Hono } from "hono";
import { shouldBeUser } from "../middleware/authMiddleware.js";
import { INVENTORY_SERVICE_URL } from "../utils/services.js";

const inventoryAggRouter = new Hono();

/**
 * GET /api/inventory/:productId/stock
 * Proxies the stock-availability check to the inventory-service.
 */
inventoryAggRouter.get("/:productId/stock", shouldBeUser, async (c) => {
  const productId = c.req.param("productId");
  const res = await fetch(
    `${INVENTORY_SERVICE_URL}/inventory/${productId}/stock`
  );
  const data = await res.json();
  return c.json(data, res.status as any);
});

export default inventoryAggRouter;
