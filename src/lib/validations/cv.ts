import { z } from "zod";
import { LANGUAGE_LEVELS, TEMPLATE_IDS } from "@/src/types/cv";

/**
 * Les messages d'erreur sont des clés du namespace i18n `validation`,
 * traduites à l'affichage par `useFieldValidAtPath`.
 */

export const MIN_PASSWORD_LENGTH = 6;

export const phoneSchema = z
  .string()
  .min(1, "phoneRequired")
  .max(20, "phoneMax")
  .regex(/^\+?[\d\s]+$/, "phoneDigitsOnly")
  .refine((s) => s.replace(/\D/g, "").length >= 8, "phoneMinDigits");

export const emailSchema = z.string().min(1, "emailRequired").email("emailInvalid");

const requiredString = (max: number) => z.string().trim().min(1, "fieldRequired").max(max);

export type FieldInputType = "phone" | "email" | "text" | "url";

export interface FieldInputOptions {
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  onInputTransform?: (value: string) => string;
}

/** Conserve un éventuel "+" initial, ne garde que les chiffres et les groupe par deux. */
const formatPhone = (v: string) => {
  const prefix = v.trimStart().startsWith("+") ? "+" : "";
  const digits = v.replace(/\D/g, "");
  return (prefix + digits.replace(/(\d{2})(?=\d)/g, "$1 ")).trim();
};

const fieldInputOptions: Record<FieldInputType, FieldInputOptions> = {
  phone: { inputMode: "tel", maxLength: 20, onInputTransform: formatPhone },
  email: { inputMode: "email", maxLength: 255 },
  text: {},
  url: { inputMode: "url" },
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
  company: requiredString(200),
  position: requiredString(200),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string().max(2000, "maxChars2000"),
});

const educationSchema = z.object({
  id: z.string(),
  school: requiredString(200),
  degree: requiredString(200),
  startDate: z.string(),
  endDate: z.string(),
});

const skillSchema = z.object({
  id: z.string(),
  name: requiredString(100),
  level: z.number().min(1).max(5),
});

const languageSchema = z.object({
  id: z.string(),
  name: requiredString(100),
  level: z.enum(LANGUAGE_LEVELS),
});

export const cvDataSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  title: requiredString(200),
  template: z.enum(TEMPLATE_IDS),
  accentColor: z.string(),
  photoUrl: z.string(),
  fullName: requiredString(200),
  jobTitle: requiredString(200),
  email: emailSchema,
  phone: phoneSchema,
  location: requiredString(200),
  summary: z.string().min(1, "summaryRequired").max(2000, "maxChars2000"),
  experiences: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(skillSchema),
  languages: z.array(languageSchema),
  currentStep: z.number().optional(),
  completed: z.boolean().optional(),
  updatedAt: z.string().optional(),
});

/** Champs validés par étape de l'éditeur : permet de renvoyer l'utilisateur à la première étape incomplète. */
export const STEP_FIELDS = {
  1: ["fullName", "jobTitle", "email", "phone", "location"],
  2: ["experiences"],
  3: ["education"],
  4: ["skills"],
  5: ["summary"],
  6: ["languages"],
  7: ["title"],
} as const;
