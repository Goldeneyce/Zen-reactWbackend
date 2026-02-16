import { PRODUCT_SERVICE_URL } from "./services.js";

/**
 * Call the product-service bulk endpoint to hydrate a list of product IDs
 * into full product objects.
 *
 *   GET /products/bulk?ids=p1,p2,p3
 *
 * Returns the products array (order is not guaranteed).
 */
export const fetchProductsByIds = async (ids: string[]): Promise<any[]> => {
  if (ids.length === 0) return [];

  const url = `${PRODUCT_SERVICE_URL}/products/bulk?ids=${ids.join(",")}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    console.error(`[gateway] Product bulk fetch failed: ${res.status}`);
    return [];
  }

  return (await res.json()) as any[];
};
