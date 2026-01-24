import { default as Paystack } from "paystack";

// Initialize Paystack client with secret key
const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY as string);

/**
 * Initialize a Paystack transaction for a product purchase
 * @param email - Customer's email address
 * @param amount - Amount in Naira (will be converted to kobo)
 * @param name - Customer's full name
 * @param callback_url - URL to redirect to after payment (optional)
 * @param reference - Unique transaction reference (optional, will be auto-generated if not provided)
 * @param metadata - Additional data to attach to the transaction (productId, etc.)
 * @returns Transaction initialization response with authorization URL
 */
export const initializePaystackTransaction = async (
    email: string,
    amount: number,
    name: string,
    callback_url?: string,
    reference?: string,
    metadata?: Record<string, any>
) => {
    try {
        const transactionRef = reference || `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        console.log("Initializing Paystack transaction with:", {
            email,
            amount: Math.round(amount * 100),
            reference: transactionRef,
            callback_url,
            metadata: { ...metadata, customer_name: name }
        });

        const res = await paystack.transaction.initialize({
            email,
            amount: Math.round(amount * 100), // Convert to kobo and ensure integer
            reference: transactionRef,
            callback_url,
            metadata: {
                ...metadata,
                customer_name: name, // Add name to metadata instead
            },
        });
        
        console.log("Paystack initialization result:", res);
        return res;
    } catch (error) {
        console.error("Error initializing Paystack transaction:", error);
        throw error;
    }
};

/**
 * Verify a Paystack transaction using the reference
 * This should be called after payment to ensure the transaction was successful
 * and the amount paid matches what was expected
 * @param reference - Transaction reference from Paystack
 * @returns Transaction verification response
 */
export const verifyPaystackTransaction = async (reference: string) => {
    try {
        const res = await paystack.transaction.verify(reference);
        return res;
    } catch (error) {
        console.error("Error verifying Paystack transaction:", error);
        throw error;
    }
};

// Export the Paystack client instance as default
export default paystack;
