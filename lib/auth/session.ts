import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/types";

export async function getCurrentUser() {
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: profile?.email ?? user.email ?? "",
    fullName:
      profile?.full_name ??
      (typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : ""),
    role: (profile?.role as UserProfile["role"] | null) ?? "user"
  };
}
