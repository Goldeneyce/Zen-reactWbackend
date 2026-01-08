import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/types'

interface WishlistStore {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  clearWishlist: () => void
  isInWishlist: (productId: string) => boolean
  toggleItem: (product: Product) => void
  getItemCount: () => number
}

const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [] as Product[],

            addItem: (product: Product): void => {
                set((state: WishlistStore) => {
                    if (state.items.some((item: Product) => item.id === product.id)) {
                        return state // Item already exists
                    }
                    return {
                        items: [...state.items, product]
                    }
                })
            },

            removeItem: (productId: string): void => {
                set((state: WishlistStore) => ({
                    items: state.items.filter((item: Product) => item.id !== productId)
                }))
            },

            clearWishlist: (): void => {
                set({ items: [] })
            },

            isInWishlist: (productId: string): boolean => {
                return get().items.some((item: Product) => item.id === productId)
            },

            toggleItem: (product: Product): void => {
                if (get().isInWishlist(product.id)) {
                    get().removeItem(product.id)
                } else {
                    get().addItem(product)
                }
            },

            getItemCount: (): number => {
                return get().items.length
            }
        } as WishlistStore),
        {
            name: 'wishlist-storage',
            version: 1
        }
    )
)

export default useWishlistStore