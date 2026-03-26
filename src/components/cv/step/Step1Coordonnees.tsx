"use client";

import { User, Briefcase, Upload, Trash2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { CVData } from "@/src/types/cv";
import type { Step1CoordonneesProps } from "@/src/components/cv/types";
import { getFieldInputProps } from "@/src/lib/validations/cv";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { ValidatedField, useFieldValidAtPath } from "@/src/lib/validations/validated-field";

export function Step1Coordonnees({ handlePhotoUpload, fileInputRef }: Step1CoordonneesProps) {
  const { register, watch, setValue } = useFormContext<CVData>();
  const photoUrl = watch("photoUrl");

  const phoneReg = register("phone");
  const phoneInputProps = getFieldInputProps("phone", phoneReg.onChange);

  const fullNameValid = useFieldValidAtPath("fullName");
  const jobTitleValid = useFieldValidAtPath("jobTitle");
  const phoneValid = useFieldValidAtPath("phone");
  const emailValid = useFieldValidAtPath("email");
  const locationValid = useFieldValidAtPath("location");

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-bold tracking-tight">Photo & identité</span>
        </div>
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center overflow-hidden border border-border shrink-0">
            {photoUrl ? (
              <img src={photoUrl} alt="Photo" className="h-full w-full object-cover" />
            ) : (
              <User className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-3.5 w-3.5 mr-1.5" />
              {photoUrl ? "Changer" : "Ajouter une photo"}
            </Button>
            {photoUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
                onClick={() => setValue("photoUrl", "")}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Supprimer
              </Button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Nom complet *</Label>
            <ValidatedField isValid={fullNameValid.isValid} error={fullNameValid.error}>
              <Input
                className="h-11 rounded-xl"
                placeholder="ex. Jean Dupont"
                {...register("fullName")}
              />
            </ValidatedField>
            {fullNameValid.error && (
              <p className="text-sm text-destructive">{fullNameValid.error}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Intitulé du poste *</Label>
            <ValidatedField isValid={jobTitleValid.isValid} error={jobTitleValid.error}>
              <Input
                className="h-11 rounded-xl"
                placeholder="ex. Développeur Web"
                {...register("jobTitle")}
              />
            </ValidatedField>
            {jobTitleValid.error && (
              <p className="text-sm text-destructive">{jobTitleValid.error}</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-bold tracking-tight">Contact</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Téléphone *</Label>
            <ValidatedField isValid={phoneValid.isValid} error={phoneValid.error}>
              <Input
                className="h-11 rounded-xl"
                placeholder="ex. 06 12 34 56 78"
                {...phoneReg}
                {...phoneInputProps}
              />
            </ValidatedField>
            {phoneValid.error && (
              <p className="text-sm text-destructive">{phoneValid.error}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">E-mail *</Label>
            <ValidatedField isValid={emailValid.isValid} error={emailValid.error}>
              <Input
                className="h-11 rounded-xl"
                placeholder="ex. jean@exemple.com"
                {...getFieldInputProps("email")}
                {...register("email")}
              />
            </ValidatedField>
            {emailValid.error && (
              <p className="text-sm text-destructive">{emailValid.error}</p>
            )}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Ville *</Label>
          <ValidatedField isValid={locationValid.isValid} error={locationValid.error}>
            <Input
              className="h-11 rounded-xl"
              placeholder="ex. Paris, France"
              {...register("location")}
            />
          </ValidatedField>
          {locationValid.error && (
            <p className="text-sm text-destructive">{locationValid.error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
