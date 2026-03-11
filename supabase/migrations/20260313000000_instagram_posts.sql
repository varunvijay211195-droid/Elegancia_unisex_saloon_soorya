-- Create Instagram posts table
CREATE TABLE IF NOT EXISTS public.instagram_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    caption TEXT,
    image_url TEXT NOT NULL,
    public_id TEXT, -- Cloudinary public_id
    permalink TEXT, -- Link to original Instagram post
    media_type TEXT DEFAULT 'IMAGE', -- 'IMAGE' or 'VIDEO'
    is_reel BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.instagram_posts ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can view published Instagram posts" ON public.instagram_posts
    FOR SELECT USING (is_published = true);

-- Admin full access
CREATE POLICY "Admins can manage Instagram posts" ON public.instagram_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Insert sample Instagram posts (these will be replaced with actual Cloudinary URLs)
INSERT INTO public.instagram_posts (caption, image_url, permalink, media_type, is_reel, display_order) VALUES
('Transform your look with our expert stylists ✨ #elegancia #salon #hairstyle', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop', 'https://www.instagram.com/p/example1/', 'IMAGE', false, 1),
('New season, new look! 💇‍♀️ #hairtransformation #elegancia', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop', 'https://www.instagram.com/p/example2/', 'IMAGE', false, 2),
('Behind the scenes at Elegancia 🎬 #salonlife #behindthescenes', 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=400&fit=crop', 'https://www.instagram.com/p/example3/', 'IMAGE', false, 3),
('Professional hair coloring services 🎨 #haircolor #elegancia', 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=400&fit=crop', 'https://www.instagram.com/p/example4/', 'IMAGE', false, 4),
('Luxury salon experience await you 💫 #luxurysalon #elegancia', 'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=400&h=400&fit=crop', 'https://www.instagram.com/p/example5/', 'IMAGE', false, 5),
('Get ready for your special occasion 👰 #bridalhair #elegancia', 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=400&fit=crop', 'https://www.instagram.com/p/example6/', 'IMAGE', false, 6),
('Expert styling by our professionals 💇 #hairstyling #elegancia', 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=400&h=400&fit=crop', 'https://www.instagram.com/p/example7/', 'IMAGE', false, 7),
('Relax and rejuvenate at Elegancia 🌿 #selfcare #salon', 'https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=400&h=400&fit=crop', 'https://www.instagram.com/p/example8/', 'IMAGE', false, 8)
ON CONFLICT DO NOTHING;
