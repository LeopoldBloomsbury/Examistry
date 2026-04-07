import { notFound } from "next/navigation";
import Link from "next/link";
import {
  AssetGrid,
  FaqGrid,
  LessonPreviewList,
  PackCard,
  PreviewRail
} from "@/components/marketing/marketing-sections";
import { getPackBySlug, getPacksForExam } from "@/lib/content/repository";
import { formatCurrency } from "@/lib/utils/cn";
import { Badge, Button, Card, Section, SectionHeading } from "@/components/shared/ui";

export default async function PackDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pack = await getPackBySlug(slug);

  if (!pack) {
    notFound();
  }

  const related = (await getPacksForExam(pack.examSlug))
    .filter((item) => pack.relatedPackSlugs.includes(item.slug) && item.slug !== pack.slug)
    .slice(0, 3);

  return (
    <>
      <Section className="pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Badge variant="subtle">{pack.badge ?? pack.packType}</Badge>
            <h1 className="mt-6 font-serif text-5xl text-zinc-950 md:text-6xl">{pack.title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">{pack.promise}</p>
            <p className="mt-8 max-w-3xl text-sm leading-8 text-zinc-700">{pack.description}</p>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <Card>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  Who it is for
                </h2>
                <ul className="mt-4 space-y-3 text-sm text-zinc-700">
                  {pack.whoItsFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
              <Card>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  Who it is not for
                </h2>
                <ul className="mt-4 space-y-3 text-sm text-zinc-700">
                  {pack.whoItsNotFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>

          <Card className="h-fit">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
              {pack.packType === "bundle" ? "Bundle purchase" : "One-time purchase"}
            </p>
            <p className="mt-4 text-4xl font-semibold text-zinc-950">
              {formatCurrency(pack.priceCents)}
            </p>
            <p className="mt-4 text-sm leading-7 text-zinc-600">{pack.subtitle}</p>
            <div className="mt-8 space-y-3">
              {pack.formatBreakdown.map((item) => (
                <div key={item.label} className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-700">{item.value}</p>
                </div>
              ))}
            </div>
            {pack.packType !== "free" ? (
              <form action="/api/checkout" method="post" className="mt-8">
                <input type="hidden" name="packSlug" value={pack.slug} />
                <Button className="w-full" type="submit">
                  Buy with Stripe Checkout
                </Button>
              </form>
            ) : (
              <Button asChild className="mt-8 w-full">
                <Link href="/free-guides/cpa-starter-guide">Claim free guide</Link>
              </Button>
            )}
            <Button asChild variant="secondary" className="mt-3 w-full">
              <Link href={`/study/${pack.slug}`}>Preview reader</Link>
            </Button>
          </Card>
        </div>
      </Section>

      <Section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-zinc-950">What’s included</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {pack.includes.map((item) => (
              <div key={item} className="rounded-3xl border border-zinc-200 p-4 text-sm text-zinc-700">
                {item}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-2xl font-semibold text-zinc-950">Outcomes</h2>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-zinc-700">
            {pack.outcomes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Preview"
          title="See the format before you buy"
          description="Preview lessons remain public. Full lessons and premium downloads unlock only after webhook-verified fulfillment."
        />
        <div className="mt-8">
          <PreviewRail
            title="Preview notes"
            subtitle={pack.studyFit}
            items={
              pack.previewNotes.length
                ? pack.previewNotes
                : ["Structured lesson previews", "Preview downloads", "Clear format breakdown"]
            }
          />
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Curriculum"
          title="Modules and lesson navigation"
          description="Every pack is broken into modules and lessons so the same schema works for bundles, section packs, and future verticals."
        />
        <div className="mt-8">
          <LessonPreviewList pack={pack} />
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Downloads"
          title="Associated assets"
          description="Assets can be attached at the pack or lesson level and served from Supabase Storage in production."
        />
        <div className="mt-8">
          <AssetGrid assets={pack.assets} />
        </div>
      </Section>

      <Section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <SectionHeading
            eyebrow="FAQ"
            title="Questions before checkout"
            description="Pack-specific answers stay structured so the content can eventually move into admin forms without a WYSIWYG."
          />
          <div className="mt-6">
            <FaqGrid items={pack.faqs} />
          </div>
        </Card>
        <Card>
          <SectionHeading
            eyebrow="Related"
            title="Keep the next move obvious"
            description="Cross-sell bundles, rescue plans, or section-specific packs without burying the user in options."
          />
          <div className="mt-6 grid gap-4">
            {related.map((item) => (
              <PackCard key={item.id} pack={item} ctaLabel="Open related pack" />
            ))}
          </div>
        </Card>
      </Section>
    </>
  );
}
