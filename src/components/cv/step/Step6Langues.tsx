"use client";

import { Plus, Trash2 } from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { useTranslations } from "next-intl";
import { emptyLanguage, LANGUAGE_LEVELS, type CVData } from "@/src/types/cv";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { ValidatedField, useFieldValidAtPath } from "@/src/lib/validations/validated-field";

function LanguageRow({ index, onRemove }: { index: number; onRemove: () => void }) {
  const { register } = useFormContext<CVData>();
  const t = useTranslations("cvEditor");
  // Libellés traduits, dans le même ordre que LANGUAGE_LEVELS (valeurs stockées).
  const labels = t.raw("languageLevels") as string[];
  const nameValid = useFieldValidAtPath(`languages.${index}.name`);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-3 sm:p-4">
      <div className="basis-full sm:basis-0 flex-1 space-y-1.5">
        <ValidatedField isValid={nameValid.isValid} error={nameValid.error}>
          <Input
            className="h-11 rounded-xl"
            placeholder={t("step6.languagePlaceholder")}
            maxLength={100}
            {...register(`languages.${index}.name`)}
          />
        </ValidatedField>
        {nameValid.error && (
          <p className="text-sm text-destructive">{nameValid.error}</p>
        )}
      </div>
      <div className="flex-1 sm:flex-none sm:min-w-[140px]">
        <select
          className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
          {...register(`languages.${index}.level`)}
        >
          {LANGUAGE_LEVELS.map((level, i) => (
            <option key={level} value={level}>
              {labels[i] ?? level}
            </option>
          ))}
        </select>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-lg text-destructive hover:bg-destructive/10 shrink-0"
        onClick={onRemove}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

export function Step6Langues() {
  const { control } = useFormContext<CVData>();
  const t = useTranslations("cvEditor");
  const { fields, append, remove } = useFieldArray({ control, name: "languages", keyName: "key" });

  return (
    <div className="space-y-3">
      {fields.map((field, i) => (
        <LanguageRow key={field.key} index={i} onRemove={() => remove(i)} />
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => append(emptyLanguage())}
        className="w-full h-12 rounded-xl border-dashed gap-2 hover:border-primary hover:bg-primary/10 hover:text-primary"
      >
        <Plus className="h-4 w-4" />
        {t("step6.addLanguage")}
      </Button>
    </div>
  );
}
