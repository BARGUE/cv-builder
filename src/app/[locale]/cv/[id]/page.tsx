import ImportCV from "@/src/components/cv/import/Import";
import CVNew from "@/src/components/cv/New";
import CVStart from "@/src/components/cv/Start";
import { getToken } from "@/src/lib/auth";
import { getMe, isSessionExpiredError } from "@/src/services/auth/api";
import { getCvApi } from "@/src/services/cv/api";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

const CVIdPage = async ({ params }: Props) => {
  const { id } = await params;
  const token = await getToken();

  const fetchUserAndCv = async () => {
    switch (id) {
      case "start":
        return { type: "start" as const };
      case "import":
        return { type: "import" as const, isAuthenticated: !!token };
      case "new": {
        const user = token ? await getMe(token) : null;
        return { type: "new" as const, user };
      }
      default: {
        if (!token) redirect("/");
        const [user, initialCvData] = await Promise.all([
          getMe(token as string),
          getCvApi(id, token as string),
        ]);
        return { type: "edit" as const, user, initialCvData };
      }
    }
  };

  try {
    const result = await fetchUserAndCv();
    if (result.type === "start") return <CVStart />;
    if (result.type === "import") return <ImportCV isAuthenticated={result.isAuthenticated} />;
    if (result.type === "new") {
      return (
        <CVNew
          initialCvData={null}
          initialCvId={undefined}
          user={result.user}
        />
      );
    }
    return (
      <CVNew
        initialCvData={result.initialCvData}
        initialCvId={id}
        user={result.user}
      />
    );
  } catch (e) {
    if (isSessionExpiredError(e)) {
      redirect("/auth/logout");
    }
    throw e;
  }
};

export default CVIdPage;
