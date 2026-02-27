import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/account", "/cv"];

function isProtectedPath(pathname: string): boolean {
    return PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/"));
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    if (!isProtectedPath(pathname)) {
        return NextResponse.next();
    }
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
        const authUrl = new URL("/", req.url);
        return NextResponse.redirect(authUrl);
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard", "/account", "/cv", "/cv/:path*"],
};
