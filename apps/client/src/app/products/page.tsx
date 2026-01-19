// app/products/page.tsx
'use client';

import { useState } from 'react';
import Searchbar from '@/components/Searchbar';
import ProductList from '@/components/ProductList';
import Filter from '@/components/Filter';
import CTA from '@/components/CTA';
import type { ProductType } from '@repo/types';
import { products as mockProducts } from '@/data/products';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Using mock products data - in a real app, this would come from an API
  const products: ProductType[] = mockProducts;

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'power', label: 'Power & Energy' },
    { id: 'appliances', label: 'Home Appliances' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'kitchen', label: 'Kitchen Essentials' },
    { id: 'security', label: 'Security' },
    { id: 'cooling', label: 'Cooling' },
  ];

  // Note: products from DB don't have category field directly (it's a many-to-many relationship)
  // Filter by category would need to access product.categories relationship
  const filteredProducts = products;

  return (
    <>
      <div className="py-8">
        <div className="container">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
              Featured Products
            </h1>
           {/*  <p className="text-gray-600 dark:text-gray-300">
              Explore our wide range of high-quality electronics and appliances
            </p> */}
          </div>
          
          <Searchbar className="mb-8" />
          
          <Filter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          
          <ProductList products={filteredProducts} />
        </div>
      </div>
      
      <CTA
        title="Can't Find What You're Looking For?"
        description="Contact us for custom solutions or special orders"
        primaryButton={{ text: 'Get in Touch', href: '/contact' }}
      />
    </>
  );
}
