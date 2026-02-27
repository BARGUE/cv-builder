import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/** Retourne le token s'il existe, sans rediriger. Pour le layout / vérifications côté serveur. */
export async function getToken(): Promise<string | undefined> {
  const token = (await cookies()).get("access_token")?.value;
  return token ?? undefined;
}

export async function requireAuth(): Promise<string> {
  const token = await getToken();
  if (!token) {
    redirect("/");
  }
  return token;
}
