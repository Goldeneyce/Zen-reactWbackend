/** Wishlist item stored in Redis (ID only — hydrated via Gateway) */
export interface WishlistEntry {
  productId: string;
  addedAt: number;
}

/** Browsing history entry stored in Redis */
export interface HistoryEntry {
  productId: string;
  viewedAt: number;
}

/** Cart item stored in Redis (no product details — hydrated via Gateway) */
export interface CartItemStored {
  productId: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  addedAt: number;
}

/** Hydrated wishlist item returned by the Gateway */
export interface HydratedWishlistItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  [key: string]: unknown;
}

/** Hydrated cart item returned by the Gateway */
export interface HydratedCartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  addedAt: number;
  lineTotal: number;
  [key: string]: unknown;
}

/** Hydrated history item returned by the Gateway */
export interface HydratedHistoryItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  viewedAt: number;
  [key: string]: unknown;
}
