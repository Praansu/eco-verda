"use client";

import toast from "react-hot-toast";

export default function NewsletterSection() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get("email") as string;

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Thanks for subscribing! 🌿");
        form.reset();
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <div className="rounded-3xl bg-gradient-to-br from-[#1b4d3e] to-[#143d30] p-8 sm:p-16 text-center text-white">
        <h3 className="font-serif text-3xl sm:text-4xl mb-4">
          Stay in the Loop
        </h3>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          Get eco tips, new product drops, and exclusive offers straight to your
          inbox.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            name="email"
            placeholder="Your email address"
            required
            className="flex-1 px-5 py-3.5 rounded-full text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
          />
          <button
            type="submit"
            className="px-8 py-3.5 rounded-full bg-[#d4a373] text-[#1a1a1a] font-semibold text-sm hover:bg-[#c49363] transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
