import { AdminGrid } from "@/components/admin/admin-shell";
import { getAdminOverviewData } from "@/lib/content/repository";

export default async function AdminPage() {
  const data = await getAdminOverviewData();
  return <AdminGrid data={data} />;
}
