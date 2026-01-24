import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { shouldBeUser } from "../middleware/authMiddleware.js";
import { initializePaystackTransaction, verifyPaystackTransaction } from "../utils/paystack.js";

const sessionRoute = new Hono();

/**
 * POST /create-checkout-session
 * Initialize a Paystack checkout session
 */
sessionRoute.post("/create-checkout-session", clerkMiddleware(), shouldBeUser, async (c) => {
    try {
        const auth = getAuth(c);
        const body = await c.req.json();
        
        const { email, amount, metadata } = body;

        // Validate required fields
        if (!email || !amount) {
            return c.json({ error: "Email and amount are required" }, 400);
        }

        // Generate unique reference for this transaction
        const reference = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Construct callback URL with session_id
        const callback_url = `http://localhost:3002/return?session_id=${reference}`;

        // Initialize Paystack transaction
        const response = await initializePaystackTransaction(
            email,
            amount,
            callback_url,
            reference,
            metadata
        );

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