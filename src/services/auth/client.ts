import type { AuthCredentials, AuthRouteResponse } from "./types";

const AUTH_API = "/api/auth";

async function requestAuth(
    action: "login" | "register",
    credentials: AuthCredentials
): Promise<AuthRouteResponse> {
    const res = await fetch(AUTH_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action, ...credentials }),
    });

    const data = (await res.json().catch(() => ({}))) as AuthRouteResponse & { error?: string };

    if (!res.ok) {
        throw new Error(data?.error ?? "Erreur d'authentification");
    }

    return data;
}

export async function login(credentials: AuthCredentials): Promise<AuthRouteResponse> {
    return requestAuth("login", credentials);
}

export async function register(credentials: AuthCredentials): Promise<AuthRouteResponse> {
    console.log("register", credentials);
    return requestAuth("register", credentials);
}
