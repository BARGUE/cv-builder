"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  createCvApi,
  updateCvApi,
  deleteCvApi,
} from "@/src/services/cv/api";
import type { CVData } from "@/src/types/cv";
import type { ActionResult } from "@/src/types/api";

async function getToken(): Promise<string | undefined> {
  const c = await cookies();
  return c.get("access_token")?.value;
}

export async function createCvAction(
  payload: CVData
): Promise<ActionResult<CVData>> {
  const token = await getToken();
  if (!token) {
    return { success: false, error: "Non authentifié" };
  }
  try {
    const cv = await createCvApi(payload, token);
    if (!cv) {
      return { success: false, error: "Erreur lors de la création" };
    }
    revalidatePath("/dashboard");
    revalidatePath("/account");
    revalidatePath("/cv/[id]", "page");
    return { success: true, data: cv };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erreur lors de la création";
    return { success: false, error: message };
  }
}

export async function updateCvAction(
  cvId: string,
  payload: CVData
): Promise<ActionResult<CVData>> {
  const token = await getToken();
  if (!token) {
    return { success: false, error: "Non authentifié" };
  }
  try {
    const cv = await updateCvApi(cvId, payload, token);
    if (!cv) {
      return { success: false, error: "Erreur lors de la mise à jour" };
    }
    revalidatePath("/dashboard");
    revalidatePath("/account");
    revalidatePath(`/cv/${cvId}`);
    revalidatePath("/cv/[id]", "page");
    return { success: true, data: cv };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erreur lors de la mise à jour";
    return { success: false, error: message };
  }
}

export async function deleteCvAction(cvId: string): Promise<ActionResult<void>> {
  const token = await getToken();
  if (!token) {
    return { success: false, error: "Non authentifié" };
  }
  const ok = await deleteCvApi(cvId, token);
  if (!ok) {
    return { success: false, error: "Erreur lors de la suppression" };
  }
  revalidatePath("/dashboard");
  revalidatePath("/account");
  revalidatePath("/cv/[id]", "page");
  return { success: true, data: undefined };
}
