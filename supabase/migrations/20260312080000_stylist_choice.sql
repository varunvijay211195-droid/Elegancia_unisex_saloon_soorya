-- Stylist's Choice Tagging Migration
-- Created: 2026-03-12

-- Add is_stylists_choice column to services table
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS is_stylists_choice BOOLEAN DEFAULT false;

-- Add index for faster lookup of featured services
CREATE INDEX IF NOT EXISTS idx_services_stylists_choice ON public.services(is_stylists_choice) WHERE is_stylists_choice = true;
