"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import type { CVData } from "@/src/types/cv";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { ValidatedField, useFieldValidAtPath } from "@/src/lib/validations/validated-field";

export function Step5Resume() {
  const { register, watch } = useFormContext<CVData>();
  const t = useTranslations("cvEditor");
  const summary = watch("summary") ?? "";
  const summaryValid = useFieldValidAtPath("summary");

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">{t("step5.label")}</Label>
        <ValidatedField isValid={summaryValid.isValid} error={summaryValid.error} variant="textarea" inputClassNameWhenValid="pr-10">
          <Textarea
            className="rounded-xl resize-none"
            placeholder={t("step5.placeholder")}
            rows={8}
            maxLength={2000}
            {...register("summary")}
          />
        </ValidatedField>
        <p className="text-xs text-muted-foreground">{t("step5.charCount", { count: summary.length })}</p>
        {summaryValid.error && (
          <p className="text-sm text-destructive">{summaryValid.error}</p>
        )}
      </div>
    </div>
  );
}
