import { FaqGrid } from "@/components/marketing/marketing-sections";
import { getContentIndex, siteFaqs } from "@/lib/content/repository";
import { Section, SectionHeading } from "@/components/shared/ui";

export default async function FaqPage() {
  const { packs } = await getContentIndex();
  const packFaqs = packs.flatMap((pack) => pack.faqs).slice(0, 3);
  const faqs = [...siteFaqs, ...packFaqs];

  return (
    <Section className="pt-20">
      <SectionHeading
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="The same answers that build trust on marketing pages also drive admin and support workflows later."
      />
      <div className="mx-auto mt-10 max-w-3xl">
        <FaqGrid items={faqs} />
      </div>
    </Section>
  );
}
