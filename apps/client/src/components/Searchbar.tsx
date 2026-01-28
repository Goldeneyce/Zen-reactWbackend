// components/Searchbar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon } from "./Icons";
import { getProducts } from "@/lib/api";
import type { ProductType } from "@repo/types";

interface SearchbarProps {
  className?: string;
}

export default function Searchbar({ className = "" }: SearchbarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [suggestions, setSuggestions] = useState<ProductType[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync input with URL parameter when navigating back/forward
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search for suggestions
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setIsLoading(true);
        const results = await getProducts({ search: searchQuery, limit: 5 });
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    } else {
      params.delete("search");
    }
    setShowSuggestions(false);
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const handleSuggestionClick = (product: ProductType) => {
    setSearchQuery(product.name);
    setShowSuggestions(false);
    router.push(`/products/${product.slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      const selectedProduct = suggestions[selectedIndex];
      if (selectedProduct) {
        handleSuggestionClick(selectedProduct);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          className="flex-1"
          aria-label="Search products"
          autoComplete="off"
        />
        <button
          type="submit"
          className="p-3"
          aria-label="Search"
        >
          <SearchIcon className="w-5 h-5" />
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              Loading...
            </div>
          ) : (
            <ul>
              {suggestions.map((product, index) => (
                <li
                  key={product.id}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    index === selectedIndex ? "bg-gray-100 dark:bg-gray-700" : ""
                  }`}
                  onClick={() => handleSuggestionClick(product)}
                >
                  <div className="flex items-center gap-3">
                    {product.images && product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ₦{product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}