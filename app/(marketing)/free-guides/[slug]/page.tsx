import Link from "next/link";
import { notFound } from "next/navigation";
import { PreviewRail } from "@/components/marketing/marketing-sections";
import { LeadCaptureForm } from "@/components/forms/lead-capture-form";
import { getExamBySlug, getGuideBySlug, getPackBySlug } from "@/lib/content/repository";
import { Badge, Button, Card, Section, SectionHeading } from "@/components/shared/ui";

export default async function FreeGuidePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const exam = await getExamBySlug(guide.examSlug);
  const relatedPack = guide.relatedPackSlug
    ? await getPackBySlug(guide.relatedPackSlug)
    : null;

  return (
    <>
      <Section className="pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Badge variant="subtle">Free guide</Badge>
            <h1 className="mt-6 font-serif text-5xl text-zinc-950">{guide.title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">{guide.promise}</p>
            <p className="mt-8 max-w-3xl text-sm leading-8 text-zinc-700">{guide.description}</p>
            <div className="mt-8 space-y-3">
              {guide.bullets.map((bullet) => (
                <div
                  key={bullet}
                  className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700 shadow-panel"
                >
                  {bullet}
                </div>
              ))}
            </div>
          </div>
          <LeadCaptureForm
            freeGuideSlug={guide.slug}
            sectionOptions={exam?.sections.map((section) => ({ label: section.name, value: section.slug })) ?? []}
          />
        </div>
      </Section>

      <Section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <PreviewRail
            title="What’s inside"
            subtitle="A meaningful free guide should show enough value to justify trust before any paid CTA appears."
            items={guide.previewCards}
          />
        </Card>
        <Card>
          <SectionHeading
            eyebrow="What happens next"
            title="After submission"
            description={guide.privacyReassurance}
          />
          <div className="mt-6 space-y-4">
            {guide.whatHappensNext.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm leading-7 text-zinc-700"
              >
                {item}
              </div>
            ))}
          </div>
          {relatedPack ? (
            <div className="mt-8 rounded-[28px] border border-zinc-200 bg-zinc-50 p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Next best offer</p>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-950">
                {relatedPack.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-zinc-600">{relatedPack.subtitle}</p>
              <Button asChild className="mt-6">
                <Link href={`/packs/${relatedPack.slug}`}>View recommended pack</Link>
              </Button>
            </div>
          ) : null}
        </Card>
      </Section>
    </>
  );
}
