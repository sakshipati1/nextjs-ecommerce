import Link from "next/link";

const highlights = [
  {
    title: "Local-first shopping",
    description:
      "Buy everyday essentials, festive items, and curated products from trusted neighbours and nearby vendors.",
  },
  {
    title: "Convenience for every society",
    description:
      "Residents can discover products without leaving the comfort of their building or parking lot.",
  },
  {
    title: "Support the community",
    description:
      "Every order helps local sellers, society helpers, and small businesses in Mumbai thrive.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-600 via-cyan-500 to-slate-900 p-8 text-white shadow-2xl shadow-slate-900/10 sm:p-12">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-100">
            About our marketplace
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            A smarter way for Mumbai societies to shop together.
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-cyan-100/90">
            Our marketplace brings convenience, trust, and community spirit
            together for residents who want quality products delivered with
            ease.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
            <h2 className="text-2xl font-semibold text-slate-900">
              Built for the rhythm of city life
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              From household staples to festive gifts, this platform is designed
              for the fast-moving lifestyle of Mumbai societies. Residents can
              browse, compare, and order in a few taps while local vendors get a
              dependable channel to serve the community.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/checkout"
                className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                Start checkout
              </Link>
              <Link
                href="/"
                className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Explore products
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-900 p-8 text-white shadow-xl shadow-slate-900/10">
            <p className="text-sm uppercase tracking-[0.35em] text-sky-200">
              Why societies love it
            </p>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
              <li>• Trusted delivery within the society and nearby areas</li>
              <li>
                • Easy browsing for groceries, daily essentials, and gifts
              </li>
              <li>• A simple checkout experience for busy families</li>
            </ul>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
