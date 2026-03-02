// components/ProductInteraction.tsx
'use client';

import React from 'react';
import { ProductType } from '@repo/types';
import useWishlistStore from '@/stores/wishlistStore';
import { toast } from 'react-toastify';
import { PlusIcon, MinusIcon, HeartIcon, HeartOutlineIcon } from './Icons';

interface ProductInteractionProps {
  product: ProductType;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

export default function ProductInteraction({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
}: ProductInteractionProps) {
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const isWishlisted = isInWishlist(product.id);

  const toggleWishlist = () => {
    toggleItem(product);
    if (isWishlisted) {
      toast.info(`${product.name} removed from wishlist`);
    } else {
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="font-medium text-dark dark:text-gray-100">Quantity:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Decrease quantity"
          >
            <MinusIcon className="w-4 h-4" />
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            max="10"
            className="w-16 h-10 border border-gray-300 dark:border-gray-600 rounded text-center bg-white dark:bg-white-dark text-dark dark:text-gray-100"
          />
          <button
            onClick={() => onQuantityChange(Math.min(10, quantity + 1))}
            className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Increase quantity"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onAddToCart}
          className="btn btn-primary flex-1"
          disabled={!product.inStock}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
        
        <button
          onClick={onBuyNow}
          className="btn btn-buy flex-1"
          disabled={!product.inStock}
        >
          Buy Now
        </button>
        
      </div>
    </div>
  );
}