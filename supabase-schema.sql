-- armor-bot · Supabase schema
-- Apply once via Supabase SQL editor. Idempotent.

-- 1. Waitlist ------------------------------------------------------------
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text not null default 'unknown',
  created_at timestamptz not null default now()
);
alter table public.waitlist enable row level security;
drop policy if exists "waitlist_service_only" on public.waitlist;
create policy "waitlist_service_only" on public.waitlist for all using (false) with check (false);

-- 2. Installations -------------------------------------------------------
-- One row per GitHub App installation. Provisioned by the installation webhook.
create table if not exists public.installations (
  installation_id bigint primary key,
  account_login text not null,
  account_type text not null,
  target_type text,
  repository_selection text,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index if not exists installations_account_login_idx on public.installations (account_login);

alter table public.installations enable row level security;
drop policy if exists "installations_service_only" on public.installations;
create policy "installations_service_only" on public.installations for all using (false) with check (false);

-- 3. Reviews -------------------------------------------------------------
-- One row per PR review armor-bot posts. `findings` is the full JSON payload
-- of the review; `finding_counts` is a small aggregate for fast dashboards.
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  installation_id bigint not null,
  owner text not null,
  repo text not null,
  pull_number integer not null,
  head_sha text not null,
  files_scanned integer not null default 0,
  files_skipped integer not null default 0,
  scan_elapsed_ms integer not null default 0,
  finding_counts jsonb not null default '{}'::jsonb,
  findings jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists reviews_installation_created_at_idx
  on public.reviews (installation_id, created_at desc);
create index if not exists reviews_repo_pr_idx
  on public.reviews (owner, repo, pull_number, created_at desc);

alter table public.reviews enable row level security;
drop policy if exists "reviews_service_only" on public.reviews;
create policy "reviews_service_only" on public.reviews for all using (false) with check (false);

-- 4. Public stats view --------------------------------------------------
-- Aggregated counts that the landing page reads from. Safe to expose because
-- it contains no identifying info — just totals.
create or replace view public.public_stats as
  select
    (select count(*) from public.installations where deleted_at is null) as installations,
    (select count(*) from public.reviews) as reviews,
    (select coalesce(sum((finding_counts->>'high')::int), 0) from public.reviews) as high_findings,
    (select coalesce(sum((finding_counts->>'medium')::int), 0) from public.reviews) as medium_findings,
    (select coalesce(sum(files_scanned), 0) from public.reviews) as files_scanned;

grant select on public.public_stats to anon, authenticated;

notify pgrst, 'reload schema';
