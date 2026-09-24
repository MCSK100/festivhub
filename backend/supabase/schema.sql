-- FestivLink V2 — Supabase (Postgres) schema
-- Run this in the Supabase SQL editor (project → SQL → New query → paste → Run).
-- Idempotent: safe to re-run (uses IF NOT EXISTS / additive policies guarded by DO blocks).

-- Extensions ------------------------------------------------------------
create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- Users (vendors + legacy customer rows; customers need no login) -------
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  email citext not null unique,
  password_hash text null,
  auth_provider text not null default 'local' check (auth_provider in ('local', 'google')),
  google_id text null unique,
  avatar text not null default '',
  role text not null default 'vendor' check (role in ('customer', 'vendor')),
  is_active boolean not null default true,
  trial_expiration timestamptz not null default (now() + interval '30 days'),
  provider_profile_id uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists users_email_idx on public.users (email);
create index if not exists users_google_id_idx on public.users (google_id);

-- Service providers (vendor public profiles) -----------------------------
create table if not exists public.service_providers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null unique references public.users (id) on delete set null,
  name text not null,
  company_name text not null default '',
  category text not null default 'Photography',
  experience text not null default '0',
  description text not null default '',
  profile_image text not null default '',
  cover_image text not null default '',
  phone text not null default '',
  contact_email text not null default '',
  city text not null default '',
  state text not null default '',
  lat double precision null,
  lng double precision null,
  facebook text not null default '',
  instagram text not null default '',
  website text not null default '',
  youtube text not null default '',
  portfolio_images text[] not null default '{}',
  gallery text[] not null default '{}',
  rating_average numeric not null default 0,
  rating_count integer not null default 0,
  availability boolean not null default true,
  price_range text not null default 'Contact for pricing',
  starting_price numeric not null default 0,
  business_hours text not null default '',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists providers_user_idx on public.service_providers (user_id);
create index if not exists providers_category_idx on public.service_providers (category);
create index if not exists providers_city_idx on public.service_providers (city);
create index if not exists providers_price_idx on public.service_providers (starting_price);
create index if not exists providers_rating_idx on public.service_providers (rating_average desc);

-- Vendor services ---------------------------------------------------------
create table if not exists public.vendor_services (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.service_providers (id) on delete cascade,
  name text not null,
  description text not null default '',
  starting_price numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists vendor_services_provider_idx on public.vendor_services (provider_id);

-- Vendor packages ---------------------------------------------------------
create table if not exists public.vendor_packages (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.service_providers (id) on delete cascade,
  name text not null,
  price numeric not null default 0,
  description text not null default '',
  features text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists vendor_packages_provider_idx on public.vendor_packages (provider_id);

-- Guest enquiries (customer needs NO account) ------------------------------
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.service_providers (id) on delete cascade,
  full_name text not null,
  phone text not null,
  email citext not null,
  event_type text not null,
  event_date date not null,
  event_location text not null,
  guests integer not null default 0,
  budget text not null default '',
  message text not null default '',
  status text not null default 'new'
    check (status in ('new', 'contacted', 'confirmed', 'completed', 'cancelled')),
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists enquiries_vendor_idx on public.enquiries (vendor_id, created_at desc);
create index if not exists enquiries_status_idx on public.enquiries (vendor_id, status);

-- Bookings (legacy authenticated flow, kept for vendor dashboard) ----------
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid null references public.users (id) on delete set null,
  vendor_id uuid not null references public.service_providers (id) on delete cascade,
  service_title text not null,
  price numeric not null,
  date timestamptz not null,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  notes text not null default '',
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists bookings_customer_idx on public.bookings (customer_id, created_at desc);
create index if not exists bookings_vendor_idx on public.bookings (vendor_id, created_at desc);

-- Link users → their provider profile (set after provider insert) ----------
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'users_provider_profile_fk'
  ) then
    alter table public.users
      add constraint users_provider_profile_fk
      foreign key (provider_profile_id)
      references public.service_providers (id)
      on delete set null;
  end if;
end $$;

-- updated_at auto-touch ----------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array['users','service_providers','vendor_services','vendor_packages','enquiries','bookings'] loop
    if not exists (select 1 from pg_trigger where tgname = t || '_touch_updated_at') then
      execute format('create trigger %I before update on public.%I for each row execute function public.touch_updated_at()', t || '_touch_updated_at', t);
    end if;
  end loop;
end $$;

-- Storage buckets (public image hosting, replaces Cloudinary) --------------
insert into storage.buckets (id, name, public)
values
  ('vendor-profiles', 'vendor-profiles', true),
  ('vendor-covers', 'vendor-covers', true),
  ('vendor-portfolio', 'vendor-portfolio', true)
on conflict (id) do update set public = true;

-- Row Level Security --------------------------------------------------------
-- The backend uses the SERVICE ROLE key (bypasses RLS) for all writes and
-- vendor-private reads. Public read policies below let vendor images and
-- published profiles be fetched directly if ever needed; the API remains
-- the source of truth for the frontend.
alter table public.users enable row level security;
alter table public.service_providers enable row level security;
alter table public.vendor_services enable row level security;
alter table public.vendor_packages enable row level security;
alter table public.enquiries enable row level security;
alter table public.bookings enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'public read published providers') then
    create policy "public read published providers"
      on public.service_providers for select using (is_published is distinct from false);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'public read vendor services') then
    create policy "public read vendor services"
      on public.vendor_services for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'public read vendor packages') then
    create policy "public read vendor packages"
      on public.vendor_packages for select using (true);
  end if;
end $$;

-- Storage public-read policies (images must be viewable without login) ------
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'public read vendor images') then
    create policy "public read vendor images"
      on storage.objects for select
      using (bucket_id in ('vendor-profiles', 'vendor-covers', 'vendor-portfolio'));
  end if;
end $$;
-- NOTE: uploads/deletes go through the backend with the SERVICE ROLE key,
-- which bypasses RLS — no insert/delete storage policies needed.
