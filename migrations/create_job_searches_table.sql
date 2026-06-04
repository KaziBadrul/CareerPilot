-- Add job_searches table for storing search history
create table job_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  query text not null,
  results_count integer default 0,
  parsed_data jsonb,
  created_at timestamptz default now()
);

-- Add index for faster queries
create index idx_job_searches_user_id on job_searches(user_id);
create index idx_job_searches_created_at on job_searches(created_at desc);

-- Add RLS policies if you use RLS
alter table job_searches enable row level security;

create policy "Users can view their own searches"
  on job_searches for select
  using (auth.uid() = user_id);

create policy "Users can create their own searches"
  on job_searches for insert
  with check (auth.uid() = user_id);
