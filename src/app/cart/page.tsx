import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CartActions } from "./CartActions";

export default async function CartPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/cart");
  }

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  });

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-3xl text-[#1b4d3e] dark:text-[#4caf7a] mb-8">
        Shopping Cart
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Your cart is empty
          </p>
          <Link
            href="/products"
            className="inline-flex px-6 py-3 rounded-full bg-[#1b4d3e] text-white font-medium text-sm"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 bg-white dark:bg-[#1a2b24] rounded-2xl p-4 border border-gray-100 dark:border-gray-800"
            >
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 shrink-0">
                <Image
                  src={JSON.parse(item.product.images)[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.product.id}`}
                  className="font-medium text-gray-800 dark:text-gray-200 hover:text-[#1b4d3e] dark:hover:text-[#4caf7a] transition line-clamp-1"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.product.category.name}
                </p>
                <p className="text-sm font-semibold text-[#1b4d3e] dark:text-[#4caf7a] mt-1">
                  Rs. {item.product.price.toLocaleString("en-IN")} each
                </p>
                <CartActions itemId={item.id} quantity={item.quantity} />
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  Rs. {(item.product.price * item.quantity).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))}

          {/* Summary */}
          <div className="bg-white dark:bg-[#1a2b24] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              <span>Total</span>
              <span>Rs. {total.toLocaleString("en-IN")}</span>
            </div>
            <Link
              href="/checkout"
              className="block w-full text-center py-3.5 rounded-full bg-[#1b4d3e] text-white font-semibold text-sm hover:bg-[#143d30] transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
