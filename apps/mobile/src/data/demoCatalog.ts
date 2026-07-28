import type { MobileAsset, MobileLesson, MobileModule, MobilePack } from "../types";

export const catalogVersion = "2026.07.20-demo-1";

export const demoPacks: MobilePack[] = [
  {
    id: "22222222-2222-4222-8222-222222222221",
    slug: "cpa-free-starter-guide-pack",
    title: "CPA Free Starter Guide",
    subtitle: "A clean first-14-days plan for not wasting your first month.",
    description:
      "A no-friction starter pack that helps candidates choose a realistic first sequence and avoid resource sprawl.",
    packType: "free",
    badge: "Free",
    estimatedHours: 2
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    slug: "aud-quickstart-pack",
    title: "AUD Quickstart Pack",
    subtitle: "Audit flow, report logic, and evidence habits in one compact path.",
    description:
      "A focused AUD pack for building recall around opinion logic, audit evidence, and the flow of an engagement.",
    packType: "one_time",
    badge: "AUD",
    estimatedHours: 8
  },
  {
    id: "22222222-2222-4222-8222-222222222223",
    slug: "far-formula-pack",
    title: "FAR Formula Map",
    subtitle: "Formula recall without turning review into a wall of flashcards.",
    description:
      "A compact FAR pack for formulas, recognition patterns, and deciding which calculations deserve memorization.",
    packType: "one_time",
    badge: "FAR",
    estimatedHours: 6
  }
];

export const demoModules: MobileModule[] = [
  {
    id: "mobile-module-start",
    packId: demoPacks[0].id,
    title: "Start Clean",
    description: "Set up the first two weeks with fewer decisions.",
    sortOrder: 1
  },
  {
    id: "mobile-module-aud",
    packId: demoPacks[1].id,
    title: "Audit Opinion Flow",
    description: "Build the opinion map before drilling details.",
    sortOrder: 1
  },
  {
    id: "mobile-module-far",
    packId: demoPacks[2].id,
    title: "Formula Recognition",
    description: "Choose the formulas that actually need memory.",
    sortOrder: 1
  }
];

export const demoLessons: MobileLesson[] = [
  {
    id: "mobile-lesson-start-1",
    moduleId: demoModules[0].id,
    packId: demoPacks[0].id,
    slug: "first-14-days",
    title: "The First 14 Days",
    summary: "A simple kickoff sequence for CPA study.",
    contentMarkdown:
      "# The First 14 Days\n\nStart with one section, one calendar, and one review loop.\n\n- Pick the section you can actually schedule.\n- Use short recall blocks before long passive reading.\n- Keep one parking lot for topics that feel urgent but are not next.\n\nThe goal is not a perfect system. The goal is a study week you will repeat.",
    lessonType: "planner",
    sortOrder: 1,
    estimatedMinutes: 12,
    isPreview: true,
    completed: false,
    saved: false
  },
  {
    id: "mobile-lesson-start-2",
    moduleId: demoModules[0].id,
    packId: demoPacks[0].id,
    slug: "resource-sprawl",
    title: "Stop Resource Sprawl",
    summary: "Avoid opening a new tool every time study feels uncomfortable.",
    contentMarkdown:
      "# Stop Resource Sprawl\n\nMost candidates do not need more sources. They need a cleaner sequence.\n\nWhen you feel stuck, write down the exact question you are trying to answer before adding another tab, video, or PDF.",
    lessonType: "reading",
    sortOrder: 2,
    estimatedMinutes: 8,
    isPreview: true,
    completed: false,
    saved: false
  },
  {
    id: "mobile-lesson-aud-1",
    moduleId: demoModules[1].id,
    packId: demoPacks[1].id,
    slug: "opinion-map",
    title: "Opinion Map",
    summary: "Sort clean, qualified, adverse, and disclaimer logic.",
    contentMarkdown:
      "# Opinion Map\n\nOpinion questions get easier when you separate scope issues from GAAP issues.\n\n- Scope limitation points toward qualified or disclaimer.\n- Material GAAP departure points toward qualified or adverse.\n- Pervasive is the escalation lever.\n\nMemorize the decision tree before memorizing report language.",
    lessonType: "memorization",
    sortOrder: 1,
    estimatedMinutes: 15,
    isPreview: true,
    completed: false,
    saved: false
  },
  {
    id: "mobile-lesson-aud-2",
    moduleId: demoModules[1].id,
    packId: demoPacks[1].id,
    slug: "evidence-habits",
    title: "Evidence Habits",
    summary: "Connect assertion, procedure, and evidence quality.",
    contentMarkdown:
      "# Evidence Habits\n\nGood AUD recall links three things: assertion, procedure, and evidence quality.\n\nFor each practice question, ask which assertion is being tested before looking at the procedure. This keeps review from becoming keyword matching.",
    lessonType: "practice",
    sortOrder: 2,
    estimatedMinutes: 18,
    isPreview: false,
    completed: false,
    saved: false
  },
  {
    id: "mobile-lesson-far-1",
    moduleId: demoModules[2].id,
    packId: demoPacks[2].id,
    slug: "formula-triage",
    title: "Formula Triage",
    summary: "Separate formulas to memorize from formulas to recognize.",
    contentMarkdown:
      "# Formula Triage\n\nDo not give every formula the same review weight.\n\nUse three buckets: must memorize, must recognize, and can derive. Put recurring exam patterns in the first two buckets and stop overtraining edge cases.",
    lessonType: "checklist",
    sortOrder: 1,
    estimatedMinutes: 14,
    isPreview: true,
    completed: false,
    saved: false
  }
];

export const demoAssets: MobileAsset[] = [
  {
    id: "mobile-asset-starter-guide",
    packId: demoPacks[0].id,
    title: "CPA Starter Guide",
    fileType: "html",
    href: "/guides/cpa-starter-guide.html",
    description: "A compact guide for the first two weeks.",
    availableOffline: false
  },
  {
    id: "mobile-asset-aud-cheat-sheet",
    packId: demoPacks[1].id,
    title: "AUD Opinions Cheat Sheet",
    fileType: "html",
    href: "/previews/aud-opinions-cheat-sheet.html",
    description: "Opinion logic in one scan-friendly reference.",
    availableOffline: false
  },
  {
    id: "mobile-asset-far-map",
    packId: demoPacks[2].id,
    title: "FAR Formula Map",
    fileType: "html",
    href: "/previews/far-formula-map.html",
    description: "Formula buckets for review planning.",
    availableOffline: false
  }
];
