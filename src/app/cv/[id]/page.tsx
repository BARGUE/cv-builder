import ImportCV from "@/src/components/cv/Import";
import CVNew from "@/src/components/cv/New";
import CVStart from "@/src/components/cv/Start";
import { requireAuth } from "@/src/lib/auth";
import { getCvApi } from "@/src/services/cv/api";

type Props = {
  params: Promise<{ id: string }>;
};

const CVIdPage = async ({ params }: Props) => {
  const token = await requireAuth();
  const { id } = await params;

  switch (id) {
    case "start":
      return <CVStart />;
    case "import":
      return <ImportCV />;
    case "new":
      return <CVNew initialCvData={null} initialCvId={undefined} />;
    default: {
      const initialCvData = await getCvApi(id, token);
      return <CVNew initialCvData={initialCvData} initialCvId={id} />;
    }
  }
};

export default CVIdPage;
