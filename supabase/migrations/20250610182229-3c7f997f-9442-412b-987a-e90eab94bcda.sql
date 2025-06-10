
-- Add phone number to profiles table
ALTER TABLE public.profiles 
ADD COLUMN phone_number TEXT,
ADD COLUMN phone_verified BOOLEAN DEFAULT false;

-- Update tasks table to include notification method preferences
ALTER TABLE public.tasks 
ADD COLUMN notification_methods JSONB DEFAULT '["email"]'::jsonb;

-- Create a table to track sent notifications
CREATE TABLE public.notification_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  notification_type TEXT NOT NULL, -- 'email' or 'sms'
  recipient TEXT NOT NULL, -- email address or phone number
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on notification_logs
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for notification_logs
CREATE POLICY "Users can view their own notification logs" 
  ON public.notification_logs 
  FOR ALL 
  USING (auth.uid() = user_id);
