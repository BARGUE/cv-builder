/** Client HTTP unique vers l'API backend (AUTH_API_URL). */

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export class SessionExpiredError extends ApiError {
  constructor() {
    super("Session expirée", 401);
    this.name = "SessionExpiredError";
  }
}

export function isSessionExpiredError(e: unknown): e is SessionExpiredError {
  return e instanceof SessionExpiredError;
}

function getBaseUrl(): string {
  const url = process.env.AUTH_API_URL;
  if (!url) throw new Error("Configuration serveur manquante (AUTH_API_URL)");
  return url.replace(/\/$/, "");
}

export function parseApiError(body: unknown): string | undefined {
  if (body && typeof body === "object") {
    const o = body as Record<string, unknown>;
    if (Array.isArray(o.message) && o.message.length) return String(o.message[0]);
    if (typeof o.message === "string") return o.message;
    if (typeof o.error === "string") return o.error;
  }
  return undefined;
}

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  token?: string;
  body?: unknown;
  /** Message utilisé si le backend ne renvoie pas d'erreur lisible. */
  fallbackError?: string;
}

export async function apiRequest<T>(
  path: string,
  { method = "GET", token, body, fallbackError = "Erreur inconnue" }: ApiRequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(`${getBaseUrl()}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  if (res.status === 401 && token) throw new SessionExpiredError();
  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw new ApiError(parseApiError(errBody) ?? fallbackError, res.status);
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
