"use client";

import { useState } from "react";

const orderSummary = [
  { label: "Community hamper", price: 680 },
  { label: "Delivery fee", price: 45 },
];

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    name: "",
    society: "",
    flat: "",
    phone: "",
    payment: "Cash on delivery",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const subtotal = orderSummary.reduce((total, item) => total + item.price, 0);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-600">
            Checkout
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            Place your society order
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Complete a few details and we will prepare your Mumbai society
            delivery.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Full name
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  placeholder="Asha Patel"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Society name
                <input
                  name="society"
                  value={formData.society}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  placeholder="Arihant Heights"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Flat / wing
                <input
                  name="flat"
                  value={formData.flat}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  placeholder="B-204"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Phone number
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  placeholder="98765 43210"
                />
              </label>
            </div>

            <label className="block text-sm font-medium text-slate-700">
              Payment method
              <select
                name="payment"
                value={formData.payment}
                onChange={handleChange}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                <option>Cash on delivery</option>
                <option>UPI</option>
                <option>Card</option>
              </select>
            </label>

            <button
              type="submit"
              className="w-full rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Confirm order
            </button>
          </form>

          {submitted && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              Order request received for {formData.name || "your residence"}. We
              will contact you shortly.
            </div>
          )}
        </section>

        <aside className="rounded-[2rem] border border-slate-200 bg-slate-900 p-8 text-white shadow-xl shadow-slate-900/10">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-200">
            Your order
          </p>
          <div className="mt-6 space-y-4">
            {orderSummary.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-sm text-slate-300"
              >
                <span>{item.label}</span>
                <span>₹{item.price}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-white/10 pt-6">
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Total</span>
              <span>₹{subtotal}</span>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Fast delivery and easy pickup options are available for most
              Mumbai societies.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
