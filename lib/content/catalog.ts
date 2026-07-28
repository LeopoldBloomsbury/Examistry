import type {
  AdminOverviewData,
  BlogPost,
  CouponCampaign,
  Exam,
  FreeGuide,
  LeadCaptureRecord,
  PromoBanner,
  PurchaseRecord,
  StudyPack,
  Testimonial,
  UserProfile
} from "@/types";

const ids = {
  examCpa: "11111111-1111-4111-8111-111111111111",
  sectionAud: "11111111-1111-4111-8111-111111111112",
  sectionFar: "11111111-1111-4111-8111-111111111113",
  sectionReg: "11111111-1111-4111-8111-111111111114",
  sectionTcp: "11111111-1111-4111-8111-111111111115",
  sectionIsc: "11111111-1111-4111-8111-111111111116",
  sectionBar: "11111111-1111-4111-8111-111111111117",
  packFree: "22222222-2222-4222-8222-222222222221",
  packAud: "22222222-2222-4222-8222-222222222222",
  packFar: "22222222-2222-4222-8222-222222222223",
  packRescue: "22222222-2222-4222-8222-222222222224",
  packBundle: "22222222-2222-4222-8222-222222222225",
  guideCpa: "66666666-6666-4666-8666-666666666661"
} as const;

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-start-cpa-study-without-burning-out",
    title: "How to Start CPA Study Without Burning Out",
    excerpt:
      "A calmer way to structure the first 14 days so you stop opening tabs and start building recall.",
    category: "Study Strategy",
    readTimeMinutes: 7,
    publishedAt: "2026-03-10"
  },
  {
    slug: "retake-rescue-plan",
    title: "The 30-Day Retake Rescue Plan",
    excerpt:
      "How to triage content, reset your calendar, and stop rebuilding your study system every Monday.",
    category: "Retake Rescue",
    readTimeMinutes: 9,
    publishedAt: "2026-03-18"
  },
  {
    slug: "far-formulas-you-actually-need",
    title: "The FAR Formulas You Actually Need to Remember",
    excerpt:
      "A high-yield lens for formula review that favors pattern recognition over brute memorization.",
    category: "FAR",
    readTimeMinutes: 6,
    publishedAt: "2026-03-25"
  }
];

export const testimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    quote: "It felt like someone finally edited out the noise.",
    name: "Jordan P.",
    role: "CPA candidate, first-time taker",
    outcome: "Used the starter guide to reset the first two weeks."
  },
  {
    id: "testimonial-2",
    quote: "The dashboard felt calmer than every prep product I tried.",
    name: "Morgan L.",
    role: "CPA retaker",
    outcome: "Finished the rescue plan without rebuilding the schedule twice."
  },
  {
    id: "testimonial-3",
    quote: "The pack copy matched the product. Clear, direct, and low-drama.",
    name: "Casey R.",
    role: "Audit associate",
    outcome: "Used AUD Quickstart to sharpen recall before practice blocks."
  }
];

export const siteFaqs = [
  {
    question: "Does CPA StudyPilot replace a full prep course?",
    answer:
      "No. It is designed to make an existing prep stack more focused, more navigable, and more useful."
  },
  {
    question: "Can I buy before creating an account?",
    answer:
      "Yes. Checkout is email-first. Access is granted by webhook fulfillment and then reconciled to the same email when you sign in."
  },
  {
    question: "Will this schema support NCLEX or bar prep later?",
    answer:
      "Yes. Exams, sections, packs, modules, lessons, assets, entitlements, and leads are modeled independently so new verticals fit without a rewrite."
  }
];

export const exams: Exam[] = [
  {
    id: ids.examCpa,
    slug: "cpa",
    name: "CPA",
    description:
      "Focused study packs for candidates who want a calmer, higher-yield path through core sections and discipline work.",
    isActive: true,
    sortOrder: 1,
    heroTitle: "Start CPA prep with a clear path into AUD",
    heroBody:
      "Use the free starter guide to get oriented, then move into AUD Quickstart when audit flow, reports, and evidence questions still feel scattered.",
    heroHighlights: [
      "First paid focus: AUD Quickstart",
      "Built for first-time takers who need sequence before volume",
      "Instant access after webhook-driven fulfillment"
    ],
    methodologyPoints: [
      "High-yield sequencing over maximal volume",
      "Deliberate lesson hierarchy and download design",
      "Structured content operations that scale to new exam verticals"
    ],
    trustPoints: [
      "Focused packs instead of bloated subscriptions",
      "Instant digital access",
      "Clean dashboards and downloads",
      "Expandable schema for future exams"
    ],
    sections: [
      {
        id: ids.sectionAud,
        slug: "aud",
        name: "AUD",
        description: "Auditing and attestation",
        sortOrder: 1
      },
      {
        id: ids.sectionFar,
        slug: "far",
        name: "FAR",
        description: "Financial accounting and reporting",
        sortOrder: 2
      },
      {
        id: ids.sectionReg,
        slug: "reg",
        name: "REG",
        description: "Regulation",
        sortOrder: 3
      },
      {
        id: ids.sectionTcp,
        slug: "tcp",
        name: "TCP",
        description: "Tax compliance and planning",
        sortOrder: 4
      },
      {
        id: ids.sectionIsc,
        slug: "isc",
        name: "ISC",
        description: "Information systems and controls",
        sortOrder: 5
      },
      {
        id: ids.sectionBar,
        slug: "bar",
        name: "BAR",
        description: "Business analysis and reporting",
        sortOrder: 6
      }
    ],
    useCases: [
      {
        id: "use-case-first-time",
        title: "First-time taker",
        body:
          "Use the starter guide to set the first two weeks, then make AUD Quickstart your first paid step if audit questions feel shapeless.",
        packSlugs: ["cpa-free-starter-guide-pack", "aud-quickstart-pack"]
      },
      {
        id: "use-case-retake",
        title: "Retake rescue",
        body:
          "Reset the plan, triage weak topics, and rebuild confidence without buying another bloated platform.",
        packSlugs: ["cpa-30-day-rescue-pack"]
      },
      {
        id: "use-case-cram",
        title: "Section-specific cramming",
        body:
          "Use focused packs for formula recall, audit flow memory, and compact downloads before practice blocks.",
        packSlugs: ["aud-quickstart-pack", "far-formula-pack"]
      }
    ],
    featuredPackSlugs: ["aud-quickstart-pack", "far-formula-pack", "cpa-30-day-rescue-pack", "cpa-full-bundle"],
    freeGuideSlug: "cpa-starter-guide"
  }
];

export const studyPacks: StudyPack[] = [
  {
    id: ids.packFree,
    slug: "cpa-free-starter-guide-pack",
    examSlug: "cpa",
    title: "CPA Free Starter Guide",
    subtitle: "A clean first-14-days plan for not wasting your first month.",
    promise: "Know what to study first, what to ignore, and how to start without chaos.",
    description:
      "This companion pack mirrors the free guide inside the study reader so users can preview the product style before they ever pay. It gives the project a no-friction sample product and creates a clean bridge into the premium catalog.",
    packType: "free",
    priceCents: 0,
    badge: "Free",
    estimatedHours: 2,
    difficultyLevel: "Beginner",
    isFeatured: false,
    isActive: true,
    includes: [
      "14-day startup plan",
      "Topic prioritization map",
      "Section selection framework"
    ],
    outcomes: [
      "Build a realistic study pace",
      "Avoid resource sprawl",
      "Choose the right next pack"
    ],
    formatBreakdown: [
      { label: "Lessons", value: "3 lightweight orientation lessons" },
      { label: "Downloads", value: "1 HTML guide for immediate access" },
      { label: "Best for", value: "First-time setup and restart weeks" }
    ],
    whoItsFor: [
      "Candidates beginning CPA prep",
      "People restarting after a long break"
    ],
    whoItsNotFor: [
      "Candidates already deep into full review mode"
    ],
    studyFit:
      "Use this before committing to a section pack so the rest of your prep has an actual sequence.",
    previewNotes: [
      "Everything in this pack is public.",
      "It doubles as the free-guide thank-you experience."
    ],
    faqs: [
      {
        question: "Is this enough to pass by itself?",
        answer: "No. It is designed to improve the start, not replace a full prep plan."
      }
    ],
    relatedPackSlugs: ["aud-quickstart-pack", "cpa-30-day-rescue-pack"],
    modules: [
      {
        id: "33333333-3333-4333-8333-333333333331",
        title: "Start Here",
        description: "A fast orientation module for the first 48 hours.",
        sortOrder: 1,
        lessons: [
          {
            id: "44444444-4444-4444-8444-444444444441",
            slug: "how-to-use-the-guide",
            title: "How to Use the Guide",
            contentMarkdown:
              "## Start with direction\n\nUse this guide to set direction before you stack more material. Focus on the next 14 days, not the next 14 weeks.\n\n- Pick one primary resource stack.\n- Decide your next section.\n- Block your first review window now.",
            summary: "Use the guide to reduce noise before you add more content.",
            lessonType: "reading",
            sortOrder: 1,
            estimatedMinutes: 8,
            isPreview: true
          },
          {
            id: "44444444-4444-4444-8444-444444444442",
            slug: "first-14-days",
            title: "Your First 14 Days",
            contentMarkdown:
              "## The first-two-weeks rule\n\nThe first two weeks should answer three questions: what matters first, what does not, and what cadence you can realistically maintain.\n\n1. Choose your section.\n2. Create four study blocks.\n3. Schedule one recall session every week.",
            lessonType: "planner",
            sortOrder: 2,
            estimatedMinutes: 10,
            isPreview: true
          }
        ]
      },
      {
        id: "33333333-3333-4333-8333-333333333332",
        title: "Pick the Right Track",
        description: "Choose section order based on your situation, not forum folklore.",
        sortOrder: 2,
        lessons: [
          {
            id: "44444444-4444-4444-8444-444444444443",
            slug: "section-selection-framework",
            title: "Section Selection Framework",
            contentMarkdown:
              "## Choose based on momentum and constraints\n\nIf your confidence is low, pick the section where clarity is easiest to rebuild. If your deadline is close, choose the section where your existing base is strongest.",
            lessonType: "checklist",
            sortOrder: 1,
            estimatedMinutes: 7,
            isPreview: true
          }
        ]
      }
    ],
    assets: [
      {
        id: "55555555-5555-4555-8555-555555555551",
        title: "Starter guide web edition",
        fileType: "html",
        href: "/guides/cpa-starter-guide.html",
        description: "Instant-access guide for the thank-you page and email delivery.",
        isPreview: true
      }
    ]
  },
  {
    id: ids.packAud,
    slug: "aud-quickstart-pack",
    examSlug: "cpa",
    sectionSlug: "aud",
    title: "AUD Quickstart Pack",
    subtitle: "The leanest credible way to get your AUD system in place.",
    promise: "Reduce uncertainty fast and start AUD with a sequence that actually sticks.",
    description:
      "A section starter for candidates who need a high-trust starting point with summaries, audit flow checklists, and memory-first drills. It is built to complement a question bank, not overwhelm one.",
    packType: "one_time",
    priceCents: 7900,
    stripePriceId: "price_aud_quickstart",
    badge: "Best for first-time takers",
    estimatedHours: 8,
    difficultyLevel: "Core",
    isFeatured: true,
    isActive: true,
    includes: [
      "Audit opinions cheat sheet",
      "Control testing workflow",
      "7-day warm-up study plan",
      "Rapid recall prompts"
    ],
    outcomes: [
      "Reduce uncertainty about what matters",
      "Study with tighter feedback loops",
      "Build confidence before full review"
    ],
    formatBreakdown: [
      { label: "Lessons", value: "5 focused lessons across 2 modules" },
      { label: "Downloads", value: "2 cheat sheets and worksheets" },
      { label: "Time to complete", value: "About 8 hours" }
    ],
    whoItsFor: [
      "Candidates starting AUD",
      "People overwhelmed by bloated prep libraries"
    ],
    whoItsNotFor: [
      "Candidates only looking for a giant MCQ bank"
    ],
    studyFit:
      "Best used before or alongside the first wave of multiple-choice practice, not after burnout has already set in.",
    previewNotes: [
      "The engagement flow lesson is public.",
      "A preview worksheet download is available before purchase."
    ],
    faqs: [
      {
        question: "Does it replace a full course?",
        answer:
          "No. It complements a question bank or course by sharpening sequence, recall, and the order of operations."
      },
      {
        question: "Can I preview before buying?",
        answer: "Yes. Key lessons and one download are available as previews on the pack page."
      }
    ],
    relatedPackSlugs: ["far-formula-pack", "cpa-full-bundle"],
    modules: [
      {
        id: "33333333-3333-4333-8333-333333333333",
        title: "Audit Frameworks",
        description: "The core flows you need to remember.",
        sortOrder: 1,
        lessons: [
          {
            id: "44444444-4444-4444-8444-444444444444",
            slug: "engagement-flow",
            title: "Engagement Flow",
            contentMarkdown:
              "## Remember the sequence\n\nAUD gets easier when you remember the engagement as a sequence: accept, plan, test, conclude, report.\n\nMap every question back to one of those five stages and the answer choices become less random.",
            summary: "A memory-first overview of the audit sequence.",
            lessonType: "reading",
            sortOrder: 1,
            estimatedMinutes: 12,
            isPreview: true
          },
          {
            id: "44444444-4444-4444-8444-444444444445",
            slug: "control-testing-checklist",
            title: "Control Testing Checklist",
            contentMarkdown:
              "## Before you start control testing questions\n\nUse this checklist before practice sets so you anchor questions to a real workflow.\n\n- Define the control objective.\n- Determine the procedure.\n- Evaluate evidence quality.\n- Decide whether deviation matters.",
            lessonType: "checklist",
            sortOrder: 2,
            estimatedMinutes: 9,
            isPreview: false
          },
          {
            id: "44444444-4444-4444-8444-444444444446",
            slug: "report-opinions",
            title: "Report Opinions",
            contentMarkdown:
              "## Learn the contrasts, not isolated labels\n\nUnmodified, qualified, adverse, disclaimer. Learn them by what changes in the report and why. Contrast is more durable than pure memorization.",
            lessonType: "memorization",
            sortOrder: 3,
            estimatedMinutes: 10,
            isPreview: false
          }
        ]
      },
      {
        id: "33333333-3333-4333-8333-333333333334",
        title: "Warm-Up Plan",
        description: "A short runway before you scale up practice volume.",
        sortOrder: 2,
        lessons: [
          {
            id: "44444444-4444-4444-8444-444444444447",
            slug: "seven-day-warm-up",
            title: "Seven-Day Warm-Up",
            contentMarkdown:
              "## Build momentum first\n\nYour first week should create a rhythm, not prove endurance. Keep the blocks short, close loops quickly, and review the same day whenever possible.",
            lessonType: "planner",
            sortOrder: 1,
            estimatedMinutes: 11,
            isPreview: false
          },
          {
            id: "44444444-4444-4444-8444-444444444448",
            slug: "rapid-recall-prompts",
            title: "Rapid Recall Prompts",
            contentMarkdown:
              "## Active review cues\n\nUse short prompts to rehearse engagement stages, report changes, and control testing logic before every practice block.",
            lessonType: "practice",
            sortOrder: 2,
            estimatedMinutes: 8,
            isPreview: false
          }
        ]
      }
    ],
    assets: [
      {
        id: "55555555-5555-4555-8555-555555555552",
        title: "AUD opinions cheat sheet",
        fileType: "html",
        href: "/previews/aud-opinions-cheat-sheet.html",
        description: "A compact reference for opinion types and report changes.",
        isPreview: false
      },
      {
        id: "55555555-5555-4555-8555-555555555553",
        title: "Preview worksheet",
        fileType: "html",
        href: "/previews/aud-opinions-cheat-sheet.html",
        description: "Public preview worksheet to verify the pack format before purchase.",
        isPreview: true
      }
    ]
  },
  {
    id: ids.packFar,
    slug: "far-formula-pack",
    examSlug: "cpa",
    sectionSlug: "far",
    title: "FAR Formula Pack",
    subtitle: "Memorize less randomly. Understand more quickly.",
    promise: "Build cleaner FAR recall by tying formulas to statement logic and pattern recognition.",
    description:
      "A formula-first FAR pack with ratio tables, statement mapping, and fast recall prompts built for retention instead of random repetition.",
    packType: "one_time",
    priceCents: 8900,
    stripePriceId: "price_far_formula",
    badge: "Formula heavy",
    estimatedHours: 10,
    difficultyLevel: "Core",
    isFeatured: true,
    isActive: true,
    includes: [
      "Formula sheets",
      "Statement map",
      "High-yield summary tables",
      "Practice prompts"
    ],
    outcomes: [
      "Cut re-learning time",
      "Build cleaner FAR recall",
      "Recognize patterns faster"
    ],
    formatBreakdown: [
      { label: "Lessons", value: "4 lessons across statement logic and drill work" },
      { label: "Downloads", value: "Formula map and summary sheet" },
      { label: "Best for", value: "Candidates who freeze on formulas under pressure" }
    ],
    whoItsFor: [
      "Candidates who forget formulas under pressure",
      "Retakers who need structure before brute-force review"
    ],
    whoItsNotFor: [
      "People looking only for full simulation exams"
    ],
    studyFit:
      "Use this before practice sets or between weak-area review cycles when FAR recall has become fragmented.",
    previewNotes: [
      "The income statement map lesson is public."
    ],
    faqs: [
      {
        question: "Is this only for memorization?",
        answer:
          "No. It uses memory cues to reinforce conceptual understanding and how formulas show up in context."
      }
    ],
    relatedPackSlugs: ["aud-quickstart-pack", "cpa-full-bundle"],
    modules: [
      {
        id: "33333333-3333-4333-8333-333333333335",
        title: "Statement Logic",
        description: "Tie formulas to what the statements are actually telling you.",
        sortOrder: 1,
        lessons: [
          {
            id: "44444444-4444-4444-8444-444444444449",
            slug: "income-statement-map",
            title: "Income Statement Map",
            contentMarkdown:
              "## Put formulas back into context\n\nMap line items to common exam patterns so formulas live in a statement, not in isolation. That means fewer orphaned numbers and faster recall under time pressure.",
            lessonType: "reading",
            sortOrder: 1,
            estimatedMinutes: 12,
            isPreview: true
          },
          {
            id: "44444444-4444-4444-8444-444444444450",
            slug: "ratio-clusters",
            title: "Ratio Clusters",
            contentMarkdown:
              "## Study formulas in families\n\nGroup liquidity, profitability, and leverage formulas together. Your recall improves when you study by contrast and shared variables.",
            lessonType: "memorization",
            sortOrder: 2,
            estimatedMinutes: 9,
            isPreview: false
          }
        ]
      },
      {
        id: "33333333-3333-4333-8333-333333333336",
        title: "Rapid Review",
        description: "Short prompts for higher-frequency rehearsal.",
        sortOrder: 2,
        lessons: [
          {
            id: "44444444-4444-4444-8444-444444444451",
            slug: "formula-recall-prompts",
            title: "Formula Recall Prompts",
            contentMarkdown:
              "## Practice with friction\n\nTurn each formula into a prompt, a relationship, and a warning. The warning is what you confuse it with when stressed.",
            lessonType: "practice",
            sortOrder: 1,
            estimatedMinutes: 10,
            isPreview: false
          },
          {
            id: "44444444-4444-4444-8444-444444444452",
            slug: "review-calendar",
            title: "Review Calendar",
            contentMarkdown:
              "## Keep formulas alive\n\nSchedule three short recall sessions each week instead of one exhausting cram block. Shorter repetition beats occasional panic review.",
            lessonType: "planner",
            sortOrder: 2,
            estimatedMinutes: 8,
            isPreview: false
          }
        ]
      }
    ],
    assets: [
      {
        id: "55555555-5555-4555-8555-555555555554",
        title: "FAR formula map",
        fileType: "html",
        href: "/previews/far-formula-map.html",
        description: "A web-friendly formula map for active review.",
        isPreview: false
      }
    ]
  },
  {
    id: ids.packRescue,
    slug: "cpa-30-day-rescue-pack",
    examSlug: "cpa",
    title: "CPA 30-Day Rescue Pack",
    subtitle: "For candidates who do not need more content. They need a recovery plan.",
    promise: "Reset the plan fast and focus the next month around what can still move the result.",
    description:
      "A focused reset pack for overwhelmed candidates heading into a close test date, including triage frameworks, confidence-reset prompts, and study schedules.",
    packType: "one_time",
    priceCents: 11900,
    stripePriceId: "price_cpa_rescue",
    badge: "Retake rescue",
    estimatedHours: 12,
    difficultyLevel: "Intensive",
    isFeatured: true,
    isActive: true,
    includes: [
      "30-day study planner",
      "Topic triage matrix",
      "Daily checklists",
      "Confidence reset prompts"
    ],
    outcomes: [
      "Recover from drift",
      "Prioritize high-yield work",
      "Stay calm under a deadline"
    ],
    formatBreakdown: [
      { label: "Lessons", value: "4 planning and reset lessons" },
      { label: "Downloads", value: "A 30-day planner and triage worksheet" },
      { label: "Time to complete", value: "12 focused hours across a month" }
    ],
    whoItsFor: [
      "Candidates within 30 to 45 days of exam day",
      "Retakers with low confidence and too many tabs open"
    ],
    whoItsNotFor: [
      "Someone just beginning CPA prep six months early"
    ],
    studyFit:
      "Use this when the schedule is already slipping and you need triage, not more theory.",
    previewNotes: [
      "The triage framework lesson is public."
    ],
    faqs: [
      {
        question: "Will this work for any section?",
        answer:
          "Yes. The planning system is section-agnostic and the examples are tuned for CPA timelines."
      }
    ],
    relatedPackSlugs: ["aud-quickstart-pack", "cpa-full-bundle"],
    modules: [
      {
        id: "33333333-3333-4333-8333-333333333337",
        title: "Reset the Plan",
        description: "Triage first, calendar second.",
        sortOrder: 1,
        lessons: [
          {
            id: "44444444-4444-4444-8444-444444444453",
            slug: "triage-framework",
            title: "Triage Framework",
            contentMarkdown:
              "## Separate must-know from nice-to-know\n\nSplit topics into three columns: must know, nice to know, and ignore for now. Do this before your calendar fills itself with vague intentions.",
            lessonType: "planner",
            sortOrder: 1,
            estimatedMinutes: 11,
            isPreview: true
          },
          {
            id: "44444444-4444-4444-8444-444444444454",
            slug: "calendar-reset",
            title: "Calendar Reset",
            contentMarkdown:
              "## Use constrained blocks\n\nConstrained blocks stop the fantasy schedule problem. Name the block, define the output, and cap it before you start.",
            lessonType: "planner",
            sortOrder: 2,
            estimatedMinutes: 8,
            isPreview: false
          }
        ]
      },
      {
        id: "33333333-3333-4333-8333-333333333338",
        title: "Confidence Reset",
        description: "Reduce drift by making progress visible again.",
        sortOrder: 2,
        lessons: [
          {
            id: "44444444-4444-4444-8444-444444444455",
            slug: "daily-checkpoints",
            title: "Daily Checkpoints",
            contentMarkdown:
              "## Define a successful day\n\nA successful day is not a heroic day. It is a day where the planned block happened and the review loop closed.",
            lessonType: "checklist",
            sortOrder: 1,
            estimatedMinutes: 7,
            isPreview: false
          },
          {
            id: "44444444-4444-4444-8444-444444444456",
            slug: "confidence-prompts",
            title: "Confidence Prompts",
            contentMarkdown:
              "## Replace vague panic with specific prompts\n\nBefore each block, answer three prompts: what matters today, what can wait, and how you will know the block is done.",
            lessonType: "practice",
            sortOrder: 2,
            estimatedMinutes: 9,
            isPreview: false
          }
        ]
      }
    ],
    assets: [
      {
        id: "55555555-5555-4555-8555-555555555555",
        title: "30-day planner",
        fileType: "html",
        href: "/previews/cpa-30-day-plan.html",
        description: "A structured month plan with reset prompts.",
        isPreview: false
      }
    ]
  },
  {
    id: ids.packBundle,
    slug: "cpa-full-bundle",
    examSlug: "cpa",
    title: "CPA Full Bundle",
    subtitle: "The premium library for candidates who want one calm, cohesive system.",
    promise: "Keep one consistent study system across sections instead of rebuilding the stack every month.",
    description:
      "Bundle the starter materials, section packs, recovery planner, and downloadable study assets into one premium library. It is the cleanest entry point for candidates who know they will be in CPA prep for more than one section.",
    packType: "bundle",
    priceCents: 24900,
    stripePriceId: "price_cpa_bundle",
    badge: "Best value",
    estimatedHours: 34,
    difficultyLevel: "All levels",
    isFeatured: true,
    isActive: true,
    includes: [
      "All current CPA packs",
      "Future CPA updates",
      "Planner assets",
      "Premium download library"
    ],
    outcomes: [
      "Keep one consistent study system",
      "Reduce switching costs",
      "Scale across sections"
    ],
    formatBreakdown: [
      { label: "Library", value: "All current CPA packs in one dashboard" },
      { label: "Downloads", value: "A combined library of guides and sheets" },
      { label: "Best for", value: "Candidates planning multiple sections" }
    ],
    whoItsFor: [
      "Candidates planning multiple sections",
      "People who want an all-in-one library"
    ],
    whoItsNotFor: [
      "Someone only needing a single section sprint"
    ],
    studyFit:
      "Best when you want one calm system from startup through retake recovery instead of patching together separate products.",
    previewNotes: [
      "The bundle orientation lesson is public."
    ],
    faqs: [
      {
        question: "Will more sections fit later?",
        answer:
          "Yes. The content model is designed to support more sections and future exam categories without redesign."
      }
    ],
    relatedPackSlugs: ["aud-quickstart-pack", "far-formula-pack", "cpa-30-day-rescue-pack"],
    modules: [
      {
        id: "33333333-3333-4333-8333-333333333339",
        title: "Welcome to the Library",
        description: "How to navigate the full bundle without losing the plot.",
        sortOrder: 1,
        lessons: [
          {
            id: "44444444-4444-4444-8444-444444444457",
            slug: "how-the-library-works",
            title: "How the Library Works",
            contentMarkdown:
              "## Move through the library in phases\n\nStart with setup, then section work, then rapid review. The bundle exists to stop the weekly re-architecture problem.",
            lessonType: "reading",
            sortOrder: 1,
            estimatedMinutes: 10,
            isPreview: true
          },
          {
            id: "44444444-4444-4444-8444-444444444458",
            slug: "recommended-sequence",
            title: "Recommended Sequence",
            contentMarkdown:
              "## Use the right pack at the right time\n\nSequence matters. Do not use the rescue planner as your first move unless your exam date is already close.",
            lessonType: "planner",
            sortOrder: 2,
            estimatedMinutes: 8,
            isPreview: false
          }
        ]
      }
    ],
    assets: [
      {
        id: "55555555-5555-4555-8555-555555555556",
        title: "Bundle orientation sheet",
        fileType: "html",
        href: "/previews/bundle-orientation.html",
        description: "A map of how the bundle fits together.",
        isPreview: true
      }
    ]
  }
];

export const freeGuides: FreeGuide[] = [
  {
    id: ids.guideCpa,
    slug: "cpa-starter-guide",
    examSlug: "cpa",
    title: "Free CPA Starter Guide",
    subtitle: "What to study first, what to ignore, and how to structure your first 14 days.",
    promise: "Start CPA prep with a 14-day plan, then know exactly when AUD Quickstart is the right next move.",
    description:
      "A polished free guide that helps candidates replace vague CPA anxiety with a first two-week plan and a clear bridge into the first paid AUD offer.",
    bullets: [
      "14-day startup plan",
      "High-yield topic map",
      "Common mistakes that waste the first month",
      "A concrete decision rule for moving into AUD Quickstart"
    ],
    previewCards: [
      "Day 1 setup checklist",
      "Section selection framework",
      "14-day startup calendar"
    ],
    deliveryMode: "both",
    filePath: "/guides/cpa-starter-guide.html",
    ctaAfterSubmit: "Continue into AUD Quickstart when you are ready for paid section work.",
    relatedPackSlug: "aud-quickstart-pack",
    privacyReassurance:
      "We store only what we need to deliver the guide, understand intent, and improve relevance. No marketplace chaos and no resold lead lists.",
    whatHappensNext: [
      "We store the lead server-side in Supabase and dedupe by email plus guide.",
      "The guide is available immediately on the thank-you page and sent by email.",
      "The page points candidates toward AUD Quickstart as the first paid offer."
    ],
    thankYouTitle: "Your guide is ready",
    thankYouBody:
      "Open the guide below, then use AUD Quickstart to move from setup into actual section work.",
    isActive: true
  }
];

export const promoBanners: PromoBanner[] = [
  {
    id: "88888888-8888-4888-8888-888888888881",
    title: "CPA launch week offer",
    body: "Claim the free starter guide, then use code CPA10 on the full bundle while launch pricing is live.",
    ctaLabel: "See bundle",
    ctaHref: "/packs/cpa-full-bundle",
    theme: "accent",
    isActive: true,
    sortOrder: 1
  }
];

export const couponCampaigns: CouponCampaign[] = [
  {
    id: "99999999-9999-4999-8999-999999999991",
    name: "CPA launch",
    code: "CPA10",
    stripePromotionCodeId: "promo_cpa10",
    active: true
  }
];

export const demoProfile: UserProfile = {
  id: "77777777-7777-4777-8777-777777777771",
  email: "jordan@example.com",
  fullName: "Jordan",
  role: "admin"
};

export const demoOwnedPackIds = [ids.packAud, ids.packRescue, ids.packBundle];

export const demoCompletedLessonIds = [
  "44444444-4444-4444-8444-444444444444",
  "44444444-4444-4444-8444-444444444445",
  "44444444-4444-4444-8444-444444444453"
];

export const demoLeadRecords: LeadCaptureRecord[] = [
  {
    email: "jordan@example.com",
    fullName: "Jordan",
    guideTitle: "Free CPA Starter Guide",
    source: "free-guide-page",
    examName: "CPA",
    sectionName: "AUD",
    marketingOptIn: true,
    capturedAt: "2026-03-28T14:20:00.000Z"
  },
  {
    email: "morgan@example.com",
    fullName: "Morgan",
    guideTitle: "Free CPA Starter Guide",
    source: "blog-resource",
    examName: "CPA",
    sectionName: "FAR",
    marketingOptIn: false,
    capturedAt: "2026-03-29T09:45:00.000Z"
  },
  {
    email: "casey@example.com",
    fullName: "Casey",
    guideTitle: "Free CPA Starter Guide",
    source: "retake-rescue-landing",
    examName: "CPA",
    sectionName: undefined,
    marketingOptIn: true,
    capturedAt: "2026-03-30T18:05:00.000Z"
  }
];

export const demoPurchaseRecords: PurchaseRecord[] = [
  {
    email: "jordan@example.com",
    packTitle: "AUD Quickstart Pack",
    amountCents: 7900,
    status: "paid",
    entitlementStatus: "active",
    purchasedAt: "2026-03-28T15:02:00.000Z"
  },
  {
    email: "morgan@example.com",
    packTitle: "CPA 30-Day Rescue Pack",
    amountCents: 11900,
    status: "paid",
    entitlementStatus: "pending_claim",
    purchasedAt: "2026-03-29T11:12:00.000Z"
  },
  {
    email: "casey@example.com",
    packTitle: "CPA Full Bundle",
    amountCents: 24900,
    status: "pending",
    entitlementStatus: "pending_claim",
    purchasedAt: "2026-03-30T20:22:00.000Z"
  }
];

export function getExamBySlug(slug: string) {
  return exams.find((exam) => exam.slug === slug);
}

export function getPackBySlug(slug: string) {
  return studyPacks.find((pack) => pack.slug === slug);
}

export function getGuideBySlug(slug: string) {
  return freeGuides.find((guide) => guide.slug === slug);
}

export function getActivePromoBanner() {
  return promoBanners
    .filter((banner) => banner.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)[0];
}

export function getPacksForExam(examSlug: string) {
  return studyPacks.filter((pack) => pack.examSlug === examSlug && pack.isActive);
}

export function getSeedAdminOverview(): AdminOverviewData {
  return {
    mode: "demo",
    metrics: [
      { label: "Active exams", value: String(exams.length), caption: "Schema already supports future verticals." },
      { label: "Live packs", value: String(studyPacks.filter((pack) => pack.isActive).length), caption: "One free, three premium, one bundle." },
      { label: "Leads this week", value: String(demoLeadRecords.length), caption: "Stored server-side in the production path." },
      { label: "Purchases", value: String(demoPurchaseRecords.length), caption: "Webhook fulfillment remains the source of truth." }
    ],
    exams,
    packs: studyPacks,
    leads: demoLeadRecords,
    purchases: demoPurchaseRecords
  };
}
