// src/middleware.js
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";

const isProtectedRoute = createRouteMatcher([
  "(.*)/user(.*)",
  "(.*)/configure(.*)",
  "(.*)/myorders(.*)",
]);

const intlMiddleware = createMiddleware({
  locales: ["en", "fr", "es"],
  defaultLocale: "en",
  localeDetection: false,
});

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    "/(fr|en|es)/:path*",
  ],
};
