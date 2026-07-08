// app/checkout/page.js
"use client";
import { useEffect, useState } from "react";
import { getCart, clearCart } from "../lib/cart";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shipping Form State
  const [formData, setFormData] = useState({
    fullName: "",
    societyName: "",
    wingFlat: "",
    phone: "",
  });

  // Load cart items on mount
  useEffect(() => {
    const items = getCart();
    setCartItems(Array.isArray(items) ? items : []);
  }, []);

  // Calculate total price
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0,
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Processing your neighborhood order...");

    try {
      // Map cart details to match our database model structure
      const formattedItems = cartItems.map((item) => ({
        productId: item._id || item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity || 1,
      }));

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: formattedItems,
          totalAmount: totalAmount,
          shippingAddress: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to place order.");
      }

      // Success sequence
      toast.dismiss(loadingToast);
      toast.success("Order placed successfully! 🎉", { duration: 5000 });

      clearCart(); // Clean up local cart data

      // UPDATED: Redirects to the newly created success screen
      router.push("/orders/success");
    } catch (error) {
      console.error("Checkout submission failure:", error);
      toast.dismiss(loadingToast);
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl grid gap-8 md:grid-cols-2">
        {/* Form Container */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-1">
            Delivery Details
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Enter your resident information for society delivery fulfillment.
          </p>

          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Sakshi Patil"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Society Name / Building Number
              </label>
              <input
                type="text"
                name="societyName"
                required
                value={formData.societyName}
                onChange={handleInputChange}
                placeholder="Ex: Orchid Towers, Phase 1"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Wing & Flat Number
              </label>
              <input
                type="text"
                name="wingFlat"
                required
                value={formData.wingFlat}
                onChange={handleInputChange}
                placeholder="Ex: B-Wing, Apt 402"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Contact Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Ex: +91 9876543210"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || cartItems.length === 0}
              className="w-full mt-6 rounded-2xl bg-slate-900 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-slate-800 active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting
                ? "Placing Your Order..."
                : `Place Order • $${totalAmount.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Cart Summary Panel */}
        <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6 self-start">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Order Summary
          </h3>

          {cartItems.length === 0 ? (
            <p className="text-sm text-slate-500">
              Your basket is completely empty.
            </p>
          ) : (
            <div className="divide-y divide-slate-200/60 max-h-80 overflow-y-auto pr-2">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3.5"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Qty: {item.quantity || 1}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    ${(item.price * (item.quantity || 1)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-slate-200 mt-6 pt-4 flex items-center justify-between font-bold text-slate-900">
            <span>Total Value</span>
            <span className="text-lg">${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
