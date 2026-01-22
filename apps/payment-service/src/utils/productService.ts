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
 * @param items - Array of items with productId and quantity
 * @returns Total price in the base currency
 */
export const calculateOrderTotal = async (
    items: Array<{ productId: string; quantity: number }>
): Promise<number> => {
    try {
        const products = await getProductsByIds(items.map(item => item.productId));
        
        const total = items.reduce((sum, item) => {
            const product = products.find(p => p.id === item.productId);
            if (!product) {
                throw new Error(`Product not found: ${item.productId}`);
            }
            return sum + (product.price * item.quantity);
        }, 0);
        
        return total;
    } catch (error) {
        console.error("Error calculating order total:", error);
        throw error;
    }
};
