import Link from "next/link";
import { BookOpenCheck, ChevronRight } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth/session";
import { getActivePromoBanner } from "@/lib/content/repository";
import { Button } from "@/components/shared/ui";

const navItems = [
  { href: "/exam/cpa", label: "CPA" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" }
];

export async function SiteHeader() {
  const profile = await getCurrentProfile();
  const banner = await getActivePromoBanner();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-[rgba(250,248,244,0.88)] backdrop-blur">
      {banner ? (
        <div
          className={
            banner.theme === "accent"
              ? "border-b border-sky-200/70 bg-sky-50 text-sky-950"
              : "border-b border-zinc-200 bg-white text-zinc-900"
          }
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-3 text-sm lg:flex-row lg:items-center lg:justify-between lg:px-10">
            <div>
              <p className="font-medium">{banner.title}</p>
              <p className="text-xs text-current/75">{banner.body}</p>
            </div>
            {banner.ctaHref && banner.ctaLabel ? (
              <Link href={banner.ctaHref} className="text-sm font-medium underline-offset-4 hover:underline">
                {banner.ctaLabel}
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold tracking-[0.18em] text-zinc-900 uppercase">
          <BookOpenCheck className="h-4 w-4" />
          Examistry
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-zinc-700 transition hover:text-zinc-950">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href={profile ? "/dashboard" : "/sign-in"}>
              {profile ? "Dashboard" : "Sign in"}
            </Link>
          </Button>
          <Button asChild>
            <Link href="/free-guides/cpa-starter-guide">
              Get free guide
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
