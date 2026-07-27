import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CheckoutForm from "./CheckoutForm";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/checkout");
  }

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  });

  if (items.length === 0) {
    redirect("/cart");
  }

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-3xl text-[#1b4d3e] dark:text-[#4caf7a] mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <CheckoutForm total={total} />
        </div>

        <div>
          <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Order Summary
          </h2>
          <div className="bg-white dark:bg-[#1a2b24] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm text-gray-600 dark:text-gray-400"
              >
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>
                  Rs.{" "}
                  {(item.product.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between font-semibold text-gray-800 dark:text-gray-200">
              <span>Total</span>
              <span>Rs. {total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
