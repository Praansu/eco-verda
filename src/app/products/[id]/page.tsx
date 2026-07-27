import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) notFound();

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: { category: true },
    take: 3,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Image */}
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-800">
          <Image
            src={JSON.parse(product.images)[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <span className="text-sm font-medium text-[#d4a373] uppercase tracking-wider mb-2">
            {product.category.name}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1b4d3e] dark:text-[#4caf7a] mb-4">
            {product.name}
          </h1>
          <p className="text-2xl font-bold text-[#1b4d3e] dark:text-[#4caf7a] mb-6">
            Rs. {product.price.toLocaleString("en-IN")}
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
            {product.description}
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            <span className="inline-flex items-center gap-1">
              🌱 {product.stock} in stock
            </span>
          </div>
          <ProductDetailClient product={product} />
        </div>
      </div>

      {/* Reviews */}
      <div className="mb-16">
        <h2 className="font-serif text-2xl text-[#1b4d3e] dark:text-[#4caf7a] mb-6">
          Reviews
        </h2>
        {product.reviews.length === 0 ? (
          <p className="text-gray-400">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white dark:bg-[#1a2b24] rounded-xl p-6 border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-[#d4a373]">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>
                  <span className="text-sm text-gray-400">
                    {review.user.name}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="font-serif text-2xl text-[#1b4d3e] dark:text-[#4caf7a] mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <a
                key={p.id}
                href={`/products/${p.id}`}
                className="group bg-white dark:bg-[#1a2b24] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 transition hover:shadow-lg"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3">
                  <Image
                    src={JSON.parse(p.images)[0]}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3 className="font-medium text-sm text-gray-800 dark:text-gray-200 line-clamp-1">
                  {p.name}
                </h3>
                <p className="text-sm font-semibold text-[#1b4d3e] dark:text-[#4caf7a]">
                  Rs. {p.price.toLocaleString("en-IN")}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
