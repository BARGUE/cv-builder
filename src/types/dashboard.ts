import type { MeResponse } from "@/src/services/auth/types";
import type { CVListItem } from "@/src/types/cv";

export interface DashboardClientProps {
    user: MeResponse;
    initialCvs: CVListItem[];
}
