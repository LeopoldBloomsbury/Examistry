import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { integrations } from "@/lib/env";

const adminNav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/exams", label: "Exams" },
  { href: "/admin/packs", label: "Packs" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/orders", label: "Orders" }
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();

  if (integrations.supabasePublic && (!profile || profile.role !== "admin")) {
    redirect("/sign-in?next=/admin");
  }

  return (
    <div className="min-h-screen bg-[#f4f1eb]">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold text-zinc-950">Examistry control room</h1>
          </div>
          <nav className="flex gap-4">
            {adminNav.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-zinc-600 transition hover:text-zinc-950">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        {children}
      </div>
    </div>
  );
}
