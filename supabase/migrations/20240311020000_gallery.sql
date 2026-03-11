-- Create gallery table
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  image_url TEXT NOT NULL,
  public_id TEXT NOT NULL, -- Cloudinary public_id for deletion
  category TEXT DEFAULT 'general', -- e.g., 'hair', 'nails', 'interior'
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Gallery Policies
CREATE POLICY "Public gallery is viewable by everyone." ON public.gallery
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage gallery." ON public.gallery
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
