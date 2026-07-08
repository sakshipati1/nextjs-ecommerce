"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchOrders();
  }, []);

  // NEW: Handles updating the status in the DB dynamically
  const handleStatusChange = async (orderId, newStatus) => {
    const updatingToast = toast.loading("Updating status...");
    try {
      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.dismiss(updatingToast);
        toast.success(`Status updated to ${newStatus}!`);
        // Refresh local state without a full page reload
        setOrders((prevOrders) =>
          prevOrders.map((ord) =>
            ord._id === orderId ? { ...ord, status: newStatus } : ord,
          ),
        );
      } else {
        throw new Error(data.error || "Failed to update status");
      }
    } catch (error) {
      toast.dismiss(updatingToast);
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-500 animate-pulse">
          Loading NexCart orders...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            NexCart Order Management
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
                    {/* Status badge changes color dynamically based on current status */}
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        order.status === "Delivered"
                          ? "bg-emerald-50 text-emerald-800"
                          : order.status === "Out for Delivery"
                            ? "bg-sky-50 text-sky-800"
                            : order.status === "Processing"
                              ? "bg-purple-50 text-purple-800"
                              : "bg-amber-50 text-amber-800"
                      }`}
                    >
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

                {/* Right Section: Totals & Status Selector Dropdown */}
                <div className="flex flex-col justify-between items-start md:items-end border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                  <div className="md:text-right w-full">
                    <p className="text-xs font-medium text-slate-400">
                      Total Bill Value
                    </p>
                    <p className="text-xl font-black text-slate-950">
                      ${order.totalAmount?.toFixed(2)}
                    </p>

                    {/* NEW: Status Selector Dropdown menu */}
                    <div className="mt-4">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 md:text-right">
                        Update Status
                      </label>
                      <select
                        value={order.status || "Pending"}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="w-full md:w-auto text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-sky-500 transition-all cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Out for Delivery">
                          Out for Delivery
                        </option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 mt-4 md:mt-0">
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
