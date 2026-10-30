"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { runAuthedAction } from "@/src/lib/action";
import { MIN_PASSWORD_LENGTH } from "@/src/lib/validations/cv";
import { updatePasswordApi, updateProfileApi } from "@/src/services/auth/api";
import type { Profile, UpdateProfilePayload } from "@/src/services/auth/types";
import type { ActionResult } from "@/src/types/api";

export async function updateProfileAction(payload: UpdateProfilePayload): Promise<ActionResult<Profile>> {
  const t = await getTranslations("serverErrors");
  return runAuthedAction(async (token) => {
    const profile = await updateProfileApi(token, {
      firstName: payload.firstName,
      lastName: payload.lastName,
      avatarUrl: payload.avatarUrl,
    });
    if (!profile) throw new Error(t("profileNotFound"));
    revalidatePath("/[locale]/account", "page");
    revalidatePath("/[locale]/dashboard", "page");
    return profile;
  }, t("cvUpdateError"));
}

export async function updatePasswordAction(newPassword: string): Promise<ActionResult> {
  const t = await getTranslations("serverErrors");
  if (typeof newPassword !== "string" || newPassword.length < MIN_PASSWORD_LENGTH) {
    return { success: false, error: t("passwordMinServer") };
  }
  return runAuthedAction((token) => updatePasswordApi(token, newPassword), t("passwordChangeError"));
}
