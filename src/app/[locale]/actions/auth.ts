"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginApi, registerApi } from "@/src/services/auth/api";
import type { AuthCredentials } from "@/src/services/auth/types";
import type { ActionResult } from "@/src/types/api";

export async function loginAction(
  credentials: AuthCredentials
): Promise<ActionResult<void>> {
  const trimmedEmail = (credentials.email ?? "").trim();
  if (!trimmedEmail || !credentials.password) {
    return { success: false, error: "Email et mot de passe requis" };
  }
  try {
    const result = await loginApi({
      email: trimmedEmail,
      password: credentials.password,
    });
    const cookieStore = await cookies();
    cookieStore.set("access_token", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return { success: true, data: undefined };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Identifiants invalides";
    return { success: false, error: message };
  }
}

export async function registerAction(
  credentials: AuthCredentials
): Promise<ActionResult<void>> {
  const trimmedEmail = (credentials.email ?? "").trim();
  const firstName = (credentials.firstName ?? "").trim();
  const lastName = (credentials.lastName ?? "").trim();
  if (!trimmedEmail || !credentials.password) {
    return { success: false, error: "Email et mot de passe requis" };
  }
  if (!firstName || !lastName) {
    return { success: false, error: "Prénom et nom requis pour l'inscription" };
  }
  try {
    const result = await registerApi({
      email: trimmedEmail,
      password: credentials.password,
      firstName,
      lastName,
    });
    const cookieStore = await cookies();
    cookieStore.set("access_token", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return { success: true, data: undefined };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Inscription refusée";
    return { success: false, error: message };
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("access_token", "", { path: "/", maxAge: 0 });
  redirect("/");
}
