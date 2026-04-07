import Stripe from "stripe";
import { serverEnv } from "@/lib/env";

let stripeClient: Stripe | null = null;

export function getStripe() {
  if (!serverEnv.stripeSecretKey) {
    return null;
  }

  if (!stripeClient) {
    stripeClient = new Stripe(serverEnv.stripeSecretKey, {
      apiVersion: "2025-02-24.acacia"
    });
  }

  return stripeClient;
}
