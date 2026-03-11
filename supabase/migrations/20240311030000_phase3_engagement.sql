-- Add loyalty points and metadata to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS loyalty_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_spent NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id), -- Null means all admins
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'booking_new', 'booking_confirmed', 'reward')),
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Notifications Policies
CREATE POLICY "Users can view their own notifications." ON public.notifications
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can manage all notifications." ON public.notifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create a table for reward tiers (optional but good for premium feel)
CREATE TABLE IF NOT EXISTS public.reward_tiers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  min_points INTEGER NOT NULL,
  perks TEXT[],
  color_hex TEXT
);

INSERT INTO public.reward_tiers (name, min_points, perks, color_hex)
VALUES 
('Silver', 0, ARRAY['Standard Support'], '#C0C0C0'),
('Gold', 500, ARRAY['10% Discount on Skin Rituals', 'Priority Booking'], '#FFD700'),
('Platinum', 2000, ARRAY['Free Hair Spa Monthly', 'Dedicated Stylist'], '#E5E4E2')
ON CONFLICT DO NOTHING;

-- Function to atomically increment points and spend
CREATE OR REPLACE FUNCTION public.increment_loyalty_points(
  user_id UUID,
  points_to_add INTEGER,
  spend_to_add NUMERIC
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET 
    loyalty_points = COALESCE(loyalty_points, 0) + points_to_add,
    total_spent = COALESCE(total_spent, 0) + spend_to_add
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
