-- VitalQuest POC 1 — Supabase cloud schema
-- Prepared for offline-first sync. Local clients generate UUIDs and can safely upsert the same IDs.
-- Run in a Supabase development project first, then formalize as a migration after verification.

begin;

create table if not exists public.profiles (
  id uuid primary key,
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text not null default 'Adventurer',
  class_key text not null default 'vanguard',
  active_title_key text,
  streak_days integer not null default 0 check (streak_days >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workout_templates (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null check (category in ('push','pull','legs','cardio','custom')),
  estimated_minutes integer check (estimated_minutes is null or estimated_minutes > 0),
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id)
);

create table if not exists public.workout_template_exercises (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id uuid not null,
  exercise_key text not null,
  exercise_name text not null,
  position integer not null check (position >= 0),
  target_sets integer check (target_sets is null or target_sets > 0),
  target_rep_min integer check (target_rep_min is null or target_rep_min > 0),
  target_rep_max integer check (target_rep_max is null or target_rep_max > 0),
  created_at timestamptz not null default now(),
  foreign key (template_id, user_id)
    references public.workout_templates(id, user_id)
    on delete cascade
);

create table if not exists public.workout_sessions (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id uuid,
  name text not null,
  source text not null default 'manual'
    check (source in ('manual','healthkit','health_connect','import')),
  status text not null default 'completed'
    check (status in ('active','completed','discarded')),
  started_at timestamptz not null,
  completed_at timestamptz,
  duration_minutes integer check (duration_minutes is null or duration_minutes >= 0),
  total_volume numeric(14,2) not null default 0 check (total_volume >= 0),
  total_distance_miles numeric(10,3) not null default 0 check (total_distance_miles >= 0),
  total_xp integer not null default 0 check (total_xp >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id)
);

create table if not exists public.exercise_sets (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null,
  exercise_key text not null,
  exercise_name text not null,
  set_number integer not null check (set_number > 0),
  weight numeric(10,2) not null default 0 check (weight >= 0),
  reps integer not null default 0 check (reps >= 0),
  rpe numeric(3,1) check (rpe is null or (rpe >= 0 and rpe <= 10)),
  is_pr boolean not null default false,
  completed_at timestamptz not null,
  created_at timestamptz not null default now(),
  foreign key (session_id, user_id)
    references public.workout_sessions(id, user_id)
    on delete cascade,
  unique (session_id, exercise_key, set_number)
);

create table if not exists public.cardio_activities (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null,
  activity_type text not null
    check (activity_type in ('run','walk','bike','row','other')),
  distance_miles numeric(10,3) not null default 0 check (distance_miles >= 0),
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  avg_pace_seconds_per_mile integer check (avg_pace_seconds_per_mile is null or avg_pace_seconds_per_mile >= 0),
  elevation_gain_feet numeric(10,2) check (elevation_gain_feet is null or elevation_gain_feet >= 0),
  source text not null default 'manual'
    check (source in ('manual','healthkit','health_connect','gps','import')),
  created_at timestamptz not null default now(),
  foreign key (session_id, user_id)
    references public.workout_sessions(id, user_id)
    on delete cascade
);

create table if not exists public.xp_events (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid,
  amount integer not null check (amount >= 0),
  reason text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  foreign key (session_id, user_id)
    references public.workout_sessions(id, user_id)
    on delete cascade
);

create table if not exists public.attribute_events (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid,
  attribute text not null
    check (attribute in ('strength','stamina','agility','power','discipline')),
  amount integer not null check (amount >= 0),
  reason text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  foreign key (session_id, user_id)
    references public.workout_sessions(id, user_id)
    on delete cascade
);

create table if not exists public.reward_definitions (
  id uuid primary key,
  reward_key text not null unique,
  name text not null,
  reward_type text not null
    check (reward_type in ('badge','title','head','chest','legs','weapon','aura','background')),
  rarity text not null default 'common'
    check (rarity in ('common','rare','epic','legendary')),
  description text not null,
  requirement_type text not null,
  requirement_value numeric not null check (requirement_value >= 0),
  requirement_attribute text,
  asset_key text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.user_rewards (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  reward_id uuid not null references public.reward_definitions(id) on delete cascade,
  source_event_id uuid,
  unlocked_at timestamptz not null default now(),
  unique (user_id, reward_id)
);

create table if not exists public.quest_definitions (
  id uuid primary key,
  quest_key text not null unique,
  name text not null,
  description text not null,
  quest_type text not null
    check (quest_type in ('daily','weekly','challenge','chain')),
  metric_key text not null,
  target_value numeric not null check (target_value > 0),
  xp_reward integer not null default 0 check (xp_reward >= 0),
  reward_id uuid references public.reward_definitions(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.user_quests (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  quest_id uuid not null references public.quest_definitions(id) on delete cascade,
  progress_value numeric not null default 0 check (progress_value >= 0),
  status text not null default 'active'
    check (status in ('active','completed','claimed','expired')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, quest_id, started_at)
);

-- RLS filter columns should be indexed for scale.
create index if not exists idx_workout_templates_user_id on public.workout_templates(user_id);
create index if not exists idx_template_exercises_user_id on public.workout_template_exercises(user_id);
create index if not exists idx_template_exercises_template_id on public.workout_template_exercises(template_id);
create index if not exists idx_workout_sessions_user_id on public.workout_sessions(user_id);
create index if not exists idx_workout_sessions_user_started on public.workout_sessions(user_id, started_at desc);
create index if not exists idx_exercise_sets_user_id on public.exercise_sets(user_id);
create index if not exists idx_exercise_sets_session_id on public.exercise_sets(session_id);
create index if not exists idx_cardio_user_id on public.cardio_activities(user_id);
create index if not exists idx_xp_events_user_id on public.xp_events(user_id);
create index if not exists idx_xp_events_user_created on public.xp_events(user_id, created_at desc);
create index if not exists idx_attribute_events_user_id on public.attribute_events(user_id);
create index if not exists idx_attribute_events_user_attribute on public.attribute_events(user_id, attribute);
create index if not exists idx_user_rewards_user_id on public.user_rewards(user_id);
create index if not exists idx_user_quests_user_id on public.user_quests(user_id);

-- Enable RLS on all exposed tables.
alter table public.profiles enable row level security;
alter table public.workout_templates enable row level security;
alter table public.workout_template_exercises enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.exercise_sets enable row level security;
alter table public.cardio_activities enable row level security;
alter table public.xp_events enable row level security;
alter table public.attribute_events enable row level security;
alter table public.reward_definitions enable row level security;
alter table public.user_rewards enable row level security;
alter table public.quest_definitions enable row level security;
alter table public.user_quests enable row level security;

-- Start from least privilege.
revoke all on table
  public.profiles,
  public.workout_templates,
  public.workout_template_exercises,
  public.workout_sessions,
  public.exercise_sets,
  public.cardio_activities,
  public.xp_events,
  public.attribute_events,
  public.reward_definitions,
  public.user_rewards,
  public.quest_definitions,
  public.user_quests
from anon, authenticated;

grant select, insert, update, delete on table
  public.profiles,
  public.workout_templates,
  public.workout_template_exercises,
  public.workout_sessions,
  public.exercise_sets,
  public.cardio_activities
to authenticated;

-- Derived game-state tables are intentionally read-only from the client.
-- A trusted server-side evaluation path will write these after workout sync.
grant select on table
  public.xp_events,
  public.attribute_events,
  public.reward_definitions,
  public.user_rewards,
  public.quest_definitions,
  public.user_quests
to authenticated;

-- Helper pattern repeated intentionally for clarity:
-- SELECT = USING
-- INSERT = WITH CHECK
-- UPDATE = USING + WITH CHECK
-- DELETE = USING

-- profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own"
on public.profiles for delete to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

-- Reusable user-owned-table policy generation is kept explicit in this starter
-- so the access model is easy to audit.

-- workout_templates
drop policy if exists "workout_templates_select_own" on public.workout_templates;
create policy "workout_templates_select_own" on public.workout_templates
for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "workout_templates_insert_own" on public.workout_templates;
create policy "workout_templates_insert_own" on public.workout_templates
for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "workout_templates_update_own" on public.workout_templates;
create policy "workout_templates_update_own" on public.workout_templates
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
drop policy if exists "workout_templates_delete_own" on public.workout_templates;
create policy "workout_templates_delete_own" on public.workout_templates
for delete to authenticated using ((select auth.uid()) = user_id);

-- workout_template_exercises
drop policy if exists "template_exercises_select_own" on public.workout_template_exercises;
create policy "template_exercises_select_own" on public.workout_template_exercises
for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "template_exercises_insert_own" on public.workout_template_exercises;
create policy "template_exercises_insert_own" on public.workout_template_exercises
for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "template_exercises_update_own" on public.workout_template_exercises;
create policy "template_exercises_update_own" on public.workout_template_exercises
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
drop policy if exists "template_exercises_delete_own" on public.workout_template_exercises;
create policy "template_exercises_delete_own" on public.workout_template_exercises
for delete to authenticated using ((select auth.uid()) = user_id);

-- workout_sessions
drop policy if exists "workout_sessions_select_own" on public.workout_sessions;
create policy "workout_sessions_select_own" on public.workout_sessions
for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "workout_sessions_insert_own" on public.workout_sessions;
create policy "workout_sessions_insert_own" on public.workout_sessions
for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "workout_sessions_update_own" on public.workout_sessions;
create policy "workout_sessions_update_own" on public.workout_sessions
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
drop policy if exists "workout_sessions_delete_own" on public.workout_sessions;
create policy "workout_sessions_delete_own" on public.workout_sessions
for delete to authenticated using ((select auth.uid()) = user_id);

-- exercise_sets
drop policy if exists "exercise_sets_select_own" on public.exercise_sets;
create policy "exercise_sets_select_own" on public.exercise_sets
for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "exercise_sets_insert_own" on public.exercise_sets;
create policy "exercise_sets_insert_own" on public.exercise_sets
for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "exercise_sets_update_own" on public.exercise_sets;
create policy "exercise_sets_update_own" on public.exercise_sets
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
drop policy if exists "exercise_sets_delete_own" on public.exercise_sets;
create policy "exercise_sets_delete_own" on public.exercise_sets
for delete to authenticated using ((select auth.uid()) = user_id);

-- cardio_activities
drop policy if exists "cardio_select_own" on public.cardio_activities;
create policy "cardio_select_own" on public.cardio_activities
for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "cardio_insert_own" on public.cardio_activities;
create policy "cardio_insert_own" on public.cardio_activities
for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "cardio_update_own" on public.cardio_activities;
create policy "cardio_update_own" on public.cardio_activities
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
drop policy if exists "cardio_delete_own" on public.cardio_activities;
create policy "cardio_delete_own" on public.cardio_activities
for delete to authenticated using ((select auth.uid()) = user_id);

-- Derived game-state tables: user can read only their own rows.
-- Writes are reserved for trusted server-side evaluation.

drop policy if exists "xp_events_select_own" on public.xp_events;
create policy "xp_events_select_own" on public.xp_events
for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "attribute_events_select_own" on public.attribute_events;
create policy "attribute_events_select_own" on public.attribute_events
for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "user_rewards_select_own" on public.user_rewards;
create policy "user_rewards_select_own" on public.user_rewards
for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "user_quests_select_own" on public.user_quests;
create policy "user_quests_select_own" on public.user_quests
for select to authenticated using ((select auth.uid()) = user_id);

-- Authenticated users may read system-authored catalogs but never mutate them.
drop policy if exists "reward_definitions_read" on public.reward_definitions;
create policy "reward_definitions_read"
on public.reward_definitions for select to authenticated using (true);

drop policy if exists "quest_definitions_read" on public.quest_definitions;
create policy "quest_definitions_read"
on public.quest_definitions for select to authenticated using (true);

commit;
