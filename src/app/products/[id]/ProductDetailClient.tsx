"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { addToCart } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProductDetailClient({
  product,
}: {
  product: { id: string; name: string; stock: number };
}) {
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleAdd = async () => {
    if (!session) {
      router.push("/auth/login");
      return;
    }
    setAdding(true);
    const result = await addToCart(product.id, qty);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Added ${qty} × ${product.name} to cart`);
    }
    setAdding(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-500">Qty:</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm"
          >
            −
          </button>
          <span className="text-lg font-medium w-8 text-center">{qty}</span>
          <button
            onClick={() => setQty(Math.min(product.stock, qty + 1))}
            className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm"
          >
            +
          </button>
        </div>
      </div>
      <button
        onClick={handleAdd}
        disabled={adding}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#1b4d3e] text-white font-semibold text-sm hover:bg-[#143d30] transition disabled:opacity-50"
      >
        <ShoppingCart className="w-4 h-4" />
        {adding ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
}
