import Link from "next/link";
import { Button, Card, Section } from "@/components/shared/ui";

export default function CheckoutCanceledPage() {
  return (
    <Section className="pt-20">
      <Card className="mx-auto max-w-2xl text-center">
        <h1 className="font-serif text-4xl text-zinc-950">Checkout canceled</h1>
        <p className="mt-4 text-sm leading-7 text-zinc-600">
          No purchase was created. You can return to the pack page whenever you are ready.
        </p>
        <Button asChild className="mt-8">
          <Link href="/pricing">Back to pricing</Link>
        </Button>
      </Card>
    </Section>
  );
}
