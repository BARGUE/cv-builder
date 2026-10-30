import { DashboardClient } from "@/src/components/dashboard/DashboardClient";
import { withSession } from "@/src/lib/session";
import { getMe } from "@/src/services/auth/api";
import { listCvsApi } from "@/src/services/cv/api";

const DashboardPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const [user, initialCvs] = await withSession(locale, (token) =>
    Promise.all([getMe(token), listCvsApi(token)])
  );
  return <DashboardClient user={user} initialCvs={initialCvs} />;
};

export default DashboardPage;
