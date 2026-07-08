"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        const data = await response.json();

        if (response.ok) {
          setOrders(data.orders || []);
        } else {
          toast.error(data.error || "Failed to load orders.");
        }
      } catch (error) {
        console.error("Dashboard error:", error);
        toast.error("Error connecting to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-500 animate-pulse">
          Loading neighborhood orders...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Society Order Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track incoming purchases, verify flat addresses, and manage delivery
            fulfillments.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <p className="text-sm text-slate-500">
              No orders have been placed yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6"
              >
                {/* Left Section: Delivery Target & Items */}
                <div className="space-y-4 flex-1">
                  <div>
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                      {order.status || "Pending"}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-2">
                      {order.shippingAddress?.fullName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      📍 {order.shippingAddress?.societyName}, Flat{" "}
                      {order.shippingAddress?.wingFlat}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      📞 {order.shippingAddress?.phone}
                    </p>
                  </div>

                  {/* Items list */}
                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Items Ordered
                    </p>
                    <ul className="space-y-1">
                      {order.items?.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-slate-700 flex justify-between max-w-md"
                        >
                          <span>
                            • {item.title}{" "}
                            <span className="text-xs text-slate-400">
                              x{item.quantity}
                            </span>
                          </span>
                          <span className="font-medium text-slate-600">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Section: Totals & Summary */}
                <div className="flex flex-col justify-between items-start md:items-end border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 min-w-[180px]">
                  <div className="md:text-right">
                    <p className="text-xs font-medium text-slate-400">
                      Total Bill Value
                    </p>
                    <p className="text-xl font-black text-slate-950">
                      ${order.totalAmount?.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 md:mt-0">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
