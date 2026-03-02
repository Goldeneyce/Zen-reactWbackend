import "dotenv/config";
import { prisma } from "./src/client.js";
import { readFileSync } from "fs";
import { resolve } from "path";

// ── NGN formatter ──────────────────────────────────────────────
const formatNGN = (n: number) => {
  const parts = n.toFixed(2).split(".");
  const whole = parts[0] ?? "0";
  const decimal = parts[1] ?? "00";
  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `₦${withCommas}.${decimal}`;
};

// ── Types ──────────────────────────────────────────────────────
interface ProductInput {
  name: string;
  slug?: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  sizes?: string[];
  colors?: string[];
  rating: number;
  reviews: number;
  features: string[];
  stock?: number;
  inStock: boolean;
  isFeatured?: boolean;
  payOnDelivery?: boolean;
  badge?: "New" | "BestSeller" | "Smart" | "EnergyEfficient" | "TopRated" | null;
  categories: {
    create: { categoryId: number; name: string; categoryName: string }[];
  };
  specifications: {
    create: { key: string; name: string; value: string }[];
  };
}

// ── Slug helper ────────────────────────────────────────────────
const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "product";

// ── Upsert a single product (delete + create) ─────────────────
async function upsertProduct(input: ProductInput) {
  const slug = input.slug ?? slugify(input.name);

  // Delete existing product with the same slug
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    await prisma.product.delete({ where: { id: existing.id } });
    console.log(`  ✕ Deleted existing: ${existing.name}`);
  }

  // Validate referenced categories exist
  const catIds = input.categories.create.map((c) => c.categoryId);
  const found = await prisma.category.findMany({ where: { id: { in: catIds } } });
  const foundIds = new Set(found.map((c) => c.id));
  const missing = catIds.filter((id) => !foundIds.has(id));
  if (missing.length) {
    console.error(`  ✕ Missing category IDs: ${missing.join(", ")}. Run db:seed first.`);
    return null;
  }

  const product = await prisma.product.create({
    data: {
      name: input.name,
      slug,
      description: input.description,
      price: input.price,
      originalPrice: input.originalPrice,
      image: input.image,
      images: JSON.stringify(input.images ?? []),
      sizes: JSON.stringify(input.sizes ?? []),
      colors: JSON.stringify(input.colors ?? []),
      rating: input.rating,
      reviews: input.reviews,
      features: JSON.stringify(input.features ?? []),
      stock: input.stock ?? 0,
      inStock: input.inStock,
      isFeatured: input.isFeatured ?? false,
      payOnDelivery: input.payOnDelivery ?? false,
      badge: input.badge ?? undefined,
      categories: input.categories,
      specifications: input.specifications,
    },
    include: {
      categories: { include: { category: true } },
      specifications: true,
    },
  });

  console.log(`  ✓ Created: ${product.name}`);
  console.log(`    ID:             ${product.id}`);
  console.log(`    Slug:           ${product.slug}`);
  console.log(`    Price:          ${formatNGN(product.price)}`);
  console.log(`    Original Price: ${product.originalPrice ? formatNGN(product.originalPrice) : "—"}`);
  console.log(`    Pay on Delivery:${product.payOnDelivery ? " Yes" : " No"}`);
  console.log(`    Categories:     ${(product as any).categories.map((c: any) => c.categoryName).join(", ")}`);
  console.log(`    Specifications: ${(product as any).specifications.length} specs`);
  return product;
}

// ── Main ───────────────────────────────────────────────────────
async function main() {
  // Usage:  npx tsx seed-product.ts                  → seeds from product-sample.json
  //         npx tsx seed-product.ts my-products.json  → seeds from custom file
  const file = process.argv[2] ?? resolve(import.meta.dirname, "../../product-sample.json");

  console.log(`\nLoading products from: ${file}\n`);

  const raw = readFileSync(file, "utf-8");
  let products: ProductInput | ProductInput[] = JSON.parse(raw);

  if (!Array.isArray(products)) products = [products];

  console.log(`Found ${products.length} product(s) to seed.\n`);

  for (const p of products) {
    console.log(`→ ${p.name}`);
    await upsertProduct(p);
    console.log();
  }

  console.log("Done!");
}

main()
  .catch((e) => {
    console.error("Failed to seed products:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
