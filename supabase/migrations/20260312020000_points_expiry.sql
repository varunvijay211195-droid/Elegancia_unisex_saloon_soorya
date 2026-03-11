-- Add points_expire_at to customer_points table
-- Created: 2026-03-12

ALTER TABLE public.customer_points 
ADD COLUMN IF NOT EXISTS points_expire_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '12 months');

-- Function to refresh expiry on earn
CREATE OR REPLACE FUNCTION public.refresh_points_expiry()
RETURNS TRIGGER AS $$
BEGIN
  -- Reset expiry to 12 months from now whenever points are earned
  IF NEW.available_points > OLD.available_points THEN
    NEW.points_expire_at := NOW() + INTERVAL '12 months';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to refresh expiry
DROP TRIGGER IF EXISTS refresh_points_expiry_trigger ON public.customer_points;
CREATE TRIGGER refresh_points_expiry_trigger
  BEFORE UPDATE ON public.customer_points
  FOR EACH ROW
  EXECUTE PROCEDURE public.refresh_points_expiry();
