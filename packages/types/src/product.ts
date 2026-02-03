import type {Product, Category} from "@repo/product-db";
import z from "zod";

export type ProductType = Product;

export type ProductsType = ProductType[];

export type CategoryType = Category;

export const CategoryformSchema = z.object({
  name: z
  .string({ message: "Name is Required!" })
  .min(1, { message: "Name is Required!" }),
  slug: z.string().optional(),
});