import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/account", "/cv"];

function isProtectedPath(pathname: string): boolean {
    return PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/"));
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get("access_token")?.value;

    // Si authentifié et sur la page d'accueil → redirection vers le dashboard
    if (pathname === "/" && token) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (!isProtectedPath(pathname)) {
        return NextResponse.next();
    }
    if (!token) {
        return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/dashboard", "/account", "/cv", "/cv/:path*"],
};
