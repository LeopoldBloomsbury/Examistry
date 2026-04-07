import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  lessonId: z.string().uuid(),
  completed: z.boolean()
});

export async function POST(request: Request) {
  const profile = await getCurrentProfile();

  if (!profile) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  const supabase = await createClient();

  if (!supabase) {
    return NextResponse.json({ message: "Supabase is not configured." }, { status: 503 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid progress payload." }, { status: 400 });
  }

  const { error } = await supabase.from("lesson_progress").upsert(
    {
      user_id: profile.id,
      lesson_id: parsed.data.lessonId,
      completed: parsed.data.completed,
      completed_at: parsed.data.completed ? new Date().toISOString() : null
    },
    {
      onConflict: "user_id,lesson_id"
    }
  );

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  revalidatePath("/dashboard");
  revalidatePath("/my-packs");

  return NextResponse.json({ ok: true });
}
