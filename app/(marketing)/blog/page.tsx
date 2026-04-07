import { BlogGrid } from "@/components/marketing/marketing-sections";
import { blogPosts } from "@/lib/content/repository";
import { Section, SectionHeading } from "@/components/shared/ui";

export default function BlogPage() {
  return (
    <Section className="pt-20">
      <SectionHeading
        eyebrow="Blog"
        title="Resources for calm, serious prep"
        description="Blog pages stay deliberately clean and secondary to the product itself."
      />
      <div className="mt-10">
        <BlogGrid posts={blogPosts} />
      </div>
    </Section>
  );
}
