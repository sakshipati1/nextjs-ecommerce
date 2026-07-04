"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // Manage filtered state separately
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false); // Track AI search state
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data); // Initially show all products
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Unable to load products.");
        setLoading(false);
      });
  }, []);

  // Handle AI Semantic Search on Form Submit
  const handleSearch = async (event) => {
    event.preventDefault();

    if (!searchInput.trim()) {
      setFilteredProducts(products);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchInput, products }),
      });

      const data = await response.json();
      if (data.results) {
        setFilteredProducts(data.results);
      }
    } catch (err) {
      console.error("AI Search failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Banner */}
        <div className="mb-10 rounded-[2rem] bg-gradient-to-r from-sky-600 via-cyan-500 to-slate-900 p-8 text-white shadow-2xl shadow-slate-900/10 sm:p-12">
          <p className="text-sm uppercase tracking-[0.4em] text-cyan-100">
            Discover top picks
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Shop the latest products
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-cyan-100/90 sm:text-lg">
            Explore premium items with Gemini AI-powered semantic search.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-xl ring-1 ring-white/20">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-200">
                Products
              </p>
              <p className="mt-4 text-3xl font-semibold">{products.length}</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-xl ring-1 ring-white/20">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-200">
                Search
              </p>
              <p className="mt-4 text-3xl font-semibold">Gemini AI</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-xl ring-1 ring-white/20">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-200">
                Experience
              </p>
              <p className="mt-4 text-3xl font-semibold">Semantic Match</p>
            </div>
          </div>
        </div>

        {/* Search Form */}
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
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by features, intent, or categories..."
            className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 sm:max-w-md"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="inline-flex justify-center rounded-3xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:opacity-50"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Counter Stats */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white/90 px-6 py-5 shadow-xl shadow-slate-900/5 ring-1 ring-slate-200/80 backdrop-blur-xl">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-sky-600">
              Product discovery
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>
        </div>

        {/* Product Grid & Loading States */}
        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">Loading products…</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
            <p className="text-red-700">{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">No products match your search.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <article
                key={product._id || product.id || product.title}
                className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-300/40"
              >
                <div className="relative overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-60 w-full cursor-pointer object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-700 shadow-sm ring-1 ring-slate-200">
                    {product.category || "Uncategorized"}
                  </div>
                </div>
                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between gap-3 text-slate-500">
                    <span className="text-base font-semibold text-slate-900">
                      {product.title}
                    </span>
                    <span className="rounded-2xl bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-900">
                      ${product.price?.toFixed(2) ?? "0.00"}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-slate-600 line-clamp-2">
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
