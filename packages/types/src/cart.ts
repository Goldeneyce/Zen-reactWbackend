import { z } from "zod";
import type { Product } from "@repo/product-db";

export interface CartItem {
    id: string;
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
    selectedSize?: string;
    selectedColor?: string;
    payOnDelivery?: boolean;
}

export type CartItemType = Product & {
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
};

export type CartItemsType = CartItemType[];

export const shippingFormSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address").regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
    phone: z.string().regex(/^\+?1?\d{9,15}$/, "Phone number must be 9-15 digits"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
});

export type ShippingFormData = z.infer<typeof shippingFormSchema>;