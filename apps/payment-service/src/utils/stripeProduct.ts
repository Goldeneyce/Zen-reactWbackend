import { StripeProductType } from "@repo/types";
import stripe from "./stripe.js";

export const createStripeProduct = async (item:StripeProductType) => {
    try {
        const res = await stripe.products.create({
            id: item.id,
            name: item.name,
            default_price_data: {
            currency: 'ngn',
            unit_amount: item.price * 100,
            },
        });
        return res;
    } catch (error) {
        console.error("Error creating Stripe product:", error);
        throw error;
    }
};

export const createStripeProductPrice = async (productId: number) => {
    try {
        const res = await stripe.prices.list({
            product: productId,
        });
        return res.data[0]?.unit_amount;

    } catch (error) {
        console.error("Error creating Stripe product:", error);
        throw error;
    }
};