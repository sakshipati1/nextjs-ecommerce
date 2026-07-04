"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  clearCart,
  getCart,
  removeFromCart,
  updateQuantity,
} from "../lib/cart";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const syncCart = () => setCartItems(getCart());
    syncCart();
    window.addEventListener("cart-updated", syncCart);
    return () => window.removeEventListener("cart-updated", syncCart);
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0,
  );

  const handleQuantityChange = (productId, quantity) => {
    updateQuantity(productId, quantity);
    setCartItems(getCart());
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
    setCartItems(getCart());
  };

  const handleClear = () => {
    clearCart();
    setCartItems(getCart());
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-600">
              Cart
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Your selected items
            </h1>
          </div>
          <Link
            href="/"
            className="text-sm font-semibold text-sky-600 hover:text-sky-700"
          >
            Continue shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-xl">
            <p className="text-slate-600">Your cart is empty right now.</p>
            <Link
              href="/"
              className="mt-4 inline-flex rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.productId || item._id || item.title}
                  className="flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5 sm:flex-row sm:items-center"
                >
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.title}
                    className="h-24 w-full rounded-2xl object-cover sm:w-24"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                          {item.title}
                        </h2>
                        <p className="mt-1 text-sm text-slate-600">
                          {item.category || "Marketplace item"}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleRemove(item.productId || item._id || item.title)
                        }
                        className="text-sm font-semibold text-rose-600 hover:text-rose-700"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <label className="flex items-center gap-2 text-sm text-slate-600">
                        Qty
                        <input
                          type="number"
                          min="1"
                          value={item.quantity || 1}
                          onChange={(event) =>
                            handleQuantityChange(
                              item.productId || item._id || item.title,
                              Number(event.target.value),
                            )
                          }
                          className="w-20 rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-sky-500"
                        />
                      </label>
                      <p className="text-base font-semibold text-slate-900">
                        ₹
                        {(
                          (Number(item.price) || 0) *
                          (Number(item.quantity) || 1)
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="rounded-[2rem] border border-slate-200 bg-slate-900 p-8 text-white shadow-xl shadow-slate-900/10">
              <p className="text-sm uppercase tracking-[0.35em] text-sky-200">
                Summary
              </p>
              <div className="mt-6 space-y-4 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery</span>
                  <span>₹45.00</span>
                </div>
              </div>
              <div className="mt-6 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>₹{(subtotal + 45).toFixed(2)}</span>
                </div>
                <Link
                  href="/checkout"
                  className="mt-6 inline-flex w-full justify-center rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  Proceed to checkout
                </Link>
                <button
                  onClick={handleClear}
                  className="mt-3 w-full rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  Clear cart
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
