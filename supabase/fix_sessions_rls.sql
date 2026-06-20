-- Fix 403 Forbidden Errors by granting permissions and disabling RLS for development
-- Run this in your Supabase SQL Editor

-- Grant all privileges to the authenticated and anon roles
GRANT ALL ON TABLE public.sessions TO authenticated, anon;
GRANT ALL ON TABLE public.messages TO authenticated, anon;
GRANT ALL ON TABLE public.evaluations TO authenticated, anon;

-- Optional: Temporarily disable Row-Level Security (RLS) while developing
-- This ensures you don't hit 403 Forbidden errors when creating or updating data
ALTER TABLE public.sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations DISABLE ROW LEVEL SECURITY;
