import { notFound } from "next/navigation";
import ImportCV from "@/src/components/cv/import/Import";
import CVNew from "@/src/components/cv/New";
import CVStart from "@/src/components/cv/Start";
import { getToken } from "@/src/lib/auth";
import { withOptionalSession, withSession } from "@/src/lib/session";
import { getMe } from "@/src/services/auth/api";
import { getCvApi } from "@/src/services/cv/api";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

const CVIdPage = async ({ params }: Props) => {
  const { locale, id } = await params;

  if (id === "start") return <CVStart />;
  if (id === "import") return <ImportCV isAuthenticated={Boolean(await getToken())} />;

  if (id === "new") {
    const user = await withOptionalSession(locale, getMe);
    return <CVNew initialCvData={null} user={user} />;
  }

  const [user, cv] = await withSession(locale, (token) => Promise.all([getMe(token), getCvApi(id, token)]));
  if (!cv) notFound();
  return <CVNew key={id} initialCvData={cv} initialCvId={id} user={user} />;
};

export default CVIdPage;
