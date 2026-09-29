-- GrantEase — core schema, triggers and row level security.

create extension if not exists "pgcrypto";

-- shared updated_at trigger ------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- profiles -----------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  school text,
  graduation_year int,
  gpa numeric(3,2),
  major text,
  state text,
  demographic_tags text[] default '{}',
  goal text,
  primary_use_case text,
  onboarded boolean not null default false,
  plan text not null default 'free' check (plan in ('free','pro','scale')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- scholarships (shared corpus) --------------------------------------------
create table if not exists public.scholarships (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  provider text not null,
  amount_cents int not null,
  deadline date,
  essay_required boolean not null default false,
  essay_word_count int,
  recommendations_required int not null default 0,
  eligibility_summary text,
  prompt_text text,
  prompt_theme text,
  applicant_pool_estimate int,
  effort_score int not null default 50,
  win_probability numeric(4,3) not null default 0.05,
  external_url text,
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- applications -------------------------------------------------------------
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scholarship_id uuid not null references public.scholarships(id) on delete cascade,
  status text not null default 'saved'
    check (status in ('saved','in_progress','submitted','awarded','rejected')),
  progress int not null default 0,
  submitted_at timestamptz,
  awarded_cents int,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, scholarship_id)
);

-- essay clusters -----------------------------------------------------------
create table if not exists public.essay_clusters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  theme text not null,
  master_draft text,
  word_count int not null default 0,
  status text not null default 'not_started'
    check (status in ('not_started','drafting','ready')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, theme)
);

create table if not exists public.essay_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cluster_id uuid not null references public.essay_clusters(id) on delete cascade,
  application_id uuid not null references public.applications(id) on delete cascade,
  tailored_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cluster_id, application_id)
);

-- recommenders -------------------------------------------------------------
create table if not exists public.recommenders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  role text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recommendation_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recommender_id uuid not null references public.recommenders(id) on delete cascade,
  application_id uuid not null references public.applications(id) on delete cascade,
  status text not null default 'not_requested'
    check (status in ('not_requested','requested','reminded','received')),
  requested_at timestamptz,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- funding goals ------------------------------------------------------------
create table if not exists public.funding_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  tuition_cents int not null default 0,
  already_covered_cents int not null default 0,
  academic_year text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- waitlist -----------------------------------------------------------------
create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text,
  created_at timestamptz not null default now()
);

-- updated_at triggers ------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','scholarships','applications','essay_clusters','essay_assignments',
    'recommenders','recommendation_requests','funding_goals'
  ] loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format(
      'create trigger set_updated_at before update on public.%I
       for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- row level security -------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.scholarships enable row level security;
alter table public.applications enable row level security;
alter table public.essay_clusters enable row level security;
alter table public.essay_assignments enable row level security;
alter table public.recommenders enable row level security;
alter table public.recommendation_requests enable row level security;
alter table public.funding_goals enable row level security;
alter table public.waitlist_signups enable row level security;

-- profiles: owner-only via id
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select to authenticated using (auth.uid() = id);
drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles for insert to authenticated with check (auth.uid() = id);
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists profiles_delete on public.profiles;
create policy profiles_delete on public.profiles for delete to authenticated using (auth.uid() = id);

-- user-owned tables: owner-only via user_id
do $$
declare t text;
begin
  foreach t in array array[
    'applications','essay_clusters','essay_assignments','recommenders',
    'recommendation_requests','funding_goals'
  ] loop
    execute format('drop policy if exists %I on public.%I', t || '_select', t);
    execute format('create policy %I on public.%I for select to authenticated using (auth.uid() = user_id)', t || '_select', t);
    execute format('drop policy if exists %I on public.%I', t || '_insert', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (auth.uid() = user_id)', t || '_insert', t);
    execute format('drop policy if exists %I on public.%I', t || '_update', t);
    execute format('create policy %I on public.%I for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)', t || '_update', t);
    execute format('drop policy if exists %I on public.%I', t || '_delete', t);
    execute format('create policy %I on public.%I for delete to authenticated using (auth.uid() = user_id)', t || '_delete', t);
  end loop;
end $$;

-- scholarships: readable by everyone, writable by nobody through the API
drop policy if exists scholarships_select on public.scholarships;
create policy scholarships_select on public.scholarships for select to anon, authenticated using (true);

-- waitlist: insert-only, no reads
drop policy if exists waitlist_insert on public.waitlist_signups;
create policy waitlist_insert on public.waitlist_signups for insert to anon, authenticated with check (true);
