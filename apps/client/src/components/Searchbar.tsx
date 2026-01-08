// components/Searchbar.tsx
'use client';

import { useState } from 'react';
import { SearchIcon } from './Icons';

interface SearchbarProps {
  className?: string;
}

export default function Searchbar({ className = '' }: SearchbarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
      // You would typically redirect to search results page or filter products
    }
  };

  return (
    <form onSubmit={handleSearch} className={`search-bar ${className}`}>
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1"
        aria-label="Search products"
      />
      <button
        type="submit"
        className="p-3"
        aria-label="Search"
      >
        <SearchIcon className="w-5 h-5" />
      </button>
    </form>
  );
}