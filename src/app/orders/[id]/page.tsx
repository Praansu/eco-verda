import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!order || order.userId !== session.user.id) {
    notFound();
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    shipped: "bg-blue-100 text-blue-800",
    delivered: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/orders"
        className="text-sm text-[#1b4d3e] dark:text-[#4caf7a] hover:underline mb-6 inline-block"
      >
        ← Back to Orders
      </Link>

      <div className="bg-white dark:bg-[#1a2b24] rounded-3xl p-8 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-2xl text-[#1b4d3e] dark:text-[#4caf7a]">
            Order #{order.id.slice(0, 8)}
          </h1>
          <span
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize ${
              statusColors[order.status] || "bg-gray-100"
            }`}
          >
            {order.status}
          </span>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6 space-y-1">
          <p>
            Placed:{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p>Delivery: {order.address}</p>
          {order.phone && <p>Phone: {order.phone}</p>}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-6 space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 shrink-0">
                <Image
                  src={JSON.parse(item.product.images)[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-800 dark:text-gray-200">
                  {item.product.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Rs. {item.price.toLocaleString("en-IN")} × {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                Rs.{" "}
                {(item.price * item.quantity).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4 flex justify-between text-lg font-semibold text-gray-800 dark:text-gray-200">
          <span>Total</span>
          <span>Rs. {order.total.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
}
