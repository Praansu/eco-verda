"use client";

import { useEffect, useState } from "react";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { updateCartItem, removeCartItem } from "@/lib/actions";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: string;
  };
}

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { data: session } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && session?.user) {
      fetchCart();
    } else if (open) {
      setLoading(false);
    }
  }, [open, session]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch {
      setItems([]);
      setTotal(0);
    }
    setLoading(false);
  };

  const handleUpdateQty = async (itemId: string, newQty: number) => {
    await updateCartItem(itemId, newQty);
    fetchCart();
  };

  const handleRemove = async (itemId: string) => {
    await removeCartItem(itemId);
    fetchCart();
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-[#0f1a16] z-50 shadow-xl flex flex-col transition-transform">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-serif text-xl font-semibold text-gray-800 dark:text-gray-200">
            Your Cart
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!session?.user ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Sign in to view your cart</p>
              <Link
                href="/auth/login"
                onClick={onClose}
                className="inline-flex px-6 py-2.5 rounded-xl bg-[#1b4d3e] text-white text-sm font-medium"
              >
                Sign In
              </Link>
            </div>
          ) : loading ? (
            <div className="text-center py-12 text-gray-400">Loading...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Your cart is empty</p>
              <Link
                href="/products"
                onClick={onClose}
                className="inline-flex px-6 py-2.5 rounded-xl bg-[#1b4d3e] text-white text-sm font-medium"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
              >
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
                  <Image
                    src={JSON.parse(item.product.images)[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.product.id}`}
                    onClick={onClose}
                    className="font-medium text-sm text-gray-800 dark:text-gray-200 hover:text-[#1b4d3e] dark:hover:text-[#4caf7a] transition line-clamp-1"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm font-semibold text-[#1b4d3e] dark:text-[#4caf7a] mt-1">
                    Rs. {item.product.price.toLocaleString("en-IN")}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="ml-auto p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {session?.user && items.length > 0 && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
            <div className="flex justify-between text-lg font-semibold text-gray-800 dark:text-gray-200">
              <span>Total</span>
              <span>Rs. {total.toLocaleString("en-IN")}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full text-center py-3 rounded-xl bg-[#1b4d3e] text-white font-medium hover:bg-[#143d30] transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
