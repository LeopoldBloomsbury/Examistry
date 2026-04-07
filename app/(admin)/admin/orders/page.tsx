import { getAdminOverviewData } from "@/lib/content/repository";
import { formatCurrency, formatDateTime } from "@/lib/utils/cn";
import { Badge, Card, SectionHeading } from "@/components/shared/ui";

export default async function AdminOrdersPage() {
  const data = await getAdminOverviewData();

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Admin"
        title="Order and entitlement inspection"
        description="Use this view to confirm payment state, entitlement state, and whether a purchase still needs to be claimed against a user account."
      />
      {data.purchases.map((purchase) => (
        <Card key={`${purchase.email}-${purchase.purchasedAt}`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold text-zinc-950">{purchase.packTitle}</h1>
              <p className="mt-1 text-sm text-zinc-600">{purchase.email}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant={purchase.status === "paid" ? "accent" : "subtle"}>
                {purchase.status}
              </Badge>
              <Badge variant="subtle">{purchase.entitlementStatus}</Badge>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-zinc-600">
            <span>{formatCurrency(purchase.amountCents)}</span>
            <span>{formatDateTime(purchase.purchasedAt)}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
