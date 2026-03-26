export interface AuthCredentials {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

export interface AuthApiResponse {
    access_token?: string;
    accessToken?: string;
    user?: unknown;
}

export interface MeResponse {
    email?: string;
    userId?: string;
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    profile?: Profile;
}

export interface Profile {
    id: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface UpdateProfilePayload {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
}

export interface LoginResult {
    accessToken: string;
    user?: unknown;
}

export interface RegisterResult {
    accessToken: string;
    user?: unknown;
}

export interface SessionExpiredError extends Error {
    name: "SessionExpiredError";
}
