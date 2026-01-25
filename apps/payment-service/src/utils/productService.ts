import { ProductType } from "@repo/types";

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || "http://localhost:8000";

/**
 * Fetch product details from the product-service
 * This ensures payment-service uses the product-service as the source of truth for prices
 * @param productId - The product ID
 * @returns Product details including current price
 */
export const getProductById = async (productId: string): Promise<ProductType> => {
    try {
        const response = await fetch(`${PRODUCT_SERVICE_URL}/products/${productId}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch product: ${response.statusText}`);
        }
        
        const product = await response.json();
        return product;
    } catch (error) {
        console.error(`Error fetching product ${productId} from product-service:`, error);
        throw error;
    }
};

/**
 * Fetch multiple products by their IDs
 * @param productIds - Array of product IDs
 * @returns Array of products with their current prices
 */
export const getProductsByIds = async (productIds: string[]): Promise<ProductType[]> => {
    try {
        const products = await Promise.all(
            productIds.map(id => getProductById(id))
        );
        return products;
    } catch (error) {
        console.error("Error fetching products from product-service:", error);
        throw error;
    }
};

/**
 * Calculate total price for a cart/order
 * Fetches current prices from product-service to prevent price manipulation
 * Falls back to provided prices for placeholder/development products
 * @param items - Array of items with productId, quantity, and optional fallback price
 * @returns Total price in the base currency
 */
export const calculateOrderTotal = async (
    items: Array<{ productId: string; quantity: number; price?: number }>
): Promise<number> => {
    try {
        // Try to fetch products from product-service
        let products;
        try {
            products = await getProductsByIds(items.map(item => item.productId));
        } catch (fetchError) {
            console.warn("Failed to fetch products from product-service, will use fallback prices if available");
            products = [];
        }
        
        const total = items.reduce((sum, item) => {
            const product = products.find(p => p.id === item.productId);
            
            if (product) {
                // Use price from product service (secure)
                console.log(`Using DB price for ${item.productId}: ₦${product.price}`);
                return sum + (product.price * item.quantity);
            } else if (item.price !== undefined) {
                // Fallback to provided price for placeholder products (DEVELOPMENT ONLY)
                console.warn(`⚠️ Using fallback price for placeholder product ${item.productId}: ₦${item.price}`);
                return sum + (item.price * item.quantity);
            } else {
                throw new Error(`Product not found and no fallback price provided: ${item.productId}`);
            }
        }, 0);
        
        return total;
    } catch (error) {
        console.error("Error calculating order total:", error);
        throw error;
    }
};
