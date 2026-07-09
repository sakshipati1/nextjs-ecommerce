import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// We add "/" here so the entire app requires a login first
const isProtectedRoute = createRouteMatcher([
  "/",
  "/checkout(.*)",
  "/admin(.*)",
  "/track-order(.*)",
]);

export function proxy(request) {
  return clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
      await auth.protect(); // Redirects unauthenticated users directly to sign-in
    }
  })(request);
}

export const config = {
  matcher: [
    "/",
    "/checkout(.*)",
    "/admin(.*)",
    "/track-order(.*)",
    "/api/(.*)",
  ],
};
