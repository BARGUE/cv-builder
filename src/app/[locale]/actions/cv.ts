"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { runAuthedAction } from "@/src/lib/action";
import { createCvApi, deleteCvApi, getCvApi, updateCvApi } from "@/src/services/cv/api";
import type { CVData } from "@/src/types/cv";
import type { ActionResult } from "@/src/types/api";

/** Pages qui affichent des données de CV ([locale] fait partie du chemin). */
function revalidateCvPages() {
  revalidatePath("/[locale]/dashboard", "page");
  revalidatePath("/[locale]/account", "page");
  revalidatePath("/[locale]/cv/[id]", "page");
}

export async function getCvAction(cvId: string): Promise<ActionResult<CVData>> {
  const t = await getTranslations("serverErrors.pdf");
  return runAuthedAction(async (token) => {
    const cv = await getCvApi(cvId, token);
    if (!cv) throw new Error(t("cannotLoadCv"));
    return cv;
  }, t("cvLoadError"));
}

export async function createCvAction(payload: CVData): Promise<ActionResult<CVData>> {
  const t = await getTranslations("serverErrors");
  return runAuthedAction(async (token) => {
    const cv = await createCvApi(payload, token);
    revalidateCvPages();
    return cv;
  }, t("cvCreateError"));
}

export async function updateCvAction(cvId: string, payload: CVData): Promise<ActionResult<CVData>> {
  const t = await getTranslations("serverErrors");
  return runAuthedAction(async (token) => {
    const cv = await updateCvApi(cvId, payload, token);
    revalidateCvPages();
    return cv;
  }, t("cvUpdateError"));
}

export async function deleteCvAction(cvId: string): Promise<ActionResult> {
  const t = await getTranslations("serverErrors");
  return runAuthedAction(async (token) => {
    await deleteCvApi(cvId, token);
    revalidateCvPages();
  }, t("cvDeleteError"));
}
