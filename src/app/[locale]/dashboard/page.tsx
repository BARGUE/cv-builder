import { DashboardClient } from "@/src/components/dashboard/DashboardClient";
import { getToken } from "@/src/lib/auth";
import { getMe, isSessionExpiredError } from "@/src/services/auth/api";
import { listCvsApi } from "@/src/services/cv/api";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const token = await getToken();
  if (!token) {
    redirect("/");
  }
  try {
    const [user, initialCvs] = await Promise.all([
      getMe(token),
      listCvsApi(token),
    ]);
    return <DashboardClient user={user} initialCvs={initialCvs} />;
  } catch (e) {
    if (isSessionExpiredError(e)) {
      redirect("/auth/logout");
    }
    throw e;
  }
};

export default DashboardPage;
