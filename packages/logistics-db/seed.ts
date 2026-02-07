import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.LOGISTICS_DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding logistics-db …");

  // Seed default shipping rates
  const rates = [
    {
      carrier: "FedEx",
      serviceLevel: "STANDARD",
      region: "US",
      basePrice: 5.99,
      pricePerKg: 1.2,
      estimatedDays: 5,
    },
    {
      carrier: "FedEx",
      serviceLevel: "EXPRESS",
      region: "US",
      basePrice: 12.99,
      pricePerKg: 2.5,
      estimatedDays: 2,
    },
    {
      carrier: "FedEx",
      serviceLevel: "OVERNIGHT",
      region: "US",
      basePrice: 24.99,
      pricePerKg: 4.0,
      estimatedDays: 1,
    },
    {
      carrier: "UPS",
      serviceLevel: "STANDARD",
      region: "US",
      basePrice: 6.49,
      pricePerKg: 1.3,
      estimatedDays: 5,
    },
    {
      carrier: "UPS",
      serviceLevel: "EXPRESS",
      region: "US",
      basePrice: 13.49,
      pricePerKg: 2.6,
      estimatedDays: 2,
    },
    {
      carrier: "DHL",
      serviceLevel: "STANDARD",
      region: "INTL",
      basePrice: 14.99,
      pricePerKg: 3.0,
      estimatedDays: 10,
    },
    {
      carrier: "DHL",
      serviceLevel: "EXPRESS",
      region: "INTL",
      basePrice: 29.99,
      pricePerKg: 5.5,
      estimatedDays: 4,
    },
  ];

  for (const rate of rates) {
    await prisma.shippingRate.upsert({
      where: {
        carrier_serviceLevel_region: {
          carrier: rate.carrier,
          serviceLevel: rate.serviceLevel,
          region: rate.region,
        },
      },
      update: {
        basePrice: rate.basePrice,
        pricePerKg: rate.pricePerKg,
        estimatedDays: rate.estimatedDays,
      },
      create: rate,
    });
  }

  console.log(`✅ Seeded ${rates.length} shipping rates`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
