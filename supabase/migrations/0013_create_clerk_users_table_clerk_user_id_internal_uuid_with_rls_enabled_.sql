-- Create a mapping table for Clerk users
CREATE TABLE IF NOT EXISTS public.clerk_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.clerk_users ENABLE ROW LEVEL SECURITY;

-- No policies on purpose: only service role should access this table.
