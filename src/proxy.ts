import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/src/i18n/routing";
import { SESSION_COOKIE } from "@/src/lib/auth";

type Locale = (typeof routing.locales)[number];

const handleI18nRouting = createMiddleware(routing);

const PROTECTED_PATHS = ["/dashboard", "/account", "/cv"];
const PUBLIC_CV_PATHS = ["/cv/start", "/cv/new", "/cv/import"];

/** Sépare "/fr/dashboard" en { locale: "fr", path: "/dashboard" }. */
function splitLocale(pathname: string): { locale: Locale; path: string } {
  const [, first, ...rest] = pathname.split("/");
  if (routing.locales.includes(first as Locale)) {
    return { locale: first as Locale, path: `/${rest.join("/")}` };
  }
  return { locale: routing.defaultLocale, path: pathname };
}

function isProtectedPath(path: string): boolean {
  if (PUBLIC_CV_PATHS.includes(path)) return false;
  return PROTECTED_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const host = request.headers.get("host") ?? "";
  if (host.startsWith("auth.")) {
    const url = request.nextUrl.clone();
    url.host = host.replace(/^auth\./, "");
    return NextResponse.redirect(url, 301);
  }

  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  const { locale, path } = splitLocale(pathname);

  if (path === "/" && hasSession) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }
  if (isProtectedPath(path) && !hasSession) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return handleI18nRouting(request);
}

export const config = {
  // Exclut les routes API, les assets Next et tout fichier avec extension (favicon, images…).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
