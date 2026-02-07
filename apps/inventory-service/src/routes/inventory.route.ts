import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { shouldBeUser, shouldBeAdmin } from "../middleware/authMiddleware.ts";
import {
  getAvailableStock,
  getInventoryItem,
  listInventory,
  restockItem,
  adjustStock,
  createInventoryItem,
} from "../controllers/inventory.controller.ts";

export function inventoryRoutes(fastify: FastifyInstance) {
  /* ───────────── Public / user-facing ───────────── */

  /** GET /inventory/:productId/stock — available quantity (cached) */
  fastify.get(
    "/inventory/:productId/stock",
    async (
      request: FastifyRequest<{ Params: { productId: string } }>,
      reply: FastifyReply
    ) => {
      const { productId } = request.params;
      const stock = await getAvailableStock(productId);
      if (!stock) return reply.status(404).send({ message: "Product not found in inventory" });
      return reply.send(stock);
    }
  );

  /* ───────────── Admin routes ───────────── */

  /** GET /inventory — paginated list */
  fastify.get<{ Querystring: { page?: string; pageSize?: string } }>(
    "/inventory",
    { preHandler: shouldBeAdmin },
    async (
      request: FastifyRequest<{ Querystring: { page?: string; pageSize?: string } }>,
      reply: FastifyReply
    ) => {
      const page = Number(request.query.page) || 1;
      const pageSize = Number(request.query.pageSize) || 25;
      const result = await listInventory(page, pageSize);
      return reply.send(result);
    }
  );

  /** GET /inventory/:productId — full detail with recent movements */
  fastify.get<{ Params: { productId: string } }>(
    "/inventory/:productId",
    { preHandler: shouldBeAdmin },
    async (
      request: FastifyRequest<{ Params: { productId: string } }>,
      reply: FastifyReply
    ) => {
      const item = await getInventoryItem(request.params.productId);
      if (!item) return reply.status(404).send({ message: "Not found" });
      return reply.send(item);
    }
  );

  /** POST /inventory — create a new inventory item */
  fastify.post<{
    Body: {
      productId: string;
      sku: string;
      variantName?: string;
      quantity?: number;
      lowStockAt?: number;
    };
  }>(
    "/inventory",
    { preHandler: shouldBeAdmin },
    async (
      request: FastifyRequest<{
        Body: {
          productId: string;
          sku: string;
          variantName?: string;
          quantity?: number;
          lowStockAt?: number;
        };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const item = await createInventoryItem(request.body);
        return reply.status(201).send(item);
      } catch (err: any) {
        if (err?.code === "P2002") {
          return reply.status(409).send({ message: "SKU already exists" });
        }
        throw err;
      }
    }
  );

  /** PATCH /inventory/:productId/restock — add stock */
  fastify.patch<{ Params: { productId: string }; Body: { quantity: number; reason?: string } }>(
    "/inventory/:productId/restock",
    { preHandler: shouldBeAdmin },
    async (
      request: FastifyRequest<{
        Params: { productId: string };
        Body: { quantity: number; reason?: string };
      }>,
      reply: FastifyReply
    ) => {
      const { productId } = request.params;
      const { quantity, reason } = request.body;
      if (!quantity || quantity <= 0) {
        return reply.status(400).send({ message: "quantity must be > 0" });
      }
      const item = await restockItem(productId, quantity, reason);
      return reply.send(item);
    }
  );

  /** PATCH /inventory/:productId/adjust — manual correction */
  fastify.patch<{ Params: { productId: string }; Body: { delta: number; reason: string } }>(
    "/inventory/:productId/adjust",
    { preHandler: shouldBeAdmin },
    async (
      request: FastifyRequest<{
        Params: { productId: string };
        Body: { delta: number; reason: string };
      }>,
      reply: FastifyReply
    ) => {
      const { productId } = request.params;
      const { delta, reason } = request.body;
      if (delta === undefined || !reason) {
        return reply
          .status(400)
          .send({ message: "delta (number) and reason (string) are required" });
      }
      const item = await adjustStock(productId, delta, reason);
      return reply.send(item);
    }
  );
}
