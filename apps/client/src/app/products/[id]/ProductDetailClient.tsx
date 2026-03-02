// app/products/[id]/ProductDetailClient.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { toast } from "react-toastify";
import { useCartStore } from '@/stores/cartStore';
import useWishlistStore from '@/stores/wishlistStore';
import Searchbar from '@/components/Searchbar';
import { formatPrice } from '@/lib/formatPrice';
import ProductInteraction from '@/components/ProductInteraction';
import CTA from '@/components/CTA';
import type { ProductType } from '@repo/types';
import {
  StarIcon,
  StarHalfIcon,
  HeartIcon,
  HeartOutlineIcon,
  ShareIcon,
} from '@/components/Icons';

export default function ProductDetailClient({ product }: { product: ProductType }) {
  const [selectedImage, setSelectedImage] = useState(product.images?.[0] ?? product.image);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product.colors?.[0]);
  const addItem = useCartStore((state) => state.addItem);
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const isWishlisted = useWishlistStore((state) => state.items.some((item) => item.id === product.id));

  const renderRating = () => {
    const stars = [];
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={`star-${i}`} className="w-5 h-5 text-accent" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalfIcon key="half-star" className="w-5 h-5 text-accent" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} className="w-5 h-5 text-gray-300" />);
    }

    return stars;
  };

  const handleAddToCart = () => {
    addItem(product, quantity, { size: selectedSize, color: selectedColor });
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    addItem(product, quantity, { size: selectedSize, color: selectedColor });
    window.location.href = '/cart';
  };

  const toggleWishlist = () => {
    toggleItem(product);
    if (isWishlisted) {
      toast.info(`${product.name} removed from wishlist`);
    } else {
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <>
      <Searchbar className="my-8" />
      
      <section className="py-8 bg-white dark:bg-white-dark">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Gallery */}
            <div className="space-y-4">
              <div className="relative h-100 rounded-lg overflow-hidden cursor-pointer">
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              
              <div className="flex gap-2">
                {product.images?.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`relative w-20 h-20 rounded overflow-hidden border-2 ${
                      selectedImage === image 
                        ? 'border-secondary' 
                        : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <span className="text-secondary font-medium">
                  Product
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-primary mt-1">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    {renderRating()}
                    <span className="ml-2 text-gray-600 dark:text-gray-300">
                      ({product.reviews} reviews)
                    </span>
                  </div>
                  <span className="text-gray-500 text-sm">
                    SKU: ZP-{product.id.toUpperCase()}-2023
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
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
                      <HeartIcon className="w-6 h-6 text-secondary" />
                    ) : (
                      <HeartOutlineIcon className="w-6 h-6" />
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Share product"
                  >
                    <ShareIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300">
                  {product.description}
                </p>
              </div>
              
              <div>
                {product.colors?.length ? (
                  <div className="mb-4">
                    <h4 className="font-semibold text-primary mb-2">Colors</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color: string) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-3 py-2 border rounded-full text-sm transition-colors ${
                            selectedColor === color
                              ? 'border-secondary bg-secondary/10 text-secondary'
                              : 'border-gray-300 hover:border-secondary'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {product.sizes?.length ? (
                  <div className="mb-4">
                    <h4 className="font-semibold text-primary mb-2">Sizes</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size: string) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-2 border rounded-full text-sm transition-colors ${
                            selectedSize === size
                              ? 'border-secondary bg-secondary/10 text-secondary'
                              : 'border-gray-300 hover:border-secondary'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <h3 className="text-xl font-bold text-primary mb-3">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                      <span className="text-secondary mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <ProductInteraction
                product={product}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div>
                  <strong>Category:</strong> N/A
                </div>
                <div>
                  <strong>Availability:</strong>{' '}
                  <span className={product.inStock ? 'text-secondary' : 'text-red-500'}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div>
                  <strong>Shipping:</strong> Free on orders over ₦500
                </div>
              </div>

              {(product.weight || product.length || product.width || product.height) && (
                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-primary">Shipping Details</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    {product.weight != null && (
                      <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Weight</span>
                        <span className="font-medium text-primary">{product.weight} kg</span>
                      </div>
                    )}
                    {product.length != null && (
                      <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Length</span>
                        <span className="font-medium text-primary">{product.length} cm</span>
                      </div>
                    )}
                    {product.width != null && (
                      <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Width</span>
                        <span className="font-medium text-primary">{product.width} cm</span>
                      </div>
                    )}
                    {product.height != null && (
                      <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Height</span>
                        <span className="font-medium text-primary">{product.height} cm</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <CTA
        title="Need Help Choosing the Right Product?"
        description="Our experts are ready to help you find the perfect solution for your needs."
        primaryButton={{ text: 'Contact Our Experts', href: '/contact' }}
        secondaryButton={{ text: 'Browse All Products', href: '/products' }}
      />
    </>
  );
}
