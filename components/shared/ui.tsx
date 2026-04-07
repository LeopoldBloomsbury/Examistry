"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type {
  ButtonHTMLAttributes,
  ForwardedRef,
  HTMLAttributes,
  InputHTMLAttributes,
  PropsWithChildren,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-950 px-5 py-3 text-white shadow-[0_12px_30px_rgba(24,24,27,0.14)] hover:bg-zinc-800",
        secondary:
          "bg-white px-5 py-3 text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-50",
        ghost: "px-4 py-2 text-zinc-700 hover:bg-zinc-100",
        outline:
          "bg-transparent px-5 py-3 text-zinc-900 ring-1 ring-zinc-300 hover:bg-white"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const badgeVariants = cva(
  "inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
  {
    variants: {
      variant: {
        default: "border-zinc-200 bg-white text-zinc-700",
        accent: "border-sky-200 bg-sky-50 text-sky-700",
        subtle: "border-zinc-200 bg-zinc-50 text-zinc-500"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant }), className)} {...props} />;
}

export function Badge({
  className,
  variant,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[32px] border border-zinc-200 bg-white p-6 shadow-panel md:p-8",
        className
      )}
      {...props}
    />
  );
}

export function Section({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn("mx-auto w-full max-w-7xl px-6 py-16 lg:px-10 lg:py-20", className)}
      {...props}
    />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" ? "mx-auto max-w-3xl text-center" : "", className)}>
      {eyebrow ? <Badge variant="subtle">{eyebrow}</Badge> : null}
      <h2 className="mt-4 font-serif text-3xl leading-tight text-zinc-950 md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-600 md:text-base md:leading-8">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  caption
}: {
  label: string;
  value: string;
  caption?: string;
}) {
  return (
    <Card className="bg-white/90">
      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">{value}</p>
      {caption ? <p className="mt-3 text-sm leading-6 text-zinc-600">{caption}</p> : null}
    </Card>
  );
}

export function Field({ label, children, hint }: PropsWithChildren<{ label: string; hint?: string }>) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-800">{label}</label>
      {children}
      {hint ? <p className="text-xs text-zinc-500">{hint}</p> : null}
    </div>
  );
}

export const Input = forwardRef(function Input(
  { className, ...props }: InputHTMLAttributes<HTMLInputElement>,
  ref: ForwardedRef<HTMLInputElement>
) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white",
        className
      )}
      {...props}
    />
  );
});

export const Select = forwardRef(function Select(
  { className, ...props }: SelectHTMLAttributes<HTMLSelectElement>,
  ref: ForwardedRef<HTMLSelectElement>
) {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white",
        className
      )}
      {...props}
    />
  );
});

export const Textarea = forwardRef(function Textarea(
  { className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>,
  ref: ForwardedRef<HTMLTextAreaElement>
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[120px] w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white",
        className
      )}
      {...props}
    />
  );
});

export function CheckboxField({
  checked,
  onChange,
  children,
  className,
  ...props
}: PropsWithChildren<
  Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "checked" | "onChange"> & {
    checked?: boolean;
    onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
    className?: string;
  }
>) {
  return (
    <label
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-6 text-zinc-700",
        className
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 rounded border-zinc-300 text-zinc-950"
        {...props}
      />
      <span>{children}</span>
    </label>
  );
}
