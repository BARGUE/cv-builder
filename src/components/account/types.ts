import type { MeResponse } from "@/src/services/auth/types";
import type { CVListItem } from "@/src/types/cv";

export interface ProfileFormValues {
  firstName: string;
  lastName: string;
  avatarUrl: string;
}

export interface AccountClientProps {
  user: MeResponse;
  initialCvs: CVListItem[];
}

export interface AccountStatsProps {
  cvs: CVListItem[];
}

export interface PasswordChangeModalProps {
  onUnauthorized?: () => void;
}
