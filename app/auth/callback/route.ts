import { NextResponse } from "next/server";
import { reconcilePendingEntitlements } from "@/lib/commerce";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";
  const supabase = await createClient();

  if (code && supabase) {
    await supabase.auth.exchangeCodeForSession(code);

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user?.email) {
      await reconcilePendingEntitlements({
        id: user.id,
        email: user.email,
        fullName:
          typeof user.user_metadata?.full_name === "string"
            ? user.user_metadata.full_name
            : "",
        role: "user"
      });
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
