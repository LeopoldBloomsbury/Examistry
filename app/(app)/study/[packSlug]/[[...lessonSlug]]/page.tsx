import { notFound } from "next/navigation";
import { StudyReader } from "@/components/app/dashboard-components";
import { getPackBySlug, getViewerAccessState } from "@/lib/content/repository";

export default async function StudyPackPage({
  params
}: {
  params: Promise<{ packSlug: string; lessonSlug?: string[] }>;
}) {
  const { packSlug, lessonSlug } = await params;
  const pack = await getPackBySlug(packSlug);

  if (!pack) {
    notFound();
  }

  const accessState = await getViewerAccessState();
  const canAccessFullPack = accessState.ownedPackIds.includes(pack.id);
  const lessons = pack.modules.flatMap((module) => module.lessons);
  let currentLesson = lessonSlug?.[0]
    ? lessons.find((lesson) => lesson.slug === lessonSlug[0])
    : lessons[0];

  if (!currentLesson) {
    notFound();
  }

  if (!canAccessFullPack && !currentLesson.isPreview) {
    currentLesson = lessons.find((lesson) => lesson.isPreview) ?? currentLesson;
  }

  return (
    <StudyReader
      pack={pack}
      currentLesson={currentLesson}
      canAccessFullPack={canAccessFullPack}
      isCompleted={accessState.completedLessonIds.includes(currentLesson.id)}
      isSaved={accessState.savedLessonIds.includes(currentLesson.id)}
      allowMutations={Boolean(accessState.profile)}
    />
  );
}
