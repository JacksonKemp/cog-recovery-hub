
-- Create a table for tasks
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  has_reminder BOOLEAN NOT NULL DEFAULT false,
  difficulty INTEGER NOT NULL DEFAULT 3 CHECK (difficulty >= 1 AND difficulty <= 10),
  reminder_times JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for users to manage their own tasks
CREATE POLICY "Users can view their own tasks" 
  ON public.tasks 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks" 
  ON public.tasks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" 
  ON public.tasks 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" 
  ON public.tasks 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for practitioners to view and update patient tasks
CREATE POLICY "Practitioners can view patient tasks" 
  ON public.tasks 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_practitioners up
      WHERE up.user_id = tasks.user_id 
      AND up.is_active = true
      AND (up.access_expires_at IS NULL OR up.access_expires_at > now())
    )
  );

CREATE POLICY "Practitioners can update patient tasks" 
  ON public.tasks 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_practitioners up
      WHERE up.user_id = tasks.user_id 
      AND up.is_active = true
      AND (up.access_expires_at IS NULL OR up.access_expires_at > now())
    )
  );

CREATE POLICY "Practitioners can create tasks for patients" 
  ON public.tasks 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_practitioners up
      WHERE up.user_id = tasks.user_id 
      AND up.is_active = true
      AND (up.access_expires_at IS NULL OR up.access_expires_at > now())
    )
  );

-- Create an index for better performance
CREATE INDEX idx_tasks_user_id_date ON public.tasks(user_id, date);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON public.tasks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
