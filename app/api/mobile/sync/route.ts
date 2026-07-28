import { NextResponse } from "next/server";
import { z } from "zod";
import { integrations } from "@/lib/env";
import { getMobileSession } from "@/lib/mobile/session";

const mutationSchema = z.object({
  id: z.string().min(1),
  operation: z.enum(["lesson_progress", "saved_lesson", "download_pack"]),
  recordId: z.string().min(1),
  payload: z.record(z.unknown()),
  createdAt: z.string().min(1)
});

const syncSchema = z.object({
  client: z.string().min(1),
  mutations: z.array(mutationSchema).max(200)
});

async function canReadLesson(
  session: NonNullable<Awaited<ReturnType<typeof getMobileSession>>>,
  lessonId: string
) {
  const { data } = await session.supabase
    .from("pack_lessons")
    .select("id")
    .eq("id", lessonId)
    .maybeSingle();

  return Boolean(data?.id);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = syncSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid sync payload." }, { status: 400 });
  }

  const session = await getMobileSession(request);

  if (!session && integrations.supabasePublic) {
    return NextResponse.json({ message: "Mobile auth token required." }, { status: 401 });
  }

  if (!session) {
    return NextResponse.json({
      acceptedMutationIds: parsed.data.mutations.map((mutation) => mutation.id),
      rejected: [],
      mode: "demo"
    });
  }

  const acceptedMutationIds: string[] = [];
  const rejected: Array<{ id: string; message: string }> = [];

  for (const mutation of parsed.data.mutations) {
    if (mutation.operation === "download_pack") {
      acceptedMutationIds.push(mutation.id);
      continue;
    }

    const lessonId =
      typeof mutation.payload.lessonId === "string"
        ? mutation.payload.lessonId
        : mutation.recordId;

    if (!(await canReadLesson(session, lessonId))) {
      rejected.push({ id: mutation.id, message: "Lesson access is required." });
      continue;
    }

    if (mutation.operation === "lesson_progress") {
      const completed = Boolean(mutation.payload.completed);
      const timestamp =
        typeof mutation.payload.updatedAt === "string"
          ? mutation.payload.updatedAt
          : new Date().toISOString();
      const { error } = await session.supabase.from("lesson_progress").upsert(
        {
          user_id: session.profile.id,
          lesson_id: lessonId,
          completed,
          completed_at: completed ? timestamp : null
        },
        {
          onConflict: "user_id,lesson_id"
        }
      );

      if (error) {
        rejected.push({ id: mutation.id, message: error.message });
      } else {
        acceptedMutationIds.push(mutation.id);
      }
    }

    if (mutation.operation === "saved_lesson") {
      const saved = Boolean(mutation.payload.saved);
      const result = saved
        ? await session.supabase.from("saved_lessons").upsert(
            {
              user_id: session.profile.id,
              lesson_id: lessonId
            },
            {
              onConflict: "user_id,lesson_id"
            }
          )
        : await session.supabase
            .from("saved_lessons")
            .delete()
            .eq("user_id", session.profile.id)
            .eq("lesson_id", lessonId);

      if (result.error) {
        rejected.push({ id: mutation.id, message: result.error.message });
      } else {
        acceptedMutationIds.push(mutation.id);
      }
    }
  }

  return NextResponse.json({
    acceptedMutationIds,
    rejected,
    mode: "server"
  });
}
