"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function CheckoutForm({ total }: { total: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast.error("Address is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, phone }),
      });
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Order placed successfully! 🌱");
        router.push(`/orders/${data.id}`);
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Delivery Address *
        </label>
        <textarea
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2b24] text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 dark:text-gray-200"
          placeholder="Street, city, zip code..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Phone (optional)
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2b24] text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4d3e]/20 dark:text-gray-200"
          placeholder="98xxxxxxxx"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-full bg-[#1b4d3e] text-white font-semibold text-sm hover:bg-[#143d30] transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Processing..." : `Pay Rs. ${total.toLocaleString("en-IN")}`}
      </button>
      <p className="text-xs text-gray-400 text-center">
        This is a demo. No real payment will be processed.
      </p>
    </form>
  );
}
