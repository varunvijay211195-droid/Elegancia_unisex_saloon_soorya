-- Add referral_code to bookings table if it doesn't exist
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS referral_code TEXT;

-- Update RLS for bookings to allow users to see their own referral codes (already covered by owner policy but good to be explicit)
-- No changes needed to policies if they are based on whole row
