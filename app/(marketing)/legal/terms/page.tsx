import { Badge, Card, Section } from "@/components/shared/ui";

export default function TermsPage() {
  return (
    <Section className="pt-20">
      <Badge>Legal</Badge>
      <Card className="mt-6">
        <h1 className="font-serif text-4xl text-zinc-950">Terms of Service</h1>
        <p className="mt-6 text-sm leading-8 text-zinc-600">
          Digital purchases unlock pack access through server-side entitlement fulfillment. Refund and access policies should be aligned with Stripe policy settings and product operations before launch.
        </p>
      </Card>
    </Section>
  );
}
