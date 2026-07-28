"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { leadCaptureSchema } from "@/lib/validation/schemas";
import {
  Badge,
  Button,
  Card,
  CheckboxField,
  Field,
  Input,
  Select
} from "@/components/shared/ui";

type LeadCaptureInput = z.input<typeof leadCaptureSchema>;

export function LeadCaptureForm({
  freeGuideSlug,
  sectionOptions
}: {
  freeGuideSlug: string;
  sectionOptions: Array<{ label: string; value: string }>;
}) {
  const router = useRouter();
  const [serverMessage, setServerMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  const form = useForm<LeadCaptureInput>({
    resolver: zodResolver(leadCaptureSchema),
    defaultValues: {
      email: "",
      fullName: "",
      examDate: "",
      targetSection: "",
      marketingOptIn: false,
      freeGuideSlug
    }
  });

  async function onSubmit(values: LeadCaptureInput) {
    setIsPending(true);
    setServerMessage("");

    const searchParams =
      typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;

    const payload = {
      ...values,
      source: "free-guide-page",
      utmSource: searchParams?.get("utm_source") ?? "",
      utmMedium: searchParams?.get("utm_medium") ?? "",
      utmCampaign: searchParams?.get("utm_campaign") ?? "",
      referrer: typeof document !== "undefined" ? document.referrer : ""
    };

    try {
      const response = await fetch("/api/lead-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        setServerMessage(result.message ?? "Something went wrong.");
        return;
      }

      startTransition(() => {
        router.push(`/free-guides/${freeGuideSlug}/thank-you`);
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card className="h-fit">
      <Badge variant="subtle">Get instant access</Badge>
      <h2 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-950">
        Claim the free guide
      </h2>
      <p className="mt-4 text-sm leading-7 text-zinc-600">
        We will deliver the guide immediately on the next page and send it to your inbox for later.
      </p>
      <form className="mt-8 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <Field label="Email">
          <Input placeholder="you@example.com" {...form.register("email")} />
          <p className="text-xs text-red-600">{form.formState.errors.email?.message}</p>
        </Field>
        <Field label="First name">
          <Input placeholder="Optional" {...form.register("fullName")} />
        </Field>
        <Field label="Target exam date" hint="Optional. Used only for better recommendations.">
          <Input type="date" {...form.register("examDate")} />
        </Field>
        <Field label="Target section">
          <Select {...form.register("targetSection")}>
            <option value="">Select one</option>
            {sectionOptions.map((section) => (
              <option key={section.value} value={section.value}>
                {section.label}
              </option>
            ))}
          </Select>
        </Field>
        <CheckboxField {...form.register("marketingOptIn")}>
          Send me occasional CPA StudyPilot study updates and future offer announcements.
        </CheckboxField>
        <Button className="w-full" disabled={isPending} type="submit">
          {isPending ? "Delivering guide..." : "Get the free guide"}
        </Button>
        <p className="text-xs leading-6 text-zinc-500">
          We store only what we need to deliver the guide, dedupe leads, and improve relevance.
        </p>
        {serverMessage ? <p className="text-sm text-red-700">{serverMessage}</p> : null}
      </form>
    </Card>
  );
}
