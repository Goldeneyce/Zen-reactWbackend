import { Hono } from "hono";
import { shouldBeUser } from "../middleware/authMiddleware.js";
import { initializePaystackTransaction, verifyPaystackTransaction } from "../utils/paystack.js";
import { calculateOrderTotal } from "../utils/productService.js";

const sessionRoute = new Hono();

/**
 * POST /create-checkout-session
 * Initialize a Paystack checkout session
 */
sessionRoute.post("/create-checkout-session", shouldBeUser, async (c) => {

    const userId = c.get("userId");

    try {
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
        console.log("Cart received:", JSON.stringify(cart, null, 2));
        
        // Validate cart items have required fields
        for (const item of cart) {
            if (!item.id || !item.quantity || item.quantity < 1) {
                console.error("Invalid cart item:", item);
                return c.json({ error: "Invalid cart item format. Each item must have 'id' and 'quantity'" }, 400);
            }
        }
        
        // Cart has id (which is productId), quantity, and price (for fallback)
        const cartItems = cart.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price  // Fallback price for placeholder products
        }));
        console.log("Cart items for calculation:", JSON.stringify(cartItems, null, 2));
        
        // Calculate total using productService utility
        let calculatedAmount: number;
        try {
            calculatedAmount = await calculateOrderTotal(cartItems);
            console.log(`Total calculated amount: ₦${calculatedAmount}`);
        } catch (calcError) {
            console.error("Error calculating order total:", calcError);
            return c.json({ 
                error: "Failed to calculate order total", 
                details: calcError instanceof Error ? calcError.message : "Unknown error" 
            }, 500);
        }
        
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
sessionRoute.get("/verify-payment/:reference", shouldBeUser, async (c) => {
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