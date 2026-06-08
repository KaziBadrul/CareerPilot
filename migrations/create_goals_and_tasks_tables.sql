-- Create goals table (idempotent)
create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  target_date timestamptz not null,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed', 'failed')),
  created_at timestamptz default now()
);

-- Create indexes on goals (idempotent)
create index if not exists idx_goals_user_id on goals(user_id);
create index if not exists idx_goals_target_date on goals(target_date);

-- Enable RLS for goals
alter table goals enable row level security;

-- Drop existing policies before recreating (idempotent)
drop policy if exists "Users can view their own goals" on goals;
drop policy if exists "Users can create their own goals" on goals;
drop policy if exists "Users can update their own goals" on goals;
drop policy if exists "Users can delete their own goals" on goals;

create policy "Users can view their own goals"
  on goals for select
  using (auth.uid() = user_id);

create policy "Users can create their own goals"
  on goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own goals"
  on goals for update
  using (auth.uid() = user_id);

create policy "Users can delete their own goals"
  on goals for delete
  using (auth.uid() = user_id);


-- Create tasks table (idempotent)
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  goal_id uuid references goals(id) on delete cascade,
  title text not null,
  description text,
  due_date timestamptz,
  completed boolean default false not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  created_at timestamptz default now()
);

-- Create indexes on tasks (idempotent)
create index if not exists idx_tasks_user_id on tasks(user_id);
create index if not exists idx_tasks_goal_id on tasks(goal_id);
create index if not exists idx_tasks_due_date on tasks(due_date);

-- Enable RLS for tasks
alter table tasks enable row level security;

-- Drop existing policies before recreating (idempotent)
drop policy if exists "Users can view their own tasks" on tasks;
drop policy if exists "Users can create their own tasks" on tasks;
drop policy if exists "Users can update their own tasks" on tasks;
drop policy if exists "Users can delete their own tasks" on tasks;

create policy "Users can view their own tasks"
  on tasks for select
  using (auth.uid() = user_id);

create policy "Users can create their own tasks"
  on tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on tasks for delete
  using (auth.uid() = user_id);
