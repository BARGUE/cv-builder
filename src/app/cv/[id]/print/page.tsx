import { requireAuth } from "@/src/lib/auth";
import { getCvApi } from "@/src/services/cv/api";
import CVPreview from "@/src/components/cv/Preview";
import type { CVData } from "@/src/types/cv";

type Props = { params: Promise<{ id: string }> };

export default async function CvPrintPage({ params }: Props) {
    const token = await requireAuth();
    const { id } = await params;
    const cvData: CVData | null = await getCvApi(id, token);
    if (!cvData) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <p className="text-muted-foreground">CV introuvable.</p>
            </div>
        );
    }
    return (
        <div className="print-only-cv min-h-screen bg-white">
            <div style={{ width: "595px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
                <CVPreview data={cvData} forPdf />
            </div>
        </div>
    );
}
