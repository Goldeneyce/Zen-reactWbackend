import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { shouldBeUser } from "../middleware/authMiddleware.js";
import { getCache } from "../utils/redis.ts";

interface CartItemBody {
  productId: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface CartItemStored {
  productId: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  addedAt: number;
}

/**
 * Cart routes – all items live in Redis using a hash per user.
 *
 * POST   /cart             → add / update item in the cart
 * GET    /cart             → get all cart items (IDs + quantities)
 * PATCH  /cart/:productId  → update quantity
 * DELETE /cart/:productId  → remove an item
 * DELETE /cart             → clear the cart
 */
export const cartRoutes = (fastify: FastifyInstance) => {
  const CART_TTL = 60 * 60 * 24 * 30; // 30 days

  // Add / upsert an item
  fastify.post<{ Body: CartItemBody }>(
    "/cart",
    { preHandler: shouldBeUser },
    async (request: FastifyRequest<{ Body: CartItemBody }>, reply: FastifyReply) => {
      const userId = request.userId!;
      const { productId, quantity, selectedSize, selectedColor } = request.body;

      if (!productId || !quantity || quantity < 1) {
        return reply.status(400).send({ message: "productId and quantity (>= 1) are required" });
      }

      const item: CartItemStored = {
        productId,
        quantity,
        selectedSize,
        selectedColor,
        addedAt: Date.now(),
      };

      await getCache().hset(`items:${userId}`, productId, item);
      await getCache().expire(`items:${userId}`, CART_TTL);

      return reply.status(201).send({ message: "Item added to cart", item });
    }
  );

  // Get cart items (IDs only – hydration happens via gateway)
  fastify.get(
    "/cart",
    { preHandler: shouldBeUser },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.userId!;
      const items = await getCache().hgetall<CartItemStored>(`items:${userId}`);
      const itemList = Object.values(items);

      return reply.send({ items: itemList, count: itemList.length });
    }
  );

  // Update quantity
  fastify.patch<{ Params: { productId: string }; Body: { quantity: number } }>(
    "/cart/:productId",
    { preHandler: shouldBeUser },
    async (
      request: FastifyRequest<{ Params: { productId: string }; Body: { quantity: number } }>,
      reply: FastifyReply
    ) => {
      const userId = request.userId!;
      const { productId } = request.params;
      const { quantity } = request.body;

      if (!quantity || quantity < 1) {
        return reply.status(400).send({ message: "quantity must be >= 1" });
      }

      const existing = await getCache().hget<CartItemStored>(`items:${userId}`, productId);
      if (!existing) {
        return reply.status(404).send({ message: "Item not in cart" });
      }

      existing.quantity = quantity;
      await getCache().hset(`items:${userId}`, productId, existing);

      return reply.send({ message: "Quantity updated", item: existing });
    }
  );

  // Remove single item
  fastify.delete<{ Params: { productId: string } }>(
    "/cart/:productId",
    { preHandler: shouldBeUser },
    async (
      request: FastifyRequest<{ Params: { productId: string } }>,
      reply: FastifyReply
    ) => {
      const userId = request.userId!;
      const { productId } = request.params;

      await getCache().hdel(`items:${userId}`, productId);

      return reply.send({ message: "Removed from cart", productId });
    }
  );

  // Clear cart
  fastify.delete(
    "/cart",
    { preHandler: shouldBeUser },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.userId!;
      await getCache().del(`items:${userId}`);

      return reply.send({ message: "Cart cleared" });
    }
  );
};
