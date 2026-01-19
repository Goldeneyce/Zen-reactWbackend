import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProductType } from '@repo/types'

interface WishlistStore {
  items: ProductType[]
  addItem: (ProductType: ProductType) => void
  removeItem: (productId: string) => void
  clearWishlist: () => void
  isInWishlist: (productId: string) => boolean
  toggleItem: (ProductType: ProductType) => void
  getItemCount: () => number
}

const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [] as ProductType[],

            addItem: (ProductType: ProductType): void => {
                set((state: WishlistStore) => {
                    if (state.items.some((item: ProductType) => item.id === ProductType.id)) {
                        return state // Item already exists
                    }
                    return {
                        items: [...state.items, ProductType]
                    }
                })
            },

            removeItem: (productId: string): void => {
                set((state: WishlistStore) => ({
                    items: state.items.filter((item: ProductType) => item.id !== productId)
                }))
            },

            clearWishlist: (): void => {
                set({ items: [] })
            },

            isInWishlist: (productId: string): boolean => {
                return get().items.some((item: ProductType) => item.id === productId)
            },

            toggleItem: (ProductType: ProductType): void => {
                if (get().isInWishlist(ProductType.id)) {
                    get().removeItem(ProductType.id)
                } else {
                    get().addItem(ProductType)
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
