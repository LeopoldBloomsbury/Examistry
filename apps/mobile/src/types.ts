export type PackType = "free" | "one_time" | "bundle";
export type LessonType = "reading" | "checklist" | "memorization" | "practice" | "planner";
export type SyncOperation = "lesson_progress" | "saved_lesson" | "download_pack";

export interface MobilePack {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  packType: PackType;
  badge: string;
  estimatedHours: number;
  downloadedAt?: string;
}

export interface MobileModule {
  id: string;
  packId: string;
  title: string;
  description: string;
  sortOrder: number;
}

export interface MobileLesson {
  id: string;
  moduleId: string;
  packId: string;
  slug: string;
  title: string;
  summary: string;
  contentMarkdown: string;
  lessonType: LessonType;
  sortOrder: number;
  estimatedMinutes: number;
  isPreview: boolean;
  completed: boolean;
  saved: boolean;
}

export interface MobileAsset {
  id: string;
  packId: string;
  title: string;
  fileType: string;
  href: string;
  description: string;
  availableOffline: boolean;
}

export interface PackSummary extends MobilePack {
  totalLessons: number;
  completedLessons: number;
  savedLessons: number;
  progressPercent: number;
}

export interface PackDetail extends PackSummary {
  modules: Array<MobileModule & { lessons: MobileLesson[] }>;
  assets: MobileAsset[];
}

export interface SyncQueueItem {
  id: string;
  operation: SyncOperation;
  recordId: string;
  payloadJson: string;
  status: "pending" | "synced" | "failed";
  createdAt: string;
  syncedAt?: string;
}

export interface MobileAuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
}

export interface ServerCatalogBundle {
  contentVersion: string;
  packs: Array<
    MobilePack & {
      modules: Array<MobileModule & { lessons: Omit<MobileLesson, "completed" | "saved">[] }>;
      assets: Omit<MobileAsset, "availableOffline">[];
    }
  >;
}

export type AppScreen =
  | { name: "dashboard" }
  | { name: "library" }
  | { name: "downloads" }
  | { name: "sync" }
  | { name: "pack"; packId: string }
  | { name: "lesson"; packId: string; lessonId: string };
