import { redirect } from "next/navigation";
import { getToken } from "@/src/lib/auth";
import { isSessionExpiredError } from "@/src/services/http";

/**
 * Charge les données d'une page protégée.
 * Sans session → accueil ; session expirée côté backend → déconnexion.
 */
export async function withSession<T>(locale: string, load: (token: string) => Promise<T>): Promise<T> {
  const token = await getToken();
  if (!token) redirect(`/${locale}`);
  try {
    return await load(token);
  } catch (e) {
    if (isSessionExpiredError(e)) redirect(`/${locale}/auth/logout`);
    throw e;
  }
}

/** Variante pour les pages accessibles sans compte : renvoie null si aucune session. */
export async function withOptionalSession<T>(locale: string, load: (token: string) => Promise<T>): Promise<T | null> {
  if (!(await getToken())) return null;
  return withSession(locale, load);
}
