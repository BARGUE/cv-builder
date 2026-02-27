export interface AuthCredentials {
    email: string;
    password: string;
}

export interface AuthApiResponse {
    access_token?: string;
    accessToken?: string;
    user?: unknown;
}

export type AuthAction = "login" | "register";

export interface AuthRouteBody extends AuthCredentials {
    action: AuthAction;
}

export interface AuthRouteResponse {
    user?: unknown;
    error?: string;
}

export interface MeResponse {
    email?: string;
    userId?: string;
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    profile?: Profile | null;
}

interface Profile {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
    createdAt?: string;
    updatedAt?: string;
}
