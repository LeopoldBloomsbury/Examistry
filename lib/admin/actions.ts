"use server";

import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import type { DeliveryMode, LessonType, PackType, PromoBannerTheme } from "@/types";

function requiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} is required.`);
  }

  return value.trim();
}

function optionalString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function checkboxValue(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function integerValue(formData: FormData, key: string, fallback = 0) {
  const value = optionalString(formData, key);
  const parsed = value ? Number.parseInt(value, 10) : fallback;
  return Number.isFinite(parsed) ? parsed : fallback;
}

function numericValue(formData: FormData, key: string) {
  const value = optionalString(formData, key);
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function splitLines(formData: FormData, key: string) {
  const value = optionalString(formData, key);

  if (!value) {
    return [];
  }

  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function detailItems(formData: FormData, key: string) {
  return splitLines(formData, key)
    .map((line) => {
      const [label, value] = line.split("::").map((item) => item.trim());
      return label && value ? { label, value } : null;
    })
    .filter(Boolean);
}

function faqItems(formData: FormData, key: string) {
  return splitLines(formData, key)
    .map((line) => {
      const [question, answer] = line.split("::").map((item) => item.trim());
      return question && answer ? { question, answer } : null;
    })
    .filter(Boolean);
}

function useCaseItems(formData: FormData, key: string) {
  return splitLines(formData, key)
    .map((line) => {
      const [id, title, body, packSlugs] = line.split("|").map((item) => item.trim());

      if (!id || !title || !body) {
        return null;
      }

      return {
        id,
        title,
        body,
        packSlugs: (packSlugs ?? "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      };
    })
    .filter(Boolean);
}

async function requireAdminClient() {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "admin") {
    throw new Error("Admin access required.");
  }

  const admin = createAdminClient();

  if (!admin) {
    throw new Error("Supabase admin client is not configured.");
  }

  return admin;
}

function assertNoError(error: { message: string } | null) {
  if (error) {
    throw new Error(error.message);
  }
}

function revalidateAdminSurface() {
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}

export async function upsertExamAction(formData: FormData) {
  const admin = await requireAdminClient();
  const id = optionalString(formData, "id");
  const payload = {
    slug: requiredString(formData, "slug"),
    name: requiredString(formData, "name"),
    description: requiredString(formData, "description"),
    hero_title: requiredString(formData, "heroTitle"),
    hero_body: requiredString(formData, "heroBody"),
    hero_highlights: splitLines(formData, "heroHighlights"),
    methodology_points: splitLines(formData, "methodologyPoints"),
    trust_points: splitLines(formData, "trustPoints"),
    use_cases: useCaseItems(formData, "useCases"),
    featured_pack_slugs: splitLines(formData, "featuredPackSlugs"),
    free_guide_slug: optionalString(formData, "freeGuideSlug"),
    active: checkboxValue(formData, "active"),
    sort_order: integerValue(formData, "sortOrder")
  };

  const result = id
    ? await admin.from("exams").update(payload).eq("id", id)
    : await admin.from("exams").insert(payload);

  assertNoError(result.error);
  revalidateAdminSurface();
}

export async function deleteExamAction(formData: FormData) {
  const admin = await requireAdminClient();
  const id = requiredString(formData, "id");
  const { error } = await admin.from("exams").delete().eq("id", id);

  assertNoError(error);
  revalidateAdminSurface();
}

export async function upsertSectionAction(formData: FormData) {
  const admin = await requireAdminClient();
  const id = optionalString(formData, "id");
  const payload = {
    exam_id: requiredString(formData, "examId"),
    slug: requiredString(formData, "slug"),
    name: requiredString(formData, "name"),
    description: optionalString(formData, "description"),
    sort_order: integerValue(formData, "sortOrder")
  };

  const result = id
    ? await admin.from("exam_sections").update(payload).eq("id", id)
    : await admin.from("exam_sections").insert(payload);

  assertNoError(result.error);
  revalidateAdminSurface();
}

export async function deleteSectionAction(formData: FormData) {
  const admin = await requireAdminClient();
  const id = requiredString(formData, "id");
  const { error } = await admin.from("exam_sections").delete().eq("id", id);

  assertNoError(error);
  revalidateAdminSurface();
}

export async function upsertPackAction(formData: FormData) {
  const admin = await requireAdminClient();
  const id = optionalString(formData, "id");
  const payload = {
    exam_id: requiredString(formData, "examId"),
    section_id: optionalString(formData, "sectionId"),
    slug: requiredString(formData, "slug"),
    title: requiredString(formData, "title"),
    subtitle: requiredString(formData, "subtitle"),
    promise: optionalString(formData, "promise"),
    description: requiredString(formData, "description"),
    pack_type: requiredString(formData, "packType") as PackType,
    price_cents: integerValue(formData, "priceCents"),
    stripe_price_id: optionalString(formData, "stripePriceId"),
    cover_image_url: optionalString(formData, "coverImageUrl"),
    badge: optionalString(formData, "badge"),
    is_featured: checkboxValue(formData, "isFeatured"),
    is_active: checkboxValue(formData, "isActive"),
    estimated_hours: numericValue(formData, "estimatedHours"),
    difficulty_level: optionalString(formData, "difficultyLevel"),
    includes: splitLines(formData, "includes"),
    outcomes: splitLines(formData, "outcomes"),
    who_its_for: splitLines(formData, "whoItsFor"),
    who_its_not_for: splitLines(formData, "whoItsNotFor"),
    format_breakdown: detailItems(formData, "formatBreakdown"),
    study_fit: optionalString(formData, "studyFit"),
    preview_notes: splitLines(formData, "previewNotes"),
    faq_items: faqItems(formData, "faqItems"),
    related_pack_slugs: splitLines(formData, "relatedPackSlugs")
  };

  const result = id
    ? await admin.from("study_packs").update(payload).eq("id", id)
    : await admin.from("study_packs").insert(payload);

  assertNoError(result.error);
  revalidateAdminSurface();
}

export async function deletePackAction(formData: FormData) {
  const admin = await requireAdminClient();
  const id = requiredString(formData, "id");
  const { error } = await admin.from("study_packs").delete().eq("id", id);

  assertNoError(error);
  revalidateAdminSurface();
}

export async function upsertModuleAction(formData: FormData) {
  const admin = await requireAdminClient();
  const id = optionalString(formData, "id");
  const payload = {
    pack_id: requiredString(formData, "packId"),
    title: requiredString(formData, "title"),
    description: optionalString(formData, "description"),
    sort_order: integerValue(formData, "sortOrder")
  };

  const result = id
    ? await admin.from("pack_modules").update(payload).eq("id", id)
    : await admin.from("pack_modules").insert(payload);

  assertNoError(result.error);
  revalidateAdminSurface();
}

export async function deleteModuleAction(formData: FormData) {
  const admin = await requireAdminClient();
  const id = requiredString(formData, "id");
  const { error } = await admin.from("pack_modules").delete().eq("id", id);

  assertNoError(error);
  revalidateAdminSurface();
}

export async function upsertLessonAction(formData: FormData) {
  const admin = await requireAdminClient();
  const id = optionalString(formData, "id");
  const payload = {
    module_id: requiredString(formData, "moduleId"),
    slug: requiredString(formData, "slug"),
    title: requiredString(formData, "title"),
    content_markdown: requiredString(formData, "contentMarkdown"),
    summary: optionalString(formData, "summary"),
    lesson_type: requiredString(formData, "lessonType") as LessonType,
    sort_order: integerValue(formData, "sortOrder"),
    estimated_minutes: integerValue(formData, "estimatedMinutes"),
    is_preview: checkboxValue(formData, "isPreview")
  };

  const result = id
    ? await admin.from("pack_lessons").update(payload).eq("id", id)
    : await admin.from("pack_lessons").insert(payload);

  assertNoError(result.error);
  revalidateAdminSurface();
}

export async function deleteLessonAction(formData: FormData) {
  const admin = await requireAdminClient();
  const id = requiredString(formData, "id");
  const { error } = await admin.from("pack_lessons").delete().eq("id", id);

  assertNoError(error);
  revalidateAdminSurface();
}

export async function upsertAssetAction(formData: FormData) {
  const admin = await requireAdminClient();
  const id = optionalString(formData, "id");
  const payload = {
    pack_id: requiredString(formData, "packId"),
    lesson_id: optionalString(formData, "lessonId"),
    title: requiredString(formData, "title"),
    file_path: requiredString(formData, "filePath"),
    file_type: requiredString(formData, "fileType"),
    description: optionalString(formData, "description"),
    is_preview: checkboxValue(formData, "isPreview")
  };

  const result = id
    ? await admin.from("downloadable_assets").update(payload).eq("id", id)
    : await admin.from("downloadable_assets").insert(payload);

  assertNoError(result.error);
  revalidateAdminSurface();
}

export async function deleteAssetAction(formData: FormData) {
  const admin = await requireAdminClient();
  const id = requiredString(formData, "id");
  const { error } = await admin.from("downloadable_assets").delete().eq("id", id);

  assertNoError(error);
  revalidateAdminSurface();
}

export async function upsertGuideAction(formData: FormData) {
  const admin = await requireAdminClient();
  const id = optionalString(formData, "id");
  const payload = {
    exam_id: requiredString(formData, "examId"),
    section_id: optionalString(formData, "sectionId"),
    slug: requiredString(formData, "slug"),
    title: requiredString(formData, "title"),
    subtitle: requiredString(formData, "subtitle"),
    promise: optionalString(formData, "promise"),
    description: requiredString(formData, "description"),
    bullets: splitLines(formData, "bullets"),
    preview_cards: splitLines(formData, "previewCards"),
    file_path: optionalString(formData, "filePath"),
    delivery_mode: requiredString(formData, "deliveryMode") as DeliveryMode,
    cta_after_submit: optionalString(formData, "ctaAfterSubmit"),
    related_pack_id: optionalString(formData, "relatedPackId"),
    privacy_reassurance: optionalString(formData, "privacyReassurance"),
    what_happens_next: splitLines(formData, "whatHappensNext"),
    thank_you_title: optionalString(formData, "thankYouTitle"),
    thank_you_body: optionalString(formData, "thankYouBody"),
    is_active: checkboxValue(formData, "isActive")
  };

  const result = id
    ? await admin.from("free_guides").update(payload).eq("id", id)
    : await admin.from("free_guides").insert(payload);

  assertNoError(result.error);
  revalidateAdminSurface();
}

export async function deleteGuideAction(formData: FormData) {
  const admin = await requireAdminClient();
  const id = requiredString(formData, "id");
  const { error } = await admin.from("free_guides").delete().eq("id", id);

  assertNoError(error);
  revalidateAdminSurface();
}

export async function upsertCouponAction(formData: FormData) {
  const admin = await requireAdminClient();
  const id = optionalString(formData, "id");
  const payload = {
    name: requiredString(formData, "name"),
    code: requiredString(formData, "code"),
    stripe_promotion_code_id: optionalString(formData, "stripePromotionCodeId"),
    active: checkboxValue(formData, "active")
  };

  const result = id
    ? await admin.from("coupon_campaigns").update(payload).eq("id", id)
    : await admin.from("coupon_campaigns").insert(payload);

  assertNoError(result.error);
  revalidateAdminSurface();
}

export async function deleteCouponAction(formData: FormData) {
  const admin = await requireAdminClient();
  const id = requiredString(formData, "id");
  const { error } = await admin.from("coupon_campaigns").delete().eq("id", id);

  assertNoError(error);
  revalidateAdminSurface();
}

export async function upsertPromoBannerAction(formData: FormData) {
  const admin = await requireAdminClient();
  const id = optionalString(formData, "id");
  const payload = {
    title: requiredString(formData, "title"),
    body: requiredString(formData, "body"),
    cta_label: optionalString(formData, "ctaLabel"),
    cta_href: optionalString(formData, "ctaHref"),
    theme: requiredString(formData, "theme") as PromoBannerTheme,
    is_active: checkboxValue(formData, "isActive"),
    sort_order: integerValue(formData, "sortOrder")
  };

  const result = id
    ? await admin.from("promo_banners").update(payload).eq("id", id)
    : await admin.from("promo_banners").insert(payload);

  assertNoError(result.error);
  revalidateAdminSurface();
}

export async function deletePromoBannerAction(formData: FormData) {
  const admin = await requireAdminClient();
  const id = requiredString(formData, "id");
  const { error } = await admin.from("promo_banners").delete().eq("id", id);

  assertNoError(error);
  revalidateAdminSurface();
}
