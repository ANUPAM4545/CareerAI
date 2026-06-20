-- Grant all necessary privileges to the authenticated role for the users table
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO anon;
