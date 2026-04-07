function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const {
  couponCampaigns,
  exams,
  freeGuides,
  getActivePromoBanner,
  studyPacks
} = await import("../lib/content/catalog.ts");

const packBySlug = new Map(studyPacks.map((pack) => [pack.slug, pack]));
const guideBySlug = new Map(freeGuides.map((guide) => [guide.slug, guide]));
const examBySlug = new Map(exams.map((exam) => [exam.slug, exam]));
const sectionBySlug = new Map(
  exams.flatMap((exam) => exam.sections.map((section) => [`${exam.slug}:${section.slug}`, section]))
);

const checks = [];

assert(exams.length > 0, "Expected at least one exam.");
checks.push("exam catalog");

assert(studyPacks.length > 0, "Expected at least one study pack.");
checks.push("pack catalog");

for (const exam of exams) {
  assert(guideBySlug.has(exam.freeGuideSlug), `Exam ${exam.slug} references a missing free guide.`);
  assert(exam.sections.length > 0, `Exam ${exam.slug} must define at least one section.`);

  for (const featuredSlug of exam.featuredPackSlugs) {
    const pack = packBySlug.get(featuredSlug);
    assert(pack, `Exam ${exam.slug} features missing pack ${featuredSlug}.`);
    assert(
      pack.examSlug === exam.slug,
      `Exam ${exam.slug} features pack ${featuredSlug} from a different exam.`
    );
  }

  for (const useCase of exam.useCases) {
    for (const packSlug of useCase.packSlugs) {
      assert(packBySlug.has(packSlug), `Use case ${useCase.id} references missing pack ${packSlug}.`);
    }
  }
}
checks.push("exam relationships");

for (const pack of studyPacks) {
  assert(examBySlug.has(pack.examSlug), `Pack ${pack.slug} references missing exam ${pack.examSlug}.`);

  if (pack.sectionSlug) {
    assert(
      sectionBySlug.has(`${pack.examSlug}:${pack.sectionSlug}`),
      `Pack ${pack.slug} references missing section ${pack.sectionSlug}.`
    );
  }

  assert(pack.modules.length > 0, `Pack ${pack.slug} must contain at least one module.`);

  for (const relatedSlug of pack.relatedPackSlugs) {
    assert(packBySlug.has(relatedSlug), `Pack ${pack.slug} references missing related pack ${relatedSlug}.`);
  }

  for (const module of pack.modules) {
    const lessonSlugs = new Set();
    for (const lesson of module.lessons) {
      assert(!lessonSlugs.has(lesson.slug), `Duplicate lesson slug ${lesson.slug} in module ${module.id}.`);
      lessonSlugs.add(lesson.slug);
    }
  }
}
checks.push("pack relationships");

for (const guide of freeGuides) {
  assert(examBySlug.has(guide.examSlug), `Guide ${guide.slug} references missing exam ${guide.examSlug}.`);

  if (guide.sectionSlug) {
    assert(
      sectionBySlug.has(`${guide.examSlug}:${guide.sectionSlug}`),
      `Guide ${guide.slug} references missing section ${guide.sectionSlug}.`
    );
  }

  if (guide.relatedPackSlug) {
    assert(
      packBySlug.has(guide.relatedPackSlug),
      `Guide ${guide.slug} references missing related pack ${guide.relatedPackSlug}.`
    );
  }
}
checks.push("guide relationships");

const banner = getActivePromoBanner();
assert(banner, "Expected at least one active promo banner.");
checks.push("promo banner");

const couponCodes = new Set();
for (const coupon of couponCampaigns) {
  assert(!couponCodes.has(coupon.code), `Duplicate coupon code ${coupon.code}.`);
  couponCodes.add(coupon.code);
}
checks.push("coupon campaigns");

console.log(`Catalog integrity checks passed (${checks.length}):`);
for (const check of checks) {
  console.log(`- ${check}`);
}
