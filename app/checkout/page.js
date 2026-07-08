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

  // Utility to dynamically load the external Razorpay checkout script modal
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Initializing payment gateway...");

    try {
      // 1. Load Razorpay Checkout SDK
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error(
          "Razorpay payment gateway failed to load. Are you connected to the internet?",
        );
      }

      // 2. Request backend API to generate unique transaction Order ID
      const paymentResponse = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount }),
      });

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(
          paymentData.error ||
            "Failed to initialize secure transaction session.",
        );
      }

      toast.dismiss(loadingToast);

      // 3. Configure and open the interactive Razorpay checkout modal overlay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "NexCart Marketplace",
        description: "Society Order Payment Fulfillment",
        order_id: paymentData.orderId,
        handler: async function (razorpayResponse) {
          const processToast = toast.loading(
            "Payment received! Saving your order details...",
          );

          try {
            // Map cart details to match our database model structure
            const formattedItems = cartItems.map((item) => ({
              productId: item._id || item.id,
              title: item.title,
              price: item.price,
              quantity: item.quantity || 1,
            }));

            // 4. Securely store order transaction inside MongoDB upon authorization success
            const saveOrderResponse = await fetch("/api/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                items: formattedItems,
                totalAmount: totalAmount,
                shippingAddress: formData,
                paymentId: razorpayResponse.razorpay_payment_id, // attaches transaction proof token
              }),
            });

            const data = await saveOrderResponse.json();

            if (!saveOrderResponse.ok) {
              throw new Error(data.error || "Failed to catalog order details.");
            }

            toast.dismiss(processToast);
            toast.success("Transaction Complete & Order Placed! 🎉", {
              duration: 5000,
            });

            clearCart(); // Wipe active local cart context
            router.push("/orders/success");
          } catch (err) {
            toast.dismiss(processToast);
            toast.error(
              err.message ||
                "Payment recorded but failed to update status pipeline.",
            );
          }
        },
        prefill: {
          name: formData.fullName,
          contact: formData.phone,
        },
        theme: {
          color: "#0284c7", // Matches NexCart sky blue UI branding
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
            toast.error("Payment screen closed by user.");
          },
        },
      };

      const paymentWindow = new window.Razorpay(options);
      paymentWindow.open();
    } catch (error) {
      console.error("Checkout transaction failure:", error);
      toast.dismiss(loadingToast);
      toast.error(error.message || "Something went wrong.");
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
                placeholder="Ex: 9876543210"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || cartItems.length === 0}
              className="w-full mt-6 rounded-2xl bg-slate-900 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-slate-800 active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting
                ? "Processing Gateway..."
                : `Proceed to Pay • $${totalAmount.toFixed(2)}`}
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
