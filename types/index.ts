export type Role = "user" | "admin";
export type ViewerMode = "demo" | "authenticated";
export type PackType = "free" | "one_time" | "bundle";
export type LessonType =
  | "reading"
  | "checklist"
  | "memorization"
  | "practice"
  | "planner";
export type DeliveryMode = "download" | "email" | "both";
export type PurchaseStatus = "pending" | "paid" | "failed" | "refunded";
export type EntitlementStatus = "active" | "revoked" | "pending_claim";
export type PromoBannerTheme = "neutral" | "accent";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Metric {
  label: string;
  value: string;
  caption?: string;
}

export interface DetailItem {
  label: string;
  value: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  outcome: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTimeMinutes: number;
  publishedAt: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
  theme: PromoBannerTheme;
  isActive: boolean;
  sortOrder: number;
}

export interface CouponCampaign {
  id: string;
  name: string;
  code: string;
  stripePromotionCodeId?: string;
  active: boolean;
}

export interface ExamSection {
  id: string;
  slug: string;
  name: string;
  description?: string;
  sortOrder: number;
}

export interface ExamUseCase {
  id: string;
  title: string;
  body: string;
  packSlugs: string[];
}

export interface PackLesson {
  id: string;
  slug: string;
  title: string;
  contentMarkdown: string;
  summary?: string;
  lessonType: LessonType;
  sortOrder: number;
  estimatedMinutes?: number;
  isPreview: boolean;
}

export interface PackModule {
  id: string;
  title: string;
  description?: string;
  sortOrder: number;
  lessons: PackLesson[];
}

export interface DownloadableAsset {
  id: string;
  title: string;
  fileType: string;
  href: string;
  lessonId?: string;
  description?: string;
  isPreview: boolean;
}

export interface StudyPack {
  id: string;
  slug: string;
  examSlug: string;
  sectionSlug?: string;
  title: string;
  subtitle: string;
  promise: string;
  description: string;
  packType: PackType;
  priceCents: number;
  stripePriceId?: string;
  badge?: string;
  estimatedHours?: number;
  difficultyLevel?: string;
  isFeatured: boolean;
  isActive: boolean;
  coverImageUrl?: string;
  includes: string[];
  outcomes: string[];
  formatBreakdown: DetailItem[];
  whoItsFor: string[];
  whoItsNotFor: string[];
  studyFit: string;
  previewNotes: string[];
  faqs: FaqItem[];
  relatedPackSlugs: string[];
  modules: PackModule[];
  assets: DownloadableAsset[];
}

export interface FreeGuide {
  id: string;
  slug: string;
  examSlug: string;
  sectionSlug?: string;
  title: string;
  subtitle: string;
  promise: string;
  description: string;
  bullets: string[];
  previewCards: string[];
  deliveryMode: DeliveryMode;
  filePath?: string;
  ctaAfterSubmit?: string;
  relatedPackSlug?: string;
  privacyReassurance: string;
  whatHappensNext: string[];
  thankYouTitle: string;
  thankYouBody: string;
  isActive: boolean;
}

export interface Exam {
  id: string;
  slug: string;
  name: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
  heroTitle: string;
  heroBody: string;
  heroHighlights: string[];
  methodologyPoints: string[];
  trustPoints: string[];
  sections: ExamSection[];
  useCases: ExamUseCase[];
  featuredPackSlugs: string[];
  freeGuideSlug: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: Role;
}

export interface OwnedPack {
  pack: StudyPack;
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  lastLessonSlug?: string;
  lastLessonTitle?: string;
}

export interface DashboardDownload {
  asset: DownloadableAsset;
  pack: StudyPack;
}

export interface RecentLesson {
  packSlug: string;
  packTitle: string;
  lessonSlug: string;
  lessonTitle: string;
}

export interface DashboardData {
  mode: ViewerMode;
  viewerName: string;
  stats: Metric[];
  ownedPacks: OwnedPack[];
  continuePack?: OwnedPack;
  recentLessons: RecentLesson[];
  downloads: DashboardDownload[];
  studyPlan: string[];
  recommendation?: StudyPack;
}

export interface LeadCaptureRecord {
  email: string;
  fullName?: string;
  guideTitle: string;
  source: string;
  examName: string;
  sectionName?: string;
  marketingOptIn: boolean;
  capturedAt: string;
}

export interface PurchaseRecord {
  email: string;
  packTitle: string;
  amountCents: number;
  status: PurchaseStatus;
  entitlementStatus: EntitlementStatus;
  purchasedAt: string;
}

export interface AdminOverviewData {
  mode: ViewerMode;
  metrics: Metric[];
  exams: Exam[];
  packs: StudyPack[];
  leads: LeadCaptureRecord[];
  purchases: PurchaseRecord[];
}
