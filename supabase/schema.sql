-- Nextrium Website — website-owned schema additions.
-- Scope: tables the dashboard itself owns (not the AI screening engine).
-- agents-engine owns its own schema.sql separately for engine-related tables.
-- All statements here are additive and safe to re-run.

-- Table: Team activity log — every meaningful staff action on the dashboard,
-- including sign-in/sign-out.
create table if not exists public.team_activity_logs (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid,
  actor_email text,
  action      text not null,
  target_type text,
  target_id   text,
  details     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists idx_team_activity_logs_created_at on public.team_activity_logs(created_at desc);
create index if not exists idx_team_activity_logs_actor_id on public.team_activity_logs(actor_id);
create index if not exists idx_team_activity_logs_action on public.team_activity_logs(action);

alter table public.team_activity_logs enable row level security;
grant select, insert on public.team_activity_logs to service_role;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'team_activity_logs'
    and policyname = 'Admins can read team activity logs'
  ) then
    create policy "Admins can read team activity logs"
      on public.team_activity_logs for select
      to authenticated
      using (
        exists (
          select 1 from public.dashboard_users
          where dashboard_users.user_id = auth.uid()
          and dashboard_users.role = 'admin'
        )
      );
  end if;
end $$;
