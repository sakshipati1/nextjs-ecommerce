import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/checkout", label: "Checkout" },
  { href: "/track-order", label: "Track Order 🔍" }, // updated href path
  { href: "/admin/orders", label: "Admin Portal ⚙️" },
  { href: "/cart", label: "Cart" },
];

export default function Navbar() {
  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-sm font-semibold text-white shadow-lg shadow-sky-200">
            NC
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-sky-600">
              Nexcart
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-2 text-sm font-medium transition hover:bg-slate-100 ${
                link.href.includes("admin")
                  ? "text-sky-600 hover:text-sky-800 font-semibold"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
