// components/ProductList.tsx
'use client';

import React from 'react';
import type { ProductType } from '@repo/types';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: ProductType[];
}

export default function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
          No products found
        </h3>
        <p className="text-gray-500">Try selecting a different category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}