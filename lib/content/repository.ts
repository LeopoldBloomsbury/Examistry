import { cache } from "react";
import { getCurrentProfile } from "@/lib/auth/session";
import {
  blogPosts,
  couponCampaigns as seedCoupons,
  demoCompletedLessonIds,
  demoLeadRecords,
  demoOwnedPackIds,
  demoProfile,
  demoPurchaseRecords,
  exams as seedExams,
  freeGuides as seedGuides,
  getActivePromoBanner as getSeedActivePromoBanner,
  getExamBySlug as getSeedExamBySlug,
  getGuideBySlug as getSeedGuideBySlug,
  getPackBySlug as getSeedPackBySlug,
  getPacksForExam as getSeedPacksForExam,
  promoBanners as seedPromoBanners,
  siteFaqs,
  studyPacks as seedPacks,
  testimonials
} from "@/lib/content/catalog";
import { integrations } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type {
  AdminOverviewData,
  DashboardData,
  DetailItem,
  DownloadableAsset,
  Exam,
  ExamSection,
  ExamUseCase,
  FaqItem,
  FreeGuide,
  LeadCaptureRecord,
  OwnedPack,
  PackLesson,
  PackModule,
  PromoBanner,
  PurchaseRecord,
  StudyPack,
  UserProfile
} from "@/types";

interface ExamRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  active: boolean;
  sort_order: number;
  hero_title?: string | null;
  hero_body?: string | null;
  hero_highlights?: unknown;
  methodology_points?: unknown;
  trust_points?: unknown;
  use_cases?: unknown;
  featured_pack_slugs?: unknown;
  free_guide_slug?: string | null;
}

interface ExamSectionRow {
  id: string;
  exam_id: string;
  slug: string;
  name: string;
  description?: string | null;
  sort_order: number;
}

interface StudyPackRow {
  id: string;
  exam_id: string;
  section_id?: string | null;
  slug: string;
  title: string;
  subtitle: string;
  promise?: string | null;
  description: string;
  pack_type: StudyPack["packType"];
  price_cents: number;
  stripe_price_id?: string | null;
  cover_image_url?: string | null;
  badge?: string | null;
  is_featured: boolean;
  is_active: boolean;
  estimated_hours?: number | null;
  difficulty_level?: string | null;
  includes?: unknown;
  outcomes?: unknown;
  who_its_for?: unknown;
  who_its_not_for?: unknown;
  format_breakdown?: unknown;
  study_fit?: string | null;
  preview_notes?: unknown;
  faq_items?: unknown;
  related_pack_slugs?: unknown;
}

interface PackModuleRow {
  id: string;
  pack_id: string;
  title: string;
  description?: string | null;
  sort_order: number;
}

interface PackLessonRow {
  id: string;
  module_id: string;
  slug: string;
  title: string;
  content_markdown: string;
  summary?: string | null;
  lesson_type: PackLesson["lessonType"];
  sort_order: number;
  estimated_minutes?: number | null;
  is_preview: boolean;
}

interface DownloadableAssetRow {
  id: string;
  pack_id: string;
  lesson_id?: string | null;
  title: string;
  file_path: string;
  file_type: string;
  description?: string | null;
  is_preview: boolean;
}

interface FreeGuideRow {
  id: string;
  exam_id: string;
  section_id?: string | null;
  slug: string;
  title: string;
  subtitle: string;
  promise?: string | null;
  description: string;
  bullets?: unknown;
  preview_cards?: unknown;
  file_path?: string | null;
  delivery_mode: FreeGuide["deliveryMode"];
  cta_after_submit?: string | null;
  related_pack_id?: string | null;
  related_pack_slug?: string | null;
  privacy_reassurance?: string | null;
  what_happens_next?: unknown;
  thank_you_title?: string | null;
  thank_you_body?: string | null;
  is_active?: boolean;
}

interface PromoBannerRow {
  id: string;
  title: string;
  body: string;
  cta_label?: string | null;
  cta_href?: string | null;
  theme: PromoBanner["theme"];
  is_active: boolean;
  sort_order: number;
}

interface CatalogSnapshot {
  exams: Exam[];
  packs: StudyPack[];
  guides: FreeGuide[];
  banners: PromoBanner[];
}

const seedSnapshot: CatalogSnapshot = {
  exams: seedExams,
  packs: seedPacks,
  guides: seedGuides,
  banners: seedPromoBanners
};

function stringArray(value: unknown, fallback: string[] = []) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value.filter((item): item is string => typeof item === "string");
}

function faqArray(value: unknown, fallback: FaqItem[] = []) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value
    .map((item) => {
      if (
        item &&
        typeof item === "object" &&
        typeof (item as FaqItem).question === "string" &&
        typeof (item as FaqItem).answer === "string"
      ) {
        return {
          question: (item as FaqItem).question,
          answer: (item as FaqItem).answer
        };
      }

      return null;
    })
    .filter((item): item is FaqItem => Boolean(item));
}

function detailArray(value: unknown, fallback: DetailItem[] = []) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value
    .map((item) => {
      if (
        item &&
        typeof item === "object" &&
        typeof (item as DetailItem).label === "string" &&
        typeof (item as DetailItem).value === "string"
      ) {
        return {
          label: (item as DetailItem).label,
          value: (item as DetailItem).value
        };
      }

      return null;
    })
    .filter((item): item is DetailItem => Boolean(item));
}

function useCaseArray(value: unknown, fallback: ExamUseCase[] = []) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value
    .map((item) => {
      if (
        item &&
        typeof item === "object" &&
        typeof (item as ExamUseCase).id === "string" &&
        typeof (item as ExamUseCase).title === "string" &&
        typeof (item as ExamUseCase).body === "string" &&
        Array.isArray((item as ExamUseCase).packSlugs)
      ) {
        return {
          id: (item as ExamUseCase).id,
          title: (item as ExamUseCase).title,
          body: (item as ExamUseCase).body,
          packSlugs: stringArray((item as ExamUseCase).packSlugs)
        };
      }

      return null;
    })
    .filter((item): item is ExamUseCase => Boolean(item));
}

const getCatalogSnapshot = cache(async (): Promise<CatalogSnapshot> => {
  if (!integrations.supabasePublic) {
    return seedSnapshot;
  }

  const supabase = await createClient();

  if (!supabase) {
    return seedSnapshot;
  }

  const [examsResult, sectionsResult, packsResult, modulesResult, lessonsResult, assetsResult, guidesResult, bannersResult] =
    await Promise.all([
      supabase.from("exams").select("*").eq("active", true).order("sort_order"),
      supabase.from("exam_sections").select("*").order("sort_order"),
      supabase.from("study_packs").select("*").eq("is_active", true).order("price_cents"),
      supabase.from("pack_modules").select("*").order("sort_order"),
      supabase.from("pack_lessons").select("*").order("sort_order"),
      supabase.from("downloadable_assets").select("*"),
      supabase.from("free_guides").select("*").eq("is_active", true),
      supabase.from("promo_banners").select("*").eq("is_active", true).order("sort_order")
    ]);

  if (
    examsResult.error ||
    sectionsResult.error ||
    packsResult.error ||
    modulesResult.error ||
    lessonsResult.error ||
    assetsResult.error ||
    guidesResult.error ||
    bannersResult.error ||
    !examsResult.data?.length
  ) {
    return seedSnapshot;
  }

  const examRows = examsResult.data as ExamRow[];
  const sectionRows = (sectionsResult.data ?? []) as ExamSectionRow[];
  const packRows = (packsResult.data ?? []) as StudyPackRow[];
  const moduleRows = (modulesResult.data ?? []) as PackModuleRow[];
  const lessonRows = (lessonsResult.data ?? []) as PackLessonRow[];
  const assetRows = (assetsResult.data ?? []) as DownloadableAssetRow[];
  const guideRows = (guidesResult.data ?? []) as FreeGuideRow[];
  const bannerRows = (bannersResult.data ?? []) as PromoBannerRow[];

  const seedExamMap = new Map(seedExams.map((exam) => [exam.slug, exam]));
  const seedPackMap = new Map(seedPacks.map((pack) => [pack.slug, pack]));
  const seedGuideMap = new Map(seedGuides.map((guide) => [guide.slug, guide]));

  const sectionsByExam = new Map<string, ExamSection[]>();
  sectionRows.forEach((section) => {
    const current = sectionsByExam.get(section.exam_id) ?? [];
    current.push({
      id: section.id,
      slug: section.slug,
      name: section.name,
      description: section.description ?? undefined,
      sortOrder: section.sort_order
    });
    sectionsByExam.set(section.exam_id, current);
  });

  const modulesByPack = new Map<string, PackModule[]>();
  const lessonsByModule = new Map<string, PackLesson[]>();
  const assetsByPack = new Map<string, DownloadableAsset[]>();

  lessonRows.forEach((lesson) => {
    const current = lessonsByModule.get(lesson.module_id) ?? [];
    current.push({
      id: lesson.id,
      slug: lesson.slug,
      title: lesson.title,
      contentMarkdown: lesson.content_markdown,
      summary: lesson.summary ?? undefined,
      lessonType: lesson.lesson_type,
      sortOrder: lesson.sort_order,
      estimatedMinutes: lesson.estimated_minutes ?? undefined,
      isPreview: lesson.is_preview
    });
    lessonsByModule.set(lesson.module_id, current);
  });

  moduleRows.forEach((module) => {
    const current = modulesByPack.get(module.pack_id) ?? [];
    current.push({
      id: module.id,
      title: module.title,
      description: module.description ?? undefined,
      sortOrder: module.sort_order,
      lessons: (lessonsByModule.get(module.id) ?? []).sort((a, b) => a.sortOrder - b.sortOrder)
    });
    modulesByPack.set(module.pack_id, current);
  });

  assetRows.forEach((asset) => {
    const current = assetsByPack.get(asset.pack_id) ?? [];
    current.push({
      id: asset.id,
      title: asset.title,
      fileType: asset.file_type,
      href: asset.file_path,
      lessonId: asset.lesson_id ?? undefined,
      description: asset.description ?? undefined,
      isPreview: asset.is_preview
    });
    assetsByPack.set(asset.pack_id, current);
  });

  const examRowsById = new Map(examRows.map((exam) => [exam.id, exam]));
  const sectionRowsById = new Map(sectionRows.map((section) => [section.id, section]));
  const exams = examRows.map((row) => {
    const fallback = seedExamMap.get(row.slug);

    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description,
      isActive: row.active,
      sortOrder: row.sort_order,
      heroTitle: row.hero_title ?? fallback?.heroTitle ?? row.name,
      heroBody: row.hero_body ?? fallback?.heroBody ?? row.description,
      heroHighlights: stringArray(row.hero_highlights, fallback?.heroHighlights ?? []),
      methodologyPoints: stringArray(
        row.methodology_points,
        fallback?.methodologyPoints ?? []
      ),
      trustPoints: stringArray(row.trust_points, fallback?.trustPoints ?? []),
      sections: (sectionsByExam.get(row.id) ?? fallback?.sections ?? []).sort(
        (a, b) => a.sortOrder - b.sortOrder
      ),
      useCases: useCaseArray(row.use_cases, fallback?.useCases ?? []),
      featuredPackSlugs: stringArray(
        row.featured_pack_slugs,
        fallback?.featuredPackSlugs ?? []
      ),
      freeGuideSlug: row.free_guide_slug ?? fallback?.freeGuideSlug ?? ""
    };
  });

  const packs = packRows.map((row) => {
    const fallback = seedPackMap.get(row.slug);
    const exam = examRowsById.get(row.exam_id);
    const section = row.section_id ? sectionRowsById.get(row.section_id) : null;

    return {
      id: row.id,
      slug: row.slug,
      examSlug: exam?.slug ?? fallback?.examSlug ?? "cpa",
      sectionSlug: section?.slug ?? fallback?.sectionSlug,
      title: row.title,
      subtitle: row.subtitle,
      promise: row.promise ?? fallback?.promise ?? row.subtitle,
      description: row.description,
      packType: row.pack_type,
      priceCents: row.price_cents,
      stripePriceId: row.stripe_price_id ?? fallback?.stripePriceId,
      badge: row.badge ?? fallback?.badge,
      estimatedHours: row.estimated_hours ?? fallback?.estimatedHours,
      difficultyLevel: row.difficulty_level ?? fallback?.difficultyLevel,
      isFeatured: row.is_featured ?? fallback?.isFeatured ?? false,
      isActive: row.is_active ?? fallback?.isActive ?? true,
      coverImageUrl: row.cover_image_url ?? fallback?.coverImageUrl,
      includes: stringArray(row.includes, fallback?.includes ?? []),
      outcomes: stringArray(row.outcomes, fallback?.outcomes ?? []),
      formatBreakdown: detailArray(
        row.format_breakdown,
        fallback?.formatBreakdown ?? []
      ),
      whoItsFor: stringArray(row.who_its_for, fallback?.whoItsFor ?? []),
      whoItsNotFor: stringArray(
        row.who_its_not_for,
        fallback?.whoItsNotFor ?? []
      ),
      studyFit: row.study_fit ?? fallback?.studyFit ?? "",
      previewNotes: stringArray(row.preview_notes, fallback?.previewNotes ?? []),
      faqs: faqArray(row.faq_items, fallback?.faqs ?? []),
      relatedPackSlugs: stringArray(
        row.related_pack_slugs,
        fallback?.relatedPackSlugs ?? []
      ),
      modules: (modulesByPack.get(row.id) ?? fallback?.modules ?? []).sort(
        (a, b) => a.sortOrder - b.sortOrder
      ),
      assets: assetsByPack.get(row.id) ?? fallback?.assets ?? []
    };
  });

  const packSlugById = new Map(packs.map((pack) => [pack.id, pack.slug]));
  const sectionSlugById = new Map(sectionRows.map((section) => [section.id, section.slug]));

  const guides = guideRows.map((row) => {
    const fallback = seedGuideMap.get(row.slug);
    const exam = examRowsById.get(row.exam_id);

    return {
      id: row.id,
      slug: row.slug,
      examSlug: exam?.slug ?? fallback?.examSlug ?? "cpa",
      sectionSlug: row.section_id ? sectionSlugById.get(row.section_id) ?? fallback?.sectionSlug : fallback?.sectionSlug,
      title: row.title,
      subtitle: row.subtitle,
      promise: row.promise ?? fallback?.promise ?? row.subtitle,
      description: row.description,
      bullets: stringArray(row.bullets, fallback?.bullets ?? []),
      previewCards: stringArray(row.preview_cards, fallback?.previewCards ?? []),
      deliveryMode: row.delivery_mode,
      filePath: row.file_path ?? fallback?.filePath,
      ctaAfterSubmit: row.cta_after_submit ?? fallback?.ctaAfterSubmit,
      relatedPackSlug:
        row.related_pack_slug ??
        (row.related_pack_id ? packSlugById.get(row.related_pack_id) : null) ??
        fallback?.relatedPackSlug,
      privacyReassurance:
        row.privacy_reassurance ?? fallback?.privacyReassurance ?? "",
      whatHappensNext: stringArray(
        row.what_happens_next,
        fallback?.whatHappensNext ?? []
      ),
      thankYouTitle: row.thank_you_title ?? fallback?.thankYouTitle ?? "Your guide is ready",
      thankYouBody: row.thank_you_body ?? fallback?.thankYouBody ?? "",
      isActive: row.is_active ?? fallback?.isActive ?? true
    };
  });

  const banners = bannerRows.map((row) => ({
    id: row.id,
    title: row.title,
    body: row.body,
    ctaLabel: row.cta_label ?? undefined,
    ctaHref: row.cta_href ?? undefined,
    theme: row.theme,
    isActive: row.is_active,
    sortOrder: row.sort_order
  }));

  return {
    exams: exams.length ? exams : seedSnapshot.exams,
    packs: packs.length ? packs : seedSnapshot.packs,
    guides: guides.length ? guides : seedSnapshot.guides,
    banners: banners.length ? banners : seedSnapshot.banners
  };
});

async function getOwnedPackIds(profile: UserProfile | null) {
  if (!profile) {
    return integrations.supabasePublic ? [] : demoOwnedPackIds;
  }

  const supabase = await createClient();

  if (!supabase) {
    return demoOwnedPackIds;
  }

  const { data, error } = await supabase
    .from("entitlements")
    .select("study_pack_id")
    .eq("user_id", profile.id)
    .eq("status", "active");

  if (error || !data) {
    return [];
  }

  return data
    .map((item) => item.study_pack_id as string | null)
    .filter((value): value is string => Boolean(value));
}

async function getCompletedLessonIds(profile: UserProfile | null) {
  if (!profile) {
    return integrations.supabasePublic ? [] : demoCompletedLessonIds;
  }

  const supabase = await createClient();

  if (!supabase) {
    return demoCompletedLessonIds;
  }

  const { data, error } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", profile.id)
    .eq("completed", true);

  if (error || !data) {
    return [];
  }

  return data
    .map((item) => item.lesson_id as string | null)
    .filter((value): value is string => Boolean(value));
}

async function getSavedLessonIds(profile: UserProfile | null) {
  if (!profile) {
    return [];
  }

  const supabase = await createClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("saved_lessons")
    .select("lesson_id")
    .eq("user_id", profile.id);

  if (error || !data) {
    return [];
  }

  return data
    .map((item) => item.lesson_id as string | null)
    .filter((value): value is string => Boolean(value));
}

function buildOwnedPack(pack: StudyPack, completedLessonIds: Set<string>): OwnedPack {
  const lessons = pack.modules.flatMap((module) => module.lessons);
  const completedLessons = lessons.filter((lesson) => completedLessonIds.has(lesson.id)).length;
  const progressPercent = lessons.length
    ? Math.round((completedLessons / lessons.length) * 100)
    : 0;
  const lastCompletedLesson = lessons
    .filter((lesson) => completedLessonIds.has(lesson.id))
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .at(-1);

  return {
    pack,
    progressPercent,
    completedLessons,
    totalLessons: lessons.length,
    lastLessonSlug: lastCompletedLesson?.slug,
    lastLessonTitle: lastCompletedLesson?.title
  };
}

export async function getContentIndex() {
  return getCatalogSnapshot();
}

export async function getExamBySlug(slug: string) {
  const snapshot = await getCatalogSnapshot();
  return snapshot.exams.find((exam) => exam.slug === slug) ?? getSeedExamBySlug(slug) ?? null;
}

export async function getPackBySlug(slug: string) {
  const snapshot = await getCatalogSnapshot();
  return snapshot.packs.find((pack) => pack.slug === slug) ?? getSeedPackBySlug(slug) ?? null;
}

export async function getGuideBySlug(slug: string) {
  const snapshot = await getCatalogSnapshot();
  return snapshot.guides.find((guide) => guide.slug === slug) ?? getSeedGuideBySlug(slug) ?? null;
}

export async function getPacksForExam(examSlug: string) {
  const snapshot = await getCatalogSnapshot();
  const packs = snapshot.packs.filter((pack) => pack.examSlug === examSlug);
  return packs.length ? packs : getSeedPacksForExam(examSlug);
}

export async function getActivePromoBanner() {
  const snapshot = await getCatalogSnapshot();
  return (
    snapshot.banners
      .filter((banner) => banner.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)[0] ??
    getSeedActivePromoBanner() ??
    null
  );
}

export async function getDashboardData(): Promise<DashboardData> {
  const snapshot = await getCatalogSnapshot();
  const accessState = await getViewerAccessState();
  const ownedPackIds = new Set(accessState.ownedPackIds);
  const completedLessonIds = new Set(accessState.completedLessonIds);

  const ownedPacks = snapshot.packs
    .filter((pack) => ownedPackIds.has(pack.id))
    .map((pack) => buildOwnedPack(pack, completedLessonIds))
    .sort((a, b) => b.progressPercent - a.progressPercent);

  const continuePack =
    ownedPacks.find((pack) => pack.progressPercent < 100) ?? ownedPacks[0];

  const downloads = ownedPacks.flatMap((ownedPack) =>
    ownedPack.pack.assets.map((asset) => ({
      asset,
      pack: ownedPack.pack
    }))
  );

  const recentLessons = ownedPacks
    .flatMap((ownedPack) =>
      ownedPack.pack.modules.flatMap((module) =>
        module.lessons
          .filter((lesson) => completedLessonIds.has(lesson.id))
          .map((lesson) => ({
            packSlug: ownedPack.pack.slug,
            packTitle: ownedPack.pack.title,
            lessonSlug: lesson.slug,
            lessonTitle: lesson.title
          }))
      )
    )
    .slice(-4)
    .reverse();

  const recommendation = snapshot.packs.find(
    (pack) => pack.isFeatured && !ownedPackIds.has(pack.id) && pack.packType !== "free"
  );

  return {
    mode: accessState.mode,
    viewerName: accessState.viewerName,
    stats: [
      {
        label: "Owned packs",
        value: String(ownedPacks.length),
        caption: "Webhook-fulfilled entitlements only."
      },
      {
        label: "Lessons completed",
        value: String(
          ownedPacks.reduce((total, pack) => total + pack.completedLessons, 0)
        ),
        caption: "Across the current library."
      },
      {
        label: "Downloads",
        value: String(downloads.length),
        caption: "Cheat sheets, planners, and previews."
      },
      {
        label: "Study hours",
        value: String(
          ownedPacks.reduce((total, pack) => total + (pack.pack.estimatedHours ?? 0), 0)
        ),
        caption: "Estimated guided hours in owned packs."
      }
    ],
    ownedPacks,
    continuePack,
    recentLessons,
    downloads,
    studyPlan: [
      "Start with one pack, one calendar, and one download set.",
      "Schedule recall before you schedule volume.",
      "Use the rescue planner only when the exam date is actually tight."
    ],
    recommendation
  };
}

export async function getViewerAccessState(): Promise<{
  profile: UserProfile | null;
  mode: "demo" | "authenticated";
  viewerName: string;
  ownedPackIds: string[];
  completedLessonIds: string[];
  savedLessonIds: string[];
}> {
  const profile = await getCurrentProfile();
  const [ownedPackIds, completedLessonIds, savedLessonIds] = await Promise.all([
    getOwnedPackIds(profile),
    getCompletedLessonIds(profile),
    getSavedLessonIds(profile)
  ]);

  return {
    profile,
    mode: profile ? "authenticated" : "demo",
    viewerName: profile?.fullName || profile?.email || demoProfile.fullName,
    ownedPackIds,
    completedLessonIds,
    savedLessonIds
  };
}

export async function getAdminOverviewData(): Promise<AdminOverviewData> {
  const profile = await getCurrentProfile();
  const admin = createAdminClient();

  if (!profile || profile.role !== "admin" || !admin) {
    return {
      mode: "demo",
      metrics: [
        {
          label: "Active exams",
          value: String(seedExams.length),
          caption: "Demo mode until Supabase admin access is configured."
        },
        {
          label: "Packs",
          value: String(seedPacks.length),
          caption: "Structured content with future-vertical support."
        },
        {
          label: "Leads",
          value: String(demoLeadRecords.length),
          caption: "Demo lead records."
        },
        {
          label: "Orders",
          value: String(demoPurchaseRecords.length),
          caption: "Demo purchase records."
        }
      ],
      exams: seedExams,
      packs: seedPacks,
      leads: demoLeadRecords,
      purchases: demoPurchaseRecords
    };
  }

  const snapshot = await getCatalogSnapshot();
  const [leadResult, purchaseResult, entitlementResult] = await Promise.all([
    admin.from("lead_captures").select("email, full_name, source, marketing_opt_in, created_at, exam_id, section_id, free_guide_id").order("created_at", { ascending: false }).limit(8),
    admin.from("purchases").select("email, amount_cents, status, created_at, purchase_items(study_pack_id), id").order("created_at", { ascending: false }).limit(8),
    admin.from("entitlements").select("purchase_id, status")
  ]);

  const leadGuideById = new Map(snapshot.guides.map((guide) => [guide.id, guide]));
  const examById = new Map(snapshot.exams.map((exam) => [exam.id, exam]));
  const sectionById = new Map(
    snapshot.exams.flatMap((exam) => exam.sections.map((section) => [section.id, section] as const))
  );
  const packById = new Map(snapshot.packs.map((pack) => [pack.id, pack]));
  const entitlementByPurchaseId = new Map(
    (entitlementResult.data ?? []).map((item) => [item.purchase_id as string, item.status as PurchaseRecord["entitlementStatus"]])
  );

  const leads: LeadCaptureRecord[] = (leadResult.data ?? []).map((row) => ({
    email: row.email as string,
    fullName: (row.full_name as string | null) ?? undefined,
    guideTitle:
      leadGuideById.get(row.free_guide_id as string)?.title ?? "Free guide",
    source: (row.source as string | null) ?? "unknown",
    examName: examById.get(row.exam_id as string)?.name ?? "Exam",
    sectionName: sectionById.get(row.section_id as string)?.name,
    marketingOptIn: Boolean(row.marketing_opt_in),
    capturedAt: row.created_at as string
  }));

  const purchases: PurchaseRecord[] = (purchaseResult.data ?? []).map((row) => {
    const items = Array.isArray(row.purchase_items) ? row.purchase_items : [];
    const firstItem = items[0] as { study_pack_id?: string } | undefined;

    return {
      email: row.email as string,
      packTitle:
        (firstItem?.study_pack_id ? packById.get(firstItem.study_pack_id)?.title : null) ??
        "Pack",
      amountCents: Number(row.amount_cents),
      status: row.status as PurchaseRecord["status"],
      entitlementStatus: entitlementByPurchaseId.get(row.id as string) ?? "pending_claim",
      purchasedAt: row.created_at as string
    };
  });

  return {
    mode: "authenticated",
    metrics: [
      {
        label: "Active exams",
        value: String(snapshot.exams.length),
        caption: "Live from Supabase content tables."
      },
      {
        label: "Packs",
        value: String(snapshot.packs.length),
        caption: "Public catalog plus bundle merchandising."
      },
      {
        label: "Recent leads",
        value: String(leads.length),
        caption: "Lead capture stays server-side only."
      },
      {
        label: "Recent orders",
        value: String(purchases.length),
        caption: "Webhook fulfillment drives entitlement state."
      }
    ],
    exams: snapshot.exams,
    packs: snapshot.packs,
    leads,
    purchases
  };
}

export {
  blogPosts,
  testimonials,
  siteFaqs,
  demoProfile,
  seedCoupons as couponCampaigns,
  seedPromoBanners as promoBanners
};
