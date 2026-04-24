"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import type { CVData } from "@/src/types/cv";
import type { Step7FinaliserProps } from "@/src/components/cv/types";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { ValidatedField, useFieldValidAtPath } from "@/src/lib/validations/validated-field";

export function Step7Finaliser({ templates }: Step7FinaliserProps) {
  const { register, watch, setValue } = useFormContext<CVData>();
  const t = useTranslations("cvEditor");
  const template = watch("template");
  const titleValid = useFieldValidAtPath("title");

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
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

      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <span className="text-sm font-bold tracking-tight">{t("step7.template")}</span>
        <div className="grid grid-cols-3 gap-3">
          {templates.map((tpl) => (
            <Button
              key={tpl.id}
              type="button"
              variant="outline"
              onClick={() => setValue("template", tpl.id, { shouldDirty: true })}
              className={`rounded-xl border-2 p-4 text-center text-sm font-semibold transition-all h-auto ${template === tpl.id
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/30"
                }`}
            >
              {tpl.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
