import { createClient } from "@supabase/supabase-js";
import { serverEnv } from "@/lib/env";
import type { UserProfile } from "@/types";

function bearerToken(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

export async function getMobileSession(request: Request) {
  const token = bearerToken(request);

  if (!token || !serverEnv.supabaseUrl || !serverEnv.supabaseAnonKey) {
    return null;
  }

  const supabase = createClient(serverEnv.supabaseUrl, serverEnv.supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });

  const {
    data: { user },
    error
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  return {
    supabase,
    profile: {
      id: user.id,
      email: profile?.email ?? user.email ?? "",
      fullName:
        profile?.full_name ??
        (typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : ""),
      role: (profile?.role as UserProfile["role"] | null) ?? "user"
    }
  };
}
