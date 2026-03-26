"use client";

import { Plus, Trash2 } from "lucide-react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import type { CVData } from "@/src/types/cv";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { ValidatedField, useFieldValidAtPath } from "@/src/lib/validations/validated-field";

export function Step4Competences() {
  const { control } = useFormContext<CVData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
    keyName: "id",
  });

  return (
    <div className="space-y-3">
      {fields.map((field, i) => (
        <SkillRow
          key={field.id}
          index={i}
          onRemove={() => remove(i)}
        />
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            id: crypto.randomUUID(),
            name: "",
            level: 3,
          })
        }
        className="w-full h-12 rounded-xl border-dashed gap-2 hover:border-primary hover:bg-primary/10 hover:text-primary"
      >
        <Plus className="h-4 w-4" />
        Ajouter une compétence
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
  const nameValid = useFieldValidAtPath(`skills.${index}.name`);

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
      <div className="flex-1 space-y-1.5">
        <ValidatedField isValid={nameValid.isValid} error={nameValid.error}>
          <Input
            className="h-11 rounded-xl"
            placeholder="ex. JavaScript"
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
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((l) => (
                <Button
                  key={l}
                  type="button"
                  variant={l <= level ? "default" : "secondary"}
                  size="icon"
                  onClick={() => field.onChange(l)}
                  className={`h-9 w-9 rounded-lg text-xs font-bold transition-colors ${l <= level
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
