create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null,
  hero_title text,
  hero_body text,
  hero_highlights jsonb not null default '[]'::jsonb,
  methodology_points jsonb not null default '[]'::jsonb,
  trust_points jsonb not null default '[]'::jsonb,
  use_cases jsonb not null default '[]'::jsonb,
  featured_pack_slugs jsonb not null default '[]'::jsonb,
  free_guide_slug text,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.exam_sections (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams(id) on delete cascade,
  slug text not null,
  name text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (exam_id, slug)
);

create table if not exists public.study_packs (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams(id) on delete restrict,
  section_id uuid references public.exam_sections(id) on delete set null,
  slug text unique not null,
  title text not null,
  subtitle text not null,
  promise text,
  description text not null,
  pack_type text not null check (pack_type in ('free', 'one_time', 'bundle')),
  price_cents int not null default 0,
  stripe_price_id text,
  cover_image_url text,
  badge text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  estimated_hours numeric,
  difficulty_level text,
  includes jsonb not null default '[]'::jsonb,
  outcomes jsonb not null default '[]'::jsonb,
  who_its_for jsonb not null default '[]'::jsonb,
  who_its_not_for jsonb not null default '[]'::jsonb,
  format_breakdown jsonb not null default '[]'::jsonb,
  study_fit text,
  preview_notes jsonb not null default '[]'::jsonb,
  faq_items jsonb not null default '[]'::jsonb,
  related_pack_slugs jsonb not null default '[]'::jsonb,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pack_modules (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.study_packs(id) on delete cascade,
  title text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pack_lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.pack_modules(id) on delete cascade,
  slug text not null,
  title text not null,
  content_markdown text not null default '',
  summary text,
  lesson_type text not null check (lesson_type in ('reading', 'checklist', 'memorization', 'practice', 'planner')),
  sort_order int not null default 0,
  estimated_minutes int,
  is_preview boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (module_id, slug)
);

create table if not exists public.downloadable_assets (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.study_packs(id) on delete cascade,
  lesson_id uuid references public.pack_lessons(id) on delete set null,
  title text not null,
  file_path text not null,
  file_type text not null,
  description text,
  is_preview boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.free_guides (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams(id) on delete cascade,
  section_id uuid references public.exam_sections(id) on delete set null,
  slug text unique not null,
  title text not null,
  subtitle text not null,
  promise text,
  description text not null,
  bullets jsonb not null default '[]'::jsonb,
  preview_cards jsonb not null default '[]'::jsonb,
  file_path text,
  delivery_mode text not null check (delivery_mode in ('download', 'email', 'both')),
  cta_after_submit text,
  related_pack_id uuid references public.study_packs(id) on delete set null,
  privacy_reassurance text,
  what_happens_next jsonb not null default '[]'::jsonb,
  thank_you_title text,
  thank_you_body text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_captures (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text,
  exam_id uuid references public.exams(id) on delete set null,
  section_id uuid references public.exam_sections(id) on delete set null,
  free_guide_id uuid references public.free_guides(id) on delete set null,
  target_exam_date date,
  source text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stripe_customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  email text not null,
  stripe_customer_id text unique not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  email text not null,
  stripe_checkout_session_id text unique not null,
  stripe_payment_intent_id text,
  stripe_customer_id text,
  amount_cents int not null,
  currency text not null default 'usd',
  status text not null check (status in ('pending', 'paid', 'failed', 'refunded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.purchase_items (
  id uuid primary key default gen_random_uuid(),
  purchase_id uuid not null references public.purchases(id) on delete cascade,
  study_pack_id uuid not null references public.study_packs(id) on delete restrict,
  price_cents int not null,
  created_at timestamptz not null default now(),
  unique (purchase_id, study_pack_id)
);

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  email text not null,
  study_pack_id uuid not null references public.study_packs(id) on delete cascade,
  purchase_id uuid not null references public.purchases(id) on delete cascade,
  status text not null check (status in ('active', 'revoked', 'pending_claim')),
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique (email, study_pack_id, purchase_id)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.pack_lessons(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table if not exists public.saved_lessons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.pack_lessons(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table if not exists public.coupon_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  stripe_promotion_code_id text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.promo_banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  cta_label text,
  cta_href text,
  theme text not null default 'neutral' check (theme in ('neutral', 'accent')),
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists exam_sections_exam_id_idx on public.exam_sections (exam_id, sort_order);
create index if not exists study_packs_exam_id_idx on public.study_packs (exam_id, section_id, is_active);
create index if not exists pack_modules_pack_id_idx on public.pack_modules (pack_id, sort_order);
create index if not exists pack_lessons_module_id_idx on public.pack_lessons (module_id, sort_order);
create index if not exists downloadable_assets_pack_id_idx on public.downloadable_assets (pack_id);
create index if not exists lead_captures_email_lower_idx on public.lead_captures (lower(email));
create unique index if not exists lead_captures_guide_email_idx
  on public.lead_captures ((coalesce(free_guide_id, '00000000-0000-0000-0000-000000000000'::uuid)), lower(email));
create index if not exists purchases_user_id_idx on public.purchases (user_id, created_at desc);
create index if not exists entitlements_user_id_idx on public.entitlements (user_id, status);
create index if not exists entitlements_email_idx on public.entitlements (lower(email));
create index if not exists lesson_progress_user_id_idx on public.lesson_progress (user_id, updated_at desc);
create index if not exists promo_banners_sort_order_idx on public.promo_banners (sort_order, is_active);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists exams_set_updated_at on public.exams;
create trigger exams_set_updated_at
before update on public.exams
for each row execute function public.set_updated_at();

drop trigger if exists exam_sections_set_updated_at on public.exam_sections;
create trigger exam_sections_set_updated_at
before update on public.exam_sections
for each row execute function public.set_updated_at();

drop trigger if exists study_packs_set_updated_at on public.study_packs;
create trigger study_packs_set_updated_at
before update on public.study_packs
for each row execute function public.set_updated_at();

drop trigger if exists pack_modules_set_updated_at on public.pack_modules;
create trigger pack_modules_set_updated_at
before update on public.pack_modules
for each row execute function public.set_updated_at();

drop trigger if exists pack_lessons_set_updated_at on public.pack_lessons;
create trigger pack_lessons_set_updated_at
before update on public.pack_lessons
for each row execute function public.set_updated_at();

drop trigger if exists downloadable_assets_set_updated_at on public.downloadable_assets;
create trigger downloadable_assets_set_updated_at
before update on public.downloadable_assets
for each row execute function public.set_updated_at();

drop trigger if exists free_guides_set_updated_at on public.free_guides;
create trigger free_guides_set_updated_at
before update on public.free_guides
for each row execute function public.set_updated_at();

drop trigger if exists lead_captures_set_updated_at on public.lead_captures;
create trigger lead_captures_set_updated_at
before update on public.lead_captures
for each row execute function public.set_updated_at();

drop trigger if exists stripe_customers_set_updated_at on public.stripe_customers;
create trigger stripe_customers_set_updated_at
before update on public.stripe_customers
for each row execute function public.set_updated_at();

drop trigger if exists purchases_set_updated_at on public.purchases;
create trigger purchases_set_updated_at
before update on public.purchases
for each row execute function public.set_updated_at();

drop trigger if exists lesson_progress_set_updated_at on public.lesson_progress;
create trigger lesson_progress_set_updated_at
before update on public.lesson_progress
for each row execute function public.set_updated_at();

drop trigger if exists coupon_campaigns_set_updated_at on public.coupon_campaigns;
create trigger coupon_campaigns_set_updated_at
before update on public.coupon_campaigns
for each row execute function public.set_updated_at();

drop trigger if exists promo_banners_set_updated_at on public.promo_banners;
create trigger promo_banners_set_updated_at
before update on public.promo_banners
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.profiles.full_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.exams enable row level security;
alter table public.exam_sections enable row level security;
alter table public.study_packs enable row level security;
alter table public.pack_modules enable row level security;
alter table public.pack_lessons enable row level security;
alter table public.downloadable_assets enable row level security;
alter table public.free_guides enable row level security;
alter table public.lead_captures enable row level security;
alter table public.stripe_customers enable row level security;
alter table public.purchases enable row level security;
alter table public.purchase_items enable row level security;
alter table public.entitlements enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.saved_lessons enable row level security;
alter table public.coupon_campaigns enable row level security;
alter table public.promo_banners enable row level security;

drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read on public.profiles
for select using (auth.uid() = id or public.is_admin());

drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
for update using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_admin_all on public.profiles
for all using (public.is_admin())
with check (public.is_admin());

drop policy if exists exams_public_read on public.exams;
create policy exams_public_read on public.exams
for select using (active = true or public.is_admin());

drop policy if exists exams_admin_all on public.exams;
create policy exams_admin_all on public.exams
for all using (public.is_admin())
with check (public.is_admin());

drop policy if exists exam_sections_public_read on public.exam_sections;
create policy exam_sections_public_read on public.exam_sections
for select using (
  exists (
    select 1
    from public.exams
    where exams.id = exam_sections.exam_id
      and exams.active = true
  )
  or public.is_admin()
);

drop policy if exists exam_sections_admin_all on public.exam_sections;
create policy exam_sections_admin_all on public.exam_sections
for all using (public.is_admin())
with check (public.is_admin());

drop policy if exists study_packs_public_read on public.study_packs;
create policy study_packs_public_read on public.study_packs
for select using (is_active = true or public.is_admin());

drop policy if exists study_packs_admin_all on public.study_packs;
create policy study_packs_admin_all on public.study_packs
for all using (public.is_admin())
with check (public.is_admin());

drop policy if exists pack_modules_public_read on public.pack_modules;
create policy pack_modules_public_read on public.pack_modules
for select using (
  exists (
    select 1
    from public.study_packs
    where study_packs.id = pack_modules.pack_id
      and study_packs.is_active = true
  )
  or public.is_admin()
);

drop policy if exists pack_modules_admin_all on public.pack_modules;
create policy pack_modules_admin_all on public.pack_modules
for all using (public.is_admin())
with check (public.is_admin());

drop policy if exists pack_lessons_read on public.pack_lessons;
create policy pack_lessons_read on public.pack_lessons
for select using (
  is_preview = true
  or exists (
    select 1
    from public.pack_modules pm
    join public.study_packs sp on sp.id = pm.pack_id
    join public.entitlements e on e.study_pack_id = sp.id
    where pm.id = pack_lessons.module_id
      and e.user_id = auth.uid()
      and e.status = 'active'
  )
  or public.is_admin()
);

drop policy if exists pack_lessons_admin_all on public.pack_lessons;
create policy pack_lessons_admin_all on public.pack_lessons
for all using (public.is_admin())
with check (public.is_admin());

drop policy if exists downloadable_assets_read on public.downloadable_assets;
create policy downloadable_assets_read on public.downloadable_assets
for select using (
  is_preview = true
  or exists (
    select 1
    from public.entitlements e
    where e.study_pack_id = downloadable_assets.pack_id
      and e.user_id = auth.uid()
      and e.status = 'active'
  )
  or public.is_admin()
);

drop policy if exists downloadable_assets_admin_all on public.downloadable_assets;
create policy downloadable_assets_admin_all on public.downloadable_assets
for all using (public.is_admin())
with check (public.is_admin());

drop policy if exists free_guides_public_read on public.free_guides;
create policy free_guides_public_read on public.free_guides
for select using (is_active = true or public.is_admin());

drop policy if exists free_guides_admin_all on public.free_guides;
create policy free_guides_admin_all on public.free_guides
for all using (public.is_admin())
with check (public.is_admin());

drop policy if exists lead_captures_admin_select on public.lead_captures;
create policy lead_captures_admin_select on public.lead_captures
for select using (public.is_admin());

drop policy if exists lead_captures_admin_all on public.lead_captures;
create policy lead_captures_admin_all on public.lead_captures
for all using (public.is_admin())
with check (public.is_admin());

drop policy if exists stripe_customers_owner_read on public.stripe_customers;
create policy stripe_customers_owner_read on public.stripe_customers
for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists stripe_customers_admin_all on public.stripe_customers;
create policy stripe_customers_admin_all on public.stripe_customers
for all using (public.is_admin())
with check (public.is_admin());

drop policy if exists purchases_owner_read on public.purchases;
create policy purchases_owner_read on public.purchases
for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists purchases_admin_all on public.purchases;
create policy purchases_admin_all on public.purchases
for all using (public.is_admin())
with check (public.is_admin());

drop policy if exists purchase_items_owner_read on public.purchase_items;
create policy purchase_items_owner_read on public.purchase_items
for select using (
  exists (
    select 1
    from public.purchases p
    where p.id = purchase_items.purchase_id
      and p.user_id = auth.uid()
  )
  or public.is_admin()
);

drop policy if exists purchase_items_admin_all on public.purchase_items;
create policy purchase_items_admin_all on public.purchase_items
for all using (public.is_admin())
with check (public.is_admin());

drop policy if exists entitlements_owner_read on public.entitlements;
create policy entitlements_owner_read on public.entitlements
for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists entitlements_admin_all on public.entitlements;
create policy entitlements_admin_all on public.entitlements
for all using (public.is_admin())
with check (public.is_admin());

drop policy if exists lesson_progress_owner_all on public.lesson_progress;
create policy lesson_progress_owner_all on public.lesson_progress
for all using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists saved_lessons_owner_all on public.saved_lessons;
create policy saved_lessons_owner_all on public.saved_lessons
for all using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists coupon_campaigns_public_read on public.coupon_campaigns;
create policy coupon_campaigns_public_read on public.coupon_campaigns
for select using (active = true or public.is_admin());

drop policy if exists coupon_campaigns_admin_all on public.coupon_campaigns;
create policy coupon_campaigns_admin_all on public.coupon_campaigns
for all using (public.is_admin())
with check (public.is_admin());

drop policy if exists promo_banners_public_read on public.promo_banners;
create policy promo_banners_public_read on public.promo_banners
for select using (is_active = true or public.is_admin());

drop policy if exists promo_banners_admin_all on public.promo_banners;
create policy promo_banners_admin_all on public.promo_banners
for all using (public.is_admin())
with check (public.is_admin());
