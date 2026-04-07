import { BlogGrid, GuideOfferCard } from "@/components/marketing/marketing-sections";
import { getContentIndex, blogPosts } from "@/lib/content/repository";
import { Card, Section, SectionHeading } from "@/components/shared/ui";

export default async function ResourcesPage() {
  const { guides, packs } = await getContentIndex();
  const guide = guides[0];
  const previews = packs.filter((pack) => pack.packType !== "free").slice(0, 2);

  return (
    <>
      <Section className="pt-20">
        <SectionHeading
          eyebrow="Resources"
          title="Free study resources and lead magnets"
          description="v1 keeps resources lean: a flagship guide, a few blog entries, and structured product previews that feed cleanly into the paid catalog."
        />
      </Section>

      <Section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <GuideOfferCard guide={guide} />
        <Card>
          <SectionHeading
            eyebrow="Preview content"
            title="Use resources to qualify interest"
            description="The goal is to give users something useful enough to earn trust, then point them toward the pack that solves the next bottleneck."
          />
          <div className="mt-6 space-y-4">
            {previews.map((pack) => (
              <div key={pack.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="font-medium text-zinc-950">{pack.title}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {pack.previewNotes[0] ?? pack.subtitle}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Blog"
          title="Calm prep resources"
          description="Local content is enough for v1. Move to MDX later if the resource library earns the complexity."
        />
        <div className="mt-10">
          <BlogGrid posts={blogPosts} />
        </div>
      </Section>
    </>
  );
}
