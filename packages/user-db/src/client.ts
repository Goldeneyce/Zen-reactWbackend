import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env["USER_DATABASE_URL"];

if (!connectionString) {
  throw new Error("USER_DATABASE_URL environment variable is not set");
}

const adapter = new PrismaPg({ connectionString });

const globalForPrisma = global as unknown as { userPrisma: PrismaClient };

export const prisma =
  globalForPrisma.userPrisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production")
  globalForPrisma.userPrisma = prisma;
