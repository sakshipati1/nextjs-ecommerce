"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { addToCart } from "../../lib/cart";

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const slug = params?.slug;
    if (!slug) return;

    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Unable to load product.");
        return res.json();
      })
      .then((data) => {
        const found = Array.isArray(data)
          ? data.find(
              (item) =>
                item._id === slug || item.title === decodeURIComponent(slug),
            )
          : null;

        if (!found) {
          setError("Product not found.");
        } else {
          setProduct(found);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load product details.");
        setLoading(false);
      });
  }, [params]);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-6 inline-flex text-sm font-semibold text-sky-600 hover:text-sky-700"
        >
          ← Back to marketplace
        </Link>

        {loading ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-xl">
            Loading product...
          </div>
        ) : error ? (
          <div className="rounded-[2rem] border border-red-200 bg-red-50 p-10 text-center text-red-700 shadow-xl">
            {error}
          </div>
        ) : product ? (
          <div className="grid gap-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
            <div className="overflow-hidden rounded-[1.5rem] bg-slate-100">
              <img
                src={product.image || "/placeholder.png"}
                alt={product.title}
                className="h-full min-h-[320px] w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-sky-600">
                  {product.category || "Featured item"}
                </p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900">
                  {product.title}
                </h1>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  {product.description}
                </p>
              </div>

              <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">
                    Price
                  </span>
                  <span className="text-3xl font-semibold text-slate-900">
                    ₹{product.price?.toFixed(2) ?? "0.00"}
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="mt-6 w-full rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  {added ? "Added to cart" : "Add to cart"}
                </button>

                <Link
                  href="/cart"
                  className="mt-3 inline-flex text-sm font-semibold text-slate-700 hover:text-slate-900"
                >
                  View cart →
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
