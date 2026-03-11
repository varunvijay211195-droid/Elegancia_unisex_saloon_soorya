-- ① Birthday Ritual Reward Feature
-- Adds date_of_birth to profiles + birthday_offers table

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS date_of_birth DATE;

CREATE TABLE IF NOT EXISTS public.birthday_offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  offer_code TEXT NOT NULL UNIQUE,
  discount_percent INTEGER DEFAULT 20,
  valid_from DATE NOT NULL,
  valid_until DATE NOT NULL,
  is_used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.birthday_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own birthday offers"
  ON public.birthday_offers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own birthday offers (mark used)"
  ON public.birthday_offers FOR UPDATE
  USING (auth.uid() = user_id);
