-- Loyalty & Referral Program Migration
-- Created: 2026-03-11

-- 1. Loyalty Programs Configuration Table
CREATE TABLE IF NOT EXISTS public.loyalty_programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Default Loyalty Program',
  points_per_rupee NUMERIC(5,2) DEFAULT 1.00,
  points_to_redeem INTEGER DEFAULT 100,
  rupee_value_per_point NUMERIC(5,2) DEFAULT 1.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Customer Points Table
CREATE TABLE IF NOT EXISTS public.customer_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  available_points INTEGER DEFAULT 0,
  lifetime_points INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id)
);

-- 3. Points Transactions Log
CREATE TABLE IF NOT EXISTS public.points_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earn', 'redeem', 'expire', 'bonus', 'referral_earn', 'referral_bonus')),
  description TEXT,
  booking_id UUID REFERENCES public.bookings(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Referrals Table
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  referee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  referral_code TEXT UNIQUE NOT NULL,
  referrer_reward_points INTEGER DEFAULT 100,
  referee_reward_points INTEGER DEFAULT 50,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  referred_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 5. Tier Benefits Configuration
CREATE TABLE IF NOT EXISTS public.tier_benefits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tier_name TEXT UNIQUE NOT NULL CHECK (tier_name IN ('bronze', 'silver', 'gold', 'platinum')),
  min_points INTEGER DEFAULT 0,
  max_points INTEGER,
  bonus_percentage INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all new tables
ALTER TABLE public.loyalty_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tier_benefits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for loyalty_programs
CREATE POLICY "Anyone can view loyalty programs" ON public.loyalty_programs FOR SELECT USING (true);
CREATE POLICY "Admins can manage loyalty programs" ON public.loyalty_programs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for customer_points
CREATE POLICY "Users can view own points" ON public.customer_points FOR SELECT USING (
  auth.uid() = customer_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Service role can manage customer points" ON public.customer_points FOR ALL USING (
  auth.role() = 'service_role' OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for points_transactions
CREATE POLICY "Users can view own transactions" ON public.points_transactions FOR SELECT USING (
  auth.uid() = customer_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Service role can manage transactions" ON public.points_transactions FOR ALL USING (
  auth.role() = 'service_role' OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for referrals
CREATE POLICY "Users can view own referrals" ON public.referrals FOR SELECT USING (
  auth.uid() = referrer_id OR auth.uid() = referee_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Anyone can create referrals" ON public.referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can manage referrals" ON public.referrals FOR ALL USING (
  auth.role() = 'service_role' OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for tier_benefits
CREATE POLICY "Anyone can view tier benefits" ON public.tier_benefits FOR SELECT USING (true);
CREATE POLICY "Admins can manage tier benefits" ON public.tier_benefits FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Insert default loyalty program
INSERT INTO public.loyalty_programs (name, points_per_rupee, points_to_redeem, rupee_value_per_point, is_active)
VALUES ('Elegancia Rewards', 1.00, 100, 1.00, true)
ON CONFLICT DO NOTHING;

-- Insert default tier benefits
INSERT INTO public.tier_benefits (tier_name, min_points, max_points, bonus_percentage, description) VALUES
('bronze', 0, 500, 0, 'Base tier - Earn 1 point per ₹1'),
('silver', 501, 2000, 10, 'Silver tier - Earn 10% bonus points on all spending'),
('gold', 2001, 5000, 20, 'Gold tier - Earn 20% bonus points + priority booking'),
('platinum', 5001, NULL, 30, 'Platinum tier - Earn 30% bonus points + exclusive offers')
ON CONFLICT (tier_name) DO NOTHING;

-- Function to calculate and update tier
CREATE OR REPLACE FUNCTION public.calculate_customer_tier()
RETURNS TRIGGER AS $$
DECLARE
  tier_info RECORD;
BEGIN
  -- Find the appropriate tier based on available points
  SELECT INTO tier_info tb.tier_name
  FROM public.tier_benefits tb
  WHERE NEW.available_points >= tb.min_points
    AND (tb.max_points IS NULL OR NEW.available_points <= tb.max_points)
  ORDER BY tb.min_points DESC
  LIMIT 1;
  
  IF tier_info.tier_name IS NOT NULL THEN
    NEW.tier := tier_info.tier_name;
  END IF;
  
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update tier
DROP TRIGGER IF EXISTS update_customer_tier ON public.customer_points;
CREATE TRIGGER update_customer_tier
  BEFORE INSERT OR UPDATE ON public.customer_points
  FOR EACH ROW
  EXECUTE PROCEDURE public.calculate_customer_tier();

-- Function to add points to customer
CREATE OR REPLACE FUNCTION public.add_loyalty_points(
  p_customer_id UUID,
  p_points INTEGER,
  p_transaction_type TEXT,
  p_description TEXT DEFAULT NULL,
  p_booking_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
  v_customer_points_id UUID;
BEGIN
  -- Get or create customer points record
  INSERT INTO public.customer_points (customer_id, total_points, available_points, lifetime_points)
  VALUES (p_customer_id, 0, 0, 0)
  ON CONFLICT (customer_id) DO NOTHING
  RETURNING id INTO v_customer_points_id;
  
  IF v_customer_points_id IS NULL THEN
    SELECT id INTO v_customer_points_id FROM public.customer_points WHERE customer_id = p_customer_id;
  END IF;
  
  -- Update customer points
  UPDATE public.customer_points
  SET 
    total_points = total_points + p_points,
    available_points = available_points + p_points,
    lifetime_points = lifetime_points + p_points,
    updated_at = NOW()
  WHERE customer_id = p_customer_id;
  
  -- Log the transaction
  INSERT INTO public.points_transactions (customer_id, points, transaction_type, description, booking_id)
  VALUES (p_customer_id, p_points, p_transaction_type, p_description, p_booking_id)
  RETURNING id INTO v_transaction_id;
  
  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to redeem points
CREATE OR REPLACE FUNCTION public.redeem_loyalty_points(
  p_customer_id UUID,
  p_points INTEGER,
  p_description TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_available_points INTEGER;
  v_transaction_id UUID;
BEGIN
  -- Check available points
  SELECT available_points INTO v_available_points
  FROM public.customer_points
  WHERE customer_id = p_customer_id;
  
  IF v_available_points IS NULL OR v_available_points < p_points THEN
    RAISE EXCEPTION 'Insufficient points';
  END IF;
  
  -- Deduct points
  UPDATE public.customer_points
  SET 
    available_points = available_points - p_points,
    total_points = total_points - p_points,
    updated_at = NOW()
  WHERE customer_id = p_customer_id;
  
  -- Log the transaction
  INSERT INTO public.points_transactions (customer_id, points, transaction_type, description)
  VALUES (p_customer_id, -p_points, 'redeem', p_description);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  v_code TEXT;
  v_exists BOOLEAN := TRUE;
BEGIN
  -- Generate a unique 8-character code
  WHILE v_exists LOOP
    v_code := UPPER(
     CHR(65 + FLOOR(RANDOM() * 26)::INT) ||
      CHR(65 + FLOOR(RANDOM() * 26)::INT) ||
      CHR(65 + FLOOR(RANDOM() * 26)::INT) ||
      CHR(48 + FLOOR(RANDOM() * 10)::INT) ||
      CHR(48 + FLOOR(RANDOM() * 10)::INT) ||
      CHR(48 + FLOOR(RANDOM() * 10)::INT) ||
      CHR(65 + FLOOR(RANDOM() * 26)::INT) ||
      CHR(65 + FLOOR(RANDOM() * 26)::INT)
    );
    
    SELECT EXISTS(SELECT 1 FROM public.referrals WHERE referral_code = v_code) INTO v_exists;
  END LOOP;
  
  RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- Function to complete referral (when referee makes first booking)
CREATE OR REPLACE FUNCTION public.complete_referral(
  p_referral_id UUID,
  p_referee_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_referral RECORD;
  v_referrer_points INTEGER;
  v_referee_points INTEGER;
BEGIN
  -- Get referral details
  SELECT * INTO v_referral FROM public.referrals WHERE id = p_referral_id;
  
  IF v_referral IS NULL OR v_referral.status != 'pending' THEN
    RAISE EXCEPTION 'Invalid referral';
  END IF;
  
  -- Get reward points
  v_referrer_points := v_referral.referrer_reward_points;
  v_referee_points := v_referral.referee_reward_points;
  
  -- Award points to referrer
  PERFORM public.add_loyalty_points(
    v_referral.referrer_id,
    v_referrer_points,
    'referral_bonus',
    'Referral bonus - friend signed up'
  );
  
  -- Award points to referee
  PERFORM public.add_loyalty_points(
    p_referee_id,
    v_referee_points,
    'referral_earn',
    'Welcome bonus from referral'
  );
  
  -- Update referral status
  UPDATE public.referrals
  SET status = 'completed', completed_at = NOW(), referee_id = p_referee_id
  WHERE id = p_referral_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
