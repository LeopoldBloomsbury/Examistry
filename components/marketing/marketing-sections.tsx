import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  Download,
  GraduationCap,
  LockKeyhole,
  Sparkles
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/cn";
import { Badge, Button, Card, Section, SectionHeading } from "@/components/shared/ui";
import type { BlogPost, Exam, FaqItem, FreeGuide, StudyPack, Testimonial } from "@/types";

export function TrustStrip({ points }: { points: string[] }) {
  return (
    <Section className="py-8">
      <div className="grid gap-4 rounded-[28px] border border-zinc-200 bg-white/90 p-6 shadow-panel md:grid-cols-4">
        {points.map((point) => (
          <p key={point} className="text-sm font-medium text-zinc-700">
            {point}
          </p>
        ))}
      </div>
    </Section>
  );
}

export function PackCard({
  pack,
  ctaLabel = "View pack",
  href
}: {
  pack: StudyPack;
  ctaLabel?: string;
  href?: string;
}) {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3">
        <Badge variant={pack.packType === "bundle" ? "accent" : "subtle"}>
          {pack.badge ?? pack.packType}
        </Badge>
        <p className="text-sm font-medium text-zinc-500">
          {pack.priceCents === 0 ? "Free" : formatCurrency(pack.priceCents)}
        </p>
      </div>
      <h3 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-950">
        {pack.title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-zinc-600">{pack.subtitle}</p>
      <ul className="mt-6 space-y-3 text-sm text-zinc-700">
        {pack.includes.slice(0, 4).map((item) => (
          <li key={item} className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-4 w-4 text-zinc-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex items-center justify-between text-sm text-zinc-500">
        <span>{pack.modules.length} modules</span>
        <span>{pack.estimatedHours ?? 0} hrs</span>
      </div>
      <Button asChild className="mt-8 w-full">
        <Link href={href ?? `/packs/${pack.slug}`}>
          {ctaLabel}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </Card>
  );
}

export function GuideOfferCard({ guide }: { guide: FreeGuide }) {
  return (
    <Card className="bg-zinc-950 text-white">
      <Badge className="border-white/15 bg-white/10 text-white">Free guide</Badge>
      <h3 className="mt-6 font-serif text-3xl">{guide.title}</h3>
      <p className="mt-4 text-sm leading-7 text-zinc-300">{guide.subtitle}</p>
      <div className="mt-8 space-y-3">
        {guide.bullets.map((bullet) => (
          <div key={bullet} className="flex items-start gap-3 text-sm text-zinc-100">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-zinc-200" />
            <span>{bullet}</span>
          </div>
        ))}
      </div>
      <Button asChild className="mt-8 bg-white text-zinc-950 hover:bg-zinc-100">
        <Link href={`/free-guides/${guide.slug}`}>
          Get the guide
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </Card>
  );
}

export function MethodologyGrid({ exam }: { exam: Exam }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {exam.methodologyPoints.map((point) => (
        <Card key={point}>
          <GraduationCap className="h-5 w-5 text-zinc-500" />
          <p className="mt-6 text-lg leading-8 text-zinc-700">{point}</p>
        </Card>
      ))}
    </div>
  );
}

export function UseCaseGrid({ exam }: { exam: Exam }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {exam.useCases.map((useCase) => (
        <Card key={useCase.id}>
          <Badge variant="subtle">Use case</Badge>
          <h3 className="mt-5 text-2xl font-semibold tracking-tight text-zinc-950">
            {useCase.title}
          </h3>
          <p className="mt-4 text-sm leading-7 text-zinc-600">{useCase.body}</p>
        </Card>
      ))}
    </div>
  );
}

export function TestimonialsGrid({ items }: { items: Testimonial[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id}>
          <p className="text-lg leading-8 text-zinc-700">“{item.quote}”</p>
          <div className="mt-8 border-t border-zinc-200 pt-5">
            <p className="font-medium text-zinc-900">{item.name}</p>
            <p className="mt-1 text-sm text-zinc-500">{item.role}</p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">{item.outcome}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function FaqGrid({ items }: { items: FaqItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((faq) => (
        <Card key={faq.question}>
          <h3 className="text-lg font-semibold text-zinc-950">{faq.question}</h3>
          <p className="mt-3 text-sm leading-7 text-zinc-600">{faq.answer}</p>
        </Card>
      ))}
    </div>
  );
}

export function PreviewRail({
  title,
  subtitle,
  items
}: {
  title: string;
  subtitle?: string;
  items: string[];
}) {
  return (
    <Card>
      <h3 className="text-2xl font-semibold tracking-tight text-zinc-950">{title}</h3>
      {subtitle ? <p className="mt-3 text-sm leading-7 text-zinc-600">{subtitle}</p> : null}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-[28px] border border-zinc-200 bg-[linear-gradient(180deg,#fcfcfd,#f4f4f5)] p-5"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Preview</p>
            <p className="mt-12 text-lg font-medium leading-7 text-zinc-900">{item}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function LessonPreviewList({ pack }: { pack: StudyPack }) {
  return (
    <div className="space-y-4">
      {pack.modules.map((module) => (
        <Card key={module.id}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-zinc-950">
                {module.title}
              </h3>
              {module.description ? (
                <p className="mt-2 text-sm leading-7 text-zinc-600">{module.description}</p>
              ) : null}
            </div>
            <Badge variant="subtle">{module.lessons.length} lessons</Badge>
          </div>
          <div className="mt-5 space-y-3">
            {module.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-zinc-900">{lesson.title}</p>
                  <p className="mt-1 text-sm text-zinc-500">{lesson.lessonType}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  {lesson.isPreview ? (
                    <BookOpenText className="h-4 w-4" />
                  ) : (
                    <LockKeyhole className="h-4 w-4" />
                  )}
                  <span>{lesson.isPreview ? "Preview" : "Premium"}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

export function AssetGrid({ assets }: { assets: StudyPack["assets"] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {assets.map((asset) => (
        <Card key={asset.id}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-lg font-semibold tracking-tight text-zinc-950">{asset.title}</p>
              {asset.description ? (
                <p className="mt-2 text-sm leading-6 text-zinc-600">{asset.description}</p>
              ) : null}
            </div>
            <Download className="h-5 w-5 text-zinc-400" />
          </div>
          <div className="mt-5 flex items-center justify-between text-sm text-zinc-500">
            <span>{asset.fileType.toUpperCase()}</span>
            <span>{asset.isPreview ? "Preview" : "Premium"}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {posts.map((post) => (
        <Card key={post.slug}>
          <Badge variant="subtle">{post.category}</Badge>
          <h3 className="mt-5 text-2xl font-semibold tracking-tight text-zinc-950">
            {post.title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-zinc-600">{post.excerpt}</p>
          <div className="mt-6 flex items-center justify-between text-sm text-zinc-500">
            <span>{post.readTimeMinutes} min read</span>
            <span>{post.publishedAt}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function FeaturedPacksSection({
  packs,
  eyebrow = "Featured packs",
  title = "A cleaner way to buy only what helps",
  description = "Section starters, recovery plans, and a premium bundle instead of one bloated prep monolith."
}: {
  packs: StudyPack[];
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  return (
    <Section>
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {packs.map((pack) => (
          <PackCard key={pack.id} pack={pack} />
        ))}
      </div>
    </Section>
  );
}
