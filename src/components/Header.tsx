"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Leaf, Menu, X, ShoppingCart, Moon, Sun, User, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import CartDrawer from "./CartDrawer";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const { data: session } = useSession();

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/orders", label: "Orders" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#0f1a16] border-b border-gray-100 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 text-[#1b4d3e] dark:text-[#4caf7a]">
              <Leaf className="w-6 h-6" />
              <span className="font-serif text-xl font-bold">EcoVerda</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? "bg-[#eef5f2] text-[#1b4d3e] dark:bg-[#1a2b24] dark:text-[#4caf7a]"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDark}
                className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                aria-label="Toggle dark mode"
              >
                {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setCartOpen(true)}
                className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition relative"
                aria-label="Open cart"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>

              {session?.user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/orders"
                    className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <User className="w-4 h-4" />
                    {session.user.name}
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden md:inline-flex px-4 py-2 rounded-xl bg-[#1b4d3e] text-white text-sm font-medium hover:bg-[#143d30] transition"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0f1a16]">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                    isActive(link.href)
                      ? "bg-[#eef5f2] text-[#1b4d3e] dark:bg-[#1a2b24] dark:text-[#4caf7a]"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!session?.user ? (
                <Link
                  href="/auth/login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-medium text-[#1b4d3e] dark:text-[#4caf7a]"
                >
                  Sign In
                </Link>
              ) : (
                <button
                  onClick={() => { setMenuOpen(false); signOut(); }}
                  className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-500"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
