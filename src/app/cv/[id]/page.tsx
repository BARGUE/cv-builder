import CVNew from "@/src/components/cv/New";
import CVStart from "@/src/components/cv/Start";
import { requireAuth } from "@/src/lib/auth";
import { getCvApi } from "@/src/services/cv/api";
import type { CVData } from "@/src/types/cv";

type Props = {
  params: Promise<{ id: string }>;
};

const CVIdPage = async ({ params }: Props) => {
  const token = await requireAuth();
  const { id } = await params;

  if (id === "start") {
    return <CVStart />;
  }

  let initialCvData: CVData | null = null;
  if (id !== "new") {
    initialCvData = await getCvApi(id, token);
  }

  return <CVNew initialCvData={initialCvData} initialCvId={id !== "new" ? id : undefined} />;
};

export default CVIdPage;
