import Stripe from "stripe";
import { getExamBySlug, getGuideBySlug, getPackBySlug } from "@/lib/content/repository";
import { sendGuideDeliveryEmail, sendPendingClaimEmail, sendPurchaseAccessEmail } from "@/lib/email/resend";
import { normalizeEmail } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import type { UserProfile } from "@/types";

type LeadCaptureInput = {
  email: string;
  fullName?: string;
  examDate?: string;
  targetSection?: string;
  marketingOptIn: boolean;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  freeGuideSlug: string;
};

export async function captureLead(input: LeadCaptureInput) {
  const email = normalizeEmail(input.email);
  const guide = await getGuideBySlug(input.freeGuideSlug);

  if (!guide) {
    throw new Error("Guide not found.");
  }

  const admin = createAdminClient();
  const relatedPack = guide.relatedPackSlug ? await getPackBySlug(guide.relatedPackSlug) : null;
  const exam = await getExamBySlug(guide.examSlug);
  const section = exam?.sections.find((item) => item.slug === input.targetSection);

  if (admin) {
    try {
      const existingLead = await admin
        .from("lead_captures")
        .select("id")
        .eq("free_guide_id", guide.id)
        .ilike("email", email)
        .maybeSingle();

      const payload = {
        email,
        full_name: input.fullName ?? null,
        exam_id: exam?.id ?? null,
        section_id: section?.id ?? null,
        free_guide_id: guide.id,
        target_exam_date: input.examDate ?? null,
        source: input.source ?? "free-guide-page",
        utm_source: input.utmSource ?? null,
        utm_medium: input.utmMedium ?? null,
        utm_campaign: input.utmCampaign ?? null,
        referrer: input.referrer ?? null,
        marketing_opt_in: input.marketingOptIn
      };

      if (existingLead.data?.id) {
        await admin.from("lead_captures").update(payload).eq("id", existingLead.data.id);
      } else {
        await admin.from("lead_captures").insert(payload);
      }
    } catch (error) {
      console.error("lead capture write failed", error);
    }
  }

  await sendGuideDeliveryEmail({
    email,
    guide,
    relatedPack: relatedPack ?? undefined
  });

  return {
    guide,
    relatedPack,
    message: "Guide delivered. Check your inbox and open the thank-you page."
  };
}

export async function recordPendingPurchase({
  sessionId,
  packId,
  email,
  userId,
  amountCents,
  currency
}: {
  sessionId: string;
  packId: string;
  email?: string;
  userId?: string;
  amountCents: number;
  currency: string;
}) {
  const admin = createAdminClient();

  if (!admin) {
    return;
  }

  const normalizedEmail = email ? normalizeEmail(email) : undefined;

  const purchaseResult = await admin
    .from("purchases")
    .upsert(
      {
        user_id: userId ?? null,
        email: normalizedEmail ?? "pending@example.com",
        stripe_checkout_session_id: sessionId,
        amount_cents: amountCents,
        currency,
        status: "pending"
      },
      {
        onConflict: "stripe_checkout_session_id"
      }
    )
    .select("id")
    .single();

  if (!purchaseResult.data?.id) {
    return;
  }

  const existingItem = await admin
    .from("purchase_items")
    .select("id")
    .eq("purchase_id", purchaseResult.data.id)
    .eq("study_pack_id", packId)
    .maybeSingle();

  if (!existingItem.data?.id) {
    await admin.from("purchase_items").insert({
      purchase_id: purchaseResult.data.id,
      study_pack_id: packId,
      price_cents: amountCents
    });
  }
}

async function lookupUserIdByEmail(email: string) {
  const admin = createAdminClient();

  if (!admin) {
    return null;
  }

  const { data } = await admin
    .from("profiles")
    .select("id")
    .ilike("email", email)
    .maybeSingle();

  return (data?.id as string | undefined) ?? null;
}

export async function fulfillCheckoutSession(session: Stripe.Checkout.Session) {
  const packSlug = session.metadata?.packSlug;
  const pack = packSlug ? await getPackBySlug(packSlug) : null;
  const admin = createAdminClient();

  if (!pack || !admin) {
    return;
  }

  const email = normalizeEmail(
    session.customer_details?.email ??
      session.customer_email ??
      session.metadata?.email ??
      ""
  );
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;
  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
  const userId =
    session.client_reference_id ??
    session.metadata?.userId ??
    (email ? await lookupUserIdByEmail(email) : null);
  const entitlementStatus = userId ? "active" : "pending_claim";

  if (customerId && email) {
    await admin.from("stripe_customers").upsert(
      {
        user_id: userId ?? null,
        email,
        stripe_customer_id: customerId
      },
      {
        onConflict: "stripe_customer_id"
      }
    );
  }

  const purchaseResult = await admin
    .from("purchases")
    .upsert(
      {
        user_id: userId ?? null,
        email,
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id: paymentIntentId,
        stripe_customer_id: customerId,
        amount_cents: session.amount_total ?? pack.priceCents,
        currency: session.currency ?? "usd",
        status: session.payment_status === "paid" ? "paid" : "pending"
      },
      {
        onConflict: "stripe_checkout_session_id"
      }
    )
    .select("id")
    .single();

  if (!purchaseResult.data?.id) {
    return;
  }

  const existingItem = await admin
    .from("purchase_items")
    .select("id")
    .eq("purchase_id", purchaseResult.data.id)
    .eq("study_pack_id", pack.id)
    .maybeSingle();

  if (!existingItem.data?.id) {
    await admin.from("purchase_items").insert({
      purchase_id: purchaseResult.data.id,
      study_pack_id: pack.id,
      price_cents: session.amount_total ?? pack.priceCents
    });
  }

  await admin.from("entitlements").upsert(
    {
      user_id: userId ?? null,
      email,
      study_pack_id: pack.id,
      purchase_id: purchaseResult.data.id,
      status: entitlementStatus
    },
    {
      onConflict: "email,study_pack_id,purchase_id"
    }
  );

  if (entitlementStatus === "active") {
    await sendPurchaseAccessEmail({ email, pack });
  } else {
    await sendPendingClaimEmail({ email, pack });
  }
}

export async function markPurchaseStatus(
  stripeCheckoutSessionId: string,
  status: "failed" | "refunded"
) {
  const admin = createAdminClient();

  if (!admin) {
    return;
  }

  await admin
    .from("purchases")
    .update({ status })
    .eq("stripe_checkout_session_id", stripeCheckoutSessionId);
}

export async function reconcilePendingEntitlements(profile: UserProfile) {
  const admin = createAdminClient();
  const email = normalizeEmail(profile.email);

  if (!admin) {
    return { entitlements: 0, purchases: 0, customers: 0 };
  }

  const [entitlements, purchases, customers] = await Promise.all([
    admin
      .from("entitlements")
      .update({ user_id: profile.id, status: "active" })
      .ilike("email", email)
      .is("user_id", null)
      .select("id"),
    admin
      .from("purchases")
      .update({ user_id: profile.id })
      .ilike("email", email)
      .is("user_id", null)
      .select("id"),
    admin
      .from("stripe_customers")
      .update({ user_id: profile.id })
      .ilike("email", email)
      .is("user_id", null)
      .select("id")
  ]);

  return {
    entitlements: entitlements.data?.length ?? 0,
    purchases: purchases.data?.length ?? 0,
    customers: customers.data?.length ?? 0
  };
}
