// components/Searchbar.tsx
'use client';

import { useState } from 'react';
import { SearchIcon } from './Icons';

interface SearchbarProps {
  className?: string;
  onSearch?: (query: string) => void;
}

export default function Searchbar({ className = '', onSearch }: SearchbarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
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