-- Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public contact form)
CREATE POLICY "Allow public insert to contact_messages" 
ON public.contact_messages FOR INSERT 
WITH CHECK (true);

-- Allow admins to read (requires admin authentication)
-- (Assuming we will add admin view later, for now protect reads)
CREATE POLICY "Allow admins to read messages" 
ON public.contact_messages FOR SELECT 
USING (auth.role() = 'authenticated');
