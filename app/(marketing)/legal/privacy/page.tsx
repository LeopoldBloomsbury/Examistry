import { Badge, Card, Section } from "@/components/shared/ui";

export default function PrivacyPage() {
  return (
    <Section className="pt-20">
      <Badge>Legal</Badge>
      <Card className="mt-6">
        <h1 className="font-serif text-4xl text-zinc-950">Privacy Policy</h1>
        <p className="mt-6 text-sm leading-8 text-zinc-600">
          CPA StudyPilot stores lead capture data, purchase records, and study access data in Supabase. Marketing consent is stored explicitly and lead access is restricted to admin-only workflows.
        </p>
      </Card>
    </Section>
  );
}
