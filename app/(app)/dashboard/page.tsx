import { DashboardOverview } from "@/components/app/dashboard-components";
import { getDashboardData } from "@/lib/content/repository";

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <DashboardOverview data={data} />;
}
