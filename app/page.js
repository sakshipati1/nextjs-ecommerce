"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Unable to load products.");
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter((product) => {
    const query = searchTerm.toLowerCase();
    return (
      product.title.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query)
    );
  });

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchTerm(searchInput.trim());
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">
            Our collection
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            All Products
          </h1>
          <p className="mt-3 text-slate-600 sm:text-lg">
            Browse the full product catalog below. Tap any card to learn more.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center"
        >
          <label htmlFor="product-search" className="sr-only">
            Search products
          </label>
          <input
            id="product-search"
            type="text"
            value={searchInput}
            onChange={(event) => {
              const value = event.target.value;
              setSearchInput(value);
              setSearchTerm(value.trim());
            }}
            placeholder="Search by name or category"
            className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 sm:max-w-md"
          />
          <button
            type="submit"
            className="inline-flex justify-center rounded-3xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
          >
            Search
          </button>
        </form>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">Loading products…</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
            <p className="text-red-700">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">No products available.</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">No products match your search.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product._id || product.id || product.title}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="h-56 overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full cursor-pointer object-cover transition duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
                    <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                      {product.category || "Uncategorized"}
                    </span>
                    <span className="font-semibold text-slate-900">
                      ${product.price?.toFixed(2) ?? "0.00"}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {product.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {product.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
