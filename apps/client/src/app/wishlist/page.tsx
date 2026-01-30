"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

interface WishlistItem {
  id: string;
  name: string;
  price?: number;
  image?: string;
  href?: string;
}

const STORAGE_KEY = "zen_wishlist";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setItems(JSON.parse(raw));
      } catch {
        setItems([]);
      }
    }
    setLoaded(true);
  }, []);

  const totalCount = useMemo(() => items.length, [items]);

  const persist = (next: WishlistItem[]) => {
    setItems(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const removeItem = (id: string) => {
    persist(items.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    persist([]);
  };

  if (!loaded) {
    return <div className="container py-12">Loading wishlist…</div>;
  }

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
                onClick={clearAll}
                className="btn btn-outline"
              >
                Clear wishlist
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-gray-200/70 dark:border-gray-700/70 p-4 flex flex-col gap-4">
                  <div className="aspect-[4/3] rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-sm text-gray-400">No image</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-dark dark:text-gray-100">{item.name}</h3>
                    {typeof item.price === "number" && (
                      <p className="mt-1 text-sm text-secondary">₦{item.price.toLocaleString()}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={item.href ?? "/products"}
                      className="btn btn-primary flex-1 text-center"
                    >
                      View
                    </Link>
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
