import { notFound } from "next/navigation";
import Link from "next/link";
import {
  FeaturedPacksSection,
  GuideOfferCard,
  MethodologyGrid,
  TrustStrip,
  UseCaseGrid
} from "@/components/marketing/marketing-sections";
import { getExamBySlug, getGuideBySlug, getPacksForExam } from "@/lib/content/repository";
import { Badge, Button, Section, SectionHeading } from "@/components/shared/ui";

export default async function ExamLandingPage({
  params
}: {
  params: Promise<{ examSlug: string }>;
}) {
  const { examSlug } = await params;
  const exam = await getExamBySlug(examSlug);

  if (!exam) {
    notFound();
  }

  const guide = await getGuideBySlug(exam.freeGuideSlug);
  const packs = await getPacksForExam(exam.slug);
  const featured = packs.filter((pack) => exam.featuredPackSlugs.includes(pack.slug));

  return (
    <>
      <Section className="pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Badge variant="subtle">{exam.name}</Badge>
            <h1 className="mt-6 max-w-4xl font-serif text-5xl text-zinc-950 md:text-6xl">
              {exam.heroTitle}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600">{exam.heroBody}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href={`/free-guides/${guide?.slug ?? ""}`}>Get free guide</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/packs/aud-quickstart-pack">View AUD Quickstart</Link>
              </Button>
            </div>
            <div className="mt-10 space-y-3">
              {exam.heroHighlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700 shadow-panel"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          {guide ? <GuideOfferCard guide={guide} /> : null}
        </div>
      </Section>

      <TrustStrip points={exam.trustPoints} />

      <Section>
        <SectionHeading
          eyebrow="Use cases"
          title="Start with the bottleneck most CPA candidates feel first"
          description="The first paid offer is AUD Quickstart because audit flow, reports, and evidence logic are easier to fix with sequence than with more random volume."
        />
        <div className="mt-10">
          <UseCaseGrid exam={exam} />
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Sections"
          title="Start by section if you already know your bottleneck"
        />
        <div className="mt-8 flex flex-wrap gap-3">
          {exam.sections.map((section) => (
            <div
              key={section.id}
              className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700"
            >
              {section.name}
            </div>
          ))}
        </div>
      </Section>

      <FeaturedPacksSection
        packs={featured}
        eyebrow="Featured packs"
        title={`The ${exam.name} catalog`}
        description="AUD Quickstart leads the paid catalog; the other packs support formula recall, rescue planning, and bundle buyers."
      />

      <Section>
        <SectionHeading
          eyebrow="Methodology"
          title="Content ops that support future exam verticals"
          description="The current content model separates exams, sections, packs, modules, lessons, and assets so you can add NCLEX, bar prep, or teacher certification later without schema surgery."
        />
        <div className="mt-10">
          <MethodologyGrid exam={exam} />
        </div>
      </Section>
    </>
  );
}
