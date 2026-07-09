"use client";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn, isLoaded, user } = useUser();

  // Define your admin email address here
  const isAdmin =
    user?.primaryEmailAddress?.emailAddress === "sakshipatil3003@gmail.com";

  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-sm font-semibold text-white shadow-lg shadow-sky-200">
            NC
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-sky-600">
              Nexcart
            </p>
          </div>
        </Link>

        {/* Navigation Elements */}
        <nav className="flex items-center gap-2 sm:gap-4">
          {/* Wait for Clerk to resolve session before rendering elements */}
          {isLoaded && (
            <>
              {isSignedIn ? (
                <>
                  {/* Client Navigation links visible after logging in */}
                  <Link
                    href="/"
                    className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    Home
                  </Link>
                  <Link
                    href="/about"
                    className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    About
                  </Link>
                  <Link
                    href="/track-order"
                    className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    Track Order 🔍
                  </Link>
                  <Link
                    href="/cart"
                    className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    Cart
                  </Link>
                  <Link
                    href="/checkout"
                    className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    Checkout
                  </Link>

                  {/* SEPARATE ADMIN PANEL: Visible ONLY if the logged-in email is the Admin Email */}
                  {isAdmin && (
                    <Link
                      href="/admin/orders"
                      className="rounded-full px-3 py-2 text-sm font-semibold text-sky-600 transition hover:bg-slate-100 hover:text-sky-800 bg-sky-50"
                    >
                      Admin Portal ⚙️
                    </Link>
                  )}

                  {/* Clerk User Avatar Dropdown Control */}
                  <div className="pl-2 border-l border-slate-200 ml-1 flex items-center">
                    {/* UPDATED: Changed deprecated afterSignOutUrl to signOutUrl */}
                    <UserButton signOutUrl="/" />
                  </div>
                </>
              ) : (
                /* Visible only when user is logged out */
                <Link href="/sign-in">
                  <button className="ml-2 rounded-full bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-700 active:scale-95 transition-all shadow-md shadow-sky-100">
                    Login / Sign Up
                  </button>
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
