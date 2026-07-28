import * as SQLite from "expo-sqlite";
import { cpaDomains, flashcards, getDomain, practiceQuestions, type CpaDomainId } from "../data/cpaPractice";

const databaseName = "examistry-cpa-practice.db";

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

export interface DomainPerformance {
  domainId: CpaDomainId;
  attempts: number;
  correct: number;
  accuracy: number;
  lastAttemptAt?: string;
}

export interface PracticeSnapshot {
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;
  weakDomainId: CpaDomainId;
  dueCards: number;
  tutorThreads: number;
  domainPerformance: DomainPerformance[];
}

export interface TutorMessage {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
}

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 100000)}`;
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

    CREATE TABLE IF NOT EXISTS practice_attempts (
      id TEXT PRIMARY KEY NOT NULL,
      question_id TEXT NOT NULL,
      domain_id TEXT NOT NULL,
      selected_choice_id TEXT NOT NULL,
      correct INTEGER NOT NULL,
      attempted_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS flashcard_reviews (
      card_id TEXT PRIMARY KEY NOT NULL,
      confidence INTEGER NOT NULL,
      reviewed_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tutor_messages (
      id TEXT PRIMARY KEY NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS practice_attempts_domain_idx ON practice_attempts (domain_id, attempted_at);
    CREATE INDEX IF NOT EXISTS practice_attempts_question_idx ON practice_attempts (question_id, attempted_at);
    CREATE INDEX IF NOT EXISTS tutor_messages_created_idx ON tutor_messages (created_at);
  `);
}

export async function initializePracticeStore() {
  const db = await getDatabase();
  await migrate(db);
}

export async function recordPracticeAttempt(questionId: string, selectedChoiceId: string, correct: boolean) {
  const db = await getDatabase();
  const question = practiceQuestions.find((item) => item.id === questionId);

  if (!question) {
    return;
  }

  await db.runAsync(
    `INSERT INTO practice_attempts
      (id, question_id, domain_id, selected_choice_id, correct, attempted_at)
      VALUES (?, ?, ?, ?, ?, ?)`,
    createId("attempt"),
    questionId,
    question.domainId,
    selectedChoiceId,
    correct ? 1 : 0,
    nowIso()
  );
}

export async function recordFlashcardReview(cardId: string, confidence: number) {
  const db = await getDatabase();

  await db.runAsync(
    `INSERT OR REPLACE INTO flashcard_reviews
      (card_id, confidence, reviewed_at)
      VALUES (?, ?, ?)`,
    cardId,
    Math.max(1, Math.min(3, Math.round(confidence))),
    nowIso()
  );
}

export async function saveTutorMessage(question: string, answer: string) {
  const db = await getDatabase();

  await db.runAsync(
    `INSERT INTO tutor_messages
      (id, question, answer, created_at)
      VALUES (?, ?, ?, ?)`,
    createId("tutor"),
    question.trim(),
    answer.trim(),
    nowIso()
  );
}

export async function listTutorMessages(): Promise<TutorMessage[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    "SELECT * FROM tutor_messages ORDER BY created_at DESC LIMIT 12"
  );

  return rows.map((row) => ({
    id: String(row.id),
    question: String(row.question),
    answer: String(row.answer),
    createdAt: String(row.created_at)
  }));
}

export async function getLatestQuestionAttempt(questionId: string) {
  const db = await getDatabase();
  const row = await db.getFirstAsync<Record<string, unknown>>(
    `SELECT selected_choice_id, correct, attempted_at
     FROM practice_attempts
     WHERE question_id = ?
     ORDER BY attempted_at DESC
     LIMIT 1`,
    questionId
  );

  return row
    ? {
        selectedChoiceId: String(row.selected_choice_id),
        correct: row.correct === 1,
        attemptedAt: String(row.attempted_at)
      }
    : null;
}

export async function getPracticeSnapshot(): Promise<PracticeSnapshot> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Record<string, unknown>>(`
    SELECT
      domain_id,
      COUNT(*) AS attempts,
      COALESCE(SUM(correct), 0) AS correct,
      MAX(attempted_at) AS last_attempt_at
    FROM practice_attempts
    GROUP BY domain_id
  `);
  const cardRows = await db.getAllAsync<Record<string, unknown>>("SELECT card_id, confidence FROM flashcard_reviews");
  const tutorRow = await db.getFirstAsync<Record<string, unknown>>("SELECT COUNT(*) AS count FROM tutor_messages");

  const rowByDomain = new Map(rows.map((row) => [String(row.domain_id), row]));
  const domainPerformance = cpaDomains.map((domain) => {
    const row = rowByDomain.get(domain.id);
    const attempts = row ? Number(row.attempts) : 0;
    const correct = row ? Number(row.correct) : 0;

    return {
      domainId: domain.id,
      attempts,
      correct,
      accuracy: attempts ? Math.round((correct / attempts) * 100) : 0,
      lastAttemptAt: typeof row?.last_attempt_at === "string" ? row.last_attempt_at : undefined
    };
  });
  const totalAttempts = domainPerformance.reduce((sum, item) => sum + item.attempts, 0);
  const correctAttempts = domainPerformance.reduce((sum, item) => sum + item.correct, 0);
  const weakDomain =
    domainPerformance
      .filter((item) => item.attempts > 0)
      .sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts)[0] ?? domainPerformance[1];
  const reviewedCardIds = new Set(cardRows.map((row) => String(row.card_id)));
  const lowConfidenceCards = cardRows.filter((row) => Number(row.confidence) < 3).length;

  return {
    totalAttempts,
    correctAttempts,
    accuracy: totalAttempts ? Math.round((correctAttempts / totalAttempts) * 100) : 0,
    weakDomainId: getDomain(weakDomain.domainId).id,
    dueCards: flashcards.filter((card) => !reviewedCardIds.has(card.id)).length + lowConfidenceCards,
    tutorThreads: tutorRow ? Number(tutorRow.count) : 0,
    domainPerformance
  };
}
