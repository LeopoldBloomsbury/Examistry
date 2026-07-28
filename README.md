# Examistry

Examistry is a premium e-commerce and study-delivery platform for professional exam prep. The first vertical is CPA, but the schema and UI structure support additional exam categories like NCLEX, bar prep, teacher certification, and real estate without major redesign.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Supabase Auth + Postgres + Storage
- Stripe Checkout + webhook fulfillment
- Resend for transactional email
- React Hook Form + Zod

## What is in this build

- Marketing pages for home, CPA landing, pack detail, free guide funnel, pricing, resources, FAQ, about, and legal pages
- Auth screens for magic-link based sign-in and sign-up
- Authenticated app shell with dashboard, packs, downloads, account, and study reader
- Admin shell with CRUD forms for exams, sections, packs, modules, lessons, assets, guides, coupon metadata, and promo banners
- Route handlers for lead capture, checkout, webhook fulfillment, and entitlement reconciliation
- Supabase schema plus a deterministic CPA seed aligned to the app UUIDs
- Static preview documents under `public/` so free-guide and asset links work immediately
- Seed-backed content that can fall back when Supabase is not configured

## Project structure

```text
app/                  Routes and layouts
apps/mobile/          Expo iOS/Android offline app
components/           Shared UI and page sections
lib/                  Auth, content, email, Stripe, Supabase, validation
public/               Free-guide and asset preview documents
supabase/schema.sql   Database schema and RLS baseline
supabase/seed.sql     Deterministic CPA seed content
types/                Shared domain types
```

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy envs:

```bash
cp .env.example .env.local
```

3. If you are wiring Supabase locally or in hosted Supabase, run:

```sql
\i supabase/schema.sql
\i supabase/seed.sql
```

4. Run the app:

```bash
npm run dev
```

5. Run the mobile app:

```bash
cd apps/mobile
npm install
npm run start
```

6. Run the verification suite:

```bash
npm run verify
```

## Integration checklist

- Create a Supabase project and run [`supabase/schema.sql`](/Users/claw/dev/Examistry/supabase/schema.sql)
- Run [`supabase/seed.sql`](/Users/claw/dev/Examistry/supabase/seed.sql) so the content UUIDs match the app and Stripe metadata
- Configure Supabase Auth magic links
- Map Stripe products and prices to `study_packs`
- Point Stripe webhook to `/api/stripe/webhooks`
- Configure Resend sender domain and update the lead capture email template

## Notes

- Checkout fulfillment must remain webhook-driven. The success page is informational only.
- Lead capture should stay server-only for writes and admin-only for reads.
- Pending entitlements should reconcile to a user on sign-in when emails match.
- The app can run in a useful demo mode when Supabase or Stripe is not configured.
