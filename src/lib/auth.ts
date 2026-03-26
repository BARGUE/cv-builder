import { cookies } from "next/headers";
import { SessionExpiredError } from "@/src/services/auth/types";

export async function getToken(): Promise<string | undefined> {
  const token = (await cookies()).get("access_token")?.value;
  return token ?? undefined;
}

export function createSessionExpiredError(): SessionExpiredError {
  const err = new Error("Session expirée") as SessionExpiredError;
  err.name = "SessionExpiredError";
  return err;
}

export function isSessionExpiredError(e: unknown): e is SessionExpiredError {
  return e instanceof Error && e.name === "SessionExpiredError";
}
