"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/shared/ui";

export function AdminSubmitButton({
  label,
  pendingLabel,
  variant = "default"
}: {
  label: string;
  pendingLabel?: string;
  variant?: "default" | "secondary" | "ghost" | "outline";
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant={variant} disabled={pending}>
      {pending ? pendingLabel ?? "Saving..." : label}
    </Button>
  );
}
