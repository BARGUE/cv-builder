import { apiRequest } from "@/src/services/http";
import type { AuthApiResponse, AuthCredentials, MeResponse, Profile, UpdateProfilePayload } from "./types";

export { isSessionExpiredError } from "@/src/services/http";

async function authenticate(path: string, credentials: AuthCredentials, fallbackError: string): Promise<string> {
    const data = await apiRequest<AuthApiResponse>(path, { method: "POST", body: credentials, fallbackError });
    const accessToken = data?.access_token ?? data?.accessToken;
    if (!accessToken) throw new Error("Réponse API invalide");
    return accessToken;
}

export const loginApi = (credentials: AuthCredentials) =>
    authenticate("/auth/login", credentials, "Identifiants invalides");

export const registerApi = (credentials: AuthCredentials) =>
    authenticate("/auth/register", credentials, "Inscription refusée");

export const getMe = (token: string) =>
    apiRequest<MeResponse>("/me", { token, fallbackError: "Erreur lors de la récupération du profil" });

export const updateProfileApi = (token: string, body: UpdateProfilePayload) =>
    apiRequest<Profile>("/me/profile", {
        method: "PATCH",
        token,
        body,
        fallbackError: "Erreur lors de la mise à jour du profil",
    });

export const updatePasswordApi = (token: string, newPassword: string) =>
    apiRequest<void>("/me/password", {
        method: "PATCH",
        token,
        body: { newPassword },
        fallbackError: "Erreur lors du changement de mot de passe",
    });
