-- Schema Health Check & Fix
-- Created: 2026-03-12
-- Goal: Fix missing tables/columns reported in UI screenshots

-- 1. Ensure contact_messages table exists (Missing from migrations)
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied'))
);

-- 2. Ensure profiles has date_of_birth (Reported missing in UI)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- 3. Ensure thank_you_notes exists (Reported missing in UI)
CREATE TABLE IF NOT EXISTS public.thank_you_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    note_type TEXT DEFAULT 'thank_you' CHECK (note_type IN ('thank_you', 'hair_care_tip', 'personal_note')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thank_you_notes ENABLE ROW LEVEL SECURITY;

-- 5. Policies for contact_messages
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contact_messages' AND policyname = 'Anyone can submit contact messages') THEN
        CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contact_messages' AND policyname = 'Admins can view contact messages') THEN
        CREATE POLICY "Admins can view contact messages" ON public.contact_messages FOR SELECT USING (
            EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
        );
    END IF;
END $$;

-- 6. Policies for thank_you_notes
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'thank_you_notes' AND policyname = 'Users can view own notes') THEN
        CREATE POLICY "Users can view own notes" ON public.thank_you_notes FOR SELECT USING (auth.uid() = recipient_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'thank_you_notes' AND policyname = 'Admins can manage notes') THEN
        CREATE POLICY "Admins can manage notes" ON public.thank_you_notes FOR ALL USING (
            EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
        );
    END IF;
END $$;
