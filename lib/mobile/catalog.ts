import { getContentIndex } from "@/lib/content/repository";
import { integrations } from "@/lib/env";
import type { StudyPack } from "@/types";

export const mobileCatalogVersion = "2026.07.20-1";

export type MobileCatalogPack = ReturnType<typeof serializeMobilePack>;

function canUseDemoAccess() {
  return !integrations.supabasePublic;
}

export function serializeMobilePack(pack: StudyPack, ownedPackIds: Set<string>) {
  const hasFullAccess = pack.packType === "free" || ownedPackIds.has(pack.id) || canUseDemoAccess();

  return {
    id: pack.id,
    slug: pack.slug,
    title: pack.title,
    subtitle: pack.subtitle,
    description: pack.description,
    packType: pack.packType,
    badge: pack.badge ?? pack.packType,
    estimatedHours: pack.estimatedHours ?? 0,
    hasFullAccess,
    modules: pack.modules.map((module) => ({
      id: module.id,
      packId: pack.id,
      title: module.title,
      description: module.description ?? "",
      sortOrder: module.sortOrder,
      lessons: module.lessons
        .filter((lesson) => hasFullAccess || lesson.isPreview)
        .map((lesson) => ({
          id: lesson.id,
          moduleId: module.id,
          packId: pack.id,
          slug: lesson.slug,
          title: lesson.title,
          summary: lesson.summary ?? "",
          contentMarkdown: lesson.contentMarkdown,
          lessonType: lesson.lessonType,
          sortOrder: lesson.sortOrder,
          estimatedMinutes: lesson.estimatedMinutes ?? 10,
          isPreview: lesson.isPreview
        }))
    })),
    assets: pack.assets
      .filter((asset) => hasFullAccess || asset.isPreview)
      .map((asset) => ({
        id: asset.id,
        packId: pack.id,
        title: asset.title,
        fileType: asset.fileType,
        href: asset.href,
        description: asset.description ?? "",
        isPreview: asset.isPreview
      }))
  };
}

export async function getOwnedPackIdsForMobile(
  session: Awaited<ReturnType<typeof import("@/lib/mobile/session").getMobileSession>>
) {
  if (!session) {
    return new Set<string>();
  }

  const { data, error } = await session.supabase
    .from("entitlements")
    .select("study_pack_id")
    .eq("user_id", session.profile.id)
    .eq("status", "active");

  if (error || !data) {
    return new Set<string>();
  }

  return new Set(
    data
      .map((item) => item.study_pack_id as string | null)
      .filter((value): value is string => Boolean(value))
  );
}

export async function getMobileCatalog(ownedPackIds: Set<string>) {
  const snapshot = await getContentIndex();

  return {
    contentVersion: mobileCatalogVersion,
    generatedAt: new Date().toISOString(),
    exams: snapshot.exams.map((exam) => ({
      id: exam.id,
      slug: exam.slug,
      name: exam.name,
      description: exam.description,
      sections: exam.sections
    })),
    packs: snapshot.packs.map((pack) => serializeMobilePack(pack, ownedPackIds))
  };
}
