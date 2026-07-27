import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/orders");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    delivered: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-3xl text-[#1b4d3e] dark:text-[#4caf7a] mb-8">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No orders yet
          </p>
          <Link
            href="/products"
            className="inline-flex px-6 py-3 rounded-full bg-[#1b4d3e] text-white font-medium text-sm"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block bg-white dark:bg-[#1a2b24] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    statusColors[order.status] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {order.items.length} item{order.items.length > 1 ? "s" : ""}
                  {order.items.length > 0 && (
                    <span className="ml-2">
                      — {order.items[0].product.name}
                      {order.items.length > 1 &&
                        ` +${order.items.length - 1} more`}
                    </span>
                  )}
                </div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  Rs. {order.total.toLocaleString("en-IN")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
