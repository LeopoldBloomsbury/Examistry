import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { fulfillCheckoutSession, markPurchaseStatus } from "@/lib/commerce";
import { serverEnv } from "@/lib/env";
import { getStripe } from "@/lib/payments/stripe";

export async function POST(request: Request) {
  const stripe = getStripe();

  if (!stripe || !serverEnv.stripeWebhookSecret) {
    return NextResponse.json({
      received: true,
      message: "Webhook handler is disabled until Stripe secrets are configured."
    });
  }

  const payload = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ message: "Missing stripe signature." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      serverEnv.stripeWebhookSecret
    );
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Invalid webhook signature." },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await fulfillCheckoutSession(session);
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    await markPurchaseStatus(session.id, "failed");
  }

  return NextResponse.json({ received: true });
}
