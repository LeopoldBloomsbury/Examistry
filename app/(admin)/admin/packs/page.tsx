import { AdminPackCrud } from "@/components/admin/catalog-crud";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  couponCampaigns as demoCoupons,
  getAdminOverviewData,
  getContentIndex,
  promoBanners as demoBanners
} from "@/lib/content/repository";
import { integrations } from "@/lib/env";
import type { CouponCampaign, PromoBanner } from "@/types";

export default async function AdminPacksPage() {
  const [data, content] = await Promise.all([getAdminOverviewData(), getContentIndex()]);
  const writable = data.mode === "authenticated" && integrations.supabaseAdmin;

  let coupons: CouponCampaign[] = demoCoupons;
  let banners: PromoBanner[] = demoBanners;

  if (writable) {
    const admin = createAdminClient();

    if (admin) {
      const [couponResult, bannerResult] = await Promise.all([
        admin.from("coupon_campaigns").select("*").order("created_at", { ascending: false }),
        admin.from("promo_banners").select("*").order("sort_order")
      ]);

      if (!couponResult.error && couponResult.data) {
        coupons = couponResult.data.map((row) => ({
          id: row.id as string,
          name: row.name as string,
          code: row.code as string,
          stripePromotionCodeId: (row.stripe_promotion_code_id as string | null) ?? undefined,
          active: Boolean(row.active)
        }));
      }

      if (!bannerResult.error && bannerResult.data) {
        banners = bannerResult.data.map((row) => ({
          id: row.id as string,
          title: row.title as string,
          body: row.body as string,
          ctaLabel: (row.cta_label as string | null) ?? undefined,
          ctaHref: (row.cta_href as string | null) ?? undefined,
          theme: row.theme as PromoBanner["theme"],
          isActive: Boolean(row.is_active),
          sortOrder: Number(row.sort_order)
        }));
      }
    }
  }

  return (
    <AdminPackCrud
      exams={content.exams}
      packs={content.packs}
      guides={content.guides}
      coupons={coupons}
      banners={banners}
      writable={writable}
    />
  );
}
