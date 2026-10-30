"use client";

import { Plus, Trash2 } from "lucide-react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import { emptySkill, type CVData } from "@/src/types/cv";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { ValidatedField, useFieldValidAtPath } from "@/src/lib/validations/validated-field";

export function Step4Competences() {
  const { control } = useFormContext<CVData>();
  const t = useTranslations("cvEditor");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
    keyName: "key",
  });

  return (
    <div className="space-y-3">
      {fields.map((field, i) => (
        <SkillRow
          key={field.key}
          index={i}
          onRemove={() => remove(i)}
        />
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => append(emptySkill())}
        className="w-full h-12 rounded-xl border-dashed gap-2 hover:border-primary hover:bg-primary/10 hover:text-primary"
      >
        <Plus className="h-4 w-4" />
        {t("step4.addSkill")}
      </Button>
    </div>
  );
}

function SkillRow({
  index,
  onRemove,
}: {
  index: number;
  onRemove: () => void;
}) {
  const { control, register } = useFormContext<CVData>();
  const t = useTranslations("cvEditor");
  const nameValid = useFieldValidAtPath(`skills.${index}.name`);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-3 sm:p-4">
      <div className="basis-full sm:basis-0 flex-1 space-y-1.5">
        <ValidatedField isValid={nameValid.isValid} error={nameValid.error}>
          <Input
            className="h-11 rounded-xl"
            placeholder={t("step4.skillPlaceholder")}
            maxLength={100}
            {...register(`skills.${index}.name`)}
          />
        </ValidatedField>
        {nameValid.error && (
          <p className="text-sm text-destructive">{nameValid.error}</p>
        )}
      </div>
      <Controller
        control={control}
        name={`skills.${index}.level`}
        render={({ field }) => {
          const level = field.value ?? 0;
          return (
            <div className="flex gap-1 flex-1 sm:flex-none">
              {[1, 2, 3, 4, 5].map((l) => (
                <Button
                  key={l}
                  type="button"
                  variant={l <= level ? "default" : "secondary"}
                  size="icon"
                  onClick={() => field.onChange(l)}
                  className={`h-9 flex-1 sm:flex-none sm:w-9 rounded-lg text-xs font-bold transition-colors ${l <= level
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                >
                  {l}
                </Button>
              ))}
            </div>
          );
        }}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-lg text-destructive hover:bg-destructive/10"
        onClick={onRemove}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
