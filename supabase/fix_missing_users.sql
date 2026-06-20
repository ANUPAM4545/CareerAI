-- Add an INSERT policy so users can create their own profile if it's missing
CREATE POLICY "Users can insert own profile" 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Manually insert any users that are in auth.users but missing from public.users
INSERT INTO public.users (id, full_name, target_role, experience_level)
SELECT id, raw_user_meta_data->>'full_name', 'Software Engineer', 'Mid-Level'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users);
