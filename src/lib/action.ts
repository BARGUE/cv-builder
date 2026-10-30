import { getTranslations } from "next-intl/server";
import { clearSessionCookie, getToken } from "@/src/lib/auth";
import { isSessionExpiredError } from "@/src/services/http";
import type { ActionResult } from "@/src/types/api";

/** Exécute `fn` et convertit toute exception en ActionResult. */
export async function runAction<T>(fn: () => Promise<T>, fallbackError: string): Promise<ActionResult<T>> {
  try {
    return { success: true, data: await fn() };
  } catch (err) {
    if (isSessionExpiredError(err)) {
      await clearSessionCookie();
      const t = await getTranslations("serverErrors");
      return { success: false, error: t("unauthenticated"), code: "UNAUTHORIZED" };
    }
    return { success: false, error: err instanceof Error ? err.message : fallbackError };
  }
}

/** Comme runAction, mais exige une session et fournit le token. */
export async function runAuthedAction<T>(
  fn: (token: string) => Promise<T>,
  fallbackError: string,
): Promise<ActionResult<T>> {
  const token = await getToken();
  if (!token) {
    const t = await getTranslations("serverErrors");
    return { success: false, error: t("unauthenticated"), code: "UNAUTHORIZED" };
  }
  return runAction(() => fn(token), fallbackError);
}
