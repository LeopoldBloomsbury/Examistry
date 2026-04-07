import Link from "next/link";
import ReactMarkdown from "react-markdown";
import {
  ArrowRight,
  BookMarked,
  CheckCircle2,
  Clock3,
  Download,
  LockKeyhole,
  NotebookText
} from "lucide-react";
import { LessonActions } from "@/components/app/lesson-actions";
import { formatCurrency } from "@/lib/utils/cn";
import { Badge, Button, Card, SectionHeading, StatCard } from "@/components/shared/ui";
import type { DashboardData, OwnedPack, PackLesson, StudyPack } from "@/types";

export function DashboardOverview({ data }: { data: DashboardData }) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-4">
        {data.stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            caption={stat.caption}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <Badge variant="subtle">{data.mode === "demo" ? "Demo workspace" : "Continue studying"}</Badge>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-950">
            {data.continuePack?.pack.title ?? "No owned packs yet"}
          </h2>
          <p className="mt-4 text-sm leading-7 text-zinc-600">
            {data.continuePack
              ? data.continuePack.pack.studyFit
              : "Purchase a pack or claim a guide to begin building out your library."}
          </p>
          {data.continuePack ? (
            <div className="mt-8 rounded-[28px] bg-zinc-100 p-5">
              <div className="flex items-center justify-between text-sm text-zinc-600">
                <span>Progress</span>
                <span>{data.continuePack.progressPercent}%</span>
              </div>
              <div className="mt-3 h-3 rounded-full bg-white">
                <div
                  className="h-3 rounded-full bg-zinc-950"
                  style={{ width: `${data.continuePack.progressPercent}%` }}
                />
              </div>
              <p className="mt-4 text-sm text-zinc-600">
                Last completed lesson: {data.continuePack.lastLessonTitle ?? "Start your first lesson"}
              </p>
            </div>
          ) : null}
          {data.continuePack ? (
            <Button asChild className="mt-8">
              <Link href={`/study/${data.continuePack.pack.slug}`}>
                Open pack
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button asChild className="mt-8">
              <Link href="/pricing">
                Browse packs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </Card>

        <Card className="bg-zinc-950 text-white">
          <Badge className="border-white/15 bg-white/10 text-white">Recommended next step</Badge>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight">
            {data.recommendation?.title ?? "Claim the free CPA guide"}
          </h2>
          <p className="mt-4 text-sm leading-7 text-zinc-300">
            {data.recommendation?.subtitle ??
              "Start with the free guide to capture the funnel and deliver immediate value."}
          </p>
          <p className="mt-6 text-2xl font-semibold">
            {data.recommendation ? formatCurrency(data.recommendation.priceCents) : "Free"}
          </p>
          <Button asChild className="mt-6 bg-white text-zinc-950 hover:bg-zinc-100">
            <Link href={data.recommendation ? `/packs/${data.recommendation.slug}` : "/free-guides/cpa-starter-guide"}>
              View offer
            </Link>
          </Button>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <SectionHeading
            title="Owned packs"
            description="Everything in the current library that this viewer can access."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {data.ownedPacks.map((ownedPack) => (
              <OwnedPackCard key={ownedPack.pack.id} ownedPack={ownedPack} />
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeading
            title="Study plan summary"
            description="Keep the plan simple enough that it survives a bad week."
          />
          <div className="mt-6 space-y-4">
            {data.studyPlan.map((item) => (
              <div key={item} className="flex gap-3 text-sm leading-7 text-zinc-700">
                <CheckCircle2 className="mt-1 h-4 w-4 text-zinc-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center gap-3">
            <BookMarked className="h-5 w-5 text-zinc-500" />
            <h2 className="text-xl font-semibold tracking-tight text-zinc-950">Recent lessons</h2>
          </div>
          <div className="mt-6 space-y-3">
            {data.recentLessons.length ? (
              data.recentLessons.map((lesson) => (
                <Link
                  key={`${lesson.packSlug}-${lesson.lessonSlug}`}
                  href={`/study/${lesson.packSlug}/${lesson.lessonSlug}`}
                  className="block rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 transition hover:bg-white"
                >
                  <p className="font-medium text-zinc-900">{lesson.lessonTitle}</p>
                  <p className="mt-1 text-sm text-zinc-500">{lesson.packTitle}</p>
                </Link>
              ))
            ) : (
              <p className="text-sm leading-7 text-zinc-600">
                Completed lessons will appear here once progress starts to accumulate.
              </p>
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <Download className="h-5 w-5 text-zinc-500" />
            <h2 className="text-xl font-semibold tracking-tight text-zinc-950">Recent downloads</h2>
          </div>
          <div className="mt-6 space-y-3">
            {data.downloads.length ? (
              data.downloads.slice(0, 5).map(({ asset, pack }) => (
                <a
                  key={asset.id}
                  href={asset.href}
                  className="block rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 transition hover:bg-white"
                >
                  <p className="font-medium text-zinc-900">{asset.title}</p>
                  <p className="mt-1 text-sm text-zinc-500">{pack.title}</p>
                </a>
              ))
            ) : (
              <p className="text-sm leading-7 text-zinc-600">
                Downloads from owned packs show up here once access is granted.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function OwnedPackCard({ ownedPack }: { ownedPack: OwnedPack }) {
  return (
    <div className="rounded-[28px] border border-zinc-200 bg-zinc-50 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge variant="subtle">{ownedPack.pack.badge ?? ownedPack.pack.packType}</Badge>
          <h3 className="mt-4 text-xl font-semibold tracking-tight text-zinc-950">
            {ownedPack.pack.title}
          </h3>
        </div>
        <span className="text-sm font-medium text-zinc-500">{ownedPack.progressPercent}%</span>
      </div>
      <p className="mt-3 text-sm leading-7 text-zinc-600">{ownedPack.pack.subtitle}</p>
      <div className="mt-5 h-2 rounded-full bg-white">
        <div
          className="h-2 rounded-full bg-zinc-950"
          style={{ width: `${ownedPack.progressPercent}%` }}
        />
      </div>
      <div className="mt-5 flex items-center justify-between text-sm text-zinc-500">
        <span>
          {ownedPack.completedLessons} / {ownedPack.totalLessons} lessons
        </span>
        <span>{ownedPack.pack.estimatedHours ?? 0} hrs</span>
      </div>
      <Button asChild className="mt-6 w-full" variant="secondary">
        <Link href={`/study/${ownedPack.pack.slug}`}>Open pack</Link>
      </Button>
    </div>
  );
}

export function DownloadsList({
  items
}: {
  items: DashboardData["downloads"];
}) {
  return (
    <div className="space-y-4">
      {items.map(({ asset, pack }) => (
        <Card key={asset.id} className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-950">{asset.title}</h2>
            <p className="mt-1 text-sm text-zinc-600">{pack.title}</p>
            {asset.description ? (
              <p className="mt-2 text-sm leading-6 text-zinc-500">{asset.description}</p>
            ) : null}
          </div>
          <Button asChild variant="secondary">
            <a href={asset.href}>Open</a>
          </Button>
        </Card>
      ))}
    </div>
  );
}

export function StudyReader({
  pack,
  currentLesson,
  canAccessFullPack,
  isCompleted,
  isSaved,
  allowMutations
}: {
  pack: StudyPack;
  currentLesson: PackLesson;
  canAccessFullPack: boolean;
  isCompleted: boolean;
  isSaved: boolean;
  allowMutations: boolean;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <Card className="h-fit">
        <Badge variant="subtle">{canAccessFullPack ? "Owned pack" : "Preview mode"}</Badge>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-zinc-950">
          {pack.title}
        </h1>
        <p className="mt-3 text-sm leading-7 text-zinc-600">{pack.subtitle}</p>
        <div className="mt-8 space-y-5">
          {pack.modules.map((module) => (
            <div key={module.id}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                {module.title}
              </h2>
              <div className="mt-3 space-y-2">
                {module.lessons.map((lesson) => {
                  const isLocked = !lesson.isPreview && !canAccessFullPack;
                  const isCurrent = lesson.id === currentLesson.id;

                  return (
                    <Link
                      key={lesson.id}
                      href={`/study/${pack.slug}/${lesson.slug}`}
                      className={`block rounded-2xl px-3 py-3 text-sm transition ${
                        isCurrent
                          ? "bg-zinc-950 text-white"
                          : isLocked
                            ? "bg-zinc-100 text-zinc-400"
                            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span>{lesson.title}</span>
                        {isLocked ? (
                          <LockKeyhole className="h-4 w-4 shrink-0" />
                        ) : (
                          <NotebookText className="h-4 w-4 shrink-0" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="rounded-[36px] p-8 lg:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="subtle">{currentLesson.lessonType}</Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl">
              {currentLesson.title}
            </h1>
            {currentLesson.summary ? (
              <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-600">
                {currentLesson.summary}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-3 text-sm text-zinc-500">
            <Clock3 className="h-4 w-4" />
            <span>{currentLesson.estimatedMinutes ?? 10} min</span>
          </div>
        </div>

        <div className="mt-6">
          <LessonActions
            lessonId={currentLesson.id}
            isCompleted={isCompleted}
            isSaved={isSaved}
            allowMutations={allowMutations && canAccessFullPack}
          />
        </div>

        {!canAccessFullPack && !currentLesson.isPreview ? (
          <div className="mt-8 rounded-[28px] border border-zinc-200 bg-zinc-50 p-6">
            <p className="text-sm leading-7 text-zinc-700">
              This lesson is part of the premium pack. The reader is showing preview mode because the current viewer does not have an active entitlement for this pack.
            </p>
            <Button asChild className="mt-5">
              <Link href={`/packs/${pack.slug}`}>
                Unlock the full pack
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="prose prose-zinc mt-8 max-w-none text-zinc-700 prose-headings:font-serif prose-headings:text-zinc-950 prose-p:leading-8 prose-li:leading-8">
            <ReactMarkdown>{currentLesson.contentMarkdown}</ReactMarkdown>
          </div>
        )}

        <div className="mt-10 border-t border-zinc-200 pt-6">
          <div className="flex flex-wrap gap-3">
            {pack.assets.map((asset) => (
              <Button key={asset.id} asChild variant="secondary">
                <a href={asset.href}>{asset.title}</a>
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
