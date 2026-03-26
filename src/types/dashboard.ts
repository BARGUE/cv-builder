import type { MeResponse } from "@/src/services/auth/types";
import type { CVData, CVListItem } from "@/src/components/cv/types";

export interface DashboardClientProps {
    user: MeResponse;
    initialCvs: CVListItem[];
}

export interface DashboardDownloadPdfOptions {
    cv: CVListItem;
    apiBaseUrl: string;
    getNode?: () => HTMLElement | null;
    isDownloading: boolean;
    onStart: () => void;
    onCvLoaded: (data: CVData) => void;
    onSuccess: () => void;
    onError: (message: string) => void;
    onFinish: () => void;
    renderDelayMs?: number;
}
