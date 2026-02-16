-- ======================================================================
-- Blog Comments Table – run this in your Supabase SQL editor
-- ======================================================================

create table if not exists public.blog_comments (
  id          uuid primary key default gen_random_uuid(),
  post_slug   text    not null,
  user_id     uuid    not null references auth.users(id) on delete cascade,
  user_name   text    not null default 'Anonymous',
  user_avatar text,
  body        text    not null check (char_length(body) > 0 and char_length(body) <= 2000),
  created_at  timestamptz not null default now()
);

-- Index for fast lookups by post
create index if not exists idx_blog_comments_post_slug on public.blog_comments(post_slug, created_at desc);

-- Enable Row Level Security
alter table public.blog_comments enable row level security;

-- Anyone can read comments
create policy "Anyone can read comments"
  on public.blog_comments for select
  using (true);

-- Authenticated users can insert their own comments
create policy "Authenticated users can insert own comments"
  on public.blog_comments for insert
  with check (auth.uid() = user_id);

-- Users can delete their own comments
create policy "Users can delete own comments"
  on public.blog_comments for delete
  using (auth.uid() = user_id);

-- ======================================================================
-- Admin delete policy
-- To let admins bypass the user_id check, use a Supabase service-role key
-- on the server (createSupabaseServerClient already uses the anon key).
-- Alternatively, set a custom claim / app_metadata on admin users and
-- create a policy like:
--
--   create policy "Admins can delete any comment"
--     on public.blog_comments for delete
--     using (
--       (auth.jwt()->'app_metadata'->>'is_admin')::boolean = true
--     );
--
-- The API route already handles admin checks in application code, so the
-- simplest option is to use the Supabase SERVICE_ROLE key for delete
-- operations made by admins. If you prefer RLS-only enforcement, add
-- the policy above after setting app_metadata on admin users.
-- ======================================================================
