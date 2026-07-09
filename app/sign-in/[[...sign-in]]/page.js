import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left Column: Brand Showcase Banner */}
      <div className="hidden lg:flex flex-col justify-between bg-sky-600 p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-sky-600 shadow-md">
            NC
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.35em]">
            Nexcart
          </span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Shop community favorites right from your doorstep.
          </h1>
          <p className="text-sky-100 max-w-md">
            Discover curated essential findables, custom collections, and local
            neighborhood picks with an optimized digital experience.
          </p>
        </div>

        <p className="text-xs text-sky-200/80">
          &copy; 2026 Nexcart Marketplace Ecosystem. All rights reserved.
        </p>
      </div>

      {/* Right Column: Clean Clerk Interaction Engine */}
      <div className="flex items-center justify-center p-8 bg-slate-50">
        <SignIn />
      </div>
    </div>
  );
}
