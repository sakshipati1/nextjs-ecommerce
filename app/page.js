"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { addToCart } from "./lib/cart";

// High-quality, distinct images for each category
const CATEGORY_IMAGES = {
  accessories:
    "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80", // Premium Wallet
  electronics:
    "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80", // Smart Speaker
  stationery:
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80", // Desk Organizer / Notebooks
  apparel:
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80", // Premium Red T-Shirt
};

const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80";

const getProductImage = (product) => {
  const imgUrl = product?.image || "";

  // FORCE DYNAMIC IMAGES: If image is empty, a placeholder, or a lorem picsum link, look up by category/title keywords instead
  if (
    imgUrl.trim() === "" ||
    imgUrl === "/placeholder.png" ||
    imgUrl.includes("picsum.photos")
  ) {
    const category = product?.category?.toLowerCase() || "";
    const title = product?.title?.toLowerCase() || "";

    // Smart Keyword Matching
    if (
      category.includes("access") ||
      title.includes("wallet") ||
      title.includes("leather")
    ) {
      return CATEGORY_IMAGES.accessories;
    }
    if (
      category.includes("elect") ||
      title.includes("speaker") ||
      title.includes("bluetooth") ||
      title.includes("audio")
    ) {
      return CATEGORY_IMAGES.electronics;
    }
    if (
      category.includes("station") ||
      title.includes("organizer") ||
      title.includes("desk") ||
      title.includes("pen")
    ) {
      return CATEGORY_IMAGES.stationery;
    }
    if (
      category.includes("appar") ||
      category.includes("cloth") ||
      title.includes("t-shirt") ||
      title.includes("shirt")
    ) {
      return CATEGORY_IMAGES.apparel;
    }

    return DEFAULT_FALLBACK_IMAGE;
  }

  // If it's any other custom unique image, use it
  return imgUrl;
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Database failed to return items.");
        return res.json();
      })
      .then((data) => {
        const productList = Array.isArray(data) ? data : [];
        setProducts(productList);
        setFilteredProducts(productList);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError(
          "Unable to load products. Please check your MongoDB Atlas IP whitelist.",
        );
        loading(false);
      });
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!searchInput.trim()) {
      setFilteredProducts(products);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchInput }), // Simplified payload
      });

      if (!response.ok) throw new Error("AI Search request failed.");

      const data = await response.json();

      // FIX: Matches the raw array structure returned from your backend aggregation pipeline
      if (data && Array.isArray(data)) {
        setFilteredProducts(data);
      } else {
        setFilteredProducts([]);
      }
    } catch (err) {
      console.error("AI Search failed:", err);
      setError("AI Search failed. Showing default items.");
      setFilteredProducts(Array.isArray(products) ? products : []);
    } finally {
      setIsSearching(false);
    }
  };

  const totalProductsCount = Array.isArray(products) ? products.length : 0;
  const filteredProductsCount = Array.isArray(filteredProducts)
    ? filteredProducts.length
    : 0;

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <main className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Banner Section */}
        <div className="mb-12 rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-sky-900 to-cyan-900 p-8 text-white shadow-2xl relative overflow-hidden sm:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.15),transparent_50%)]" />
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-sky-400">
              Mumbai society marketplace
            </p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl max-w-3xl leading-[1.15]">
              Shop community favorites from your doorstep
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Discover trusted essentials, festive finds, and local picks with a
              simple experience built for modern societies. Enhanced by AI.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3 max-w-4xl">
              <div className="rounded-2xl bg-white/5 p-5 backdrop-blur-md ring-1 ring-white/10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Products Available
                </p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {totalProductsCount}
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 p-5 backdrop-blur-md ring-1 ring-white/10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Search Engine
                </p>
                <p className="mt-2 text-3xl font-bold text-sky-400">
                  AI Assisted
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 p-5 backdrop-blur-md ring-1 ring-white/10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Fulfillment
                </p>
                <p className="mt-2 text-3xl font-bold text-cyan-400">
                  Society Ready
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar Block */}
        <form
          onSubmit={handleSearch}
          className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center"
        >
          <label htmlFor="product-search" className="sr-only">
            Search products
          </label>
          <div className="relative w-full sm:max-w-xl">
            <input
              id="product-search"
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by features, keywords, or categories..."
              className="w-full rounded-2xl border border-slate-200 bg-white pl-5 pr-4 py-3.5 text-slate-900 shadow-sm outline-none transition-all duration-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="inline-flex justify-center items-center rounded-2xl bg-sky-600 px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-sky-600/10 transition-all duration-200 hover:bg-sky-700 active:scale-95 disabled:opacity-50"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Dynamic Context Header Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white px-6 py-4 shadow-sm ring-1 ring-slate-100">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">
              Product Discovery
            </p>
            <p className="mt-1 text-base font-semibold text-slate-800">
              Showing {filteredProductsCount} of {totalProductsCount} items
            </p>
          </div>
        </div>

        {/* State Conditional Renders */}
        {loading ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-16 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading collective marketplace items…
            </p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-100 bg-red-50/50 p-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-red-700">{error}</p>
          </div>
        ) : filteredProductsCount === 0 ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-16 text-center shadow-sm">
            <p className="text-base font-medium text-slate-500">
              No matching neighborhood listings found.
            </p>
          </div>
        ) : (
          /* Responsive Layout Display Grid */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(Array.isArray(filteredProducts) ? filteredProducts : []).map(
              (product) => (
                <article
                  key={product._id || product.id || product.title}
                  className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/50"
                >
                  <div>
                    {/* Card Visual Wrapper */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      <img
                        src={getProductImage(product)}
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute left-3 top-3 rounded-xl bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-800 shadow-sm backdrop-blur-md ring-1 ring-black/5">
                        {product.category || "General"}
                      </div>
                    </div>

                    {/* Text Content Block Area */}
                    <div className="p-5 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base font-bold text-slate-900 tracking-tight line-clamp-1 group-hover:text-sky-600 transition-colors">
                          {product.title}
                        </h3>
                        <span className="inline-flex shrink-0 font-bold text-slate-900 text-sm bg-slate-50 px-2.5 py-1 rounded-lg ring-1 ring-slate-100">
                          ${product.price?.toFixed(2) ?? "0.00"}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-500 line-clamp-2">
                        {product.description || "No item description provided."}
                      </p>
                    </div>
                  </div>

                  {/* Structured Interactive Call to Actions */}
                  <div className="px-5 pb-5 pt-1 grid grid-cols-2 gap-2">
                    <Link
                      href={`/products/${encodeURIComponent(product._id || product.id || product.title)}`}
                      className="inline-flex justify-center items-center rounded-xl bg-slate-50 py-2.5 text-xs font-bold text-slate-700 ring-1 ring-slate-200/60 transition-all hover:bg-slate-100 active:scale-95 text-center"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="inline-flex justify-center items-center rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white transition-all hover:bg-sky-600 active:scale-95 text-center shadow-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                </article>
              ),
            )}
          </div>
        )}
      </div>
    </main>
  );
}
