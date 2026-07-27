"use client";

import { useState, useMemo } from "react";
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

export default function ProductsClient({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "all" || p.category.slug === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, activeCategory]);

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
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2b24] text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 dark:focus:ring-[#4caf7a]/20 dark:text-gray-200"
          />
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <button
          onClick={() => setActiveCategory("all")}
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
            onClick={() => setActiveCategory(cat.slug)}
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

      {/* Products grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No products found.</p>
          <p className="text-sm mt-1">Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}
