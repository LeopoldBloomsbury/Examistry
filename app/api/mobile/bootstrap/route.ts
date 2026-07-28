import { NextResponse } from "next/server";
import { getMobileCatalog, getOwnedPackIdsForMobile } from "@/lib/mobile/catalog";
import { getMobileSession } from "@/lib/mobile/session";

export async function GET(request: Request) {
  const session = await getMobileSession(request);
  const ownedPackIds = await getOwnedPackIdsForMobile(session);
  const catalog = await getMobileCatalog(ownedPackIds);

  return NextResponse.json({
    ...catalog,
    viewer: session
      ? {
          id: session.profile.id,
          email: session.profile.email,
          fullName: session.profile.fullName
        }
      : null,
    entitlements: Array.from(ownedPackIds).map((packId) => ({
      packId,
      status: "active"
    })),
    offlineRevalidation: {
      requiredEveryHours: 72,
      checkedAt: new Date().toISOString()
    }
  });
}
