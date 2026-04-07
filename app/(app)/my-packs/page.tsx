import { OwnedPackCard } from "@/components/app/dashboard-components";
import { getDashboardData } from "@/lib/content/repository";
import { SectionHeading } from "@/components/shared/ui";

export default async function MyPacksPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="My packs"
        title="Everything this viewer currently owns"
        description="Entitlements come from Stripe webhook fulfillment and are reconciled to the signed-in email."
      />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {data.ownedPacks.map((ownedPack) => (
          <OwnedPackCard key={ownedPack.pack.id} ownedPack={ownedPack} />
        ))}
      </div>
    </div>
  );
}
