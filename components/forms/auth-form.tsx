"use client";

import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { authEmailSchema } from "@/lib/validation/schemas";
import { createClient } from "@/lib/supabase/client";
import { Badge, Button, Card, Field, Input } from "@/components/shared/ui";

type AuthInput = z.input<typeof authEmailSchema>;

export function AuthForm({
  mode,
  nextPath = "/dashboard"
}: {
  mode: "sign-in" | "sign-up";
  nextPath?: string;
}) {
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  const form = useForm<AuthInput>({
    resolver: zodResolver(authEmailSchema),
    defaultValues: { email: "" }
  });

  async function onSubmit(values: AuthInput) {
    setMessage("");
    setIsPending(true);

    try {
      const supabase = createClient();

      if (!supabase) {
        setMessage(
          "Supabase environment variables are missing. Configure them to enable magic-link authentication."
        );
        return;
      }

      const emailRedirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
          : undefined;

      const { error } = await supabase.auth.signInWithOtp({
        email: values.email,
        options: {
          emailRedirectTo,
          shouldCreateUser: mode === "sign-up"
        }
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      startTransition(() => {
        setMessage(
          "Magic link sent. Open the email on this device and CertKit will reconcile any pending purchases after sign-in."
        );
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card className="w-full">
      <Badge variant="subtle">{mode === "sign-in" ? "Sign in" : "Create account"}</Badge>
      <h1 className="mt-5 font-serif text-4xl text-zinc-950">
        {mode === "sign-in" ? "Open your study dashboard" : "Create your CertKit account"}
      </h1>
      <p className="mt-4 text-sm leading-7 text-zinc-600">
        Magic links keep the first version simple. Use the same email as checkout to automatically reconcile pending entitlements.
      </p>
      <form className="mt-8 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <Field label="Email">
          <Input placeholder="you@example.com" {...form.register("email")} />
          <p className="text-xs text-red-600">{form.formState.errors.email?.message}</p>
        </Field>
        <Button className="w-full" disabled={isPending} type="submit">
          {isPending
            ? "Sending link..."
            : mode === "sign-in"
              ? "Send magic link"
              : "Create account"}
        </Button>
        {message ? <p className="text-sm text-zinc-600">{message}</p> : null}
      </form>
    </Card>
  );
}
