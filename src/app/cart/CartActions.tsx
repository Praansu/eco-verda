"use client";

import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { updateCartItem, removeCartItem } from "@/lib/actions";

export function CartActions({
  itemId,
  quantity,
}: {
  itemId: string;
  quantity: number;
}) {
  const router = useRouter();

  const handleQty = async (delta: number) => {
    const newQty = quantity + delta;
    await updateCartItem(itemId, newQty);
    router.refresh();
  };

  const handleRemove = async () => {
    await removeCartItem(itemId);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <button
        onClick={() => handleQty(-1)}
        className="w-7 h-7 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <Minus className="w-3 h-3" />
      </button>
      <span className="text-sm font-medium w-6 text-center">{quantity}</span>
      <button
        onClick={() => handleQty(1)}
        className="w-7 h-7 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <Plus className="w-3 h-3" />
      </button>
      <button
        onClick={handleRemove}
        className="ml-2 p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
