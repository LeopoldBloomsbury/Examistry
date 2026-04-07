import Link from "next/link";
import {
  BlogGrid,
  FaqGrid,
  FeaturedPacksSection,
  GuideOfferCard,
  MethodologyGrid,
  TestimonialsGrid,
  TrustStrip
} from "@/components/marketing/marketing-sections";
import { getContentIndex, blogPosts, siteFaqs, testimonials } from "@/lib/content/repository";
import { formatCurrency } from "@/lib/utils/cn";
import { Badge, Button, Card, Section, SectionHeading } from "@/components/shared/ui";

export default async function HomePage() {
  const { exams, guides, packs } = await getContentIndex();
  const exam = exams[0];
  const guide = guides.find((item) => item.slug === exam.freeGuideSlug) ?? guides[0];
  const featured = packs.filter((pack) => exam.featuredPackSlugs.includes(pack.slug));
  const bundle = packs.find((pack) => pack.slug === "cpa-full-bundle") ?? featured[0];

  return (
    <>
      <Section className="pt-20 lg:pt-28">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <Badge variant="subtle">Professional exam study packs</Badge>
            <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-tight text-zinc-950 md:text-6xl">
              Pass smarter, not slower.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
              Modern study packs for high-stakes professional exams. Start with a free guide, upgrade into focused packs, and study inside a dashboard built for calm recall instead of content sprawl.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href={`/free-guides/${guide.slug}`}>Get free study guide</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/exam/cpa">Browse study packs</Link>
              </Button>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["Exam vertical", exam.name],
                ["Current featured packs", String(featured.length)],
                ["Bundle price", formatCurrency(bundle.priceCents)]
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-zinc-200 bg-white/90 px-4 py-4 shadow-panel"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{label}</p>
                  <p className="mt-2 text-lg font-semibold text-zinc-950">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="bg-zinc-950 text-white">
            <Badge className="border-white/15 bg-white/10 text-white">Featured bundle</Badge>
            <h2 className="mt-6 font-serif text-3xl">{bundle.title}</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-300">{bundle.promise}</p>
            <div className="mt-8 space-y-4">
              {bundle.includes.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100"
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-between">
              <p className="text-2xl font-semibold">{formatCurrency(bundle.priceCents)}</p>
              <Button asChild className="bg-white text-zinc-950 hover:bg-zinc-100">
                <Link href={`/packs/${bundle.slug}`}>See bundle</Link>
              </Button>
            </div>
          </Card>
        </div>
      </Section>

      <TrustStrip points={exam.trustPoints} />

      <FeaturedPacksSection packs={featured} />

      <Section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <GuideOfferCard guide={guide} />
        <Card>
          <SectionHeading
            eyebrow="How it works"
            title="A premium study funnel without the low-trust funnel energy"
            description="Every page is designed to make the next decision clearer: claim the guide, preview the value, buy with Stripe, then access the pack inside a calm dashboard."
          />
          <div className="mt-8 space-y-4">
            {[
              "Claim the free guide and capture interest without requiring an account.",
              "Preview section-specific packs, downloads, outcomes, and fit before buying.",
              "Complete purchase through Stripe Checkout and unlock content through webhook-driven entitlements."
            ].map((item, index) => (
              <div key={item} className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Step {index + 1}</p>
                <p className="mt-2 text-sm leading-7 text-zinc-700">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Methodology"
          title="Built like product, not like clutter"
          description="The content model, commerce flow, and dashboard shell are designed to be durable enough for more exams without rebuilding the entire app."
        />
        <div className="mt-10">
          <MethodologyGrid exam={exam} />
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Testimonials"
          title="Trust comes from clarity"
          description="The design language stays restrained on purpose: strong hierarchy, neutral surfaces, and just enough color for the actions that matter."
        />
        <div className="mt-10">
          <TestimonialsGrid items={testimonials} />
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Resources"
          title="Free resources that feed the funnel cleanly"
          description="Blog and resource pages stay lightweight in v1. Content belongs in the product database; SEO content can stay local until it earns complexity."
        />
        <div className="mt-10">
          <BlogGrid posts={blogPosts} />
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="FAQ"
          title="Designed around trust and fulfillment"
          align="center"
        />
        <div className="mx-auto mt-10 max-w-3xl">
          <FaqGrid items={siteFaqs} />
        </div>
      </Section>
    </>
  );
}
