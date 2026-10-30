import type { UseFormSetValue } from "react-hook-form";
import type { MeResponse } from "@/src/services/auth/types";
import type { CVData } from "@/src/types/cv";

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

export interface ScanningAnimationProps {
  importDone: boolean;
}

export type ImportPhase = "upload" | "scanning" | "done";
