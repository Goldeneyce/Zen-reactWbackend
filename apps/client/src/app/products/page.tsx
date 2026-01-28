// app/products/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Searchbar from '@/components/Searchbar';
import ProductList from '@/components/ProductList';
import Filter from '@/components/Filter';
import SortDropdown from '@/components/SortDropdown';
import CTA from '@/components/CTA';
import type { ProductType } from '@repo/types';
import { getProducts } from '@/lib/api';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('newest');
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get search query from URL
  const searchQuery = searchParams.get('search') || '';

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'power', label: 'Power & Energy' },
    { id: 'appliances', label: 'Home Appliances' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'kitchen', label: 'Kitchen Essentials' },
    { id: 'security', label: 'Security' },
    { id: 'cooling', label: 'Cooling' },
  ];

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);
        const data = await getProducts({
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          search: searchQuery || undefined,
          sort: selectedSort as 'newest' | 'oldest' | 'price-asc' | 'price-desc'
        });
        setProducts(data);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedCategory, searchQuery, selectedSort]);

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
          <SortDropdown
            selectedSort={selectedSort}
            onSelectSort={setSelectedSort}
          />
          
          
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Loading products...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          
          {!loading && !error && <ProductList products={filteredProducts} />}
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
