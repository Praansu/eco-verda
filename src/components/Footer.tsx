import Link from "next/link";
import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#0f1a16] border-t border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-[#1b4d3e] dark:text-[#4caf7a] mb-4">
              <Leaf className="w-5 h-5" />
              <span className="font-serif text-lg font-bold">EcoVerda</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Sustainable living essentials for a better tomorrow. Every purchase supports a greener planet.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/products" className="block text-sm text-gray-500 dark:text-gray-400 hover:text-[#1b4d3e] dark:hover:text-[#4caf7a] transition">
                Products
              </Link>
              <Link href="/orders" className="block text-sm text-gray-500 dark:text-gray-400 hover:text-[#1b4d3e] dark:hover:text-[#4caf7a] transition">
                My Orders
              </Link>
              <Link href="/auth/login" className="block text-sm text-gray-500 dark:text-gray-400 hover:text-[#1b4d3e] dark:hover:text-[#4caf7a] transition">
                Sign In
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Contact</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Have questions? Reach out and we&apos;ll get back to you within 24 hours.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">hello@ecoverda.com</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} EcoVerda. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
