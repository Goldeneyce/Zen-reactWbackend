import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { shouldBeUser } from "../middleware/authMiddleware.js";
import { initializePaystackTransaction, verifyPaystackTransaction } from "../utils/paystack.js";
import { calculateOrderTotal } from "../utils/productService.js";

const sessionRoute = new Hono();

/**
 * POST /create-checkout-session
 * Initialize a Paystack checkout session
 */
sessionRoute.post("/create-checkout-session", clerkMiddleware(), shouldBeUser, async (c) => {

    const userId = c.get("userId");

    try {
        const auth = getAuth(c);
        const body = await c.req.json();
        
        const { email, metadata, cart } = body;
        const customerName = metadata?.fullName || email; // Use fullName from metadata or fallback to email

        // Validate required fields
        if (!email || !cart || !Array.isArray(cart) || cart.length === 0) {
            return c.json({ error: "Email and cart items are required" }, 400);
        }

        // ⚠️ SECURITY: Calculate amount from backend, NOT from frontend
        // Use productService utility to fetch real prices and calculate total
        console.log("Calculating amount from product service...");
        
        // Transform cart format from { id, quantity } to { productId, quantity }
        const cartItems = cart.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity
        }));
        
        // Calculate total using productService utility
        const calculatedAmount = await calculateOrderTotal(cartItems);
        console.log(`Total calculated amount: ₦${calculatedAmount}`);
        
        // Use the calculated amount instead of the one from frontend
        const amount = calculatedAmount;

        // Generate unique reference for this transaction
        const reference = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Construct callback URL with session_id
        const callback_url = `http://localhost:3002/return?session_id=${reference}`;

        // Initialize Paystack transaction with cart data in metadata
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

        // Check if response is valid
        if (!response || !response.status || !response.data) {
            console.error("Invalid Paystack response structure:", response);
            return c.json({ error: "Invalid response from payment gateway", details: response }, 500);
        }

        // Return the access code and reference
        return c.json({
            success: true,
            access_code: response.data.access_code,
            session_id: response.data.reference,
            authorization_url: response.data.authorization_url,
        });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        return c.json({ error: "Failed to create checkout session" }, 500);
    }
});

/**
 * GET /verify-payment/:reference
 * Verify a Paystack payment transaction
 */
sessionRoute.get("/verify-payment/:reference", clerkMiddleware(), shouldBeUser, async (c) => {
    try {
        const reference = c.req.param("reference");

        if (!reference) {
            return c.json({ error: "Transaction reference is required" }, 400);
        }

        // Verify the transaction
        const response = await verifyPaystackTransaction(reference);

        return c.json({
            success: true,
            data: response.data,
        });
    } catch (error) {
        console.error("Error verifying payment:", error);
        return c.json({ error: "Failed to verify payment" }, 500);
    }
});

export default sessionRoute;