import { NextResponse } from "next/server";
import { loginApi, registerApi } from "@/src/services/auth/api";
import type { AuthRouteBody } from "@/src/services/auth/types";

export async function POST(req: Request) {
    let body: AuthRouteBody;
    try {
        body = (await req.json()) as AuthRouteBody;
    } catch {
        return NextResponse.json(
            { error: "Corps de requête invalide" },
            { status: 400 }
        );
    }

    const { action, email, password } = body;
    const trimmedEmail = typeof email === "string" ? email.trim() : "";

    if (!trimmedEmail || !password) {
        return NextResponse.json(
            { error: "Email et mot de passe requis" },
            { status: 400 }
        );
    }

    const credentials = { email: trimmedEmail, password };

    try {
        const result =
            action === "login"
                ? await loginApi(credentials)
                : await registerApi(credentials);

        const res = NextResponse.json({ user: result.user ?? null });
        res.cookies.set("access_token", result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 jours
        });
        return res;
    } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur d'authentification";
        const status = message.includes("réseau") || message.includes("Configuration") ? 502 : 401;
        return NextResponse.json({ error: message }, { status });
    }
}
