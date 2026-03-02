import type {Product, Category} from "@repo/product-db";
import z from "zod";

// ProductBadge is now a plain string (SQLite doesn't support enums)
export type ProductBadge = "New" | "BestSeller" | "Smart" | "EnergyEfficient" | "TopRated";

// Prisma stores these JSON array fields as `string` in SQLite,
// but the product service parses them into real arrays at runtime.
// Override those fields so client-side code can safely call .map() etc.
export type ProductType = Omit<Product, 'images' | 'sizes' | 'colors' | 'features'> & {
  images: string[];
  sizes: string[];
  colors: string[];
  features: string[];
};

export type ProductsType = ProductType[];

export const ProductBadgeValues = [
  "New",
  "BestSeller",
  "Smart",
  "EnergyEfficient",
  "TopRated",
] as const;

export const ProductFormSchema = z.object({
  name: z.string({ message: "Product name is required!" }).min(1, { message: "Product name is required!" }),
  description: z.string({ message: "Description is required!" }).min(1, { message: "Description is required!" }),
  price: z.number({ message: "Price is required!" }).min(1, { message: "Price is required!" }),
  originalPrice: z.number().optional(),
  categorySlug: z.string({ message: "Category is required!" }).min(1, { message: "Category is required!" }),
  image: z.string({ message: "Main image is required!" }).min(1, { message: "Main image is required!" }),
  images: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  specifications: z.array(z.object({
    key: z.string().min(1),
    name: z.string().min(1),
    value: z.string().min(1),
  })).optional(),
  stock: z.number().int().min(0).default(0),
  inStock: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  payOnDelivery: z.boolean().optional(),
  badge: z.enum(ProductBadgeValues).optional(),
  weight: z.number().positive().optional(),
  length: z.number().positive().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  rating: z.number().default(0),
  reviews: z.number().int().default(0),
});


export type CategoryType = Category;

export const CategoryformSchema = z.object({
  name: z
  .string({ message: "Name is Required!" })
  .min(1, { message: "Name is Required!" }),
  slug: z.string().optional(),
});