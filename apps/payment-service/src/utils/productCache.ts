import { ProductType } from "@repo/types";

/**
 * In-memory cache for product data
 * Reduces API calls to product-service for price verification
 */
class ProductCache {
    private cache: Map<string, ProductType> = new Map();

    set(product: ProductType): void {
        this.cache.set(product.id, product);
        console.log(`✅ Cached product: ${product.id} - ${product.name} (₦${product.price})`);
    }

    get(productId: string): ProductType | undefined {
        return this.cache.get(productId);
    }

    getMany(productIds: string[]): ProductType[] {
        return productIds
            .map(id => this.cache.get(id))
            .filter((p): p is ProductType => p !== undefined);
    }

    delete(productId: string): boolean {
        const deleted = this.cache.delete(productId);
        if (deleted) {
            console.log(`🗑️  Removed product from cache: ${productId}`);
        }
        return deleted;
    }

    has(productId: string): boolean {
        return this.cache.has(productId);
    }

    clear(): void {
        this.cache.clear();
        console.log("🧹 Product cache cleared");
    }

    size(): number {
        return this.cache.size;
    }

    getAll(): ProductType[] {
        return Array.from(this.cache.values());
    }
}

export const productCache = new ProductCache();
