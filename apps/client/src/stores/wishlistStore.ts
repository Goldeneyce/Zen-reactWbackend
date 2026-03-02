import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProductType } from '@repo/types'
import { getSupabaseBrowserClient } from '@/lib/supabaseClient'

const WISHLIST_SERVICE =
  process.env.NEXT_PUBLIC_WISHLIST_SERVICE_URL ?? 'http://localhost:8006'
const PRODUCT_SERVICE =
  process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL ?? 'http://localhost:8000'

/* ── helpers ── */
async function getToken(): Promise<string | null> {
  const supabase = getSupabaseBrowserClient()
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

async function apiAdd(productId: string, token: string) {
  await fetch(`${WISHLIST_SERVICE}/wishlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ productId }),
  })
}

async function apiRemove(productId: string, token: string) {
  await fetch(`${WISHLIST_SERVICE}/wishlist/${productId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

async function apiClear(token: string) {
  await fetch(`${WISHLIST_SERVICE}/wishlist`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

async function apiFetchIds(token: string): Promise<string[]> {
  const res = await fetch(`${WISHLIST_SERVICE}/wishlist`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.productIds ?? []
}

async function fetchProductsByIds(ids: string[]): Promise<ProductType[]> {
  if (ids.length === 0) return []
  const res = await fetch(
    `${PRODUCT_SERVICE}/products/bulk?ids=${ids.join(',')}`
  )
  if (!res.ok) return []
  return res.json()
}

/* ── store ── */
interface WishlistStore {
  items: ProductType[]
  /** true while hydrating from backend on login */
  syncing: boolean
  addItem: (product: ProductType) => Promise<boolean>
  removeItem: (productId: string) => Promise<boolean>
  clearWishlist: () => Promise<boolean>
  isInWishlist: (productId: string) => boolean
  toggleItem: (product: ProductType) => Promise<boolean>
  getItemCount: () => number
  /** Pull the canonical list from the backend and refresh product data */
  syncFromBackend: () => Promise<void>
}

const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [] as ProductType[],
      syncing: false,

      addItem: async (product: ProductType): Promise<boolean> => {
        const token = await getToken()
        if (!token) return false // not logged in

        // optimistic
        set((state) => {
          if (state.items.some((i) => i.id === product.id)) return state
          return { items: [...state.items, product] }
        })

        try { await apiAdd(product.id, token) } catch { /* backend fire-and-forget */ }
        return true
      },

      removeItem: async (productId: string): Promise<boolean> => {
        const token = await getToken()
        if (!token) return false

        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        }))

        try { await apiRemove(productId, token) } catch { /* */ }
        return true
      },

      clearWishlist: async (): Promise<boolean> => {
        const token = await getToken()
        if (!token) return false

        set({ items: [] })

        try { await apiClear(token) } catch { /* */ }
        return true
      },

      isInWishlist: (productId: string): boolean => {
        return get().items.some((i) => i.id === productId)
      },

      toggleItem: async (product: ProductType): Promise<boolean> => {
        if (get().isInWishlist(product.id)) {
          return get().removeItem(product.id)
        } else {
          return get().addItem(product)
        }
      },

      getItemCount: (): number => get().items.length,

      syncFromBackend: async (): Promise<void> => {
        const token = await getToken()
        if (!token) {
          // Logged out — clear wishlist
          set({ items: [], syncing: false })
          return
        }

        set({ syncing: true })
        try {
          const ids = await apiFetchIds(token)
          const products = await fetchProductsByIds(ids)
          set({ items: products })
        } catch {
          // keep whatever is in localStorage
        } finally {
          set({ syncing: false })
        }
      },
    }),
    {
      name: 'wishlist-storage',
      version: 2,
    }
  )
)

export default useWishlistStore
