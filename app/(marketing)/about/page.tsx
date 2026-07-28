import { MethodologyGrid, TestimonialsGrid } from "@/components/marketing/marketing-sections";
import { getContentIndex, testimonials } from "@/lib/content/repository";
import { Badge, Card, Section, SectionHeading } from "@/components/shared/ui";

export default async function AboutPage() {
  const { exams } = await getContentIndex();
  const exam = exams[0];

  return (
    <>
      <Section className="pt-20">
        <Badge variant="subtle">Methodology</Badge>
        <h1 className="mt-6 max-w-4xl font-serif text-5xl text-zinc-950 md:text-6xl">
          Study content built like product, not like clutter
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">
          Examistry is meant to feel closer to Stripe, Linear, and premium DTC education than to marketplace junk. Every content object exists because it makes the user’s next decision clearer.
        </p>
      </Section>

      <Section>
        <MethodologyGrid exam={exam} />
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Why this architecture"
          title="The schema is meant to survive more than one exam"
          description="Exams, sections, study packs, modules, lessons, assets, leads, purchases, entitlements, and progress are independent primitives. That keeps CPA specific enough for launch and future verticals cheap to add."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {[
            "DB-backed pack and lesson content with structured JSON for merchandising fields.",
            "Webhook-first Stripe fulfillment with pending-claim support for email-only purchases.",
            "Supabase Auth magic links with entitlement reconciliation after sign-in."
          ].map((item) => (
            <Card key={item}>
              <p className="text-lg leading-8 text-zinc-700">{item}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Proof of taste"
          title="Design language stays restrained"
          description="Minimal surfaces, strong typography, neutral backgrounds, and small doses of color only where actions or status need emphasis."
        />
        <div className="mt-10">
          <TestimonialsGrid items={testimonials} />
        </div>
      </Section>
    </>
  );
}
