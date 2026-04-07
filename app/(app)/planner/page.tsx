import Link from "next/link";
import { getDashboardData } from "@/lib/content/repository";
import { Badge, Button, Card, SectionHeading } from "@/components/shared/ui";

export default async function PlannerPage() {
  const data = await getDashboardData();
  const focusPack = data.continuePack ?? data.ownedPacks[0];

  if (!focusPack) {
    return (
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Planner"
          title="No study plan yet"
          description="Claim a guide or buy a pack first, then use the planner to turn content into an actual weekly sequence."
        />
        <Button asChild>
          <Link href="/pricing">Browse packs</Link>
        </Button>
      </div>
    );
  }

  const upcomingLessons = focusPack.pack.modules
    .flatMap((module) => module.lessons.map((lesson) => ({ module, lesson })))
    .slice(focusPack.completedLessons, focusPack.completedLessons + 4);

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Planner"
        title={`Weekly plan for ${focusPack.pack.title}`}
        description="A lightweight planner that turns the current pack into concrete next sessions. It is intentionally simple in v1 so the data model stays clean."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card>
          <Badge variant="subtle">Current focus</Badge>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-950">
            {focusPack.pack.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-zinc-600">{focusPack.pack.studyFit}</p>
          <div className="mt-8 space-y-4">
            {upcomingLessons.map(({ module, lesson }, index) => (
              <div key={lesson.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Session {index + 1}
                </p>
                <p className="mt-2 text-lg font-semibold text-zinc-950">{lesson.title}</p>
                <p className="mt-1 text-sm text-zinc-500">{module.title}</p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Allocate {lesson.estimatedMinutes ?? 20} minutes, then close the loop with a short recall block.
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeading
            eyebrow="Planning rules"
            title="Keep it durable"
            description="The planner favors sequences you can repeat, not schedules you can only survive once."
          />
          <div className="mt-6 space-y-4">
            {[
              "Schedule one concept block, one recall block, and one review block before adding volume.",
              "Use shorter sessions when confidence is low; consistency is more valuable than one heroic day.",
              "Move to the rescue planner only when the test date is actually tight."
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm leading-7 text-zinc-700">
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
