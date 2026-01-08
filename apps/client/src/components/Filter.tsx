// components/Filter.tsx
'use client';

import React from 'react';

interface FilterProps {
  categories: { id: string; label: string }[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function Filter({ categories, selectedCategory, onSelectCategory }: FilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            selectedCategory === category.id
              ? 'bg-primary text-white border-primary'
              : 'border-primary text-primary hover:bg-primary hover:text-white'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}