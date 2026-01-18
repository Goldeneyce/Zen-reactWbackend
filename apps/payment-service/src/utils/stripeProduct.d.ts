import { StripeProductType } from "@repo/types";
export declare const createStripeProduct: (item: StripeProductType) => Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Product>>;
export declare const createStripeProductPrice: (productId: number) => Promise<number | null | undefined>;
//# sourceMappingURL=stripeProduct.d.ts.map