import Link from "next/link";
import { Badge, Button, Card, Section } from "@/components/shared/ui";

export default function CheckoutSuccessPage() {
  return (
    <Section className="pt-20">
      <Card className="mx-auto max-w-2xl text-center">
        <Badge variant="accent">Success</Badge>
        <h1 className="mt-6 font-serif text-4xl text-zinc-950">Payment received</h1>
        <p className="mt-4 text-sm leading-7 text-zinc-600">
          Access is granted by Stripe webhook fulfillment, not only by this redirect. If the webhook has already landed, your pack will appear in the dashboard.
        </p>
        <Button asChild className="mt-8">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </Card>
    </Section>
  );
}
