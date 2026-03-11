-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- e.g., 'hair', 'makeup', 'nails', 'bridals'
  icon TEXT NOT NULL,
  short_desc TEXT NOT NULL,
  long_desc TEXT,
  sub_services TEXT[], -- Array of strings
  image_url TEXT NOT NULL,
  starting_price NUMERIC NOT NULL,
  duration TEXT NOT NULL,
  tag TEXT, -- e.g., 'Most Popular', 'Trending'
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Services Policies
CREATE POLICY "Public services are viewable by everyone." ON public.services
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage services." ON public.services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Insert initial services
INSERT INTO public.services (slug, title, category, icon, short_desc, long_desc, sub_services, image_url, starting_price, duration, tag)
VALUES 
('haircuts-styling', 'Haircuts & Styling', 'hair', 'Scissors', 'Clean lines and sharp edges. We listen to what you want and deliver it.', 'Each cut is designed to work with your natural texture and grow out beautifully. We consult before we touch the scissors. No surprises — just the result you came for.', ARRAY['Ladies Haircut', 'Gents Haircut', 'Kids Haircut', 'Blow Dry', 'Hair Setting', 'Trim & Shape'], 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80', 350, '30–60 mins', 'Most Popular'),
('hair-coloring', 'Hair Color', 'hair', 'Palette', 'Balayage, highlights, global color, and correction. Vibrant. Lasting. Precise.', 'From subtle sun-kissed balayage to bold full-color transformations. We use professional-grade products that protect while they color. Every shade is mixed to suit your skin tone.', ARRAY['Global Color', 'Balayage', 'Highlights', 'Ombre', 'Color Correction', 'Toning & Gloss'], 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80', 1200, '90–180 mins', 'Trending'),
('hair-treatments', 'Treatments', 'hair', 'Sparkles', 'Keratin, spa, restoration. We rebuild what time and heat have worn down.', 'Every treatment is customized to your hair\'s current condition and goal. We assess before we apply. The result is hair that looks and feels better than it has in years.', ARRAY['Hair Spa', 'Keratin Treatment', 'Smoothening', 'Deep Conditioning', 'Scalp Treatment', 'Aromatherapy'], 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=800&q=80', 800, '60–120 mins', NULL),
('bridal-styling', 'Bridal Styling', 'bridals', 'Crown', 'She builds styles that hold through dancing and photographs.', 'Your wedding day gets the full attention it deserves, from trial to the big day. We build styles that hold through celebration, photography, and everything in between.', ARRAY['Bridal Hair', 'Bridal Makeup', 'Pre-Bridal Package', 'Trial Session', 'Party Makeup', 'Saree Draping'], 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', 8000, '3–6 hours', 'Premium'),
('mens-grooming', 'Men\'s Grooming', 'hair', 'Zap', 'Beards and cuts handled with equal precision. Clean, sharp, confident.', 'That\'s the standard here. No compromise on technique. Whether it\'s a fade, a beard shape-up, or a full grooming session — we handle it with skill.', ARRAY['Haircut', 'Beard Trim', 'Beard Styling', 'Clean Shave', 'Scalp Treatment', 'Hair Color (Men)'], 'https://images.unsplash.com/photo-1503951914875-452162b28f1f?w=800&q=80', 250, '30–45 mins', NULL),
('makeup', 'Makeup', 'makeup', 'Wand2', 'Color and technique that enhance what you have.', 'We make you look like yourself — only better. Available for all events and occasions, from casual parties to full bridal looks. We use only professional-grade products.', ARRAY['Party Makeup', 'Bridal Makeup', 'Engagement Makeup', 'Photoshoot Makeup', 'Airbrush Makeup', 'HD Makeup'], 'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=800&q=80', 1500, '60–90 mins', NULL),
('nail-care', 'Nail Care', 'nails', 'Hand', 'Finished hands complete the picture. Precision in every application.', 'Quality products and skilled technicians in every session. We do nails that last, look flawless, and feel professional. From simple manicures to elaborate nail art.', ARRAY['Basic Manicure', 'Gel Manicure', 'Basic Pedicure', 'Spa Pedicure', 'Nail Art', 'Gel Extensions', 'Nail Repair'], 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80', 400, '45–90 mins', NULL);
