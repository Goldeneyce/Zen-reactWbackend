import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.INVENTORY_DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding inventory-db …");

  // Example seed — add / adjust as needed for your catalogue
  const items = [
    { productId: "demo-product-1", sku: "DEMO-001", quantity: 100 },
    { productId: "demo-product-2", sku: "DEMO-002", quantity: 50 },
  ];

  for (const item of items) {
    await prisma.inventoryItem.upsert({
      where: { sku: item.sku },
      update: { quantity: item.quantity },
      create: item,
    });
  }

  console.log(`✅ Seeded ${items.length} inventory items`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
