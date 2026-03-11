-- Thank You Notes Table
-- Created: 2026-03-12

CREATE TABLE IF NOT EXISTS public.thank_you_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Stylist/Admin
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- Client
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    note_type TEXT DEFAULT 'thank_you' CHECK (note_type IN ('thank_you', 'hair_care_tip', 'personal_note')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.thank_you_notes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own notes" ON public.thank_you_notes 
    FOR SELECT USING (auth.uid() = recipient_id);

CREATE POLICY "Admins can manage notes" ON public.thank_you_notes 
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Add helper to notify admins (integration point)
-- This would be handled in the app logic when a note is created.
