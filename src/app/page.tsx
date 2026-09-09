import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import NewsletterSection from "@/components/NewsletterSection";
import { placeholders } from "@/lib/placeholders";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { featured: true },
    include: { category: true },
    take: 6,
  });

  const testimonials = [
    { text: "Switched to EcoVerda for my kitchen essentials and haven't looked back. The quality is amazing.", author: "Anisha P." },
    { text: "Love that everything comes in plastic-free packaging. Finally a brand that actually walks the talk.", author: "Rajan S." },
    { text: "The bamboo straws are a game changer. Durable, washable, and look great on the table.", author: "Maya K." },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="flex flex-col md:flex-row min-h-[70vh] bg-white dark:bg-[#0f1a16]">
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-16 bg-gradient-to-br from-[#f0f4f2] to-white dark:from-[#0a1410] dark:to-[#0f1a16]">
          <p className="text-sm font-semibold text-[#d4a373] uppercase tracking-[2px] mb-3">
            Good Morning
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight text-[#1b4d3e] dark:text-[#4caf7a] mb-6">
            Sustainable <br />
            Living,{" "}
            <em className="text-[#d4a373] not-italic">Redefined.</em>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-md mb-8 leading-relaxed">
            Join our mission to protect the planet with high-quality, ethically
            sourced, and zero-waste essentials.
          </p>
          <div className="flex gap-3">
            <Link
              href="/products"
              className="inline-flex px-8 py-3.5 rounded-full bg-[#1b4d3e] text-white font-semibold text-sm hover:bg-[#143d30] transition shadow-lg shadow-[#1b4d3e]/20"
            >
              Start Shopping
            </Link>
            <Link
              href="/products"
              className="inline-flex px-8 py-3.5 rounded-full border-2 border-[#1b4d3e] dark:border-[#4caf7a] text-[#1b4d3e] dark:text-[#4caf7a] font-semibold text-sm hover:bg-[#1b4d3e] hover:text-white dark:hover:bg-[#4caf7a] dark:hover:text-[#0f1a16] transition"
            >
              Explore
            </Link>
          </div>
        </div>
        <div className="flex-1 min-h-[300px] md:min-h-full">
          <Image
            src="/images/eco.jpg"
            alt="Eco lifestyle"
            width={800}
            height={800}
            className="w-full h-full object-cover"
            priority
            blurDataURL={placeholders.eco}
            placeholder="blur"
          />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="font-serif text-3xl sm:text-4xl text-center text-[#1b4d3e] dark:text-[#4caf7a] mb-16">
          Why EcoVerda?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              img: "/images/o.jpg",
              title: "100% Organic",
              desc: "Every product we sell is certified organic and free from harmful chemicals.",
            },
            {
              img: "/images/handmade.jpg",
              title: "Eco-Handmade",
              desc: "Handcrafted by local artisans who share our vision for a greener future.",
            },
            {
              img: "/images/wrapping.jpg",
              title: "Zero Waste",
              desc: "We use 100% biodegradable packaging to ensure no plastic enters our oceans.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group bg-white dark:bg-[#1a2b24] rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-lg"
            >
              <div className="w-full h-56 rounded-2xl overflow-hidden mb-6">
                <Image
                  src={f.img}
                  alt={f.title}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  blurDataURL={placeholders[f.img.split('/').pop()?.split('.')[0] || '']}
                  placeholder="blur"
                />
              </div>
              <h3 className="font-serif text-xl text-[#1b4d3e] dark:text-[#4caf7a] mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white dark:bg-[#0f1a16] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl sm:text-4xl text-center text-[#1b4d3e] dark:text-[#4caf7a] mb-16">
            Featured Collections
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white dark:bg-[#1a2b24] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <Link href={`/products/${product.id}`}>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 mb-4">
                    <Image
                      src={JSON.parse(product.images)[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </Link>
                <div className="mb-1">
                  <span className="text-xs font-medium text-[#d4a373] uppercase tracking-wider">
                    {product.category.name}
                  </span>
                </div>
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-serif text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1 hover:text-[#1b4d3e] dark:hover:text-[#4caf7a] transition">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                  {product.description}
                </p>
                <span className="text-lg font-bold text-[#1b4d3e] dark:text-[#4caf7a]">
                  Rs. {product.price.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex px-8 py-3.5 rounded-full bg-[#1b4d3e] text-white font-semibold text-sm hover:bg-[#143d30] transition"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="font-serif text-3xl sm:text-4xl text-center text-[#1b4d3e] dark:text-[#4caf7a] mb-16">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1a2b24] rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800"
            >
              <div className="text-[#d4a373] text-lg mb-3">
                {"★".repeat(5)}
              </div>
              <p className="text-gray-600 dark:text-gray-400 italic leading-relaxed mb-4">
                &ldquo;{t.text}&rdquo;
              </p>
              <p className="font-semibold text-sm text-[#1b4d3e] dark:text-[#4caf7a]">
                — {t.author}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
}
