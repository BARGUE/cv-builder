"use server";

import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { clearSessionCookie, setSessionCookie } from "@/src/lib/auth";
import { runAction } from "@/src/lib/action";
import { loginApi, registerApi } from "@/src/services/auth/api";
import type { AuthCredentials } from "@/src/services/auth/types";
import type { ActionResult } from "@/src/types/api";

export async function loginAction(credentials: AuthCredentials): Promise<ActionResult> {
  const t = await getTranslations("serverErrors");
  const email = (credentials.email ?? "").trim();
  if (!email || !credentials.password) {
    return { success: false, error: t("authEmailPasswordRequired") };
  }
  return runAction(async () => {
    await setSessionCookie(await loginApi({ email, password: credentials.password }));
  }, t("invalidCredentials"));
}

export async function registerAction(credentials: AuthCredentials): Promise<ActionResult> {
  const t = await getTranslations("serverErrors");
  const email = (credentials.email ?? "").trim();
  const firstName = (credentials.firstName ?? "").trim();
  const lastName = (credentials.lastName ?? "").trim();
  if (!email || !credentials.password) {
    return { success: false, error: t("authEmailPasswordRequired") };
  }
  if (!firstName || !lastName) {
    return { success: false, error: t("authNameRequiredRegister") };
  }
  return runAction(async () => {
    await setSessionCookie(await registerApi({ email, password: credentials.password, firstName, lastName }));
  }, t("registrationDenied"));
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/");
}
