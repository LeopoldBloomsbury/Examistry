import Link from "next/link";
import { PackCard } from "@/components/marketing/marketing-sections";
import { getContentIndex } from "@/lib/content/repository";
import { Badge, Button, Card, Section, SectionHeading } from "@/components/shared/ui";

export default async function PricingPage() {
  const { packs } = await getContentIndex();
  const free = packs.filter((pack) => pack.packType === "free");
  const oneTime = packs.filter((pack) => pack.packType === "one_time");
  const bundles = packs.filter((pack) => pack.packType === "bundle");

  return (
    <>
      <Section className="pt-20">
        <SectionHeading
          eyebrow="Pricing"
          title="Choose the scope that matches the actual problem"
          description="A free guide for setup, focused one-time packs for real bottlenecks, and a full bundle for candidates who want one durable system."
          align="center"
        />
      </Section>

      <Section>
        <SectionHeading eyebrow="Free" title="Start without friction" />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {free.map((pack) => (
            <PackCard key={pack.id} pack={pack} />
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Focused packs" title="Buy only what sharpens the plan" />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {oneTime.map((pack) => (
            <PackCard key={pack.id} pack={pack} />
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Bundle" title="One cohesive premium library" />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {bundles.map((pack) => (
            <PackCard key={pack.id} pack={pack} />
          ))}
          <Card className="flex flex-col justify-between bg-zinc-950 text-white">
            <div>
              <Badge className="border-white/15 bg-white/10 text-white">Why bundle</Badge>
              <h2 className="mt-6 font-serif text-4xl">Keep the system consistent</h2>
              <p className="mt-4 text-sm leading-7 text-zinc-300">
                If you know you will cover multiple sections, the bundle prevents the weekly re-architecture problem and keeps assets, lessons, and planning in one dashboard.
              </p>
            </div>
            <Button asChild className="mt-8 bg-white text-zinc-950 hover:bg-zinc-100">
              <Link href="/packs/cpa-full-bundle">See bundle details</Link>
            </Button>
          </Card>
        </div>
      </Section>
    </>
  );
}
