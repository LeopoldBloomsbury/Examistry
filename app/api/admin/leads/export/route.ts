import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

function csvEscape(value: string | null | undefined) {
  const text = value ?? "";
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET() {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ message: "Admin access required." }, { status: 403 });
  }

  const admin = createAdminClient();

  if (!admin) {
    return NextResponse.json({ message: "Supabase admin client unavailable." }, { status: 503 });
  }

  const { data, error } = await admin
    .from("lead_captures")
    .select("email, full_name, source, utm_source, utm_medium, utm_campaign, referrer, marketing_opt_in, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  const lines = [
    [
      "email",
      "full_name",
      "source",
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "referrer",
      "marketing_opt_in",
      "created_at"
    ].join(","),
    ...(data ?? []).map((row) =>
      [
        csvEscape(row.email as string),
        csvEscape(row.full_name as string | null),
        csvEscape(row.source as string | null),
        csvEscape(row.utm_source as string | null),
        csvEscape(row.utm_medium as string | null),
        csvEscape(row.utm_campaign as string | null),
        csvEscape(row.referrer as string | null),
        csvEscape(String(Boolean(row.marketing_opt_in))),
        csvEscape(row.created_at as string)
      ].join(",")
    )
  ];

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="certkit-leads.csv"'
    }
  });
}
