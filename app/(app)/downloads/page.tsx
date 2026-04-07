import { DownloadsList } from "@/components/app/dashboard-components";
import { getDashboardData } from "@/lib/content/repository";
import { SectionHeading } from "@/components/shared/ui";

export default async function DownloadsPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Downloads"
        title="Pack assets and cheat sheets"
        description="In production these files should come from Supabase Storage. The scaffold links to static preview documents so the flow is usable immediately."
      />
      <DownloadsList items={data.downloads} />
    </div>
  );
}
