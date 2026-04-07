import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { integrations } from "@/lib/env";
import { Badge } from "@/components/shared/ui";

const appNav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/my-packs", label: "My packs" },
  { href: "/planner", label: "Planner" },
  { href: "/downloads", label: "Downloads" },
  { href: "/account", label: "Account" }
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();

  if (integrations.supabasePublic && !profile) {
    redirect("/sign-in?next=/dashboard");
  }

  return (
    <div className="min-h-screen bg-zinc-100/80">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-900">
            CertKit
          </Link>
          <nav className="flex flex-wrap items-center gap-4 rounded-full border border-zinc-200 bg-white px-4 py-2 shadow-panel">
            {appNav.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-zinc-600 transition hover:text-zinc-950">
                {item.label}
              </Link>
            ))}
            {!profile ? <Badge variant="subtle">Demo workspace</Badge> : null}
          </nav>
        </div>
        {children}
      </div>
    </div>
  );
}
