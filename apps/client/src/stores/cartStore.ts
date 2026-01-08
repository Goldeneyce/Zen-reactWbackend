// stores/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  hasHydrated: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,
      
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.productId === product.id);
          
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.productId === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          
          return {
            items: [
              ...state.items,
              {
                id: `${product.id}-${Date.now()}`,
                productId: product.id,
                productName: product.name,
                price: product.price,
                quantity,
                image: product.image,
              },
            ],
          };
        });
      },
      
      removeItem: (itemId: string) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== itemId),
        }));
      },
      
      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity < 1) {
          get().removeItem(itemId);
          return;
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'cart-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    }
  )
);