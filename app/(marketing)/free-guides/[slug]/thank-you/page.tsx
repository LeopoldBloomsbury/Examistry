import Link from "next/link";
import { notFound } from "next/navigation";
import { PreviewRail } from "@/components/marketing/marketing-sections";
import { getGuideBySlug, getPackBySlug } from "@/lib/content/repository";
import { Badge, Button, Card, Section, SectionHeading } from "@/components/shared/ui";

export default async function FreeGuideThankYouPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const relatedPack = guide.relatedPackSlug
    ? await getPackBySlug(guide.relatedPackSlug)
    : null;

  return (
    <>
      <Section className="pt-20">
        <Card className="mx-auto max-w-4xl">
          <Badge variant="accent">Guide delivered</Badge>
          <h1 className="mt-6 font-serif text-5xl text-zinc-950">{guide.thankYouTitle}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600">{guide.thankYouBody}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {guide.filePath ? (
              <Button asChild>
                <a href={guide.filePath}>Open guide</a>
              </Button>
            ) : null}
            <Button asChild variant="secondary">
              <Link href="/pricing">Browse premium packs</Link>
            </Button>
          </div>
        </Card>
      </Section>

      <Section>
        <PreviewRail
          title="Delivered immediately on-page"
          subtitle="The thank-you page should feel like actual fulfillment, not a dead end with a vague promise about email."
          items={guide.previewCards}
        />
      </Section>

      {relatedPack ? (
        <Section>
          <Card className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <SectionHeading
                eyebrow="Next best offer"
                title={relatedPack.title}
                description={relatedPack.subtitle}
              />
              <p className="mt-6 text-sm leading-7 text-zinc-600">{guide.ctaAfterSubmit}</p>
            </div>
            <div className="flex flex-col justify-between rounded-[28px] border border-zinc-200 bg-zinc-50 p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  {relatedPack.badge}
                </p>
                <p className="mt-4 text-2xl font-semibold tracking-tight text-zinc-950">
                  {relatedPack.promise}
                </p>
              </div>
              <Button asChild className="mt-8">
                <Link href={`/packs/${relatedPack.slug}`}>View recommended pack</Link>
              </Button>
            </div>
          </Card>
        </Section>
      ) : null}
    </>
  );
}
