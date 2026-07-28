import { createClient } from "@/lib/supabase/server";

type LessonAccessResult =
  | {
      ok: true;
      supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>;
    }
  | {
      ok: false;
      message: string;
      status: number;
    };

export async function canMutateLesson(lessonId: string): Promise<LessonAccessResult> {
  const supabase = await createClient();

  if (!supabase) {
    return {
      ok: false,
      message: "Supabase is not configured.",
      status: 503
    };
  }

  const { data, error } = await supabase
    .from("pack_lessons")
    .select("id, is_preview")
    .eq("id", lessonId)
    .maybeSingle();

  if (error) {
    return {
      ok: false,
      message: error.message,
      status: 400
    };
  }

  if (!data) {
    return {
      ok: false,
      message: "Lesson access is required.",
      status: 403
    };
  }

  return {
    ok: true,
    supabase
  };
}
