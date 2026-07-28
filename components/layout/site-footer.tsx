import Link from "next/link";

const links = [
  { href: "/pricing", label: "Pricing" },
  { href: "/resources", label: "Resources" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/terms", label: "Terms" }
];

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:flex-row lg:items-start lg:justify-between lg:px-10">
        <div>
          <p className="text-sm font-semibold text-zinc-900">CPA StudyPilot</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-zinc-600">
            Calm, premium study packs for professional exams. The initial niche is CPA, with an architecture designed to support future certification verticals without major schema changes.
          </p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-zinc-600">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-zinc-950">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
