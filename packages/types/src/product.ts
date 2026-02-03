import type {Product, Category} from "@repo/product-db";
import z from "zod";

export type ProductType = Product;

export type ProductsType = ProductType[];

export const ProductFormSchema = z.object({
  name: z.string({ message: "Product name is required!" }).min(1, { message: "Product name is required!" }),
  shortDescription: z
    .string({ message: "Short description is required!" })
    .min(1, { message: "Short description is required!" })
    .max(60),
  description: z.string({ message: "Description is required!" }).min(1, { message: "Description is required!" }),
  price: z.number({ message: "Price is required!" }).min(1, { message: "Price is required!" }),
  categorySlug: z.string({ message: "Category is required!" }).min(1, { message: "Category is required!" }),
  sizes: z.string().optional(),
  colors: z.string().optional(),
  images: z.string(),
});


export type CategoryType = Category;

export const CategoryformSchema = z.object({
  name: z
  .string({ message: "Name is Required!" })
  .min(1, { message: "Name is Required!" }),
  slug: z.string().optional(),
});