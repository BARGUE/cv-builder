import type {
    AuthCredentials,
    AuthApiResponse,
    MeResponse,
    LoginResult,
    RegisterResult,
    UpdateProfilePayload,
    SessionExpiredError,
} from "./types";

const AUTH_API_URL = process.env.AUTH_API_URL;

function getBaseUrl(): string {
    if (!AUTH_API_URL) {
        throw new Error("Configuration serveur manquante (AUTH_API_URL)");
    }
    return AUTH_API_URL;
}

function getAccessToken(data: AuthApiResponse): string | undefined {
    return data.access_token ?? data.accessToken;
}

function parseApiError(body: unknown): string {
    if (body && typeof body === "object") {
        const o = body as Record<string, unknown>;
        if (Array.isArray(o.message)) return String(o.message[0]);
        if (typeof o.message === "string") return o.message;
        if (typeof o.error === "string") return o.error;
        if (o.message != null) return String(o.message);
    }
    return "Erreur inconnue";
}

export async function loginApi(credentials: AuthCredentials): Promise<LoginResult> {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(parseApiError(body) || "Identifiants invalides");
    }

    const data = (await res.json()) as AuthApiResponse;
    const accessToken = getAccessToken(data);
    if (!accessToken) {
        throw new Error("Réponse API invalide");
    }
    return { accessToken, user: data.user };
}

export async function registerApi(credentials: AuthCredentials): Promise<RegisterResult> {
    const baseUrl = getBaseUrl();
    let res: Response;
    try {
        res = await fetch(`${baseUrl}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur réseau";
        throw new Error(message);
    }

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(parseApiError(body) || "Inscription refusée");
    }

    const data = (await res.json()) as AuthApiResponse;
    const accessToken = getAccessToken(data);
    if (!accessToken) {
        throw new Error("Réponse API invalide");
    }
    return { accessToken, user: data.user };
}

export function createSessionExpiredError(): SessionExpiredError {
    const err = new Error("Session expirée") as SessionExpiredError;
    err.name = "SessionExpiredError";
    return err;
}

export function isSessionExpiredError(e: unknown): e is SessionExpiredError {
    return e instanceof Error && e.name === "SessionExpiredError";
}

export async function getMe(accessToken: string): Promise<MeResponse> {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
    });
    if (res.status === 401) {
        throw createSessionExpiredError();
    }
    if (!res.ok) {
        throw new Error("Erreur lors de la récupération du profil");
    }
    return (await res.json()) as MeResponse;
}

export async function updateProfileApi(
    accessToken: string,
    body: UpdateProfilePayload,
): Promise<MeResponse["profile"]> {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/me/profile`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(parseApiError(err) || "Erreur lors de la mise à jour du profil");
    }
    return (await res.json()) as MeResponse["profile"];
}

export async function updatePasswordApi(
    accessToken: string,
    newPassword: string,
): Promise<void> {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/me/password`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(parseApiError(err) || "Erreur lors du changement de mot de passe");
    }
}
