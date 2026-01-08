// components/ShoppingCartIcon.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCartIcon } from './Icons';
import { useCartStore } from '@/stores/cartStore';

export default function ShoppingCartIconWithBadge() {
  const pathname = usePathname();
  const { getTotalItems, hasHydrated } = useCartStore();
  const itemCount = getTotalItems();
  const isCartPage = pathname === '/cart';

  return (
    <Link 
      href="/cart" 
      className={`relative p-2 transition-colors ${
        isCartPage 
          ? 'text-[var(--color-secondary)]' 
          : 'text-[var(--color-dark)] dark:text-[var(--color-dark-light)] hover:text-[var(--color-secondary)]'
      }`}
    >
      <ShoppingCartIcon className="w-6 h-6" />
      {hasHydrated && itemCount > 0 && (
        <span className="icon-badge">{itemCount}</span>
      )}
    </Link>
  );
}