-- Create the logs table for audit trails
CREATE TABLE public.logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- User who performed the action
  action TEXT NOT NULL, -- e.g., 'USER_BLOCKED', 'PHARMACY_VERIFIED', 'PRESCRIPTION_UPLOADED'
  target_id UUID, -- ID of the entity affected (e.g., user_id, pharmacy_id, prescription_id)
  description TEXT, -- Detailed description of the action
  metadata JSONB -- Any additional relevant data
);

-- Set up Row Level Security (RLS) for logs table
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Policy: Only allow admins to view logs
CREATE POLICY "Allow admins to view all logs" ON public.logs
  FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy: Only allow admins to insert logs (application should handle this, not direct user interaction)
CREATE POLICY "Allow admins to insert logs" ON public.logs
  FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- No update or delete policies for logs, as they should be immutable records.