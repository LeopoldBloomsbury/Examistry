import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { canMutateLesson } from "@/lib/auth/lesson-access";
import { getCurrentProfile } from "@/lib/auth/session";

const schema = z.object({
  lessonId: z.string().uuid(),
  saved: z.boolean()
});

export async function POST(request: Request) {
  const profile = await getCurrentProfile();

  if (!profile) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid saved lesson payload." }, { status: 400 });
  }

  const access = await canMutateLesson(parsed.data.lessonId);

  if (!access.ok) {
    return NextResponse.json({ message: access.message }, { status: access.status });
  }

  if (parsed.data.saved) {
    const { error } = await access.supabase.from("saved_lessons").upsert(
      {
        user_id: profile.id,
        lesson_id: parsed.data.lessonId
      },
      {
        onConflict: "user_id,lesson_id"
      }
    );

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  } else {
    const { error } = await access.supabase
      .from("saved_lessons")
      .delete()
      .eq("user_id", profile.id)
      .eq("lesson_id", parsed.data.lessonId);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/my-packs");

  return NextResponse.json({ ok: true });
}
