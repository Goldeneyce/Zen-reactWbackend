"use client";

import { useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import useWishlistStore from "@/stores/wishlistStore";

/**
 * Invisible component that syncs the Zustand wishlist store
 * with the backend whenever the auth state changes.
 * Mount once in the root layout.
 */
export default function WishlistSync() {
  const syncFromBackend = useWishlistStore((state) => state.syncFromBackend);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    // Sync on mount (covers page refresh while logged in)
    syncFromBackend();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
          syncFromBackend();
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [syncFromBackend]);

  return null;
}
