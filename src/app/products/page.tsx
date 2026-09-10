import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import ProductsClient from "./ProductsClient";

function ProductsClientWrapper({ products, categories }: { products: any[]; categories: any[] }) {
  return <ProductsClient products={products} categories={categories} />;
}

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">Loading products…</div>}>
      <ProductsClientWrapper products={products} categories={categories} />
    </Suspense>
  );
}