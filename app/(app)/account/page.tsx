import { getCurrentProfile } from "@/lib/auth/session";
import { integrations } from "@/lib/env";
import { Badge, Button, Card, SectionHeading } from "@/components/shared/ui";

export default async function AccountPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <SectionHeading
          eyebrow="Account"
          title={profile?.fullName || profile?.email || "Demo account"}
          description="Supabase Auth handles the session. Profiles, purchases, and entitlements are linked after sign-in using the same email."
        />
        <div className="mt-6 space-y-4 text-sm text-zinc-600">
          <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
            <span>Email</span>
            <span>{profile?.email ?? "jordan@example.com"}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
            <span>Role</span>
            <Badge variant="subtle">{profile?.role ?? "demo-admin"}</Badge>
          </div>
        </div>
        {profile ? (
          <Button asChild className="mt-6" variant="secondary">
            <a href="/auth/sign-out">Sign out</a>
          </Button>
        ) : null}
      </Card>
      <Card>
        <SectionHeading
          eyebrow="Billing"
          title="Stripe-ready billing entry point"
          description="Stripe Checkout is active in v1. Customer Portal can be added later if subscriptions or self-serve billing changes are introduced."
        />
        <div className="mt-6 space-y-4">
          {[
            ["Stripe secret", integrations.stripe ? "Configured" : "Missing"],
            ["Webhook secret", integrations.stripeWebhooks ? "Configured" : "Missing"],
            ["Resend", integrations.resend ? "Configured" : "Missing"]
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
              <span>{label}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
