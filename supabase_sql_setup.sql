-- Create the prescription_pharmacy_responses table
CREATE TABLE public.prescription_pharmacy_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE CASCADE NOT NULL,
  pharmacy_id UUID REFERENCES public.pharmacies(id) ON DELETE CASCADE NOT NULL,
  has_stock BOOLEAN NOT NULL,
  price NUMERIC,
  response_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS) for prescription_pharmacy_responses table
ALTER TABLE public.prescription_pharmacy_responses ENABLE ROW LEVEL SECURITY;

-- Policy: Allow patients to view responses for their prescriptions
CREATE POLICY "Allow patients to view their prescription responses" ON public.prescription_pharmacy_responses
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.prescriptions WHERE id = prescription_id AND user_id = auth.uid())
  );

-- Policy: Allow pharmacies to insert responses
CREATE POLICY "Allow pharmacies to insert responses" ON public.prescription_pharmacy_responses
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'pharmacy')
    AND EXISTS (SELECT 1 FROM public.pharmacies WHERE user_id = auth.uid() AND id = pharmacy_id)
  );

-- Policy: Allow pharmacies to update their own responses
CREATE POLICY "Allow pharmacies to update their own responses" ON public.prescription_pharmacy_responses
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'pharmacy')
    AND EXISTS (SELECT 1 FROM public.pharmacies WHERE user_id = auth.uid() AND id = pharmacy_id)
  );

-- Policy: Allow admins to view all prescription responses
CREATE POLICY "Allow admins to view all prescription responses" ON public.prescription_pharmacy_responses
  FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy: Allow admins to update any prescription response
CREATE POLICY "Allow admins to update any prescription response" ON public.prescription_pharmacy_responses
  FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy: Allow admins to delete any prescription response
CREATE POLICY "Allow admins to delete any prescription response" ON public.prescription_pharmacy_responses
  FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create a trigger to call the function before update on prescription_pharmacy_responses
CREATE TRIGGER update_prescription_pharmacy_responses_updated_at
BEFORE UPDATE ON public.prescription_pharmacy_responses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();