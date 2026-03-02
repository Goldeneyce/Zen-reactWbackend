"use client";

import Link from "next/link";
import Image from "next/image";
import useWishlistStore from "@/stores/wishlistStore";
import { formatPrice } from "@/lib/formatPrice";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "react-toastify";

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const addItem = useCartStore((state) => state.addItem);

  const totalCount = items.length;

  const handleAddToCart = (product: (typeof items)[0]) => {
    addItem(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 bg-gradient-to-br from-white via-white to-secondary/10 dark:from-white-dark dark:via-white-dark dark:to-secondary/10 p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-secondary">Wishlist</p>
          <h1 className="mt-2 text-3xl font-semibold text-dark dark:text-gray-100">Your wishlist</h1>
          <p className="mt-2 text-sm text-gray-500">Save products you love and come back anytime.</p>
        </div>

        {totalCount === 0 ? (
          <div className="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 bg-white dark:bg-white-dark p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold">Your wishlist is empty</h2>
            <p className="mt-2 text-sm text-gray-500">Browse products and add items to your wishlist.</p>
            <Link href="/products" className="mt-6 btn btn-primary inline-flex items-center justify-center">
              Shop products
            </Link>
          </div>
        ) : (
          <section className="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 bg-white dark:bg-white-dark p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-gray-500">{totalCount} item{totalCount > 1 ? "s" : ""}</p>
              <button
                onClick={clearWishlist}
                className="btn btn-outline"
              >
                Clear wishlist
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-gray-200/70 dark:border-gray-700/70 p-4 flex flex-col gap-4">
                  <div className="aspect-[4/3] rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center overflow-hidden relative">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <span className="text-sm text-gray-400">No image</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-dark dark:text-gray-100">{item.name}</h3>
                    {typeof item.price === "number" && (
                      <p className="mt-1 text-sm text-secondary">{formatPrice(item.price)}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/products/${item.slug}`}
                      className="btn btn-primary flex-1 text-center"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="btn btn-buy flex-1 text-center"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="btn btn-outline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
