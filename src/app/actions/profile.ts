"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { updateProfileApi, updatePasswordApi } from "@/src/services/auth/api";
import type { Profile, UpdateProfilePayload } from "@/src/services/auth/types";
import type { ActionResult } from "@/src/types/api";

async function getToken(): Promise<string | undefined> {
  const c = await cookies();
  return c.get("access_token")?.value;
}

export async function updateProfileAction(
  payload: UpdateProfilePayload
): Promise<ActionResult<Profile>> {
  const token = await getToken();
  if (!token) {
    return { success: false, error: "Non authentifié" };
  }
  try {
    const profile = await updateProfileApi(token, {
      firstName: payload.firstName,
      lastName: payload.lastName,
      avatarUrl: payload.avatarUrl,
    });
    if (!profile) {
      return { success: false, error: "Profil introuvable" };
    }
    revalidatePath("/account");
    revalidatePath("/dashboard");
    return { success: true, data: profile };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erreur lors de la mise à jour";
    return { success: false, error: message };
  }
}

export async function updatePasswordAction(
  newPassword: string
): Promise<ActionResult<void>> {
  const token = await getToken();
  if (!token) {
    return { success: false, error: "Non authentifié" };
  }
  if (typeof newPassword !== "string" || newPassword.length < 6) {
    return {
      success: false,
      error: "Le mot de passe doit contenir au moins 6 caractères.",
    };
  }
  try {
    await updatePasswordApi(token, newPassword);
    return { success: true, data: undefined };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erreur lors du changement";
    return { success: false, error: message };
  }
}
