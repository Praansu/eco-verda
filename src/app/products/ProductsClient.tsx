"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string;
  category: { name: string; slug: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

function debounce<T extends (value: string) => void>(fn: T, ms: number): T {
  let timeoutId: ReturnType<typeof setTimeout>;
  return ((value: string) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(value), ms);
  }) as T;
}

export default function ProductsClient({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initialize from URL
  const initialSearch = searchParams.get("q") || "";
  const initialCategory = searchParams.get("cat") || "all";

  const [search, setSearch] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  // Debounced search setter
  const setDebouncedSearchFn = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 300),
    []
  );

  // Sync URL when search or category changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("q", debouncedSearch);
    if (activeCategory !== "all") params.set("cat", activeCategory);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debouncedSearch, activeCategory, router, pathname]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !debouncedSearch ||
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesCategory =
        activeCategory === "all" || p.category.slug === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, debouncedSearch, activeCategory]);

  // Find related categories when no results
  const relatedCategories = useMemo(() => {
    if (filtered.length > 0) return [];
    const matchingProducts = products.filter((p) => {
      const matchesSearch =
        !debouncedSearch ||
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesSearch;
    });
    const categorySlugs = new Set(matchingProducts.map((p) => p.category.slug));
    return categories.filter((c) => categorySlugs.has(c.slug));
  }, [products, categories, debouncedSearch, filtered.length]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setDebouncedSearchFn(value);
  };

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
  };

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setActiveCategory("all");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-3xl sm:text-4xl text-center text-[#1b4d3e] dark:text-[#4caf7a] mb-4">
        Our Sustainable Shop
      </h1>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto">
        Every product is ethically sourced, eco-friendly, and built to last.
      </p>

      {/* Search */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2b24] text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 dark:focus:ring-[#4caf7a]/20 dark:text-gray-200"
          />
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <button
          onClick={() => handleCategoryChange("all")}
          className={`px-5 py-2 rounded-full text-sm font-medium transition ${
            activeCategory === "all"
              ? "bg-[#1b4d3e] text-white"
              : "bg-white dark:bg-[#1a2b24] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-[#1b4d3e] dark:hover:border-[#4caf7a]"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.slug)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              activeCategory === cat.slug
                ? "bg-[#1b4d3e] text-white"
                : "bg-white dark:bg-[#1a2b24] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-[#1b4d3e] dark:hover:border-[#4caf7a]"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Active filters badge */}
      {(debouncedSearch || activeCategory !== "all") && (
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {debouncedSearch && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1b4d3e]/10 text-[#1b4d3e] dark:bg-[#4caf7a]/10 dark:text-[#4caf7a] text-sm">
              <span>"{debouncedSearch}"</span>
              <button
                onClick={() => {
                  setSearch("");
                  setDebouncedSearch("");
                }}
                className="hover:text-[#1b4d3e]/70 dark:hover:text-[#4caf7a]/70"
              >
                ✕
              </button>
            </span>
          )}
          {activeCategory !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1b4d3e]/10 text-[#1b4d3e] dark:bg-[#4caf7a]/10 dark:text-[#4caf7a] text-sm">
              <span>{categories.find((c) => c.slug === activeCategory)?.name}</span>
              <button
                onClick={() => setActiveCategory("all")}
                className="hover:text-[#1b4d3e]/70 dark:hover:text-[#4caf7a]/70"
              >
                ✕
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="px-3 py-1.5 rounded-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Products grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            No products found for <span className="font-medium">"{debouncedSearch || 'your filters'}"</span>
          </p>
          {relatedCategories.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                But we have matches in these categories:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {relatedCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-white dark:bg-[#1a2b24] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-[#1b4d3e] dark:hover:border-[#4caf7a] hover:bg-[#1b4d3e]/5 dark:hover:bg-[#4caf7a]/5 transition"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={clearFilters}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1b4d3e] text-white font-medium hover:bg-[#143d30] transition"
          >
            <span className="text-lg">✕</span> Clear all filters
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6 text-sm text-gray-500 dark:text-gray-400 text-center">
            Showing <span className="font-medium text-[#1b4d3e] dark:text-[#4caf7a]">{filtered.length}</span> of{" "}
            <span className="font-medium">{products.length}</span> products
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}