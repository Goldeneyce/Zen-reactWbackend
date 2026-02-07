/**
 * Upstream service URLs – configure via env or fall back to defaults.
 */
export const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL ?? "http://localhost:8000";

export const HISTORY_SERVICE_URL =
  process.env.HISTORY_SERVICE_URL ?? "http://localhost:8003";

export const CART_SERVICE_URL =
  process.env.CART_SERVICE_URL ?? "http://localhost:8004";
