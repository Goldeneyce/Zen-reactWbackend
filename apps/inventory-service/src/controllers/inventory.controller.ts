import { prisma, MovementType } from "@repo/inventory-db";
import { getCache, acquireLock } from "../utils/redis.ts";
import { producer } from "../utils/kafka.ts";

/* ─── Cache helpers ─── */

const CACHE_TTL = 300; // 5 minutes

const stockCacheKey = (productId: string) => `stock:${productId}`;
const lockResource = (productId: string) => `lock:inventory:${productId}`;

async function invalidateStockCache(productId: string) {
  await getCache().del(stockCacheKey(productId));
}

/* ─── Public query ─── */

/**
 * Get the available stock for a product (quantity − reserved).
 * Checks Redis first; falls back to Postgres and caches the result.
 */
export async function getAvailableStock(productId: string) {
  const cache = getCache();
  const cached = await cache.get<{ available: number; quantity: number; reserved: number }>(
    stockCacheKey(productId)
  );
  if (cached) return cached;

  const item = await prisma.inventoryItem.findFirst({
    where: { productId },
    select: { quantity: true, reserved: true, lowStockAt: true },
  });

  if (!item) return null;

  const result = {
    available: item.quantity - item.reserved,
    quantity: item.quantity,
    reserved: item.reserved,
    lowStockAt: item.lowStockAt,
  };

  await cache.set(stockCacheKey(productId), result, CACHE_TTL);
  return result;
}

/**
 * Get full inventory item detail (admin).
 */
export async function getInventoryItem(productId: string) {
  return prisma.inventoryItem.findFirst({
    where: { productId },
    include: { movements: { orderBy: { createdAt: "desc" }, take: 50 } },
  });
}

/**
 * List all inventory items (admin, paginated).
 */
export async function listInventory(page = 1, pageSize = 25) {
  const [items, total] = await Promise.all([
    prisma.inventoryItem.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.inventoryItem.count(),
  ]);
  return { items, total, page, pageSize };
}

/* ─── Stock mutations (all protected by Redlock) ─── */

interface OrderItem {
  productId: string;
  quantity: number;
}

interface OrderEvent {
  orderId: string;
  items: OrderItem[];
}

/**
 * Reserve stock when an order is created.
 * Uses Redlock so two concurrent checkouts for the last item
 * cannot both succeed.
 */
export async function reserveStock(event: OrderEvent) {
  for (const item of event.items) {
    const lock = await acquireLock(lockResource(item.productId), 5_000);
    try {
      const inv = await prisma.inventoryItem.findFirst({
        where: { productId: item.productId },
      });

      if (!inv) throw new Error(`No inventory record for product ${item.productId}`);

      const available = inv.quantity - inv.reserved;
      if (available < item.quantity) {
        // Publish a "stock.insufficient" event so order-service can react
        await producer.send("stock.insufficient", [
          {
            key: event.orderId,
            value: JSON.stringify({
              orderId: event.orderId,
              productId: item.productId,
              requested: item.quantity,
              available,
            }),
          },
        ]);
        throw new Error(
          `Insufficient stock for ${item.productId}: requested ${item.quantity}, available ${available}`
        );
      }

      await prisma.$transaction([
        prisma.inventoryItem.update({
          where: { id: inv.id },
          data: { reserved: { increment: item.quantity } },
        }),
        prisma.stockMovement.create({
          data: {
            inventoryItemId: inv.id,
            type: MovementType.RESERVATION,
            delta: -item.quantity,
            reason: `Reserved for order ${event.orderId}`,
            referenceId: event.orderId,
          },
        }),
      ]);

      await invalidateStockCache(item.productId);

      // Check low-stock threshold
      const newAvailable = available - item.quantity;
      if (newAvailable <= inv.lowStockAt) {
        await producer.send("stock.low", [
          {
            key: item.productId,
            value: JSON.stringify({
              productId: item.productId,
              available: newAvailable,
              threshold: inv.lowStockAt,
            }),
          },
        ]);
      }
    } finally {
      await lock.release();
    }
  }

  await producer.send("stock.reserved", [
    {
      key: event.orderId,
      value: JSON.stringify({ orderId: event.orderId }),
    },
  ]);
}

/**
 * Release previously reserved stock (order cancelled / payment failed).
 */
export async function releaseStock(event: OrderEvent) {
  for (const item of event.items) {
    const lock = await acquireLock(lockResource(item.productId), 5_000);
    try {
      const inv = await prisma.inventoryItem.findFirst({
        where: { productId: item.productId },
      });
      if (!inv) continue;

      await prisma.$transaction([
        prisma.inventoryItem.update({
          where: { id: inv.id },
          data: { reserved: { decrement: item.quantity } },
        }),
        prisma.stockMovement.create({
          data: {
            inventoryItemId: inv.id,
            type: MovementType.RELEASE,
            delta: item.quantity,
            reason: `Released from cancelled order ${event.orderId}`,
            referenceId: event.orderId,
          },
        }),
      ]);

      await invalidateStockCache(item.productId);
    } finally {
      await lock.release();
    }
  }
}

/**
 * Commit stock — converts a reservation into an actual outbound deduction.
 * Called after payment succeeds.
 */
export async function commitStock(event: OrderEvent) {
  const redlock = getRedlock();

  for (const item of event.items) {
    const lock = await redlock.acquire([lockResource(item.productId)], 5_000);
    try {
      const inv = await prisma.inventoryItem.findFirst({
        where: { productId: item.productId },
      });
      if (!inv) continue;

      await prisma.$transaction([
        prisma.inventoryItem.update({
          where: { id: inv.id },
          data: {
            quantity: { decrement: item.quantity },
            reserved: { decrement: item.quantity },
          },
        }),
        prisma.stockMovement.create({
          data: {
            inventoryItemId: inv.id,
            type: MovementType.OUTBOUND,
            delta: -item.quantity,
            reason: `Shipped for order ${event.orderId}`,
            referenceId: event.orderId,
          },
        }),
      ]);

      await invalidateStockCache(item.productId);
    } finally {
      await lock.release();
    }
  }
}

/**
 * Restock / receive goods (admin action).
 */
export async function restockItem(
  productId: string,
  quantity: number,
  reason?: string
) {
  const redlock = getRedlock();
  const lock = await redlock.acquire([lockResource(productId)], 5_000);
  try {
    const inv = await prisma.inventoryItem.findFirst({
      where: { productId },
    });
    if (!inv) throw new Error(`No inventory record for product ${productId}`);

    await prisma.$transaction([
      prisma.inventoryItem.update({
        where: { id: inv.id },
        data: { quantity: { increment: quantity } },
      }),
      prisma.stockMovement.create({
        data: {
          inventoryItemId: inv.id,
          type: MovementType.INBOUND,
          delta: quantity,
          reason: reason ?? "Restock",
        },
      }),
    ]);

    await invalidateStockCache(productId);
    return prisma.inventoryItem.findUnique({ where: { id: inv.id } });
  } finally {
    await lock.release();
  }
}

/**
 * Manual adjustment (admin action).
 */
export async function adjustStock(
  productId: string,
  delta: number,
  reason: string
) {
  const redlock = getRedlock();
  const lock = await redlock.acquire([lockResource(productId)], 5_000);
  try {
    const inv = await prisma.inventoryItem.findFirst({
      where: { productId },
    });
    if (!inv) throw new Error(`No inventory record for product ${productId}`);

    await prisma.$transaction([
      prisma.inventoryItem.update({
        where: { id: inv.id },
        data: { quantity: { increment: delta } },
      }),
      prisma.stockMovement.create({
        data: {
          inventoryItemId: inv.id,
          type: MovementType.ADJUSTMENT,
          delta,
          reason,
        },
      }),
    ]);

    await invalidateStockCache(productId);
    return prisma.inventoryItem.findUnique({ where: { id: inv.id } });
  } finally {
    await lock.release();
  }
}

/**
 * Create a brand-new inventory item (admin).
 */
export async function createInventoryItem(data: {
  productId: string;
  sku: string;
  variantName?: string;
  quantity?: number;
  lowStockAt?: number;
}) {
  const item = await prisma.inventoryItem.create({
    data: {
      productId: data.productId,
      sku: data.sku,
      variantName: data.variantName,
      quantity: data.quantity ?? 0,
      lowStockAt: data.lowStockAt ?? 5,
      movements: {
        create: data.quantity
          ? {
              type: MovementType.INBOUND,
              delta: data.quantity,
              reason: "Initial stock",
            }
          : undefined,
      },
    },
  });
  return item;
}
