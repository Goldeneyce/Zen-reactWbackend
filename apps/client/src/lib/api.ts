import { ProductType } from "@repo/types";

const PRODUCT_SERVICE_URL = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000";

/**
 * Fetch all products from the product-service
 * @param options - Optional query parameters (search, category, limit)
 * @returns Array of products
 */
export async function getProducts(options?: {
  search?: string;
  category?: string;
  limit?: number;
}): Promise<ProductType[]> {
  try {
    const params = new URLSearchParams();
    if (options?.search) params.append("search", options.search);
    if (options?.category) params.append("category", options.category);
    if (options?.limit) params.append("limit", options.limit.toString());

    const url = `${PRODUCT_SERVICE_URL}/products${params.toString() ? `?${params}` : ""}`;
    const response = await fetch(url, {
      cache: "no-store", // Always fetch fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

/**
 * Fetch a single product by ID
 * @param id - Product ID
 * @returns Product details
 */
export async function getProductById(id: string): Promise<ProductType | null> {
  try {
    const response = await fetch(`${PRODUCT_SERVICE_URL}/products/${id}`, {
      cache: "no-store",
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const product = await response.json();
    return product;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
}

/**
 * Search products by query string
 * @param query - Search query
 * @returns Array of matching products
 */
export async function searchProducts(query: string): Promise<ProductType[]> {
  return getProducts({ search: query });
}

/**
 * Get products by category
 * @param category - Category slug or name
 * @returns Array of products in the category
 */
export async function getProductsByCategory(category: string): Promise<ProductType[]> {
  return getProducts({ category });
}
