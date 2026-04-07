import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { recordPendingPurchase } from "@/lib/commerce";
import { checkoutSchema } from "@/lib/validation/schemas";
import { absoluteUrl } from "@/lib/env";
import { getPackBySlug } from "@/lib/content/repository";
import { getStripe } from "@/lib/payments/stripe";

async function parseBody(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
}

export async function POST(request: Request) {
  const body = await parseBody(request);
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid checkout request." }, { status: 400 });
  }

  const resolvedPack = await getPackBySlug(parsed.data.packSlug);
  const profile = await getCurrentProfile();

  if (!resolvedPack) {
    return NextResponse.json({ message: "Pack not found." }, { status: 404 });
  }

  const stripe = getStripe();
  const email = parsed.data.email ?? profile?.email;

  if (!stripe || !resolvedPack.priceCents) {
    return NextResponse.redirect(
      new URL(`/checkout/success?demo=1&pack=${resolvedPack.slug}`, absoluteUrl("/")),
      303
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: absoluteUrl("/checkout/success?session_id={CHECKOUT_SESSION_ID}"),
    cancel_url: absoluteUrl("/checkout/canceled"),
    customer_email: email,
    client_reference_id: profile?.id,
    line_items: resolvedPack.stripePriceId
      ? [
          {
            price: resolvedPack.stripePriceId,
            quantity: 1
          }
        ]
      : [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: resolvedPack.title,
                description: resolvedPack.subtitle,
                metadata: {
                  packSlug: resolvedPack.slug
                }
              },
              unit_amount: resolvedPack.priceCents
            },
            quantity: 1
          }
        ],
    metadata: {
      packId: resolvedPack.id,
      packSlug: resolvedPack.slug,
      email: email ?? "",
      userId: profile?.id ?? ""
    }
  });

  await recordPendingPurchase({
    sessionId: session.id,
    packId: resolvedPack.id,
    email,
    userId: profile?.id,
    amountCents: resolvedPack.priceCents,
    currency: "usd"
  });

  return NextResponse.redirect(session.url ?? absoluteUrl("/checkout/canceled"), 303);
}
