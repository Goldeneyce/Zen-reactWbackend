import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.INVENTORY_DATABASE_URL,
});

const globalForPrisma = global as unknown as { inventoryPrisma: PrismaClient };

export const prisma =
  globalForPrisma.inventoryPrisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production")
  globalForPrisma.inventoryPrisma = prisma;
