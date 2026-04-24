import type { UseFormSetValue } from "react-hook-form";
import type { MeResponse } from "@/src/services/auth/types";

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

export type CVTemplate =
  | "classic"
  | "modern"
  | "creative"
  | "compact"
  | "executive"
  | "sidebar"
  | "minimaliste"
  | "playfair"
  | "tech";

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

export type UpdateField = (field: keyof CVData, value: unknown) => void;

export interface Step1Props {
  cvData: CVData;
  update: UpdateField;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export interface Step2Props {
  cvData: CVData;
  addExperience: () => void;
  removeExperience: (id: string) => void;
  updateExperience: (id: string, field: string, value: string) => void;
}

export interface Step3Props {
  cvData: CVData;
  addEducation: () => void;
  removeEducation: (id: string) => void;
  updateEducation: (id: string, field: string, value: string) => void;
}

export interface Step4Props {
  cvData: CVData;
  addSkill: () => void;
  removeSkill: (id: string) => void;
  updateSkill: (id: string, field: string, value: string) => void;
}

export interface Step5Props {
  cvData: CVData;
  update: UpdateField;
}

export interface Step6Props {
  cvData: CVData;
  addLanguage: () => void;
  removeLanguage: (id: string) => void;
  updateLanguage: (id: string, field: string, value: string) => void;
}

export interface Step7Props {
  cvData: CVData;
  update: UpdateField;
  templates: { id: CVData["template"]; label: string }[];
}

export interface CVNewProps {
  initialCvData?: CVData | null;
  initialCvId?: string;
  user: MeResponse | null;
}

export interface ImportCVProps {
  isAuthenticated: boolean;
}

export interface CVPreviewProps {
  data: CVData;
  forPdf?: boolean;
}

export interface TemplateModalProps {
  showTemplateModal: boolean;
  setShowTemplateModal: (showTemplateModal: boolean) => void;
  cvData: CVData;
  setValue: UseFormSetValue<CVData>;
}

export interface Step1CoordonneesProps {
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export interface Step7FinaliserProps {
  templates: { id: CVData["template"]; label: string }[];
}

export interface ScanningAnimationProps {
  importDone: boolean;
}

export type ImportPhase = "upload" | "scanning" | "done";
