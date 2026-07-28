import Link from "next/link";
import { Button, Card, Section } from "@/components/shared/ui";

export default function NotFound() {
  return (
    <Section className="pt-20">
      <Card className="mx-auto max-w-2xl text-center">
        <h1 className="font-serif text-4xl text-zinc-950">Page not found</h1>
        <p className="mt-4 text-sm leading-7 text-zinc-600">
          The page you requested does not exist in this Examistry build.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Return home</Link>
        </Button>
      </Card>
    </Section>
  );
}
