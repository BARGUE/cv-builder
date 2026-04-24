"use client";

import { Plus, Trash2 } from "lucide-react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import type { CVData } from "@/src/types/cv";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { ScrollDatePicker } from "@/src/components/ui/scroll-date-picker";
import { ValidatedField, useFieldValidAtPath } from "@/src/lib/validations/validated-field";

function EducationCard({ index, onRemove }: { index: number; onRemove: () => void }) {
  const { control, register } = useFormContext<CVData>();
  const t = useTranslations("cvEditor");
  const schoolValid = useFieldValidAtPath(`education.${index}.school`);
  const degreeValid = useFieldValidAtPath(`education.${index}.degree`);
  const startDateValid = useFieldValidAtPath(`education.${index}.startDate`);
  const endDateValid = useFieldValidAtPath(`education.${index}.endDate`);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4 relative">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">
          {t("step3.formationN", { n: index + 1 })}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg text-destructive hover:bg-destructive/10"
          onClick={onRemove}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">{t("step3.school")}</Label>
          <ValidatedField isValid={schoolValid.isValid} error={schoolValid.error}>
            <Input
              className="h-11 rounded-xl"
              placeholder={t("step3.schoolPlaceholder")}
              maxLength={200}
              {...register(`education.${index}.school`)}
            />
          </ValidatedField>
          {schoolValid.error && (
            <p className="text-sm text-destructive">{schoolValid.error}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">{t("step3.degree")}</Label>
          <ValidatedField isValid={degreeValid.isValid} error={degreeValid.error}>
            <Input
              className="h-11 rounded-xl"
              placeholder={t("step3.degreePlaceholder")}
              maxLength={200}
              {...register(`education.${index}.degree`)}
            />
          </ValidatedField>
          {degreeValid.error && (
            <p className="text-sm text-destructive">{degreeValid.error}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">{t("step3.startDate")}</Label>
          <Controller
            control={control}
            name={`education.${index}.startDate`}
            render={({ field: f }) => (
              <ValidatedField isValid={startDateValid.isValid} error={startDateValid.error} ringOnChild={true}>
                <ScrollDatePicker
                  value={f.value}
                  onChange={f.onChange}
                  placeholder={t("step3.startPlaceholder")}
                  className="w-full"
                />
              </ValidatedField>
            )}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">{t("step3.endDate")}</Label>
          <Controller
            control={control}
            name={`education.${index}.endDate`}
            render={({ field: f }) => (
              <ValidatedField isValid={endDateValid.isValid} error={endDateValid.error} ringOnChild={true}>
                <ScrollDatePicker
                  value={f.value}
                  onChange={f.onChange}
                  placeholder={t("step3.endPlaceholder")}
                  className="w-full"
                />
              </ValidatedField>
            )}
          />
        </div>
      </div>
    </div>
  );
}

export function Step3Formation() {
  const { control } = useFormContext<CVData>();
  const t = useTranslations("cvEditor");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
    keyName: "id",
  });

  return (
    <div className="space-y-4">
      {fields.map((field, i) => (
        <EducationCard key={field.id} index={i} onRemove={() => remove(i)} />
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            id: crypto.randomUUID(),
            school: "",
            degree: "",
            startDate: "",
            endDate: "",
          })
        }
        className="w-full h-12 rounded-xl border-dashed gap-2 hover:border-primary hover:bg-primary/10 hover:text-primary"
      >
        <Plus className="h-4 w-4" />
        {t("step3.addFormation")}
      </Button>
    </div>
  );
}
