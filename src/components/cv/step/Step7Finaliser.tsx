"use client";

import { useFormContext } from "react-hook-form";
import type { CVData } from "@/src/types/cv";
import type { Step7FinaliserProps } from "@/src/components/cv/types";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { ValidatedField, useFieldValidAtPath } from "@/src/lib/validations/validated-field";

export function Step7Finaliser({ templates }: Step7FinaliserProps) {
  const { register, watch, setValue } = useFormContext<CVData>();
  const template = watch("template");
  const titleValid = useFieldValidAtPath("title");

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="space-y-1.5">
          <span className="text-sm font-bold tracking-tight">Titre du CV</span>
          <ValidatedField isValid={titleValid.isValid} error={titleValid.error}>
            <Input
              className="h-11 rounded-xl"
              placeholder="ex. Mon CV Développeur"
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
        <span className="text-sm font-bold tracking-tight">Template</span>
        <div className="grid grid-cols-3 gap-3">
          {templates.map((t) => (
            <Button
              key={t.id}
              type="button"
              variant="outline"
              onClick={() => setValue("template", t.id)}
              className={`rounded-xl border-2 p-4 text-center text-sm font-semibold transition-all h-auto ${template === t.id
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/30"
                }`}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
