import { AdminExamCrud } from "@/components/admin/catalog-crud";
import { getAdminOverviewData } from "@/lib/content/repository";
import { integrations } from "@/lib/env";

export default async function AdminExamsPage() {
  const data = await getAdminOverviewData();

  return <AdminExamCrud exams={data.exams} writable={data.mode === "authenticated" && integrations.supabaseAdmin} />;
}
