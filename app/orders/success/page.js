"use client";
import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 p-8 shadow-sm text-center">
        <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-2xl mb-4">
          🎉
        </div>
        <h1 className="text-2xl font-bold text-slate-950 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Your neighborhood delivery is being processed and will arrive at your
          society gates shortly.
        </p>
        <Link
          href="/"
          className="inline-block w-full rounded-2xl bg-slate-900 py-3.5 text-sm font-bold text-white shadow-md hover:bg-slate-800 transition-all text-center text-white"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
