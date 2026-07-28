import { NextResponse } from "next/server";
import { z } from "zod";
import { getPackBySlug } from "@/lib/content/repository";
import { integrations } from "@/lib/env";
import { mobileCatalogVersion, getOwnedPackIdsForMobile, serializeMobilePack } from "@/lib/mobile/catalog";
import { getMobileSession } from "@/lib/mobile/session";

const querySchema = z.object({
  packSlug: z.string().trim().min(1)
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    packSlug: url.searchParams.get("packSlug")
  });

  if (!parsed.success) {
    return NextResponse.json({ message: "packSlug is required." }, { status: 400 });
  }

  const pack = await getPackBySlug(parsed.data.packSlug);

  if (!pack) {
    return NextResponse.json({ message: "Pack not found." }, { status: 404 });
  }

  const session = await getMobileSession(request);
  const ownedPackIds = await getOwnedPackIdsForMobile(session);
  const canDownload =
    pack.packType === "free" || ownedPackIds.has(pack.id) || !integrations.supabasePublic;

  if (!canDownload) {
    return NextResponse.json({ message: "Active pack entitlement required." }, { status: 403 });
  }

  return NextResponse.json({
    contentVersion: mobileCatalogVersion,
    generatedAt: new Date().toISOString(),
    pack: serializeMobilePack(pack, ownedPackIds),
    files: pack.assets.map((asset) => ({
      id: asset.id,
      title: asset.title,
      href: asset.href,
      fileType: asset.fileType,
      checksum: null
    }))
  });
}
