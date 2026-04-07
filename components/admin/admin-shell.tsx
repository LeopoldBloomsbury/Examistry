import { formatCurrency, formatDateTime } from "@/lib/utils/cn";
import { Badge, Card, SectionHeading, StatCard } from "@/components/shared/ui";
import type { AdminOverviewData } from "@/types";

export function AdminGrid({ data }: { data: AdminOverviewData }) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-4">
        {data.metrics.map((metric) => (
          <StatCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            caption={metric.caption}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <SectionHeading
            eyebrow="Catalog"
            title="Exam verticals"
            description="Structured, database-friendly content entities with room for future sections and tracks."
          />
          <div className="mt-6 space-y-4">
            {data.exams.map((exam) => (
              <div key={exam.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold tracking-tight text-zinc-950">{exam.name}</p>
                    <p className="mt-1 text-sm text-zinc-600">{exam.description}</p>
                  </div>
                  <Badge variant="subtle">{exam.sections.length} sections</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeading
            eyebrow="Catalog"
            title="Pack merchandising"
            description="Use badges, structured bullets, and related-pack cross-sells rather than a complex CMS."
          />
          <div className="mt-6 space-y-4">
            {data.packs.slice(0, 5).map((pack) => (
              <div key={pack.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold tracking-tight text-zinc-950">{pack.title}</p>
                    <p className="mt-1 text-sm text-zinc-600">{pack.subtitle}</p>
                  </div>
                  <p className="text-sm font-medium text-zinc-500">
                    {formatCurrency(pack.priceCents)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <SectionHeading
            eyebrow="Leads"
            title="Recent lead captures"
            description="Lead writes stay server-only. Export and inspection live here while catalog operations happen in the exam and pack editors."
          />
          <div className="mt-6 space-y-4">
            {data.leads.map((lead) => (
              <div key={`${lead.email}-${lead.capturedAt}`} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-zinc-950">{lead.email}</p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {lead.examName}
                      {lead.sectionName ? ` / ${lead.sectionName}` : ""}
                    </p>
                  </div>
                  <Badge variant={lead.marketingOptIn ? "accent" : "subtle"}>
                    {lead.marketingOptIn ? "Opted in" : "No opt-in"}
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{lead.source}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-zinc-400">
                  {formatDateTime(lead.capturedAt)}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeading
            eyebrow="Orders"
            title="Recent purchases"
            description="Purchases and entitlements should always be reconciled from webhook events, not browser redirects."
          />
          <div className="mt-6 space-y-4">
            {data.purchases.map((purchase) => (
              <div key={`${purchase.email}-${purchase.purchasedAt}`} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-zinc-950">{purchase.packTitle}</p>
                    <p className="mt-1 text-sm text-zinc-500">{purchase.email}</p>
                  </div>
                  <Badge variant={purchase.status === "paid" ? "accent" : "subtle"}>
                    {purchase.status}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-zinc-600">
                  <span>{formatCurrency(purchase.amountCents)}</span>
                  <span>{purchase.entitlementStatus}</span>
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-zinc-400">
                  {formatDateTime(purchase.purchasedAt)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
