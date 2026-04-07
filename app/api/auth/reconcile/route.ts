import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { reconcilePendingEntitlements } from "@/lib/commerce";

export async function POST() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return NextResponse.json({ message: "No authenticated user." }, { status: 401 });
  }

  const result = await reconcilePendingEntitlements(profile);

  return NextResponse.json({
    message: "Pending access reconciled.",
    ...result
  });
}
