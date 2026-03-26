import { z } from "zod";


export const phoneSchema = z
  .string()
  .min(1, "Téléphone requis")
  .max(14, "Maximum 14 caractères")
  .regex(/^[\d\s]+$/, "Uniquement des chiffres (et espaces)")
  .refine((s) => s.replace(/\D/g, "").length >= 10, "Au moins 10 chiffres");

export const emailSchema = z
  .string()
  .min(1, "E-mail requis")
  .email("E-mail invalide");

export const requiredString = (min = 1, max = 500) =>
  z.string().min(min, "Champ requis").max(max);

export type FieldInputType = "phone" | "email" | "text" | "url";

export interface FieldInputOptions {
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  onInputTransform?: (value: string) => string;
}

const fieldInputOptions: Record<FieldInputType, FieldInputOptions> = {
  phone: {
    inputMode: "numeric",
    maxLength: 14,
    onInputTransform: (v) =>
      v.replace(/\D/g, "").replace(/(\d{2})(?=\d)/g, "$1 ").trim(),
  },
  email: {
    inputMode: "email",
    maxLength: 255,
  },
  text: {},
  url: {
    inputMode: "url",
  },
};

export function getFieldInputProps(
  type: FieldInputType,
  registerOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
): Pick<React.InputHTMLAttributes<HTMLInputElement>, "inputMode" | "maxLength" | "onChange"> {
  const opts = fieldInputOptions[type];
  const transform = opts.onInputTransform;
  return {
    inputMode: opts.inputMode,
    maxLength: opts.maxLength,
    ...(transform && registerOnChange
      ? {
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          e.target.value = transform(e.target.value);
          registerOnChange(e);
        },
      }
      : undefined),
  };
}

// ——— Schéma CV complet ———

const experienceSchema = z.object({
  id: z.string(),
  company: requiredString(1, 200),
  position: requiredString(1, 200),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string().max(2000, "Maximum 2000 caractères"),
});

const educationSchema = z.object({
  id: z.string(),
  school: requiredString(1, 200),
  degree: requiredString(1, 200),
  startDate: z.string(),
  endDate: z.string(),
});

const skillSchema = z.object({
  id: z.string(),
  name: requiredString(1, 100),
  level: z.number().min(1).max(5),
});

const languageLevels = ["Débutant", "Intermédiaire", "Avancé", "Courant", "Natif"] as const;
const languageSchema = z.object({
  id: z.string(),
  name: requiredString(1, 100),
  level: z.enum(languageLevels),
});

const templateSchema = z.enum([
  "classic",
  "modern",
  "creative",
  "compact",
  "executive",
  "sidebar",
  "minimaliste",
  "playfair",
  "tech",
]);

export const cvDataSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  title: requiredString(1, 200).default("Mon CV"),
  template: templateSchema.default("classic"),
  accentColor: z.string().default("#4F46E5"),
  photoUrl: z.string().default(""),
  fullName: requiredString(1, 200),
  jobTitle: requiredString(1, 200),
  email: emailSchema,
  phone: phoneSchema,
  location: requiredString(1, 200),
  summary: z.string().min(1, "Résumé requis").max(2000, "Maximum 2000 caractères").default(""),
  experiences: z.array(experienceSchema).min(1),
  education: z.array(educationSchema).min(1),
  skills: z.array(skillSchema).min(1),
  languages: z.array(languageSchema).min(1),
  currentStep: z.number().optional(),
  completed: z.boolean().optional(),
  updatedAt: z.string().optional(),
});

export type CVDataSchema = z.infer<typeof cvDataSchema>;
