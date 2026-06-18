-- Create tables for CareerSpeak AI

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  target_role TEXT,
  experience_level TEXT,
  preferred_language TEXT DEFAULT 'English',
  preferred_input_mode TEXT DEFAULT 'both',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  mode TEXT NOT NULL, -- 'interview' or 'english'
  role TEXT,
  input_type TEXT NOT NULL, -- 'text' or 'voice'
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  sender TEXT NOT NULL, -- 'user' or 'ai'
  transcript TEXT NOT NULL,
  audio_url TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Evaluations table
CREATE TABLE IF NOT EXISTS public.evaluations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  evaluation_json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Progress Metrics table
CREATE TABLE IF NOT EXISTS public.progress_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  interview_score INTEGER DEFAULT 0,
  communication_score INTEGER DEFAULT 0,
  grammar_score INTEGER DEFAULT 0,
  fluency_score INTEGER DEFAULT 0,
  pronunciation_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_metrics ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own sessions" ON public.sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON public.sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view messages of own sessions" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.sessions WHERE sessions.id = messages.session_id AND sessions.user_id = auth.uid())
);
CREATE POLICY "Users can insert messages to own sessions" ON public.messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.sessions WHERE sessions.id = messages.session_id AND sessions.user_id = auth.uid())
);

CREATE POLICY "Users can view evaluations of own sessions" ON public.evaluations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.sessions WHERE sessions.id = evaluations.session_id AND sessions.user_id = auth.uid())
);
CREATE POLICY "Users can insert evaluations to own sessions" ON public.evaluations FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.sessions WHERE sessions.id = evaluations.session_id AND sessions.user_id = auth.uid())
);

CREATE POLICY "Users can view own progress metrics" ON public.progress_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress metrics" ON public.progress_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
