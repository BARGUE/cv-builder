"use client";

import { Plus, Trash2 } from "lucide-react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import type { CVData } from "@/src/types/cv";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { ScrollDatePicker } from "@/src/components/ui/scroll-date-picker";
import { ValidatedField, useFieldValidAtPath } from "@/src/lib/validations/validated-field";

function ExperienceCard({ index, onRemove }: { index: number; onRemove: () => void }) {
  const { control, register } = useFormContext<CVData>();
  const companyValid = useFieldValidAtPath(`experiences.${index}.company`);
  const positionValid = useFieldValidAtPath(`experiences.${index}.position`);
  const descriptionValid = useFieldValidAtPath(`experiences.${index}.description`);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4 relative">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">
          Expérience {index + 1}
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
          <Label className="text-sm font-medium">Entreprise *</Label>
          <ValidatedField isValid={companyValid.isValid} error={companyValid.error}>
            <Input
              className="h-11 rounded-xl"
              placeholder="ex. Google"
              maxLength={200}
              {...register(`experiences.${index}.company`)}
            />
          </ValidatedField>
          {companyValid.error && (
            <p className="text-sm text-destructive">{companyValid.error}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Poste *</Label>
          <ValidatedField isValid={positionValid.isValid} error={positionValid.error}>
            <Input
              className="h-11 rounded-xl"
              placeholder="ex. Développeur Senior"
              maxLength={200}
              {...register(`experiences.${index}.position`)}
            />
          </ValidatedField>
          {positionValid.error && (
            <p className="text-sm text-destructive">{positionValid.error}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Date de début *</Label>
          <Controller
            control={control}
            name={`experiences.${index}.startDate`}
            render={({ field: f }) => (
              <ScrollDatePicker
                value={f.value}
                onChange={f.onChange}
                placeholder="ex. Jan 2020"
                className="w-full"
              />
            )}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Date de fin</Label>
          <Controller
            control={control}
            name={`experiences.${index}.endDate`}
            render={({ field: f }) => (
              <ScrollDatePicker
                value={f.value}
                onChange={f.onChange}
                placeholder="ex. Présent"
                className="w-full"
              />
            )}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Description</Label>
        <ValidatedField isValid={descriptionValid.isValid} error={descriptionValid.error} variant="textarea">
          <Textarea
            className="rounded-xl resize-none"
            placeholder="Décrivez vos responsabilités..."
            rows={3}
            maxLength={2000}
            {...register(`experiences.${index}.description`)}
          />
        </ValidatedField>
        {descriptionValid.error && (
          <p className="text-sm text-destructive">{descriptionValid.error}</p>
        )}
      </div>
    </div>
  );
}

export function Step2Experiences() {
  const { control } = useFormContext<CVData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences",
    keyName: "id",
  });

  return (
    <div className="space-y-4">
      {fields.map((field, i) => (
        <ExperienceCard key={field.id} index={i} onRemove={() => remove(i)} />
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            id: crypto.randomUUID(),
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            description: "",
          })
        }
        className="w-full h-12 rounded-xl border-dashed gap-2 hover:border-primary hover:bg-primary/10 hover:text-primary"
      >
        <Plus className="h-4 w-4" />
        Ajouter une expérience
      </Button>
    </div>
  );
}
