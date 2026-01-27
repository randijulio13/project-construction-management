import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  // 1. First, handle internationalization
  const response = intlMiddleware(request);

  // 2. Extract locale from the pathname or use default
  const pathnameHasLocale = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  // Normalize pathname for auth check (remove locale prefix)
  let internalPathname = pathname;
  if (pathnameHasLocale) {
    const parts = pathname.split("/");
    internalPathname = "/" + parts.slice(2).join("/");
  }

  // 3. Authentication Logic
  const isProtectedRoute =
    internalPathname.startsWith("/dashboard") ||
    internalPathname.startsWith("/warehouse") ||
    internalPathname.startsWith("/projects") ||
    internalPathname.startsWith("/account-settings");
  const isAuthRoute =
    internalPathname === "/login" || internalPathname === "/register";

  if (isProtectedRoute && !token) {
    const url = new URL("/login", request.url);
    // Ensure redirect keeps the locale if present
    if (pathnameHasLocale) {
      const locale = pathname.split("/")[1];
      url.pathname = `/${locale}/login`;
    }
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && token) {
    const url = new URL("/dashboard", request.url);
    if (pathnameHasLocale) {
      const locale = pathname.split("/")[1];
      url.pathname = `/${locale}/dashboard`;
    }
    return NextResponse.redirect(url);
  }

  // 4. Redirect root to dashboard
  if (internalPathname === "/") {
    const url = new URL("/dashboard", request.url);
    if (pathnameHasLocale) {
      const locale = pathname.split("/")[1];
      url.pathname = `/${locale}/dashboard`;
    }
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /_static (inside /public)
  // - /_vercel (Vercel internals)
  // - all root files inside /public (e.g. /favicon.ico)
  matcher: [
    "/",
    "/(id|en)/:path*",
    "/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};
