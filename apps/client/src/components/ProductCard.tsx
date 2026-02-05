// components/ProductCard.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from "react-toastify";
import { useCartStore } from '@/stores/cartStore';
import type { ProductType, CategoryType } from '@repo/types';
import {
  StarIcon,
  StarHalfIcon,
  HeartIcon,
  HeartOutlineIcon,
  ShareIcon,
} from './Icons';

interface ProductCardProps {
  product: ProductType & {
    categories?: Array<{
      category: CategoryType;
    }>;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const renderRating = () => {
    const stars = [];
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={`star-${i}`} className="w-4 h-4 text-accent" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalfIcon key="half-star" className="w-4 h-4 text-accent" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  const handleAddToCart = () => {
    addItem(product, 1);
    // Show notification (you can implement a toast system)
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    addItem(product, 1);
    window.location.href = '/cart';
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // In real app, this would update wishlist in store/API
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.origin + `/products/${product.slug}`,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.origin + `/products/${product.slug}`);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="bg-white dark:bg-white-dark rounded-lg shadow-custom dark:shadow-dark-custom overflow-hidden hover:-translate-y-2 transition-transform duration-300 relative">
      {/* Product Badge */}
      {product.badge && (
        <div className="absolute top-3 left-3 bg-accent text-dark px-3 py-1 rounded text-xs font-semibold z-10">
          {product.badge}
        </div>
      )}
      
      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative h-64 overflow-hidden group">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </Link>
      
      {/* Product Content */}
      <div className="p-6">
        <Link href={`/products/${product.slug}`}>
          <span className="text-secondary text-sm font-medium block mb-1">
            {product.categories && product.categories.length > 0 && product.categories[0]?.category
              ? product.categories[0].category.name.charAt(0).toUpperCase() + product.categories[0].category.name.slice(1)
              : 'N/A'}
          </span>
          <h3 className="text-lg font-semibold text-primary mb-2 hover:text-secondary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        {/* Price and Actions */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              ₦{product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-gray-500 line-through text-sm">
                ₦{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleWishlist}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isWishlisted ? (
                <HeartIcon className="w-5 h-5 text-secondary" />
              ) : (
                <HeartOutlineIcon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Share product"
            >
              <ShareIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {renderRating()}
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
            ({product.reviews})
          </span>
        </div>

        {/* Pay on Delivery Tag */}
        {product.payOnDelivery && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold px-2.5 py-1 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Pay on Delivery
            </span>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleAddToCart}
            className="btn btn-primary flex-1"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="btn btn-buy flex-1"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}