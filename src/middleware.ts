import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { userAgent } from "next/server";
import { routing } from "@/src/i18n/routing";

const handleI18nRouting = createMiddleware(routing);
const locales = routing.locales;
const defaultLocale = routing.defaultLocale;

const PROTECTED_PATHS = ["/dashboard", "/account"];
const UNPROTECTED_CV_PATHS = ["/cv/start", "/cv/new", "/cv/import"];

const systemRoutes = [
  "appspecific",
  "well-known",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "images",
  "icon",
];

function isSystemRoute(pathname: string): boolean {
  return systemRoutes.some((route) => pathname.includes(route));
}

function stripLocalePrefix(pathname: string): string {
  for (const loc of locales) {
    if (pathname === `/${loc}`) return "/";
    if (pathname.startsWith(`/${loc}/`)) {
      return pathname.slice(loc.length + 1) || "/";
    }
  }
  return pathname;
}

function isProtectedPath(path: string): boolean {
  if (UNPROTECTED_CV_PATHS.includes(path)) return false;
  if (path === "/cv" || path.startsWith("/cv/")) return true;
  return PROTECTED_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

/** Locale depuis le premier segment d’URL (/fr/..., /en/...). */
function localeFromPathname(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean)[0];
  if (segment && locales.includes(segment as "fr" | "en")) {
    return segment;
  }
  return defaultLocale;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isSystemRoute(pathname)) {
    return NextResponse.next();
  }

  const host = request.headers.get("host") ?? "";
  if (host.includes("auth.")) {
    const targetHost = host.replace(/^auth\./, "");
    const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
    return NextResponse.redirect(new URL(`https://${targetHost}${path}`), 301);
  }

  const token = request.cookies.get("access_token")?.value;
  const pathForAuth = stripLocalePrefix(pathname);

  if (pathForAuth === "/" && token) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}/dashboard`, request.url),
    );
  }

  if (isProtectedPath(pathForAuth) && !token) {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  const response = handleI18nRouting(request);

  const { device } = userAgent(request);
  response.headers.set("x-viewport", device.type || "desktop");
  response.headers.set("x-locale", localeFromPathname(pathname));

  return response;
}

export const config = {
  matcher: [
    "/",
    "/(fr|en)/:path*",
    "/((?!api|_next|_vercel|trpc|monitoring|.*\\..*).*)",
  ],
};
