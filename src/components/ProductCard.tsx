"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { addToCart } from "@/lib/actions";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string;
  category: { name: string; slug: string };
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  images,
  category,
}: ProductCardProps) {
  const [adding, setAdding] = useState(false);
  const imageUrl = JSON.parse(images)[0];

  const handleAddToCart = async () => {
    setAdding(true);
    const result = await addToCart(id, 1);
    if (result.error) {
      alert(result.error);
    }
    setAdding(false);
  };

  return (
    <div className="group bg-white dark:bg-[#1a2b24] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link href={`/products/${id}`}>
        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 mb-4">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="mb-1">
        <span className="text-xs font-medium text-[#d4a373] uppercase tracking-wider">
          {category.name}
        </span>
      </div>

      <Link href={`/products/${id}`}>
        <h3 className="font-serif text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1 hover:text-[#1b4d3e] dark:hover:text-[#4caf7a] transition">
          {name}
        </h3>
      </Link>

      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
        {description}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-[#1b4d3e] dark:text-[#4caf7a]">
          Rs. {price.toLocaleString("en-IN")}
        </span>
        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1b4d3e] text-white text-sm font-medium hover:bg-[#143d30] transition disabled:opacity-50"
        >
          <ShoppingCart className="w-4 h-4" />
          {adding ? "..." : "Add"}
        </button>
      </div>
    </div>
  );
}
