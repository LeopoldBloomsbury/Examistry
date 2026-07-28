import * as SQLite from "expo-sqlite";
import { catalogVersion, demoAssets, demoLessons, demoModules, demoPacks } from "../data/demoCatalog";
import type {
  MobileAsset,
  MobileLesson,
  MobileModule,
  MobilePack,
  PackDetail,
  PackSummary,
  SyncOperation,
  SyncQueueItem,
  MobileAuthSession,
  ServerCatalogBundle
} from "../types";

const databaseName = "examistry-offline.db";

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

function nowIso() {
  return new Date().toISOString();
}

function boolValue(value: unknown) {
  return value === 1 || value === true;
}

function intValue(value: boolean) {
  return value ? 1 : 0;
}

function createQueueId(operation: SyncOperation, recordId: string) {
  return `${operation}:${recordId}:${Date.now()}`;
}

async function getDatabase() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(databaseName);
  }

  return databasePromise;
}

async function migrate(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS packs (
      id TEXT PRIMARY KEY NOT NULL,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      description TEXT NOT NULL,
      pack_type TEXT NOT NULL,
      badge TEXT NOT NULL,
      estimated_hours INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS modules (
      id TEXT PRIMARY KEY NOT NULL,
      pack_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      sort_order INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY NOT NULL,
      module_id TEXT NOT NULL,
      pack_id TEXT NOT NULL,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      content_markdown TEXT NOT NULL,
      lesson_type TEXT NOT NULL,
      sort_order INTEGER NOT NULL,
      estimated_minutes INTEGER NOT NULL,
      is_preview INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY NOT NULL,
      pack_id TEXT NOT NULL,
      title TEXT NOT NULL,
      file_type TEXT NOT NULL,
      href TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS downloaded_packs (
      pack_id TEXT PRIMARY KEY NOT NULL,
      downloaded_at TEXT NOT NULL,
      content_version TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lesson_progress (
      lesson_id TEXT PRIMARY KEY NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS saved_lessons (
      lesson_id TEXT PRIMARY KEY NOT NULL,
      saved_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sync_queue (
      id TEXT PRIMARY KEY NOT NULL,
      operation TEXT NOT NULL,
      record_id TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL,
      synced_at TEXT
    );

    CREATE INDEX IF NOT EXISTS lessons_pack_id_idx ON lessons (pack_id, sort_order);
    CREATE INDEX IF NOT EXISTS modules_pack_id_idx ON modules (pack_id, sort_order);
    CREATE INDEX IF NOT EXISTS assets_pack_id_idx ON assets (pack_id);
    CREATE INDEX IF NOT EXISTS sync_queue_status_idx ON sync_queue (status, created_at);
  `);
}

async function seedIfNeeded(db: SQLite.SQLiteDatabase) {
  const current = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM app_meta WHERE key = ?",
    "catalog_version"
  );

  if (current?.value === catalogVersion) {
    return;
  }

  for (const pack of demoPacks) {
    await db.runAsync(
      `INSERT OR REPLACE INTO packs
        (id, slug, title, subtitle, description, pack_type, badge, estimated_hours)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      pack.id,
      pack.slug,
      pack.title,
      pack.subtitle,
      pack.description,
      pack.packType,
      pack.badge,
      pack.estimatedHours
    );
  }

  for (const module of demoModules) {
    await db.runAsync(
      `INSERT OR REPLACE INTO modules
        (id, pack_id, title, description, sort_order)
        VALUES (?, ?, ?, ?, ?)`,
      module.id,
      module.packId,
      module.title,
      module.description,
      module.sortOrder
    );
  }

  for (const lesson of demoLessons) {
    await db.runAsync(
      `INSERT OR REPLACE INTO lessons
        (id, module_id, pack_id, slug, title, summary, content_markdown, lesson_type, sort_order, estimated_minutes, is_preview)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      lesson.id,
      lesson.moduleId,
      lesson.packId,
      lesson.slug,
      lesson.title,
      lesson.summary,
      lesson.contentMarkdown,
      lesson.lessonType,
      lesson.sortOrder,
      lesson.estimatedMinutes,
      intValue(lesson.isPreview)
    );
  }

  for (const asset of demoAssets) {
    await db.runAsync(
      `INSERT OR REPLACE INTO assets
        (id, pack_id, title, file_type, href, description)
        VALUES (?, ?, ?, ?, ?, ?)`,
      asset.id,
      asset.packId,
      asset.title,
      asset.fileType,
      asset.href,
      asset.description
    );
  }

  await db.runAsync(
    "INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)",
    "catalog_version",
    catalogVersion
  );

  const freePack = demoPacks.find((pack) => pack.packType === "free");
  if (freePack) {
    await db.runAsync(
      `INSERT OR IGNORE INTO downloaded_packs
        (pack_id, downloaded_at, content_version)
        VALUES (?, ?, ?)`,
      freePack.id,
      nowIso(),
      catalogVersion
    );
  }
}

function packFromRow(row: Record<string, unknown>): MobilePack {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    subtitle: String(row.subtitle),
    description: String(row.description),
    packType: row.pack_type as MobilePack["packType"],
    badge: String(row.badge),
    estimatedHours: Number(row.estimated_hours),
    downloadedAt: typeof row.downloaded_at === "string" ? row.downloaded_at : undefined
  };
}

function lessonFromRow(row: Record<string, unknown>): MobileLesson {
  return {
    id: String(row.id),
    moduleId: String(row.module_id),
    packId: String(row.pack_id),
    slug: String(row.slug),
    title: String(row.title),
    summary: String(row.summary),
    contentMarkdown: String(row.content_markdown),
    lessonType: row.lesson_type as MobileLesson["lessonType"],
    sortOrder: Number(row.sort_order),
    estimatedMinutes: Number(row.estimated_minutes),
    isPreview: boolValue(row.is_preview),
    completed: boolValue(row.completed),
    saved: boolValue(row.saved)
  };
}

function moduleFromRow(row: Record<string, unknown>): MobileModule {
  return {
    id: String(row.id),
    packId: String(row.pack_id),
    title: String(row.title),
    description: String(row.description),
    sortOrder: Number(row.sort_order)
  };
}

function assetFromRow(row: Record<string, unknown>): MobileAsset {
  return {
    id: String(row.id),
    packId: String(row.pack_id),
    title: String(row.title),
    fileType: String(row.file_type),
    href: String(row.href),
    description: String(row.description),
    availableOffline: boolValue(row.available_offline)
  };
}

export async function initializeOfflineStore() {
  const db = await getDatabase();
  await migrate(db);
  await seedIfNeeded(db);
}

export async function importCatalogBundle(bundle: ServerCatalogBundle) {
  const db = await getDatabase();

  for (const pack of bundle.packs) {
    await db.runAsync(
      `INSERT OR REPLACE INTO packs
        (id, slug, title, subtitle, description, pack_type, badge, estimated_hours)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      pack.id,
      pack.slug,
      pack.title,
      pack.subtitle,
      pack.description,
      pack.packType,
      pack.badge,
      pack.estimatedHours
    );

    for (const module of pack.modules) {
      await db.runAsync(
        `INSERT OR REPLACE INTO modules
          (id, pack_id, title, description, sort_order)
          VALUES (?, ?, ?, ?, ?)`,
        module.id,
        pack.id,
        module.title,
        module.description,
        module.sortOrder
      );

      for (const lesson of module.lessons) {
        await db.runAsync(
          `INSERT OR REPLACE INTO lessons
            (id, module_id, pack_id, slug, title, summary, content_markdown, lesson_type, sort_order, estimated_minutes, is_preview)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          lesson.id,
          module.id,
          pack.id,
          lesson.slug,
          lesson.title,
          lesson.summary,
          lesson.contentMarkdown,
          lesson.lessonType,
          lesson.sortOrder,
          lesson.estimatedMinutes,
          intValue(lesson.isPreview)
        );
      }
    }

    for (const asset of pack.assets) {
      await db.runAsync(
        `INSERT OR REPLACE INTO assets
          (id, pack_id, title, file_type, href, description)
          VALUES (?, ?, ?, ?, ?, ?)`,
        asset.id,
        pack.id,
        asset.title,
        asset.fileType,
        asset.href,
        asset.description
      );
    }
  }

  await db.runAsync(
    "INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)",
    "catalog_version",
    bundle.contentVersion
  );
}

export async function setMobileAuthSession(session: MobileAuthSession | null) {
  const db = await getDatabase();

  if (!session) {
    await db.runAsync("DELETE FROM app_meta WHERE key = ?", "mobile_auth_session");
    return;
  }

  await db.runAsync(
    "INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)",
    "mobile_auth_session",
    JSON.stringify(session)
  );
}

export async function getMobileAuthSession(): Promise<MobileAuthSession | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM app_meta WHERE key = ?",
    "mobile_auth_session"
  );

  if (!row?.value) {
    return null;
  }

  try {
    return JSON.parse(row.value) as MobileAuthSession;
  } catch {
    return null;
  }
}

export async function listPackSummaries(): Promise<PackSummary[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Record<string, unknown>>(`
    SELECT
      p.*,
      dp.downloaded_at,
      COUNT(l.id) AS total_lessons,
      COALESCE(SUM(CASE WHEN lp.completed = 1 THEN 1 ELSE 0 END), 0) AS completed_lessons,
      COALESCE(SUM(CASE WHEN sl.lesson_id IS NOT NULL THEN 1 ELSE 0 END), 0) AS saved_lessons
    FROM packs p
    LEFT JOIN downloaded_packs dp ON dp.pack_id = p.id
    LEFT JOIN lessons l ON l.pack_id = p.id
    LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id
    LEFT JOIN saved_lessons sl ON sl.lesson_id = l.id
    GROUP BY p.id, dp.downloaded_at
    ORDER BY CASE WHEN dp.downloaded_at IS NULL THEN 1 ELSE 0 END, p.title
  `);

  return rows.map((row: Record<string, unknown>) => {
    const totalLessons = Number(row.total_lessons);
    const completedLessons = Number(row.completed_lessons);

    return {
      ...packFromRow(row),
      totalLessons,
      completedLessons,
      savedLessons: Number(row.saved_lessons),
      progressPercent: totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0
    };
  });
}

export async function getPackDetail(packId: string): Promise<PackDetail | null> {
  const db = await getDatabase();
  const packRow = await db.getFirstAsync<Record<string, unknown>>(
    `SELECT p.*, dp.downloaded_at
     FROM packs p
     LEFT JOIN downloaded_packs dp ON dp.pack_id = p.id
     WHERE p.id = ?`,
    packId
  );

  if (!packRow) {
    return null;
  }

  const [modules, lessons, assets] = await Promise.all([
    db.getAllAsync<Record<string, unknown>>(
      "SELECT * FROM modules WHERE pack_id = ? ORDER BY sort_order",
      packId
    ),
    db.getAllAsync<Record<string, unknown>>(
      `SELECT
        l.*,
        COALESCE(lp.completed, 0) AS completed,
        CASE WHEN sl.lesson_id IS NULL THEN 0 ELSE 1 END AS saved
       FROM lessons l
       LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id
       LEFT JOIN saved_lessons sl ON sl.lesson_id = l.id
       WHERE l.pack_id = ?
       ORDER BY l.sort_order`,
      packId
    ),
    db.getAllAsync<Record<string, unknown>>(
      `SELECT
        a.*,
        CASE WHEN dp.pack_id IS NULL THEN 0 ELSE 1 END AS available_offline
       FROM assets a
       LEFT JOIN downloaded_packs dp ON dp.pack_id = a.pack_id
       WHERE a.pack_id = ?
       ORDER BY a.title`,
      packId
    )
  ]);

  const parsedLessons = lessons.map(lessonFromRow);
  const totalLessons = parsedLessons.length;
  const completedLessons = parsedLessons.filter((lesson: MobileLesson) => lesson.completed).length;
  const parsedModules = modules.map((moduleRow: Record<string, unknown>) => {
    const module = moduleFromRow(moduleRow);
    return {
      ...module,
      lessons: parsedLessons.filter((lesson: MobileLesson) => lesson.moduleId === module.id)
    };
  });

  return {
    ...packFromRow(packRow),
    totalLessons,
    completedLessons,
    savedLessons: parsedLessons.filter((lesson: MobileLesson) => lesson.saved).length,
    progressPercent: totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0,
    modules: parsedModules,
    assets: assets.map(assetFromRow)
  };
}

export async function getLesson(packId: string, lessonId: string): Promise<MobileLesson | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<Record<string, unknown>>(
    `SELECT
      l.*,
      COALESCE(lp.completed, 0) AS completed,
      CASE WHEN sl.lesson_id IS NULL THEN 0 ELSE 1 END AS saved
     FROM lessons l
     LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id
     LEFT JOIN saved_lessons sl ON sl.lesson_id = l.id
     WHERE l.pack_id = ? AND l.id = ?`,
    packId,
    lessonId
  );

  return row ? lessonFromRow(row) : null;
}

export async function downloadPack(packId: string) {
  const db = await getDatabase();
  const timestamp = nowIso();

  await db.runAsync(
    `INSERT OR REPLACE INTO downloaded_packs
      (pack_id, downloaded_at, content_version)
      VALUES (?, ?, ?)`,
    packId,
    timestamp,
    catalogVersion
  );

  await enqueueMutation("download_pack", packId, {
    packId,
    downloadedAt: timestamp,
    contentVersion: catalogVersion
  });
}

export async function setLessonCompleted(lessonId: string, completed: boolean) {
  const db = await getDatabase();
  const timestamp = nowIso();

  await db.runAsync(
    `INSERT OR REPLACE INTO lesson_progress
      (lesson_id, completed, completed_at, updated_at)
      VALUES (?, ?, ?, ?)`,
    lessonId,
    intValue(completed),
    completed ? timestamp : null,
    timestamp
  );

  await enqueueMutation("lesson_progress", lessonId, {
    lessonId,
    completed,
    completedAt: completed ? timestamp : null,
    updatedAt: timestamp
  });
}

export async function setLessonSaved(lessonId: string, saved: boolean) {
  const db = await getDatabase();
  const timestamp = nowIso();

  if (saved) {
    await db.runAsync(
      "INSERT OR REPLACE INTO saved_lessons (lesson_id, saved_at) VALUES (?, ?)",
      lessonId,
      timestamp
    );
  } else {
    await db.runAsync("DELETE FROM saved_lessons WHERE lesson_id = ?", lessonId);
  }

  await enqueueMutation("saved_lesson", lessonId, {
    lessonId,
    saved,
    updatedAt: timestamp
  });
}

export async function enqueueMutation(
  operation: SyncOperation,
  recordId: string,
  payload: Record<string, unknown>
) {
  const db = await getDatabase();

  await db.runAsync(
    `INSERT INTO sync_queue
      (id, operation, record_id, payload_json, status, created_at)
      VALUES (?, ?, ?, ?, 'pending', ?)`,
    createQueueId(operation, recordId),
    operation,
    recordId,
    JSON.stringify(payload),
    nowIso()
  );
}

export async function listPendingSyncItems(): Promise<SyncQueueItem[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    "SELECT * FROM sync_queue WHERE status = 'pending' ORDER BY created_at"
  );

  return rows.map((row: Record<string, unknown>) => ({
    id: String(row.id),
    operation: row.operation as SyncOperation,
    recordId: String(row.record_id),
    payloadJson: String(row.payload_json),
    status: row.status as SyncQueueItem["status"],
    createdAt: String(row.created_at),
    syncedAt: typeof row.synced_at === "string" ? row.synced_at : undefined
  }));
}

export async function markSyncItemsSynced(ids: string[]) {
  if (!ids.length) {
    return;
  }

  const db = await getDatabase();
  const timestamp = nowIso();

  for (const id of ids) {
    await db.runAsync(
      "UPDATE sync_queue SET status = 'synced', synced_at = ? WHERE id = ?",
      timestamp,
      id
    );
  }
}

export async function markSyncItemsFailed(items: Array<{ id: string; message: string }>) {
  if (!items.length) {
    return;
  }

  const db = await getDatabase();

  for (const item of items) {
    await db.runAsync(
      "UPDATE sync_queue SET status = 'failed', payload_json = json_set(payload_json, '$.syncError', ?) WHERE id = ?",
      item.message,
      item.id
    );
  }
}

export async function getOfflineStats() {
  const db = await getDatabase();
  const row = await db.getFirstAsync<Record<string, unknown>>(`
    SELECT
      (SELECT COUNT(*) FROM downloaded_packs) AS downloaded_packs,
      (SELECT COUNT(*) FROM lessons) AS total_lessons,
      (SELECT COUNT(*) FROM lesson_progress WHERE completed = 1) AS completed_lessons,
      (SELECT COUNT(*) FROM saved_lessons) AS saved_lessons,
      (SELECT COUNT(*) FROM sync_queue WHERE status = 'pending') AS pending_sync
  `);

  return {
    downloadedPacks: Number(row?.downloaded_packs ?? 0),
    totalLessons: Number(row?.total_lessons ?? 0),
    completedLessons: Number(row?.completed_lessons ?? 0),
    savedLessons: Number(row?.saved_lessons ?? 0),
    pendingSync: Number(row?.pending_sync ?? 0)
  };
}
