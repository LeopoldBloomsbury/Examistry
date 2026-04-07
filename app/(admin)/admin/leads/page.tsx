import Link from "next/link";
import { getAdminOverviewData } from "@/lib/content/repository";
import { formatDateTime } from "@/lib/utils/cn";
import { Badge, Button, Card, SectionHeading } from "@/components/shared/ui";

export default async function AdminLeadsPage() {
  const data = await getAdminOverviewData();

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Admin"
        title="Lead capture and order inspection"
        description="This page is intentionally read-heavy for v1: enough to inspect attribution, intent, and entitlement state before full CRUD lands."
      />
      <Button asChild variant="secondary">
        <Link href="/api/admin/leads/export">Export leads CSV</Link>
      </Button>
      {data.leads.map((lead) => (
        <Card key={`${lead.email}-${lead.capturedAt}`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold text-zinc-950">{lead.email}</h1>
              <p className="mt-1 text-sm text-zinc-600">{lead.guideTitle}</p>
            </div>
            <Badge variant={lead.marketingOptIn ? "accent" : "subtle"}>
              {lead.marketingOptIn ? "Marketing opt-in" : "No opt-in"}
            </Badge>
          </div>
          <p className="mt-3 text-sm text-zinc-600">{lead.source}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-zinc-400">
            {formatDateTime(lead.capturedAt)}
          </p>
        </Card>
      ))}
    </div>
  );
}
