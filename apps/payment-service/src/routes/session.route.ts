import type { FastifyPluginAsync } from "fastify";
import { shouldBeUser } from "../middleware/authMiddleware.js";
import { initializePaystackTransaction, verifyPaystackTransaction } from "../utils/paystack.js";
import { calculateOrderTotal } from "../utils/productService.js";

const sessionRoute: FastifyPluginAsync = async (app) => {
    /**
     * POST /create-checkout-session
     * Initialize a Paystack checkout session
     */
    app.post(
        "/create-checkout-session",
        { preHandler: shouldBeUser },
        async (request, reply) => {
            const userId = request.userId;

            try {
                const body = request.body as any;
                const { email, metadata, cart } = body || {};
                const customerName = metadata?.fullName || email;

                if (!email || !cart || !Array.isArray(cart) || cart.length === 0) {
                    return reply
                        .code(400)
                        .send({ error: "Email and cart items are required" });
                }

                console.log("Calculating amount from product service...");
                console.log("Cart received:", JSON.stringify(cart, null, 2));

                for (const item of cart) {
                    if (!item.id || !item.quantity || item.quantity < 1) {
                        console.error("Invalid cart item:", item);
                        return reply.code(400).send({
                            error: "Invalid cart item format. Each item must have 'id' and 'quantity'",
                        });
                    }
                }

                const cartItems = cart.map((item: any) => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                }));
                console.log("Cart items for calculation:", JSON.stringify(cartItems, null, 2));

                let calculatedAmount: number;
                try {
                    calculatedAmount = await calculateOrderTotal(cartItems);
                    console.log(`Total calculated amount: ₦${calculatedAmount}`);
                } catch (calcError) {
                    console.error("Error calculating order total:", calcError);
                    return reply.code(500).send({
                        error: "Failed to calculate order total",
                        details: calcError instanceof Error ? calcError.message : "Unknown error",
                    });
                }

                const amount = calculatedAmount;
                const reference = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const callback_url = `http://localhost:3002/return?session_id=${reference}`;

                const enrichedMetadata = {
                    ...metadata,
                    userId,
                    cart: cart || [],
                    orderDate: new Date().toISOString(),
                };

                const response = await initializePaystackTransaction(
                    email,
                    amount,
                    customerName,
                    callback_url,
                    reference,
                    enrichedMetadata
                );

                console.log("Paystack response:", JSON.stringify(response, null, 2));

                if (!response || !response.status || !response.data) {
                    console.error("Invalid Paystack response structure:", response);
                    return reply.code(500).send({
                        error: "Invalid response from payment gateway",
                        details: response,
                    });
                }

                return reply.send({
                    success: true,
                    access_code: response.data.access_code,
                    session_id: response.data.reference,
                    authorization_url: response.data.authorization_url,
                });
            } catch (error) {
                console.error("Error creating checkout session:", error);
                return reply.code(500).send({ error: "Failed to create checkout session" });
            }
        }
    );

    /**
     * GET /verify-payment/:reference
     * Verify a Paystack payment transaction
     */
    app.get(
        "/verify-payment/:reference",
        { preHandler: shouldBeUser },
        async (request, reply) => {
            try {
                const reference = (request.params as { reference?: string }).reference;

                if (!reference) {
                    return reply.code(400).send({ error: "Transaction reference is required" });
                }

                const response = await verifyPaystackTransaction(reference);

                return reply.send({
                    success: true,
                    data: response.data,
                });
            } catch (error) {
                console.error("Error verifying payment:", error);
                return reply.code(500).send({ error: "Failed to verify payment" });
            }
        }
    );
};

export default sessionRoute;