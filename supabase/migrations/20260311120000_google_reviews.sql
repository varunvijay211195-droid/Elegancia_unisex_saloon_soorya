-- Create google_reviews table if it doesn't exist
CREATE TABLE IF NOT EXISTS google_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    review_date TEXT NOT NULL,
    profile_picture_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample Google reviews for Elegancia Salon
INSERT INTO google_reviews (reviewer_name, rating, review_text, review_date, profile_picture_url) VALUES
('Priya Menon', 5, 'Absolutely love this salon! The staff is incredibly talented and the ambiance is so relaxing. I got a balayage done and it turned out exactly as I imagined. Highly recommend!', '2 days ago', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'),
('Anita Sharma', 5, 'Best salon in town! Been coming here for years and they never disappoint. The stylists really listen to what you want and deliver perfect results every time.', '1 week ago', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'),
('Meera Nair', 5, 'Amazing experience! Got a keratin treatment and my hair has never looked better. The team is professional, friendly and the pricing is very reasonable for the quality.', '2 weeks ago', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'),
('Kavita Reddy', 5, 'Wonderful service! I was hesitant to try a new salon but Im so glad I did. They transformed my look completely. The makeup for my wedding was flawless!', '3 weeks ago', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'),
('Divya Patel', 4, 'Great salon with excellent professionals. Had a great haircut and styling. The only reason for 4 stars is the wait time sometimes, but the result is worth it!', '1 month ago', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop'),
('Sonia James', 5, 'My go-to salon for all hair needs! They use quality products and the results speak for themselves. The hair spa treatment is absolutely rejuvenating.', '1 month ago', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop');

-- Enable RLS
ALTER TABLE google_reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to google_reviews" 
ON google_reviews FOR SELECT 
USING (true);
