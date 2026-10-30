export const TEMPLATE_IDS = [
  "classic",
  "modern",
  "creative",
  "compact",
  "executive",
  "sidebar",
  "minimaliste",
  "playfair",
  "tech",
] as const;

export type CVTemplate = (typeof TEMPLATE_IDS)[number];

/** Valeurs stockées en base (en français pour compatibilité avec les CV existants) ; l'affichage passe par i18n. */
export const LANGUAGE_LEVELS = ["Débutant", "Intermédiaire", "Avancé", "Courant", "Natif"] as const;

export type LanguageLevel = (typeof LANGUAGE_LEVELS)[number];

export const DEFAULT_ACCENT_COLOR = "#4F46E5";

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface CVData {
  id?: string;
  userId?: string;
  title: string;
  template: CVTemplate;
  accentColor: string;
  photoUrl: string;
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  currentStep?: number;
  completed?: boolean;
  updatedAt?: string;
}

export interface CVListItem {
  id: string;
  title: string;
  template: string;
  fullName: string;
  jobTitle: string;
  updatedAt: string;
  currentStep?: number;
  completed?: boolean;
}

const newId = () => crypto.randomUUID();

export const emptyExperience = (): Experience => ({
  id: newId(),
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  description: "",
});

export const emptyEducation = (): Education => ({
  id: newId(),
  school: "",
  degree: "",
  startDate: "",
  endDate: "",
});

export const emptySkill = (): Skill => ({ id: newId(), name: "", level: 3 });

export const emptyLanguage = (): Language => ({ id: newId(), name: "", level: "Intermédiaire" });

export const createDefaultCVData = (): CVData => ({
  title: "Mon CV",
  template: "classic",
  accentColor: DEFAULT_ACCENT_COLOR,
  photoUrl: "",
  fullName: "",
  jobTitle: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  experiences: [emptyExperience()],
  education: [emptyEducation()],
  skills: [emptySkill()],
  languages: [emptyLanguage()],
  currentStep: 1,
  completed: false,
});

const str = (v: unknown): string => (typeof v === "string" ? v : "");
const withId = (v: unknown): string => (typeof v === "string" && v ? v : newId());

/**
 * Normalise une donnée CV venant d'une source externe (backend, import IA) :
 * remplace les null par des chaînes vides, garantit des ids uniques et un template valide.
 */
type CVDataInput = Partial<Omit<CVData, "experiences" | "education" | "skills" | "languages">> & {
  experiences?: Partial<Experience>[];
  education?: Partial<Education>[];
  skills?: Partial<Skill>[];
  languages?: Partial<Language>[];
};

export function normalizeCVData(raw: CVDataInput | null | undefined): CVData {
  const base = createDefaultCVData();
  if (!raw) return base;
  const template = TEMPLATE_IDS.includes(raw.template as CVTemplate) ? (raw.template as CVTemplate) : base.template;
  const level = (v: unknown) => (typeof v === "number" && v >= 1 && v <= 5 ? Math.round(v) : 3);

  return {
    ...raw,
    title: str(raw.title) || base.title,
    template,
    accentColor: str(raw.accentColor) || base.accentColor,
    photoUrl: str(raw.photoUrl),
    fullName: str(raw.fullName),
    jobTitle: str(raw.jobTitle),
    email: str(raw.email),
    phone: str(raw.phone),
    location: str(raw.location),
    summary: str(raw.summary),
    experiences: (raw.experiences ?? []).map((e) => ({
      id: withId(e.id),
      company: str(e.company),
      position: str(e.position),
      startDate: str(e.startDate),
      endDate: str(e.endDate),
      description: str(e.description),
    })),
    education: (raw.education ?? []).map((e) => ({
      id: withId(e.id),
      school: str(e.school),
      degree: str(e.degree),
      startDate: str(e.startDate),
      endDate: str(e.endDate),
    })),
    skills: (raw.skills ?? []).map((s) => ({ id: withId(s.id), name: str(s.name), level: level(s.level) })),
    languages: (raw.languages ?? []).map((l) => ({
      id: withId(l.id),
      name: str(l.name),
      level: LANGUAGE_LEVELS.includes(l.level as LanguageLevel) ? (l.level as LanguageLevel) : "Intermédiaire",
    })),
    currentStep: raw.currentStep ?? 1,
    completed: raw.completed ?? false,
  };
}
