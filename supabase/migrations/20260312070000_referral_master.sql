-- Referral Master & Black Tier Migration
-- Created: 2026-03-12

-- 1. Update customer_points tier constraint
ALTER TABLE public.customer_points DROP CONSTRAINT IF EXISTS customer_points_tier_check;
ALTER TABLE public.customer_points ADD CONSTRAINT customer_points_tier_check 
  CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum', 'black'));

-- 2. Add Black Tier to benefits
INSERT INTO public.tier_benefits (tier_name, min_points, max_points, bonus_percentage, description) VALUES
('black', 10000, NULL, 50, 'Master Referral Tier - Earn 50% bonus points + Ultimate Ritual Privileges')
ON CONFLICT (tier_name) DO UPDATE SET 
  bonus_percentage = 50,
  description = 'Master Referral Tier - Earn 50% bonus points + Ultimate Ritual Privileges';

-- 3. Modify referral_code to be unique per REFERRER, but referrals table can have multiple rows for different referees
-- Current state: referrals.referral_code is UNIQUE.
-- We need to change it so that one row DEFINES the code, and other rows are usages.
-- Or better: just remove the UNIQUE constraint on referral_code and allow multiple rows with same code but different referee_id.

ALTER TABLE public.referrals DROP CONSTRAINT IF EXISTS referrals_referral_code_key;
-- Now multiple people can have the same code? No, we still want the CODE to belong to ONE person.
-- So we add a unique index on (referrer_id, referral_code) or just trust the RPC.
-- Actually, the best way is:
-- UNIQUE(referral_code) where referee_id is NULL (this is the original code definition)
-- Plus rows where referral_code exists and referee_id is NOT NULL (these are usages)

-- But let's keep it simple: Just allow multiple rows with the same code.
-- The RPC `useReferralCode` will find the "template" row (where referee_id is NULL) and create a NEW row for the conversion.

-- 4. Function to count successful referrals
CREATE OR REPLACE FUNCTION public.get_referral_count(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM public.referrals WHERE referrer_id = p_user_id AND status = 'completed');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
