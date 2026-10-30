"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { TEMPLATE_IDS, type CVData } from "@/src/types/cv";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { ValidatedField, useFieldValidAtPath } from "@/src/lib/validations/validated-field";

export function Step7Finaliser() {
  const { register, watch, setValue } = useFormContext<CVData>();
  const t = useTranslations("cvEditor");
  const tTemplates = useTranslations("templates");
  const template = watch("template");
  const titleValid = useFieldValidAtPath("title");

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 space-y-4">
        <div className="space-y-1.5">
          <span className="text-sm font-bold tracking-tight">{t("step7.cvTitle")}</span>
          <ValidatedField isValid={titleValid.isValid} error={titleValid.error}>
            <Input
              className="h-11 rounded-xl"
              placeholder={t("step7.cvTitlePlaceholder")}
              maxLength={200}
              {...register("title")}
            />
          </ValidatedField>
          {titleValid.error && (
            <p className="text-sm text-destructive">{titleValid.error}</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 space-y-4">
        <span className="text-sm font-bold tracking-tight">{t("step7.template")}</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {TEMPLATE_IDS.map((id) => (
            <Button
              key={id}
              type="button"
              variant="outline"
              onClick={() => setValue("template", id, { shouldDirty: true })}
              className={`rounded-xl border-2 p-3 sm:p-4 text-center whitespace-normal text-sm font-semibold transition-all h-auto ${template === id
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/30"
                }`}
            >
              {tTemplates(id)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
