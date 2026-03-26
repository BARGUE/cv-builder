"use client";

import { useFormContext } from "react-hook-form";
import type { CVData } from "@/src/types/cv";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { ValidatedField, useFieldValidAtPath } from "@/src/lib/validations/validated-field";

export function Step5Resume() {
  const { register, watch } = useFormContext<CVData>();
  const summary = watch("summary") ?? "";
  const summaryValid = useFieldValidAtPath("summary");

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Résumé professionnel *</Label>
        <ValidatedField isValid={summaryValid.isValid} error={summaryValid.error} variant="textarea" inputClassNameWhenValid="pr-10">
          <Textarea
            className="rounded-xl resize-none"
            placeholder="Décrivez-vous en quelques phrases. Mettez en avant vos points forts et votre valeur ajoutée..."
            rows={8}
            maxLength={2000}
            {...register("summary")}
          />
        </ValidatedField>
        <p className="text-xs text-muted-foreground">{summary.length} / 2000 caractères</p>
        {summaryValid.error && (
          <p className="text-sm text-destructive">{summaryValid.error}</p>
        )}
      </div>
    </div>
  );
}
