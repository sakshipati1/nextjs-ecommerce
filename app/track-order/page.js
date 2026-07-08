"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function OrderTrackingPage() {
  const [phone, setPhone] = useState("");
  const [userOrders, setUserOrders] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();

      if (response.ok) {
        const matched = (data.orders || []).filter(
          (order) =>
            order.shippingAddress?.phone?.replace(/\s+/g, "") ===
            phone.replace(/\s+/g, ""),
        );
        setUserOrders(matched);
        setHasSearched(true);
      } else {
        toast.error("Could not search for orders right now.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Connection error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Track Your NexCart Order
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Enter your resident phone number to check your community delivery
            pipeline status.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm max-w-md mx-auto mb-10">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Registered Contact Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 9876543210"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-500 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              {loading ? "Searching Records..." : "Check Live Status"}
            </button>
          </form>
        </div>

        {hasSearched && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-1">
              Purchase History ({userOrders.length})
            </h2>

            {userOrders.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                No orders discovered matching that phone number.
              </div>
            ) : (
              userOrders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {order.shippingAddress?.fullName}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <span
                      className={`self-start sm:self-auto inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                        order.status === "Delivered"
                          ? "bg-emerald-50 text-emerald-700"
                          : order.status === "Out for Delivery"
                            ? "bg-sky-50 text-sky-700 font-extrabold animate-pulse"
                            : order.status === "Processing"
                              ? "bg-purple-50 text-purple-700"
                              : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      Current Status: {order.status || "Pending"}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-xs text-slate-600"
                      >
                        <span>
                          {item.title}{" "}
                          <span className="text-slate-400 font-medium">
                            x{item.quantity}
                          </span>
                        </span>
                        <span className="font-semibold text-slate-800">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-sm font-bold text-slate-900">
                    <span>Amount Charged</span>
                    <span>${order.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
