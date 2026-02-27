import { DashboardClient } from "@/src/components/dashboard/DashboardClient";
import { requireAuth } from "@/src/lib/auth";

const DashboardPage = async () => {
  await requireAuth();
  return <DashboardClient />;
};

export default DashboardPage;
